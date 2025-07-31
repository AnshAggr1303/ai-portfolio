/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ChatScreen from "./chat/ChatScreen"
import type { Message } from "../types/chat"

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickQuestions, setShowQuickQuestions] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const processingRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Generate unique ID using timestamp + random number
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Enhanced RAG override patterns - these ALWAYS go to RAG regardless of other matches
  const RAG_OVERRIDE_PATTERNS = [
    // Question starters that are philosophical/informational (excluding ones that should go to fun)
    /^what are you/i,
    /^how are you/i,
    /^why are you/i,
    /^when are you/i,
    /^where are you/i,
    /^how do you/i,
    /^why do you/i,
    /^what do you think/i,
    /^what is your/i,
    /^what's your/i,
    
    // Tell me about / Explain patterns (excluding adventure/fun related)
    /^tell me about(?!.*(?:adventure|crazy|trek|photo|kedarnath|fun))/i,
    /^explain/i,
    /^describe(?!.*(?:adventure|crazy|trek|photo|kedarnath|fun))/i,
    
    // Current/temporal questions
    /\bcurrently\b/i,
    /\bright now\b/i,
    /\bthese days\b/i,
    /\bnowadays\b/i,
    /\brecently\b/i,
    /\blately\b/i,
    
    // Opinion/preference questions (excluding fun activities)
    /\bprefer\b/i,
    /\bfavorite\b/i,
    /\bbetter\b/i,
    /\bworse\b/i,
    /\blike\b.*\bbetter\b/i,
    /\bthink about\b/i,
    /\bopinion\b/i,
    /\bfeel about\b/i,
    
    // Comparison patterns
    /\bvs\b/i,
    /\bversus\b/i,
    /\bcompared to\b/i,
    /\bdifference between\b/i,
    /\bcompare\b/i,
    
    // Experience/background questions (excluding adventure)
    /\bexperience with\b/i,
    /\bbackground in\b/i,
    /\bjourney(?!.*(?:trek|mountain|adventure))\b/i,
    /\bstory(?!.*(?:trek|mountain|adventure|crazy))\b/i,
    /\bhow did you\b/i,
    /\bwhy did you\b/i,
    /\bwhen did you start\b/i,
    
    // Learning/advice patterns
    /\badvice\b/i,
    /\brecommend\b/i,
    /\bsuggest\b/i,
    /\btips\b/i,
    /\bhow to\b/i,
    /\bshould i\b/i,
    
    // Future/goals patterns (when asking about detailed plans)
    /\bplanning to\b/i,
    /\bgoals\b/i,
    /\bfuture\b/i,
    /\bnext\b.*\byears?\b/i,
    /\bwant to\b/i,
    /\bhope to\b/i,
    /\baspir/i, // aspirations, aspire
    
    // Philosophy/approach patterns
    /\bphilosophy\b/i,
    /\bapproach\b/i,
    /\bmethodology\b/i,
    /\bprinciples\b/i,
    /\bbelieve\b/i,
    /\bvalues\b/i,
  ]

  // Exact component trigger phrases - these must match exactly (case insensitive)
  const EXACT_COMPONENT_TRIGGERS = {
    profile: [
      "who are you",
      "who are you?",
      "about you", 
      "about yourself",
      "introduce yourself",
      "tell me about yourself",
      "tell me about you",
      "show me your profile",
      "your profile",
      "profile",
      "profile card"
    ],
    projects: [
      "show me your projects",
      "your projects", 
      "show projects",
      "projects",
      "portfolio",
      "what projects have you built",
      "what projects have you worked on",
      "show me what you've built",
      "your work"
    ],
    skills: [
      "show me your skills",
      "your skills",
      "skills", 
      "what are your skills",
      "what skills do you have",
      "technical skills",
      "programming skills"
    ],
    contact: [
      "contact",
      "contact details",
      "contact info", 
      "contact information",
      "how can i contact you",
      "how to contact you",
      "reach you",
      "get in touch",
      "email",
      "phone number"
    ],
    resume: [
      "resume",
      "cv",
      "download resume",
      "show me your resume",
      "your resume",
      "can i see your resume",
      "see your resume",
      "view your resume",
      "show resume",
      "get your resume"
    ],
    fun: [
      "adventure photos",
      "fun photos",
      "kedarnath",
      "kedarnath trek", 
      "trek photos",
      "mountain photos",
      "travel photos",
      "show me your adventure photos",
      "crazy thing",
      "craziest thing",
      "what's the craziest thing",
      "craziest thing you've done",
      "crazy things you've done",
      "adventure",
      "adventures",
      "hobbies",
      "your hobbies",
      "what are your hobbies",
      "fun activities",
      "outdoor activities",
      "trekking",
      "hiking",
      "mountains",
      "travel",
      "crazy experiences",
      "wild experiences",
      "extreme activities"
    ],
    more: [
      "more",
      "more options",
      "show more", 
      "what else",
      "show me more",
      "other options"
    ],
    internship: [
      "internship",
      "internship availability",
      "are you available for internship",
      "looking for internship",
      "summer internship",
      "available for work",
      "job opportunity",
      "work opportunity", 
      "hiring",
      "freelance",
      "part time",
      "full time",
      "remote work",
      "looking for talent"
    ]
  }

  // Function to check if message should go to RAG (highest priority)
  const shouldGoToRAG = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()
    
    // Check RAG override patterns first
    return RAG_OVERRIDE_PATTERNS.some(pattern => pattern.test(lowerMessage))
  }

  // Enhanced detection functions with strict exact matching
  const getComponentType = (message: string): "profile" | "projects" | "skills" | "contact" | "resume" | "fun" | "more" | "internship" | null => {
    const lowerMessage = message.toLowerCase().trim()
    
    // First check if it should go to RAG - if yes, return null
    if (shouldGoToRAG(message)) {
      return null
    }

    // Check for exact component matches
    for (const [componentType, triggers] of Object.entries(EXACT_COMPONENT_TRIGGERS)) {
      const hasExactMatch = triggers.some(trigger => {
        const lowerTrigger = trigger.toLowerCase()
        // Exact match or very close match (within 3 characters difference)
        return lowerMessage === lowerTrigger || 
               lowerMessage === lowerTrigger + "?" ||
               lowerMessage === lowerTrigger + "." ||
               (lowerMessage.includes(lowerTrigger) && Math.abs(lowerMessage.length - lowerTrigger.length) <= 3)
      })
      
      if (hasExactMatch) {
        return componentType as "profile" | "projects" | "skills" | "contact" | "resume" | "fun" | "more" | "internship"
      }
    }

    // Additional pattern matching for component types (only if no RAG override)
    
    // Profile patterns
    if (/^(show me\s+)?(your\s+)?profile$/i.test(lowerMessage) ||
        /^who\s+are\s+you\??$/i.test(lowerMessage) ||
        /^introduce\s+yourself$/i.test(lowerMessage)) {
      return "profile"
    }

    // Projects patterns  
    if (/^(show me\s+)?(your\s+)?projects?$/i.test(lowerMessage) ||
        /^projects?$/i.test(lowerMessage) ||
        /^portfolio$/i.test(lowerMessage)) {
      return "projects"
    }

    // Skills patterns
    if (/^(show me\s+)?(your\s+)?skills?$/i.test(lowerMessage) ||
        /^skills?$/i.test(lowerMessage) ||
        /^what\s+(are\s+)?(your\s+)?skills?$/i.test(lowerMessage)) {
      return "skills"
    }

    // Contact patterns
    if (/^contact$/i.test(lowerMessage) ||
        /^(show me\s+)?(your\s+)?contact(\s+details)?$/i.test(lowerMessage) ||
        /^how\s+(can\s+)?i\s+contact\s+you\??$/i.test(lowerMessage)) {
      return "contact"
    }

    // Resume patterns
    if (/^resume$/i.test(lowerMessage) ||
        /^cv$/i.test(lowerMessage) ||
        /^(show me\s+)?(your\s+)?resume$/i.test(lowerMessage) ||
        /^download\s+resume$/i.test(lowerMessage)) {
      return "resume"
    }

    // Enhanced Fun patterns - more comprehensive matching
    if (/^kedarnath$/i.test(lowerMessage) ||
        /^(show me\s+)?adventure\s+photos?$/i.test(lowerMessage) ||
        /^fun\s+photos?$/i.test(lowerMessage) ||
        /craziest?\s+thing/i.test(lowerMessage) ||
        /crazy\s+thing/i.test(lowerMessage) ||
        /^hobbies?$/i.test(lowerMessage) ||
        /what\s+(are\s+)?(your\s+)?hobbies/i.test(lowerMessage) ||
        /adventure/i.test(lowerMessage) ||
        /trek/i.test(lowerMessage) ||
        /mountain/i.test(lowerMessage) ||
        /travel/i.test(lowerMessage) ||
        /crazy\s+experience/i.test(lowerMessage) ||
        /wild\s+experience/i.test(lowerMessage) ||
        /extreme\s+activit/i.test(lowerMessage) ||
        /fun\s+activit/i.test(lowerMessage) ||
        /outdoor\s+activit/i.test(lowerMessage)) {
      return "fun"
    }

    // More patterns
    if (/^more$/i.test(lowerMessage) ||
        /^(show me\s+)?more(\s+options)?$/i.test(lowerMessage) ||
        /^what\s+else$/i.test(lowerMessage)) {
      return "more"
    }

    // Internship patterns
    if (/^internship$/i.test(lowerMessage) ||
        /^(are you\s+)?available(\s+for)?\s*(internship|work|opportunities?)$/i.test(lowerMessage) ||
        /^availability$/i.test(lowerMessage) ||
        /^hiring$/i.test(lowerMessage)) {
      return "internship"
    }

    return null
  }

  const processMessage = useCallback(
    async (content: string, chatHistory: Message[] = []) => {
      // Prevent duplicate processing of the same message
      if (processingRef.current.has(content) || isLoading) {
        console.log("Skipping duplicate or already processing:", content)
        return
      }

      console.log("Processing message:", content)
      processingRef.current.add(content)
      setIsLoading(true)

      try {
        let responseContent = ""
        const componentType = getComponentType(content)

        console.log("Component type detected:", componentType)
        console.log("Should go to RAG:", shouldGoToRAG(content))

        // Handle component responses
        if (componentType === "profile") {
          responseContent = "Here's my profile:"

          setTimeout(() => {
            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content:
                "That's me in a nutshell! 👆 I'm passionate about creating innovative solutions and always excited to take on new challenges. Love working on projects that make a real impact! \n\nWhat about you? What’s your story? ?",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)

        } else if (componentType === "projects") {
          responseContent = "Here are some of my recent projects:"

          setTimeout(() => {
            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content:
                "These are some of my favorite projects I've worked on! Each one taught me something new and pushed my skills further. I love building things that solve real problems 🚀\n\nWhich project caught your eye?",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)

        } else if (componentType === "skills") {
          responseContent = "Here are my skills and expertise:"

          setTimeout(async () => {
            try {
              const followUpResponse = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  message: `I just showed my skills component above. Now give a casual, friendly follow-up message that references the skills shown above, uses emojis, and asks an engaging question to continue the conversation. Keep it conversational and personal. Original user question was: "${content}"`,
                  chatHistory: chatHistory.slice(-6),
                }),
              })

              const followUpData = await followUpResponse.json()
              const followUpContent =
                followUpData.response ||
                "You can check out all my skills above! I've got a mix of **hard skills** like coding in various languages and **soft skills** like communication and problem-solving. Pretty handy, right? 😄\n\nWhat skills are you looking for in a developer?"

              const followUpMessage: Message = {
                id: generateUniqueId(),
                role: "assistant",
                content: followUpContent,
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, followUpMessage])
            } catch (error) {
              console.error("Error getting follow-up response:", error)
              const fallbackMessage: Message = {
                id: generateUniqueId(),
                role: "assistant",
                content:
                  "You can check out all my skills above! I've got a mix of **hard skills** like coding in various languages and **soft skills** like communication and problem-solving. Pretty handy, right? 😄\n\nWhat skills are you looking for in a developer?",
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, fallbackMessage])
            }
          }, 1000)

        } else if (componentType === "contact") {
          responseContent = "Here's how you can reach me:"

          setTimeout(() => {
            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content:
                "That's my main email above! 📬 Feel free to click on it - the link works and will open your email client directly. I'm always excited to connect with new people and discuss potential opportunities, collaborations, or just have a chat about tech!\n\nWhat would you like to talk about?",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)

        } else if (componentType === "resume") {
          responseContent = "Here's my resume - you can download it:"

          setTimeout(() => {
            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content:
                "Click the download button above to get my latest resume! 📄 It includes all my experience, projects, and technical skills in a neat PDF format.\n\nAny specific role or opportunity you have in mind?",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)

        } else if (componentType === "fun") {
          responseContent = "Check out my adventures and crazy experiences:"

          setTimeout(() => {
            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content:
                "That was such an incredible experience! 🏔️ Kedarnath is one of those places that really tests your limits and rewards you with breathtaking views. The journey was challenging but so worth it! I love pushing my boundaries and trying new adventures.\n\nDo you enjoy trekking or outdoor adventures too?",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)

        } else if (componentType === "more") {
          // For "more" queries, show the drawer directly without text
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

        } else if (componentType === "internship") {
          responseContent = "Here's my internship availability and what I'm looking for:"

          setTimeout(() => {
            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content:
                "I'm actively looking for **summer 2026 internships** and part-time opportunities! 🚀 I'm passionate about **AI/ML** and **full-stack development**, and I'd love to contribute to innovative projects. Feel free to reach out if you think I'd be a good fit for your team!\n\nWhat kind of role or project are you working on?",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)

        } 
        // All other queries go to RAG (including detailed questions)
        else {
          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: content,
                chatHistory: chatHistory.slice(-6),
              }),
            })

            const data = await response.json()
            responseContent = data.response || "Sorry, something went wrong. Please try again!"
          } catch (error) {
            console.error("Error calling API:", error)
            responseContent = "I'm having trouble connecting right now. Please try again in a moment."
          }
        }

        // Add assistant response
        const delay = componentType ? 500 : 100

        setTimeout(() => {
          const assistantMessage: Message = {
            id: generateUniqueId(),
            role: "assistant",
            content: responseContent,
            timestamp: new Date(),
            ...(componentType && { type: componentType as "profile" | "projects" | "skills" | "contact" | "resume" | "fun" | "more" | "internship" }),
          }

          console.log("Adding assistant message:", assistantMessage)
          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
          processingRef.current.delete(content)
        }, delay)

      } catch (error) {
        console.error("Error processing message:", error)
        setIsLoading(false)
        processingRef.current.delete(content)
      }
    },
    [isLoading],
  )

  const handleSendMessage = useCallback(
    async (messageContent?: string) => {
      const content = messageContent || inputValue.trim()
      if (!content || isLoading) return

      console.log("Sending message:", content)

      const userMessage: Message = {
        id: generateUniqueId(),
        role: "user",
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => {
        const newMessages = [...prev, userMessage]
        setTimeout(() => processMessage(content, newMessages), 50)
        return newMessages
      })
      setInputValue("")
    },
    [inputValue, isLoading, processMessage],
  )

  // Handle initial query from URL - only run once
  useEffect(() => {
    if (initialized) return

    const query = searchParams?.get("query")
    if (query) {
      setInitialized(true)

      const userMessage: Message = {
        id: generateUniqueId(),
        role: "user",
        content: query,
        timestamp: new Date(),
      }

      setMessages([userMessage])
      processMessage(query, [userMessage])
    } else {
      setInitialized(true)
    }
  }, [searchParams, initialized, processMessage])

  return (
    <ChatScreen
      messages={messages}
      inputValue={inputValue}
      setInputValue={setInputValue}
      isLoading={isLoading}
      showQuickQuestions={showQuickQuestions}
      setShowQuickQuestions={setShowQuickQuestions}
      handleSendMessage={handleSendMessage}
      messagesEndRef={messagesEndRef}
      textareaRef={textareaRef}
      onSendMessage={handleSendMessage}
      setMessages={setMessages}
    />
  )
}