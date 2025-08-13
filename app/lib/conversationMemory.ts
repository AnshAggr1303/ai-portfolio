// app/lib/conversationMemory.ts

import type { Message } from "../types/chat"
import type { ComponentType } from "./messageProcessor"

interface ComponentMemory {
  type: ComponentType
  data: any
  shownAt: Date
  userQuery: string
}

interface ConversationContext {
  shownComponents: Map<ComponentType, ComponentMemory>
  lastComponent?: ComponentMemory
  conversationFlow: string[]
}

export class ConversationMemory {
  private static context: ConversationContext = {
    shownComponents: new Map(),
    conversationFlow: []
  }

  // Updated COMPONENT_DATA with reordered projects + full details + removed Trade Sphere
  private static COMPONENT_DATA = {
    fun: {
      adventures: ["Kedarnath Trek", "BITS Goa Exploration"],
      highlights: {
        kedarnath: {
          description: "Epic 22km trek to Kedarnath Temple",
          challenges: "High altitude, weather conditions, physical endurance",
          experience: "Life-changing spiritual and physical journey with friends",
          photos: "Stunning mountain landscapes and temple views"
        },
        bits_goa: {
          description: "Explored Goa on scooty during BITS Goa Hackathon finals",
          experience: "Beaches, markets, and bonding with the team after intense coding rounds"
        }
      }
    },
    projects: {
      // Fully ordered and matched
      featured: [
        "Study Buddy",
        "Aarogya AI – Multilingual RAG Chatbot",
        "Exam Guard – AI Cheat Detection",
        "DATAI – Natural Language to DB",
        "MUJeats – Food Ordering App (UI)",
        "Agentic Chatbot System (Assesli)",
        "Helping Vision"
      ],
      details: {
        "study_buddy": {
          description: "AI-powered, voice-enabled study companion",
          duration: "6 months development",
          impact: "Helped 200+ students improve study efficiency",
          tech: "Next.js, Supabase, Gemini AI, STT"
        },
        "aarogya_ai": {
          description: "Multilingual RAG chatbot for health assistance",
          duration: "4 months development",
          impact: "Handles 1000+ queries/day for NGO",
          tech: "LLaMA, FAISS, FastAPI, VOSK, Python"
        },
        "exam_guard": {
          description: "AI cheating detection system for online & offline exams",
          duration: "2 months development",
          impact: "Won 1st prize at MUJ hackathon",
          tech: "YOLOv5, OpenCV, TensorFlow"
        },
        "datai": {
          description: "Natural language to database insights",
          duration: "3 weeks build for hackathon",
          impact: "Improved query handling and database accessibility",
          tech: "Next.js, Supabase, Gemini AI, Recharts"
        },
        "mujeats": {
          description: "Campus food ordering app UI",
          duration: "2 weeks development",
          impact: "User-friendly food ordering experience for MUJ students",
          tech: "Flutter"
        },
        "agentic_chatbot_system": {
          description: "Real-time voice chatbot with LLM integration",
          duration: "Hackathon project",
          impact: "3rd place in Assesli Hackathon + interview offer",
          tech: "Gemini AI, Voice Integration, AWS"
        },
        "helping_vision": {
          description: "Smart glasses for visually impaired",
          duration: "Prototype stage",
          impact: "Helped 50+ people in NGO testing phase",
          tech: "Arduino, Ultrasonic Sensors, TTS"
        }
      }
    },
    skills: {
      categories: ["Frontend", "Backend", "AI/ML", "Tools", "Databases"],
      favorites: ["React", "Python", "Gemini AI", "YOLOv5", "OpenCV"],
      expertise: "Frontend with React & Tailwind, AI/ML with Python + CV models"
    },
    experience: {
      hackathons: [
        "Assesli Hackathon – 3rd Place",
        "MUJ Hackathon – 1st Prize",
        "BITS Goa CODESTORM – 4th Place",
        "IIT Kanpur TechKriti – Top 5"
      ],
      achievements: [
        "Multiple hackathon podium finishes",
        "Developed multilingual AI solutions",
        "Built award-winning AI cheating detection system"
      ],
      professional: "BTech CSE student at MUJ with strong project & hackathon experience"
    }
  }

  static updateComponentMemory(message: Message): void {
    if (message.role === 'assistant' && message.type && message.componentContext?.shown) {
      const componentMemory: ComponentMemory = {
        type: message.type,
        data: this.getComponentData(message.type),
        shownAt: message.timestamp,
        userQuery: message.componentContext.userQuery
      }

      this.context.shownComponents.set(message.type, componentMemory)
      this.context.lastComponent = componentMemory
      this.context.conversationFlow.push(`shown_${message.type}`)

      console.log("💾 Updated component memory:", message.type)
    }

    if (message.role === 'user') {
      this.context.conversationFlow.push(`query_${message.content.slice(0, 20)}`)
    }
  }

  static getRecentComponentContext(): ComponentMemory | null {
    return this.context.lastComponent || null
  }

  static getComponentContext(componentType: ComponentType): ComponentMemory | null {
    return this.context.shownComponents.get(componentType) || null
  }

  static buildContextString(componentType?: ComponentType): string {
    if (!componentType) {
      const recent = this.getRecentComponentContext()
      if (!recent) return ""
      componentType = recent.type
    }

    const memory = this.getComponentContext(componentType)
    if (!memory) return ""

    const data = memory.data
    let contextString = `\nRECENT COMPONENT CONTEXT:\n`
    contextString += `Component: ${componentType} (shown for query: "${memory.userQuery}")\n`
    contextString += `Shown at: ${memory.shownAt.toLocaleString()}\n`

    switch (componentType) {
      case 'fun':
        contextString += `\nADVENTURE DETAILS AVAILABLE:\n`
        contextString += `- Adventures: ${data.adventures?.join(', ')}\n`
        if (data.highlights?.kedarnath) {
          contextString += `- Kedarnath Trek Details: ${data.highlights.kedarnath.description}\n`
          contextString += `- Experience: ${data.highlights.kedarnath.experience}\n`
          contextString += `- Challenges: ${data.highlights.kedarnath.challenges}\n`
        }
        break

      case 'projects':
        contextString += `\nPROJECT DETAILS AVAILABLE:\n`
        contextString += `- Featured Projects: ${data.featured?.join(', ')}\n`
        if (data.details?.study_buddy) {
          contextString += `- Study Buddy: ${data.details.study_buddy.description}\n`
          contextString += `- Impact: ${data.details.study_buddy.impact}\n`
          contextString += `- Duration: ${data.details.study_buddy.duration}\n`
        }
        break

      case 'skills':
        contextString += `\nSKILLS DETAILS AVAILABLE:\n`
        contextString += `- Categories: ${data.categories?.join(', ')}\n`
        contextString += `- Favorites: ${data.favorites?.join(', ')}\n`
        contextString += `- Expertise Note: ${data.expertise}\n`
        break

      case 'profile':
        contextString += `\nPROFILE CONTEXT:\n`
        contextString += `- Current Status: BTech Student at Manipal University Jaipur\n`
        contextString += `- Location: Gurgaon, Haryana\n`
        contextString += `- Experience: ${this.COMPONENT_DATA.experience.professional}\n`
        break

      default:
        contextString += `- Component data available for elaboration\n`
    }

    return contextString
  }

  static hasRecentComponent(componentType: ComponentType, withinMinutes: number = 5): boolean {
    const memory = this.getComponentContext(componentType)
    if (!memory) return false

    const timeDiff = Date.now() - memory.shownAt.getTime()
    return timeDiff <= (withinMinutes * 60 * 1000)
  }

  static getConversationFlow(): string[] {
    return [...this.context.conversationFlow]
  }

  static clearMemory(): void {
    this.context = {
      shownComponents: new Map(),
      conversationFlow: []
    }
    console.log("🧹 Conversation memory cleared")
  }

  private static getComponentData(componentType: ComponentType): any {
    return (this.COMPONENT_DATA as any)[componentType] || {}
  }

  static getEnhancedContext(query: string, componentType?: ComponentType): string {
    let context = ""
    
    if (componentType) {
      context += this.buildContextString(componentType)
    }

    if (/craziest|crazy|adventure/i.test(query) && this.hasRecentComponent('fun')) {
      context += `\nQUERY CONTEXT: User is asking about crazy/adventure experiences after seeing the fun component with Kedarnath trek details.\n`
    }

    if (/work philosophy|approach/i.test(query)) {
      context += `\nQUERY CONTEXT: User is asking about work philosophy/approach - this is a philosophical question, not a request to see projects.\n`
    }

    if (/professional experience/i.test(query)) {
      context += `\nQUERY CONTEXT: User wants details about professional experience - should focus on hackathons, achievements, and experience narrative rather than just showing profile.\n`
    }

    return context
  }
}

/*
CHANGES MADE:
1. Removed "Trade Sphere" from project list completely.
2. Reordered `projects.featured` and `projects.details` so they match exactly.
3. Added missing detailed entries for all featured projects.
4. Updated skills favorites with latest stack.
5. Updated adventures to match latest life experiences (Kedarnath + BITS Goa).
6. Updated `experience` section to reflect all major hackathons + achievements.
*/
