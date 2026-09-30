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

  // Function words, pronouns, and question words that carry no topic content on their
  // own. A message built entirely out of these (plus a context keyword) is a vague
  // reference to something already said; a message with even one real content word
  // (a noun/adjective/technical term) is a fresh, specific question -- regardless of
  // how short it is or whether it happens to contain "that"/"this".
  private static VAGUE_STOPWORDS = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'do', 'does', 'did',
    'will', 'would', 'can', 'could', 'should', 'shall', 'may', 'might',
    'i', 'you', 'your', 'yours', 'my', 'mine', 'me', 'it', 'its',
    'that', 'this', 'these', 'those', 'one', 'ones',
    'what', 'why', 'how', 'who', 'when', 'where', 'which',
    'about', 'above', 'mentioned', 'shown',
    'to', 'for', 'of', 'in', 'on', 'at', 'with', 'from', 'by', 'and', 'or', 'but', 'so',
    'tell', 'more'
  ])

  private static isVagueReference(message: string): boolean {
    const contentWords = message
      .toLowerCase()
      .replace(/['"?!.,;:()]+/g, '')
      .split(/\s+/)
      .filter(word => word && !this.VAGUE_STOPWORDS.has(word))

    // Zero content words is unambiguously vague ("what about that"). One leftover word is
    // still treated as vague when it's a single generic qualifier ("is this recent?") --
    // a real new topic tends to introduce more than one piece of substantive content
    // ("why is that important for scaling a team" has two: "important", "scaling").
    return contentWords.length <= 1
  }

  private static isElaborationRequest(message: string, recentComponent: Message): boolean {
    const componentType = recentComponent.type

    // Check for direct elaboration keywords FIRST
    if (this.ELABORATION_KEYWORDS.some(keyword => message.includes(keyword))) {
      return true
    }

    // Context reference words ("that"/"this"/etc.) only signal elaboration when the rest
    // of the message is just filler/question words -- a message with a real content word
    // (e.g. "why is that important for scaling") is a fresh, specific question even though
    // it's short and contains "that".
    if (this.isVagueReference(message) && this.CONTEXT_KEYWORDS.some(keyword => message.includes(keyword))) {
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

    // Word-boundary check for a single bare word (optionally plural, e.g. "internship(s)")
    // so triggers don't match as a substring inside an unrelated word (e.g. "work" inside
    // "artwork").
    const hasWord = (word: string) => new RegExp(`\\b${word}s?\\b`).test(cleanMessage)

    // 1. HIGH CONFIDENCE: Exact/Direct requests. Multi-word phrases are specific enough to
    // match as substrings; bare single words are common English words in their own right
    // (e.g. "work", "profile", "email", "hiring", "availability") and need word-boundary
    // matching at minimum -- several are handled separately below with an extra
    // co-occurring context requirement because a word boundary alone isn't enough to rule
    // out things like "does remote work interest you" or "what email service do you use".
    const directTriggers: Record<string, string[]> = {
      profile: ["who are you", "about you", "introduce yourself"],
      projects: ["projects", "what have you built"],
      skills: ["your skills", "technical skills"],
      contact: ["get in touch", "reach you"],
      internship: ["internship", "intern", "job opportunity"]
    }

    for (const [componentType, triggers] of Object.entries(directTriggers)) {
      for (const trigger of triggers) {
        const matched = trigger.includes(' ')
          ? cleanMessage.includes(trigger)
          : hasWord(trigger)
        if (matched) {
          return componentType as ComponentType
        }
      }
    }

    // Bare words that are too common/ambiguous on their own -- require a co-occurring
    // self-reference ("your"/"my") or an explicit exclusion for their other common usage.
    if (/\b(?:your|my)\s+profile\b/.test(cleanMessage)) {
      return 'profile'
    }

    if (/\b(?:your|my)\s+email\b/.test(cleanMessage) || /\bemail\s+(?:me|address)\b/.test(cleanMessage)) {
      return 'contact'
    }

    // "contact" and "portfolio" alone are generic nouns (a contact form, an investment
    // portfolio) -- only treat them as a request when self-referential.
    if (/\bcontact\s+(?:me|you)\b/.test(cleanMessage) || /\b(?:your|my)\s+contact\b/.test(cleanMessage)) {
      return 'contact'
    }
    if (/\b(?:your|my)\s+portfolio\b/.test(cleanMessage)) {
      return 'projects'
    }

    // "resume" is ambiguous between the noun (my resume/cv) and the verb ("resume the
    // conversation") -- only treat it as the noun unless it's clearly used as a verb.
    const resumeUsedAsVerb = /\bresume\s+(?:the|our|this|talking|chatting|working)\b/.test(cleanMessage)
    if (hasWord('resume') && !resumeUsedAsVerb) {
      return 'resume'
    }
    if (hasWord('cv')) {
      return 'resume'
    }

    // "hiring" and "availability" are too generic on their own (hiring processes at other
    // companies, calendar availability for a coffee chat) -- only treat them as an
    // internship-availability question when self-referential ("hiring you") or paired with
    // an actual job/role context word.
    if (/\bhir(?:e|ing)\s+you\b|\byou\s+hir(?:e|ing)\b/.test(cleanMessage)) {
      return 'internship'
    }
    if (
      /\b(?:your|my)\s+availability\b/.test(cleanMessage) &&
      /\b(?:role|position|job|internship|opportunity)\b/.test(cleanMessage)
    ) {
      return 'internship'
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
          // Hobby/activity questions - require a self-reference so a generic mention of
          // "activities" (e.g. "what activities does your dev team do") doesn't misfire
          /\b(?:your|my)\s+(?:hobbies|adventures)\b/,
          /\b(?:trekking|hiking|outdoor)\b/,
          // "climbing" alone is also a common metaphor ("climbing the corporate ladder",
          // "climbing the ranks") -- rather than blacklist every metaphor, require it to
          // co-occur (in either order) with an actual outdoor/physical-activity word.
          /(?=[\s\S]*\bclimbing\b)(?=[\s\S]*\b(?:mountain|mountains|rock|wall|cliff|hill|hills|peak|trek|wilderness)\b)/,
          /fun.*(?:stuff|things|activities|photos)/,
          // Direct adventure requests
          /(?:show|tell).*(?:adventure|fun|crazy|epic)/
        ]
      },
      {
        type: 'projects',
        patterns: [
          /(?:show|tell|see).*(?:projects|portfolio)/,
          /what.*(?:built|created|developed|worked on)/,
          /\bprojects\b/
        ]
      },
      {
        type: 'skills',
        patterns: [
          /(?:show|tell|list).*skills/,
          // A bare "what ... skills/technologies/programming" anywhere in the message is too
          // loose -- "what soft skills matter most to you" contains "what", "you", and
          // "skills" without being a self-referential request. Require the self-reference to
          // sit right next to the noun instead of just co-occurring somewhere in the message.
          /\byour\s+(?:skills|technologies|programming)\b/,
          /\b(?:skills|technologies|programming)\s+do\s+you\s+(?:have|know|use)\b/,
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

    // 3. FALLBACK: Action word + context. The action word (show/display/see/...) is
    // itself the co-occurring context that justifies matching on a bare noun here.
    if (this.COMPONENT_KEYWORDS.some(keyword => cleanMessage.includes(keyword))) {
      if (/\b(?:projects?|portfolio|built)\b/.test(cleanMessage)) {
        return 'projects'
      }
      if (/\bskills?\b/.test(cleanMessage)) {
        return 'skills'
      }
      if (/\bprofile\b/.test(cleanMessage)) {
        return 'profile'
      }
      if (/\bcontact\b/.test(cleanMessage)) {
        return 'contact'
      }
      if (/\b(?:resume|cv)\b/.test(cleanMessage) && !resumeUsedAsVerb) {
        return 'resume'
      }
      if (/\b(?:adventure|fun|photos|crazy|wild)\b/.test(cleanMessage)) {
        return 'fun'
      }
    }

    return null
  }
}