// app/lib/intentAnalyzer.ts

import type { ComponentType } from "./messageProcessor"
import type { Message } from "../types/chat"

export interface IntentAnalysis {
  intentType: 'component' | 'elaboration' | 'philosophical' | 'informational'
  componentType?: ComponentType
  confidence: number
  needsContext: boolean
  recentComponentRef?: ComponentType
}

export class IntentAnalyzer {
  // Component keywords that should trigger component display
  private static COMPONENT_KEYWORDS = [
    'show', 'display', 'see', 'view', 'check out', 'take a look'
  ]

  // Elaboration keywords that suggest user wants more details
  private static ELABORATION_KEYWORDS = [
    'tell me more', 'explain', 'elaborate', 'details', 'about that', 
    'how did', 'what happened', 'describe', 'more about', 'can you tell me more'
  ]

  // Philosophical/opinion keywords
  private static PHILOSOPHICAL_KEYWORDS = [
    'philosophy', 'approach', 'opinion', 'think about', 'believe', 
    'feel about', 'thoughts on', 'perspective'
  ]

  // Context reference keywords
  private static CONTEXT_KEYWORDS = [
    'that', 'this', 'the one', 'mentioned', 'above', 'shown'
  ]

  static analyzeIntent(message: string, recentMessages: Message[]): IntentAnalysis {
    const lowerMessage = message.toLowerCase().trim()

    // Check for recent component context
    const recentComponent = this.getRecentComponentContext(recentMessages)

    // 1. FIRST PRIORITY: Check for explicit component requests (regardless of context)
    const componentType = this.detectComponentRequest(lowerMessage)
    if (componentType) {
      return {
        intentType: 'component',
        componentType,
        confidence: 0.9, // Higher confidence for explicit requests
        needsContext: false
      }
    }

    // 2. SECOND PRIORITY: Check for elaboration intent (only if no explicit component request)
    if (recentComponent && this.isElaborationRequest(lowerMessage, recentComponent)) {
      return {
        intentType: 'elaboration',
        confidence: 0.85,
        needsContext: true,
        recentComponentRef: recentComponent.type
      }
    }

    // 3. THIRD PRIORITY: Check for philosophical/opinion questions
    if (this.isPhilosophicalQuestion(lowerMessage)) {
      return {
        intentType: 'philosophical',
        confidence: 0.8,
        needsContext: false
      }
    }

    // 4. DEFAULT: Informational
    return {
      intentType: 'informational',
      confidence: 0.6,
      needsContext: recentComponent !== null
    }
  }

  private static getRecentComponentContext(messages: Message[]): Message | null {
    // Look for the most recent component message (within last 3 messages)
    const recentMessages = messages.slice(-3)
    
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const msg = recentMessages[i]
      if (msg.role === 'assistant' && msg.type && msg.componentContext?.shown) {
        return msg
      }
    }
    
    return null
  }

  private static isElaborationRequest(message: string, recentComponent: Message): boolean {
    const componentType = recentComponent.type
    
    // Check for direct elaboration keywords FIRST
    if (this.ELABORATION_KEYWORDS.some(keyword => message.includes(keyword))) {
      return true
    }

    // Check for context reference words + vague questions
    if (this.CONTEXT_KEYWORDS.some(keyword => message.includes(keyword))) {
      return true
    }

    // MUCH MORE SPECIFIC elaboration patterns (only when really about the component)
    switch (componentType) {
      case 'fun':
        // Only elaborate on fun if asking about specific adventure details
        return /tell me about.*trek|how was.*kedarnath|what happened.*mountain|describe.*adventure/i.test(message)
      
      case 'projects':
        // Only elaborate if asking about specific project details (not general project requests)
        return /tell me about.*study buddy|how did you build|what was.*challenging|describe.*development/i.test(message)
      
      case 'skills':
        // Only elaborate if asking about learning/experience with specific skills
        return /how did you learn|tell me about.*react|what's your experience.*python|describe your.*development/i.test(message)
      
      case 'profile':
        // Only elaborate if asking for more personal details
        return /tell me more about yourself|what's your story|describe your journey|how did you get into/i.test(message)
      
      default:
        return false
    }
  }

  private static isPhilosophicalQuestion(message: string): boolean {
    // Check for philosophical keywords
    if (this.PHILOSOPHICAL_KEYWORDS.some(keyword => message.includes(keyword))) {
      return true
    }

    // Check for specific philosophical patterns
    const philosophicalPatterns = [
      /^what are you(?!\s*(?:working on|building|doing|studying|learning|planning|skilled))/i,
      /^how are you(?!\s*(?:different|building|working|doing))/i,
      /^why are you(?!\s*(?:interested|passionate|good))/i,
      /^what do you think about/i,
      /^what's your opinion on/i,
      /^how do you feel about/i,
      /work philosophy/i,
      /approach to/i,
      /believe in/i
    ]

    for (const pattern of philosophicalPatterns) {
      if (pattern.test(message)) {
        return true
      }
    }

    return false
  }

  private static detectComponentRequest(message: string): ComponentType | null {
    // Clean the message properly - remove ALL punctuation and extra spaces
    const cleanMessage = message
      .toLowerCase()
      .replace(/['"?!.,;:()]+/g, '') // Remove ALL punctuation including quotes and apostrophes
      .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
      .trim()
    
    // 1. HIGH CONFIDENCE: Exact/Direct requests
    const directTriggers = {
      profile: ["profile", "who are you", "about you", "introduce yourself"],
      projects: ["projects", "portfolio", "your work", "what have you built"],
      skills: ["skills", "your skills", "technical skills"],
      contact: ["contact", "email", "get in touch", "reach you"],
      resume: ["resume", "cv"],
      internship: ["internship", "availability", "hiring", "job opportunity"]
    }

    // Check direct triggers first
    for (const [componentType, triggers] of Object.entries(directTriggers)) {
      for (const trigger of triggers) {
        const cleanTrigger = trigger.toLowerCase().replace(/['"?!.,;:()]+/g, '').replace(/\s+/g, ' ').trim()
        if (cleanMessage.includes(cleanTrigger)) {
          return componentType as ComponentType
        }
      }
    }

    // 2. SEMANTIC PATTERNS: More flexible keyword combinations
    const semanticPatterns = [
      {
        type: 'fun',
        patterns: [
          // Adventure/crazy questions
          /craziest.*(?:thing|adventure|experience)/,
          /wildest.*(?:thing|adventure|experience)/, 
          /most.*(?:epic|crazy|wild|fun|adventurous)/,
          /(?:adventure|crazy|wild|epic).*(?:story|experience|thing)/,
          // Hobby/activity questions
          /(?:hobbies|activities|adventures)/,
          /(?:trekking|hiking|climbing|outdoor)/,
          /fun.*(?:stuff|things|activities|photos)/,
          // Direct adventure requests
          /(?:show|tell).*(?:adventure|fun|crazy|epic)/
        ]
      },
      {
        type: 'projects',
        patterns: [
          /(?:show|tell|see).*(?:projects|work|portfolio)/,
          /what.*(?:built|created|developed|worked on)/,
          /(?:projects|portfolio|work)/
        ]
      },
      {
        type: 'skills',
        patterns: [
          /(?:show|tell|list).*skills/,
          /what.*(?:skills|technologies|programming)/,
          /(?:technical|programming).*skills/
        ]
      }
    ]

    // Check semantic patterns
    for (const { type, patterns } of semanticPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(cleanMessage)) {
          return type as ComponentType
        }
      }
    }

    // 3. FALLBACK: Action word + context
    if (this.COMPONENT_KEYWORDS.some(keyword => cleanMessage.includes(keyword))) {
      if (/projects?|portfolio|work|built/i.test(cleanMessage)) {
        return 'projects'
      }
      if (/skills?/i.test(cleanMessage)) {
        return 'skills'
      }
      if (/profile|about/i.test(cleanMessage)) {
        return 'profile'
      }
      if (/contact|email/i.test(cleanMessage)) {
        return 'contact'
      }
      if (/resume|cv/i.test(cleanMessage)) {
        return 'resume'
      }
      if (/adventure|fun|photos|crazy|wild/i.test(cleanMessage)) {
        return 'fun'
      }
    }

    return null
  }
}