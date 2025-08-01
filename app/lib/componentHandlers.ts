// app/lib/componentHandlers.ts

import type { Message } from "../types/chat"
import type { ComponentType } from "./messageProcessor"
import { ConversationMemory } from "./conversationMemory"

interface ComponentContext {
  type: ComponentType
  shown: boolean
  userQuery: string
  availableProjects?: string[]
  skillCategories?: string[]
  adventureHighlights?: string[]
  availability?: string
  interests?: string[]
}

// Generate unique ID using timestamp + random number
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Enhanced RAG API call with better context handling
const callRAGAPI = async (
  content: string, 
  chatHistory: Message[], 
  componentContext?: ComponentContext,
  intentType?: string
) => {
  try {
    // Build enhanced context string
    let enhancedContext = ""
    
    if (componentContext) {
      enhancedContext += ConversationMemory.buildContextString(componentContext.type)
    }
    
    // Add query-specific context
    enhancedContext += ConversationMemory.getEnhancedContext(content, componentContext?.type)
    
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content,
        chatHistory: chatHistory.slice(-6),
        componentContext,
        enhancedContext,
        intentType
      }),
    })

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("Error getting RAG follow-up:", error)
    return null
  }
}

// Enhanced component handler with better context integration
export const handleComponentMessage = async (
  componentType: ComponentType,
  content: string,
  chatHistory: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  processingRef: React.MutableRefObject<Set<string>>
) => {
  let responseContent = ""
  let componentContext: ComponentContext
  let fallbackMessage = ""

  switch (componentType) {
    case "profile":
      responseContent = "Here's my profile:"
      componentContext = {
        type: "profile",
        shown: true,
        userQuery: content
      }
      fallbackMessage = "That's me in a nutshell! Currently living the student + developer life in Gurgaon. What would you like to know more about?"
      break

    case "projects":
      responseContent = "Here are some of my recent projects:"
      componentContext = {
        type: "projects",
        shown: true,
        userQuery: content,
        availableProjects: ["Study Buddy", "RAG Chatbot", "AI Cheat Detection", "Helping Vision"]
      }
      fallbackMessage = "Hope you liked what you saw! 🚀 Study Buddy is my baby - took 6 months but helped 200+ students. Which project caught your eye?"
      break

    case "skills":
      responseContent = "Here are my skills and expertise:"
      componentContext = {
        type: "skills",
        shown: true,
        userQuery: content,
        skillCategories: ["Frontend", "Backend", "AI/ML", "Tools"]
      }
      fallbackMessage = "That's my tech arsenal! 💪 React and Python are my favorites - React for the UI magic, Python for AI wizardry. What's your go-to tech stack?"
      break

    case "contact":
      responseContent = "Here's how you can reach me:"
      componentContext = {
        type: "contact",
        shown: true,
        userQuery: content
      }
      fallbackMessage = "Let's connect! 🤝 I'm always up for interesting conversations about tech, AI, or just life in general. Feel free to reach out!"
      break

    case "resume":
      responseContent = "Here's my resume - you can download it:"
      componentContext = {
        type: "resume",
        shown: true,
        userQuery: content
      }
      fallbackMessage = "Click the download button above to get my latest resume! Any specific role you have in mind?"
      break

    case "fun":
      responseContent = "Check out my adventures and crazy experiences:"
      componentContext = {
        type: "fun",
        shown: true,
        userQuery: content,
        adventureHighlights: ["Kedarnath Trek", "Mountain Photography", "Outdoor Adventures"]
      }
      fallbackMessage = "That Kedarnath trek was absolutely incredible! 14km of pure adventure at high altitude. Do you enjoy trekking or outdoor adventures too?"
      break

    case "internship":
      responseContent = "Here's my internship availability and what I'm looking for:"
      componentContext = {
        type: "internship",
        shown: true,
        userQuery: content,
        availability: "Summer 2026, Part-time",
        interests: ["AI/ML", "Full-stack Development", "Startups"]
      }
      fallbackMessage = "I'm actively looking for summer 2026 internships! What kind of role are you working on?"
      break

    case "more":
      // Special case for "more" - show drawer directly
      setTimeout(() => {
        const moreMessage: Message = {
          id: generateUniqueId(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
          type: "more",
        }
        setMessages((prev) => [...prev, moreMessage])
        setIsLoading(false)
        processingRef.current.delete(content)
      }, 300)
      return

    default:
      console.error(`Unknown component type: ${componentType}`)
      return
  }

  // Create the component message immediately
  const componentMessage: Message = {
    id: generateUniqueId(),
    role: "assistant",
    content: responseContent,
    timestamp: new Date(),
    type: componentType,
    componentContext
  }

  // Add component message immediately
  setMessages((prev) => [...prev, componentMessage])
  
  // Update conversation memory
  ConversationMemory.updateComponentMemory(componentMessage)

  // Get RAG follow-up after showing component
  setTimeout(async () => {
    const ragResponse = await callRAGAPI(content, chatHistory, componentContext, 'component')
    const dynamicFollowUp = ragResponse || fallbackMessage

    const followUpMessage: Message = {
      id: generateUniqueId(),
      role: "assistant",
      content: dynamicFollowUp,
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, followUpMessage])
    setIsLoading(false)
    processingRef.current.delete(content)
  }, 1000)
}

// Enhanced RAG handler with context awareness
export const handleRAGResponse = async (
  content: string, 
  chatHistory: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  processingRef: React.MutableRefObject<Set<string>>,
  intentType?: string
) => {
  try {
    // Get recent component context if available
    const recentComponent = ConversationMemory.getRecentComponentContext()
    let componentContext = undefined
    
    if (recentComponent) {
      componentContext = {
        type: recentComponent.type,
        shown: true,
        userQuery: content
      }
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content,
        chatHistory: chatHistory.slice(-6),
        componentContext,
        enhancedContext: ConversationMemory.getEnhancedContext(content, recentComponent?.type),
        intentType
      }),
    })

    const data = await response.json()
    const ragResponse = data.response || "Sorry, something went wrong. Please try again!"

    const ragMessage: Message = {
      id: generateUniqueId(),
      role: "assistant",
      content: ragResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, ragMessage])
    setIsLoading(false)
    processingRef.current.delete(content)
    
    return ragResponse

  } catch (error) {
    console.error("Error calling RAG API:", error)
    const errorMessage = "I'm having trouble connecting right now. Please try again in a moment."
    
    const errorMsg: Message = {
      id: generateUniqueId(),
      role: "assistant",
      content: errorMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, errorMsg])
    setIsLoading(false)
    processingRef.current.delete(content)
    
    return errorMessage
  }
}