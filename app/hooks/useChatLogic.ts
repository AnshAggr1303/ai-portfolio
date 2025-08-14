// app/hooks/useChatLogic.ts

import { useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import type { Message } from "../types/chat"
import { MessageProcessor } from "../lib/messageProcessor"
import { handleComponentMessage, handleRAGResponse, generateUniqueId } from "../lib/componentHandlers"
import { ConversationMemory } from "../lib/conversationMemory"

export const useChatLogic = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false) // New state for initial query processing
  const [showQuickQuestions, setShowQuickQuestions] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const searchParams = useSearchParams()
  const processingRef = useRef<Set<string>>(new Set())

  // Updated scroll effect - now triggers on messages AND loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading, initialLoading]) // Added loading dependencies

  // Update conversation memory when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      ConversationMemory.updateComponentMemory(lastMessage)
    }
  }, [messages])

  const processMessage = useCallback(
    async (content: string, chatHistory: Message[] = [], isInitialQuery = false) => {
      // Prevent duplicate processing of the same message
      if (processingRef.current.has(content) || isLoading) {
        console.log("🚫 Skipping duplicate or already processing:", content)
        return
      }

      console.log("📨 Processing message:", content, "isInitial:", isInitialQuery)
      processingRef.current.add(content)
      
      if (isInitialQuery) {
        setInitialLoading(true)
      } else {
        setIsLoading(true)
      }

      try {
        // Use enhanced message processor
        const processingResult = MessageProcessor.processMessage(content, chatHistory)
        console.log("🔍 Processing result:", processingResult)

        if (processingResult.shouldShowComponent && processingResult.componentType) {
          // Handle component message
          console.log(`🎯 Handling component: ${processingResult.componentType}`)
          await handleComponentMessage(
            processingResult.componentType,
            content,
            chatHistory,
            setMessages,
            isInitialQuery ? setInitialLoading : setIsLoading,
            processingRef
          )
        } else if (processingResult.shouldUseRAG) {
          // Handle RAG response with intent context
          console.log("🤖 Handling RAG response with intent:", processingResult.intentAnalysis.intentType)
          await handleRAGResponse(
            content,
            chatHistory,
            setMessages,
            isInitialQuery ? setInitialLoading : setIsLoading,
            processingRef,
            processingResult.intentAnalysis.intentType
          )
        } else {
          // Fallback - shouldn't happen but just in case
          console.log("⚠️ No handler found, using RAG fallback")
          await handleRAGResponse(
            content,
            chatHistory,
            setMessages,
            isInitialQuery ? setInitialLoading : setIsLoading,
            processingRef
          )
        }

      } catch (error) {
        console.error("❌ Error processing message:", error)
        
        // Create error message
        const errorMessage: Message = {
          id: generateUniqueId(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again!",
          timestamp: new Date(),
        }
        
        setMessages((prev) => [...prev, errorMessage])
        
        if (isInitialQuery) {
          setInitialLoading(false)
        } else {
          setIsLoading(false)
        }
        
        processingRef.current.delete(content)
      }
    },
    [isLoading],
  )

  const handleSendMessage = useCallback(
    async (messageContent?: string) => {
      const content = messageContent || inputValue.trim()
      if (!content || isLoading || initialLoading) {
        console.log("🚫 No content or already loading")
        return
      }

      console.log("📤 Sending message:", content)

      const userMessage: Message = {
        id: generateUniqueId(),
        role: "user",
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => {
        const newMessages = [...prev, userMessage]
        // Process message after state update
        setTimeout(() => processMessage(content, newMessages, false), 50)
        return newMessages
      })
      
      setInputValue("")
      setShowQuickQuestions(false) // Hide quick questions after first message
    },
    [inputValue, isLoading, initialLoading, processMessage],
  )

  // Handle initial query from URL - only run once
  useEffect(() => {
    console.log("🔗 URL Effect - initialized:", initialized)
    console.log("🔗 searchParams:", searchParams?.toString())
    
    if (initialized) {
      console.log("🔗 Already initialized, skipping")
      return
    }

    const query = searchParams?.get("query")
    console.log("🔗 Extracted query:", query)
    
    if (query) {
      console.log("🔗 Processing URL query:", query)
      setInitialized(true)

      const userMessage: Message = {
        id: generateUniqueId(),
        role: "user" as const,
        content: query,
        timestamp: new Date(),
      }

      setMessages([userMessage])
      setShowQuickQuestions(false)
      
      console.log("🔗 About to call processMessage with:", query)
      
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        processMessage(query, [userMessage], true) // Pass true for initial query
      }, 100)
    } else {
      setInitialized(true)
    }
  }, [searchParams, initialized, processMessage])

  // Clear conversation memory when component unmounts
  useEffect(() => {
    return () => {
      ConversationMemory.clearMemory()
    }
  }, [])

  return {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    initialLoading, // Export the new initial loading state
    showQuickQuestions,
    setShowQuickQuestions,
    handleSendMessage,
    messagesEndRef,
    textareaRef,
  }
}