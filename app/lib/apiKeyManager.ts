// app/lib/apiKeyManager.ts
import { GoogleGenerativeAI } from "@google/generative-ai"
import { APIKey, RateLimitConfig } from "./types"

export class APIKeyManager {
  private apiKeys: APIKey[] = []
  private currentKeyIndex = 0
  private rateLimitConfig: RateLimitConfig = {
    requestsPerMinute: 15, // Free tier limit
    requestsPerDay: 1500,  // Free tier limit
    cooldownTime: 60000,   // 1 minute cooldown
  }

  constructor() {
    this.initializeAPIKeys()
    this.startHealthChecks()
  }

  private initializeAPIKeys() {
    const keyVariables = [
      'GEMINI_API_KEY_1',
      'GEMINI_API_KEY_2',
      'GEMINI_API_KEY_3',
      'GEMINI_API_KEY_4',
      'GEMINI_API_KEY_5',
      'GEMINI_API_KEY_6'
    ]

    keyVariables.forEach((keyVar, index) => {
      const key = process.env[keyVar]
      if (key) {
        this.apiKeys.push({
          id: `key_${index + 1}`,
          key,
          isHealthy: true,
          permanentlyDisabled: false,   // Fix 1: track permanently dead keys
          dailyExhausted: false,        // Fix 2: track daily quota exhaustion
          dailyExhaustedUntil: 0,       // Fix 3: reset at midnight
          lastUsed: 0,
          requestCount: 0,
          errorCount: 0,
          rateLimitResetTime: 0,
          dailyRequestCount: 0,
          lastDailyReset: Date.now()
        })
      }
    })

    if (this.apiKeys.length === 0) {
      throw new Error('No valid API keys found. Please set GEMINI_API_KEY_1 through GEMINI_API_KEY_6')
    }

    console.log(`Initialized ${this.apiKeys.length} API keys`)
  }

  // Fix 4: Detect if a 429 error is a daily quota exhaustion vs per-minute rate limit
  private isDailyQuotaExhausted(error: any): boolean {
    try {
      const errorDetails = error?.errorDetails || []
      for (const detail of errorDetails) {
        if (detail?.violations) {
          for (const violation of detail.violations) {
            if (
              violation?.quotaId?.includes('PerDay') ||
              violation?.quotaId?.includes('PerDayPerProject')
            ) {
              return true
            }
          }
        }
      }
      // Also check error message string as fallback
      const msg = error?.message || ''
      if (msg.includes('PerDay') || msg.includes('per_day')) return true
    } catch {
      // ignore parse errors
    }
    return false
  }

  // Fix 5: Calculate ms until next midnight UTC for daily exhausted keys
  private msUntilMidnightUTC(): number {
    const now = new Date()
    const midnight = new Date()
    midnight.setUTCHours(24, 0, 0, 0)
    return midnight.getTime() - now.getTime()
  }

  getHealthyKey(): APIKey | null {
    const now = Date.now()

    this.apiKeys.forEach(key => {
      // Reset daily counters if 24h have passed
      if (now - key.lastDailyReset >= 24 * 60 * 60 * 1000) {
        key.dailyRequestCount = 0
        key.lastDailyReset = now
      }

      // Fix 6: Lift daily exhaustion flag after midnight reset
      if (key.dailyExhausted && key.dailyExhaustedUntil > 0 && now >= key.dailyExhaustedUntil) {
        key.dailyExhausted = false
        key.dailyExhaustedUntil = 0
        key.isHealthy = true
        key.errorCount = 0
        console.log(`Key ${key.id} daily quota reset, re-enabling`)
      }
    })

    const availableKeys = this.apiKeys.filter(key => {
      if (key.permanentlyDisabled) return false   // Fix 7: never use permanently disabled keys
      if (!key.isHealthy) return false
      if (key.dailyExhausted) return false        // Fix 8: skip daily-exhausted keys
      if (key.dailyRequestCount >= this.rateLimitConfig.requestsPerDay) return false
      if (key.rateLimitResetTime > now) return false

      const minuteWindow = 60 * 1000
      const recentRequests = key.requestCount
      if (recentRequests >= this.rateLimitConfig.requestsPerMinute) {
        if (now - key.lastUsed < minuteWindow) return false
      }

      return true
    })

    if (availableKeys.length === 0) {
      console.warn('No available keys, checking for keys past cooldown...')
      const waitingKeys = this.apiKeys
        .filter(key => key.isHealthy && !key.permanentlyDisabled && !key.dailyExhausted)
        .sort((a, b) => a.lastUsed - b.lastUsed)

      return waitingKeys[0] || null
    }

    const keyIndex = this.currentKeyIndex % availableKeys.length
    this.currentKeyIndex = (this.currentKeyIndex + 1) % availableKeys.length

    return availableKeys[keyIndex]
  }

  async executeWithRetry<T>(
    operation: (genAI: GoogleGenerativeAI) => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const key = this.getHealthyKey()
      if (!key) {
        await this.waitForAvailableKey()
        continue
      }

      try {
        const genAI = new GoogleGenerativeAI(key.key)
        const result = await operation(genAI)
        this.updateKeyStats(key, true)
        return result

      } catch (error: any) {
        lastError = error
        console.error(`API call failed with key ${key.id}:`, error.message)
        this.updateKeyStats(key, false)

        if (error.status === 429) {
          if (this.isDailyQuotaExhausted(error)) {
            // Fix 9: Mark as daily-exhausted, not just a short cooldown
            key.dailyExhausted = true
            key.dailyExhaustedUntil = Date.now() + this.msUntilMidnightUTC()
            key.isHealthy = false
            console.warn(`Key ${key.id} daily quota exhausted, disabling until midnight UTC`)
          } else {
            // Per-minute rate limit — short cooldown only
            key.rateLimitResetTime = Date.now() + this.rateLimitConfig.cooldownTime
            console.log(`Key ${key.id} rate limited, cooling down`)
          }
        } else if (error.status === 403 || error.status === 401) {
          // Fix 10: Permanently disable leaked/invalid keys, never health-check again
          key.isHealthy = false
          key.permanentlyDisabled = true
          console.error(`Key ${key.id} permanently disabled due to auth error (${error.status})`)
        } else if (error.status >= 500) {
          console.log(`Server error with key ${key.id}, will retry`)
        }
      }
    }

    throw lastError || new Error('All API keys exhausted')
  }

  private updateKeyStats(key: APIKey, success: boolean) {
    const now = Date.now()
    key.lastUsed = now
    key.requestCount++
    key.dailyRequestCount++

    if (!success) {
      key.errorCount++

      if (key.errorCount > 10 && key.requestCount > 0) {
        const errorRate = key.errorCount / key.requestCount
        if (errorRate > 0.5 && !key.permanentlyDisabled) {
          key.isHealthy = false
          console.warn(`Key ${key.id} disabled due to high error rate: ${(errorRate * 100).toFixed(1)}%`)
        }
      }
    }
  }

  private async waitForAvailableKey(timeout = 30000): Promise<void> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      const key = this.getHealthyKey()
      if (key) return
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    throw new Error('Timeout waiting for available API key')
  }

  private async performHealthCheck(): Promise<void> {
    // Fix 11: Only health-check keys that are unhealthy but NOT permanently disabled or daily-exhausted
    const recoverableKeys = this.apiKeys.filter(
      key => !key.isHealthy && !key.permanentlyDisabled && !key.dailyExhausted
    )

    for (const key of recoverableKeys) {
      try {
        const genAI = new GoogleGenerativeAI(key.key)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
        await model.generateContent("Hello")

        key.isHealthy = true
        key.errorCount = 0
        key.requestCount = 0
        console.log(`Key ${key.id} re-enabled after health check`)

      } catch (error: any) {
        // Fix 12: If health check itself returns 403, permanently disable immediately
        if (error.status === 403 || error.status === 401) {
          key.permanentlyDisabled = true
          console.error(`Key ${key.id} permanently disabled during health check (${error.status})`)
        } else {
          console.log(`Key ${key.id} still unhealthy:`, error)
        }
      }
    }
  }

  private startHealthChecks() {
    setInterval(() => {
      this.performHealthCheck()
    }, 5 * 60 * 1000)
  }

  getKeyStats() {
    return this.apiKeys.map(key => ({
      id: key.id,
      isHealthy: key.isHealthy,
      permanentlyDisabled: key.permanentlyDisabled,
      dailyExhausted: key.dailyExhausted,
      dailyExhaustedUntil: key.dailyExhaustedUntil
        ? new Date(key.dailyExhaustedUntil).toISOString()
        : null,
      requestCount: key.requestCount,
      errorCount: key.errorCount,
      dailyRequestCount: key.dailyRequestCount,
      errorRate: key.requestCount > 0
        ? (key.errorCount / key.requestCount * 100).toFixed(1) + '%'
        : '0%'
    }))
  }

  getHealthyKeyCount(): number {
    return this.apiKeys.filter(
      key => key.isHealthy && !key.permanentlyDisabled && !key.dailyExhausted
    ).length
  }
}