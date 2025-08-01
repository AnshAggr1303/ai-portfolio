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
    // Initialize API keys from environment variables
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

  getHealthyKey(): APIKey | null {
    const now = Date.now()
    
    // Reset daily counters if needed
    this.apiKeys.forEach(key => {
      if (now - key.lastDailyReset >= 24 * 60 * 60 * 1000) {
        key.dailyRequestCount = 0
        key.lastDailyReset = now
      }
    })

    // Find healthy keys that haven't hit rate limits
    const availableKeys = this.apiKeys.filter(key => {
      if (!key.isHealthy) return false
      if (key.dailyRequestCount >= this.rateLimitConfig.requestsPerDay) return false
      if (key.rateLimitResetTime > now) return false
      
      // Check minute-based rate limit
      const minuteWindow = 60 * 1000
      const recentRequests = key.requestCount
      if (recentRequests >= this.rateLimitConfig.requestsPerMinute) {
        if (now - key.lastUsed < minuteWindow) return false
      }
      
      return true
    })

    if (availableKeys.length === 0) {
      console.warn('No available keys, checking for keys past cooldown...')
      // If no keys available, find the one that's been waiting longest
      const waitingKeys = this.apiKeys
        .filter(key => key.isHealthy)
        .sort((a, b) => a.lastUsed - b.lastUsed)
      
      return waitingKeys[0] || null
    }

    // Use round-robin among available keys
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
        
        // Update key usage stats on success
        this.updateKeyStats(key, true)
        return result
        
      } catch (error: any) {
        lastError = error
        console.error(`API call failed with key ${key.id}:`, error.message)
        
        // Update key stats on failure
        this.updateKeyStats(key, false)
        
        // Handle different error types
        if (error.status === 429) {
          // Rate limit hit
          key.rateLimitResetTime = Date.now() + this.rateLimitConfig.cooldownTime
          console.log(`Key ${key.id} rate limited, cooling down`)
        } else if (error.status === 401 || error.status === 403) {
          // Auth error - disable key
          key.isHealthy = false
          console.error(`Key ${key.id} disabled due to auth error`)
        } else if (error.status >= 500) {
          // Server error - temporary issue
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
      
      // Disable key if error rate is too high
      if (key.errorCount > 10 && key.requestCount > 0) {
        const errorRate = key.errorCount / key.requestCount
        if (errorRate > 0.5) {
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
      
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    throw new Error('Timeout waiting for available API key')
  }

  // Health check method to re-enable keys
  private async performHealthCheck(): Promise<void> {
    const disabledKeys = this.apiKeys.filter(key => !key.isHealthy)
    
    for (const key of disabledKeys) {
      try {
        const genAI = new GoogleGenerativeAI(key.key)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
        
        // Simple test request
        await model.generateContent("Hello")
        
        // If successful, re-enable key
        key.isHealthy = true
        key.errorCount = 0
        key.requestCount = 0
        console.log(`Key ${key.id} re-enabled after health check`)
        
      } catch (error) {
        console.log(`Key ${key.id} still unhealthy:`, error)
      }
    }
  }

  // Start periodic health checks
  private startHealthChecks() {
    setInterval(() => {
      this.performHealthCheck()
    }, 5 * 60 * 1000) // Every 5 minutes
  }

  // Health monitoring methods
  getKeyStats() {
    return this.apiKeys.map(key => ({
      id: key.id,
      isHealthy: key.isHealthy,
      requestCount: key.requestCount,
      errorCount: key.errorCount,
      dailyRequestCount: key.dailyRequestCount,
      errorRate: key.requestCount > 0 ? (key.errorCount / key.requestCount * 100).toFixed(1) + '%' : '0%'
    }))
  }

  getHealthyKeyCount(): number {
    return this.apiKeys.filter(key => key.isHealthy).length
  }
}