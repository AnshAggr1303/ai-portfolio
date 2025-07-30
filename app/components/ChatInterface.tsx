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

  // Common exclusion keywords that should go to RAG instead of components
  const RAG_KEYWORDS = [
    // Philosophy & Approach (but not basic "who are you")
    "philosophy",
    "approach",
    "methodology",
    "mindset",
    "values",
    "principles",
    "beliefs",
    "perspective",
    "viewpoint",
    "opinion",
    "thoughts on",

    // Experience & Background (detailed questions)
    "background",
    "history",
    "journey",
    "career path",
    "story",
    "how did you",
    "why did you",
    "when did you start",
    "how long have you",

    // Education & Learning (detailed)
    "degree",
    "university",
    "college",
    "studied",
    "learned",
    "courses",
    "certification details",
    "academic",
    "school",

    // Detailed Technical Questions
    "how do you",
    "what do you think",
    "explain",
    "difference between",
    "compare",
    "vs",
    "versus",
    "better than",
    "why use",
    "when to use",

    // Goals & Future (detailed)
    "goals",
    "aspirations",
    "future",
    "next",
    "planning",
    "want to",
    "dream",
    "vision",
    "ambition",
    "hope to",
    "aim to",

    // Process & Methods
    "process",
    "method",
    "way",
    "how you",
    "your way of",
    "strategy",
    "technique",
    "practice",
    "workflow",
    "system",

    // Opinions & Preferences
    "favorite",
    "prefer",
    "like",
    "dislike",
    "hate",
    "love",
    "best",
    "worst",
    "recommend",
    "suggest",
    "advice",
    "tip",

    // Availability & Opportunities
    "available",
    "hiring",
    "opportunity",
    "job",
    "work",
    "freelance",
    "contract",
    "full-time",
    "part-time",
    "remote",

    // Achievements & Detailed Info
    "achievement",
    "award",
    "recognition",
    "accomplishment",
    "success",
    "proud of",
    "biggest",
    "most",
    "challenge",
    "difficult",

    // Learning & Development
    "learning",
    "studying",
    "currently",
    "now",
    "recently",
    "latest",
    "new",
    "trend",
    "technology",
    "framework",
  ]

  // Function to check if a message should go to RAG instead of components
  const shouldGoToRAG = (message: string): boolean => {
    const lowerMessage = message.toLowerCase()

    // Special exceptions for basic questions that should show components
    const basicComponentQuestions = [
      "who are you",
      "who are you?",
      "tell me about you",
      "tell me about yourself",
      "introduce yourself",
      "about you",
      "about yourself",
      "what are your projects",
      "what projects",
      "show me projects",
      "your projects",
      "projects",
      "what are your skills",
      "your skills",
      "skills",
      "contact",
      "contact details",
      "how can i contact you",
    ]

    if (basicComponentQuestions.some((phrase) => lowerMessage.includes(phrase))) {
      return false // Don't send to RAG, show component instead
    }

    // Check for RAG keywords
    const hasRAGKeywords = RAG_KEYWORDS.some((keyword) => lowerMessage.includes(keyword))

    // Check for question patterns that should go to RAG
    const ragPatterns = [
      /^(what do you think|how do you|why do you|when do you|where do you)/,
      /^(tell me about your|explain your|describe your)/,
      /^(what is your|what are your).*(philosophy|approach|opinion|view)/,
      /^(how did you|why did you|when did you)/,
      /\b(vs|versus|compared to|better than)\b/,
      /\b(favorite|prefer|recommend|suggest|advice)\b/,
      /\b(currently|recently|latest|new|future|next)\b/,
      /\?(.*)(philosophy|approach|experience|opinion|think|feel)/,
    ]

    const hasRAGPatterns = ragPatterns.some((pattern) => pattern.test(lowerMessage))

    return hasRAGKeywords || hasRAGPatterns
  }

  // Updated detection functions with comprehensive exclusion logic
  const isProfileQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()

    // Enhanced profile detection - include more variations
    const exactProfileMatches = [
      "show me your profile",
      "your profile",
      "profile card",
      "about you",
      "who are you",
      "who are you?",
      "introduce yourself",
      "tell me about yourself",
      "tell me about you",
      "about yourself",
      "i want to know more about you",
      "know more about you",
      "more about you",
    ]

    // Check for exact matches or close matches
    if (
      exactProfileMatches.some(
        (phrase) =>
          lowerMessage === phrase ||
          lowerMessage.includes(phrase) ||
          // Handle compound questions like "Who are you? I want to know more about you."
          (lowerMessage.includes("who are you") && lowerMessage.includes("know") && lowerMessage.includes("about")),
      )
    ) {
      return true
    }

    // Very specific profile patterns
    const profilePatterns = [
      /^(show me\s+)?(your\s+)?profile$/,
      /^profile$/,
      /^who\s+are\s+you\??$/,
      /^about\s+you$/,
      /^introduce\s+yourself$/,
      /^tell\s+me\s+about\s+yourself$/,
      /who\s+are\s+you.*want.*know.*about/,
      /who\s+are\s+you.*more.*about/,
    ]

    return profilePatterns.some((pattern) => pattern.test(lowerMessage))
  }

  const isProjectsQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()

    if (shouldGoToRAG(message)) {
      return false
    }

    // Enhanced project detection with more variations
    const exactProjectMatches = [
      "show me your projects",
      "your projects",
      "show projects",
      "projects",
      "what projects have you worked on",
      "what are your projects",
      "what projects",
      "what are you working on",
      "what are you working on right now",
      "working on right now",
      "current projects",
      "recent projects",
    ]

    if (
      exactProjectMatches.some(
        (phrase) =>
          lowerMessage === phrase ||
          lowerMessage.includes(phrase) ||
          lowerMessage === phrase + "?" ||
          // Handle compound questions like "What are your projects? What are you working on right now?"
          (lowerMessage.includes("what are your projects") && lowerMessage.includes("working on")) ||
          (lowerMessage.includes("projects") &&
            lowerMessage.includes("working on") &&
            lowerMessage.includes("right now")),
      )
    ) {
      return true
    }

    const projectPatterns = [
      /^(show me\s+)?(your\s+)?projects?$/,
      /^projects?$/,
      /^portfolio$/,
      /^what\s+projects/,
      /^what\s+are\s+you\s+working\s+on/,
      /working\s+on\s+(right\s+)?now/,
      /current\s+projects/,
      /recent\s+projects/,
      /what.*projects.*working.*on/,
    ]

    return projectPatterns.some((pattern) => pattern.test(lowerMessage))
  }

  const isSkillsQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()

    if (shouldGoToRAG(message)) {
      return false
    }

    const exactSkillsMatches = [
      "show me your skills",
      "your skills",
      "skills",
      "what are your skills",
      "what skills do you have",
    ]

    if (
      exactSkillsMatches.some(
        (phrase) => lowerMessage === phrase || lowerMessage.includes(phrase) || lowerMessage === phrase + "?",
      )
    ) {
      return true
    }

    const skillPatterns = [/^(show me\s+)?(your\s+)?skills?$/, /^skills?$/, /^what\s+(are\s+)?(your\s+)?skills/]

    return skillPatterns.some((pattern) => pattern.test(lowerMessage))
  }

  const isContactQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()

    // First check if it should go to RAG (but contact info is usually ok to show)
    // Only exclude if it's asking about contact philosophy or approach
    if (
      lowerMessage.includes("philosophy") ||
      lowerMessage.includes("approach") ||
      lowerMessage.includes("prefer") ||
      lowerMessage.includes("method")
    ) {
      return false
    }

    const exactContactMatches = [
      "show me your contact details",
      "your contact details",
      "contact details",
      "contact",
      "how can i contact you",
      "contact you",
    ]

    if (
      exactContactMatches.some(
        (phrase) =>
          lowerMessage === phrase || (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 15),
      )
    ) {
      return true
    }

    const contactPatterns = [
      /^(show me\s+)?(your\s+)?contact(\s+details)?$/,
      /^contact$/,
      /^how\s+(can\s+)?i\s+contact\s+you$/,
    ]

    return contactPatterns.some((pattern) => pattern.test(lowerMessage))
  }

  const isResumeQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()

    // Resume queries are usually straightforward, but check for detailed questions
    if (
      lowerMessage.includes("tell me about") ||
      lowerMessage.includes("explain") ||
      lowerMessage.includes("details about") ||
      lowerMessage.includes("experience in")
    ) {
      return false
    }

    const exactResumeMatches = ["show me your resume", "your resume", "resume", "download resume", "cv"]

    if (
      exactResumeMatches.some(
        (phrase) =>
          lowerMessage === phrase || (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 10),
      )
    ) {
      return true
    }

    const resumePatterns = [/^(show me\s+)?(your\s+)?resume$/, /^resume$/, /^cv$/, /^download\s+resume$/]

    return resumePatterns.some((pattern) => pattern.test(lowerMessage))
  }

  const isFunQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()

    // First check if it should go to RAG
    if (shouldGoToRAG(message)) {
      return false
    }

    const exactFunMatches = ["show me your adventure photos", "adventure photos", "fun photos", "kedarnath trek"]

    if (
      exactFunMatches.some(
        (phrase) =>
          lowerMessage === phrase || (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 10),
      )
    ) {
      return true
    }

    const funPatterns = [/^(show me\s+)?adventure\s+photos?$/, /^kedarnath$/, /^fun\s+photos?$/]

    return funPatterns.some((pattern) => pattern.test(lowerMessage))
  }

  const isMoreQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()

    const exactMoreMatches = ["show me more options", "more options", "more", "what else", "show more"]

    if (
      exactMoreMatches.some(
        (phrase) =>
          lowerMessage === phrase ||
          lowerMessage === phrase + "?" ||
          (lowerMessage.includes(phrase) && lowerMessage.length <= phrase.length + 5),
      )
    ) {
      return true
    }

    const morePatterns = [/^(show me\s+)?more(\s+options)?$/i, /^more$/i, /^what\s+else$/i, /^show\s+more$/i]

    return morePatterns.some((pattern) => pattern.test(lowerMessage))
  }

  const isInternshipQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()

    // First check if it should go to RAG for detailed questions
    if (shouldGoToRAG(message)) {
      return false
    }

    const exactInternshipMatches = [
      "are you available for internship",
      "looking for internship",
      "internship plans",
      "summer internship",
      "available for work",
      "are you available for new opportunities",
      "availability",
      "when are you available",
      "internship availability",
      "looking for talent",
      "hiring",
      "job opportunity",
      "work opportunity",
      "freelance availability",
      "part time work",
      "remote work",
    ]

    if (
      exactInternshipMatches.some(
        (phrase) =>
          lowerMessage === phrase ||
          lowerMessage.includes(phrase) ||
          lowerMessage === phrase + "?" ||
          // Handle compound questions
          (lowerMessage.includes("available") &&
            (lowerMessage.includes("internship") ||
              lowerMessage.includes("work") ||
              lowerMessage.includes("opportunity"))) ||
          (lowerMessage.includes("looking") && lowerMessage.includes("talent")),
      )
    ) {
      return true
    }

    const internshipPatterns = [
      /^(are you\s+)?available(\s+for)?\s*(internship|work|opportunities?)$/,
      /^internship(\s+plans)?$/,
      /^availability$/,
      /^when\s+are\s+you\s+available/,
      /looking\s+for\s+(talent|intern|developer)/,
      /hiring.*developer/,
      /available.*internship/,
      /internship.*available/,
    ]

    return internshipPatterns.some((pattern) => pattern.test(lowerMessage))
  }

  const getMessageType = (
    message: string,
  ): "profile" | "projects" | "skills" | "contact" | "resume" | "fun" | "more" | "internship" | undefined => {
    // Check in order of specificity (most specific first)
    if (isInternshipQuery(message)) return "internship"
    if (isResumeQuery(message)) return "resume"
    if (isContactQuery(message)) return "contact"
    if (isFunQuery(message)) return "fun"
    if (isSkillsQuery(message)) return "skills"
    if (isProjectsQuery(message)) return "projects"
    if (isProfileQuery(message)) return "profile"
    if (isMoreQuery(message)) return "more"

    return undefined
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
        const messageType = getMessageType(content)

        // Check for component queries using the unified detection
        if (messageType === "profile") {
          responseContent = "Here's my profile:"

          // Add immediate follow-up response for profile
          setTimeout(() => {
            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content:
                "That's me in a nutshell! 👆 I'm passionate about creating innovative solutions and always excited to take on new challenges. Love working on projects that make a real impact! \n\nWhat kind of projects are you working on?",
              timestamp: new Date(),
            }

            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)
        } else if (messageType === "projects") {
          responseContent = "Here are some of my recent projects:"

          // Add immediate follow-up response for projects
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
        } else if (messageType === "skills") {
          responseContent = "Here are my skills and expertise:"

          // Add Gemini-generated follow-up response for skills
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
                "You can check out all my skills above! I've got a mix of hard skills like coding in various languages and soft skills like communication and problem-solving. Pretty handy, right? 😄\n\nWhat skills are you looking for in a developer?"

              const followUpMessage: Message = {
                id: generateUniqueId(),
                role: "assistant",
                content: followUpContent,
                timestamp: new Date(),
              }

              setMessages((prev) => [...prev, followUpMessage])
            } catch (error) {
              console.error("Error getting follow-up response:", error)
              // Fallback to hardcoded message if API fails
              const fallbackMessage: Message = {
                id: generateUniqueId(),
                role: "assistant",
                content:
                  "You can check out all my skills above! I've got a mix of hard skills like coding in various languages and soft skills like communication and problem-solving. Pretty handy, right? 😄\n\nWhat skills are you looking for in a developer?",
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, fallbackMessage])
            }
          }, 1000)
        } else if (messageType === "contact") {
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
        } else if (messageType === "resume") {
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
        } else if (messageType === "fun") {
          responseContent = "Check out my Kedarnath trek adventure:"

          setTimeout(() => {
            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content:
                "That was such an incredible experience! 🏔️ Kedarnath is one of those places that really tests your limits and rewards you with breathtaking views. The journey was challenging but so worth it!\n\nDo you enjoy trekking or outdoor adventures too?",
              timestamp: new Date(),
            }

            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)
        } else if (messageType === "more") {
          // For "more" queries, we don't add a text message, just show the drawer directly
          responseContent = "" // No text message

          // Add the more component immediately without any text
          setTimeout(() => {
            const moreMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content: "", // Empty content since we're showing the drawer directly
              timestamp: new Date(),
              type: "more",
            }

            setMessages((prev) => [...prev, moreMessage])
            setIsLoading(false)
            processingRef.current.delete(content)
          }, 300)
          return // Early return to avoid the normal flow
        } else if (messageType === "internship") {
          responseContent = "Here's my internship availability and what I'm looking for:"

          setTimeout(() => {
            const followUpMessage: Message = {
              id: generateUniqueId(),
              role: "assistant",
              content:
                "I'm actively looking for summer 2026 internships and part-time opportunities! 🚀 I'm passionate about AI/ML and full-stack development, and I'd love to contribute to innovative projects. Feel free to reach out if you think I'd be a good fit for your team!\n\nWhat kind of role or project are you working on?",
              timestamp: new Date(),
            }

            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)
        }
        // Regular API call for all other queries (including philosophy, experience, etc.)
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

        console.log("Message type detected:", messageType)

        // Add assistant response immediately for special types, with a small delay for API responses
        const delay = messageType ? 500 : 100

        setTimeout(() => {
          const assistantMessage: Message = {
            id: generateUniqueId(),
            role: "assistant",
            content: responseContent,
            timestamp: new Date(),
            ...(messageType && { type: messageType }),
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
        // Process the message with the updated messages array
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
