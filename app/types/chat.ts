// types/chat.ts

import type { ComponentType } from "../lib/messageProcessor"

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
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: ComponentType
  componentContext?: ComponentContext
}

export interface ConversationState {
  messages: Message[]
  recentComponents: ComponentType[]
  contextMemory: Map<ComponentType, any>
}

// Intent analysis types
export interface IntentAnalysis {
  intentType: 'component' | 'elaboration' | 'philosophical' | 'informational'
  componentType?: ComponentType
  confidence: number
  needsContext: boolean
  recentComponentRef?: ComponentType
}

// Processing result types
export interface ProcessingResult {
  shouldShowComponent: boolean
  componentType?: ComponentType
  shouldUseRAG: boolean
  needsContext: boolean
  intentAnalysis: IntentAnalysis
}