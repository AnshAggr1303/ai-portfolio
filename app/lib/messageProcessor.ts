// app/lib/messageProcessor.ts

import type { Message } from "@/types/chat"
import { IntentAnalyzer, type IntentAnalysis } from "./intentAnalyzer"
import { ConversationMemory } from "./conversationMemory"

export type ComponentType = "profile" | "projects" | "skills" | "contact" | "resume" | "fun" | "more" | "internship"

export interface ProcessingResult {
  shouldShowComponent: boolean
  componentType?: ComponentType
  shouldUseRAG: boolean
  needsContext: boolean
  intentAnalysis: IntentAnalysis
}

export class MessageProcessor {
  
  static processMessage(message: string, chatHistory: Message[]): ProcessingResult {
    console.log("🔄 Processing message:", message)
    
    // Update conversation memory with recent messages
    this.updateConversationMemory(chatHistory)
    
    // Analyze user intent
    const intentAnalysis = IntentAnalyzer.analyzeIntent(message, chatHistory)
    console.log("🎯 Intent analysis:", intentAnalysis)
    
    let result: ProcessingResult = {
      shouldShowComponent: false,
      shouldUseRAG: true,
      needsContext: intentAnalysis.needsContext,
      intentAnalysis
    }

    switch (intentAnalysis.intentType) {
      case 'component':
        // User explicitly wants to see a component
        result.shouldShowComponent = true
        result.componentType = intentAnalysis.componentType
        result.shouldUseRAG = true // Still need follow-up message
        break

      case 'elaboration':
        // User wants more details about recently shown component
        result.shouldShowComponent = false
        result.shouldUseRAG = true
        result.needsContext = true
        break

      case 'philosophical':
        // User asking philosophical/opinion questions
        result.shouldShowComponent = false
        result.shouldUseRAG = true
        result.needsContext = false
        break

      case 'informational':
      default:
        // Default to RAG with any available context
        result.shouldShowComponent = false
        result.shouldUseRAG = true
        result.needsContext = intentAnalysis.needsContext
        break
    }

    console.log("✅ Processing result:", result)
    return result
  }

  private static updateConversationMemory(chatHistory: Message[]): void {
    // Update memory with the most recent messages
    const recentMessages = chatHistory.slice(-2) // Last 2 messages
    recentMessages.forEach(msg => {
      ConversationMemory.updateComponentMemory(msg)
    })
  }

  // Legacy function for backward compatibility
  static getComponentType(message: string): ComponentType | null {
    const chatHistory: Message[] = [] // Empty for legacy calls
    const result = this.processMessage(message, chatHistory)
    
    if (result.shouldShowComponent && result.componentType) {
      return result.componentType
    }
    
    return null
  }

  // Legacy function for backward compatibility  
  static shouldGoToRAG(message: string): boolean {
    const chatHistory: Message[] = [] // Empty for legacy calls
    const result = this.processMessage(message, chatHistory)
    
    return result.shouldUseRAG && !result.shouldShowComponent
  }
}

// Export legacy functions for backward compatibility
export const getComponentType = MessageProcessor.getComponentType.bind(MessageProcessor)
export const shouldGoToRAG = MessageProcessor.shouldGoToRAG.bind(MessageProcessor)