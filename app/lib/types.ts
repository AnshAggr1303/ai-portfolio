// app/lib/types.ts

import type { ComponentType } from "./messageProcessor"

export interface Document {
  id: string
  content: string
  metadata: {
    title: string
    type: string
    timestamp: number
  }
  embedding?: number[]
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// Updated to use the correct ComponentType from messageProcessor
export interface ComponentContext {
  type: ComponentType
  shown: boolean
  userQuery: string
  availableProjects?: string[]
  skillCategories?: string[]
  adventureHighlights?: string[]
  availability?: string
  interests?: string[]
  achievements?: string[]
  enhancedData?: {
    projectDetails?: Record<string, any>
    skillDetails?: Record<string, any>
    adventureDetails?: Record<string, any>
    [key: string]: any
  }
  details?: Record<string, any>
}

export interface APIKey {
  id: string
  key: string
  isHealthy: boolean
  lastUsed: number
  requestCount: number
  errorCount: number
  rateLimitResetTime: number
  dailyRequestCount: number
  lastDailyReset: number
}

export interface RateLimitConfig {
  requestsPerMinute: number
  requestsPerDay: number
  cooldownTime: number // ms to wait after rate limit hit
}

export interface ProjectData {
  id?: string // Added optional id for compatibility
  name: string
  title?: string // Added for compatibility with existing code
  description: string
  tech: string[]
  technologies?: string[] // Added for compatibility
  impact: string
  status: string
  category: string
  achievements?: string[] // Added for compatibility
  links?: {
    github?: string
    live?: string
    demo?: string
  }
}

export interface SkillData {
  name: string
  level: number
  experience: string
  description?: string // Added for compatibility
}

export interface SkillCategory {
  name: string
  skills: SkillData[]
}

export interface Achievement {
  id?: string // Added optional id for compatibility
  title: string
  date: string
  description: string
  category: string
  impact: string
}