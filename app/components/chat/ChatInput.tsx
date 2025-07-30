"use client"

import { ArrowUp, ChevronDown, ChevronUp } from "lucide-react"
import type React from "react"
import { categoryButtons } from "../../constants/quickQuestions"
import { motion } from "framer-motion"
import type { Message } from "../../types/chat"

interface ChatInputProps {
  inputValue: string
  setInputValue: (value: string) => void
  isLoading: boolean
  showQuickQuestions: boolean
  setShowQuickQuestions: (show: boolean) => void
  handleSendMessage: (messageContent?: string) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export default function ChatInput({
  inputValue,
  setInputValue,
  isLoading,
  showQuickQuestions,
  setShowQuickQuestions,
  handleSendMessage,
  textareaRef,
  setMessages,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && inputValue.trim()) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue.trim()) {
      handleSendMessage()
    }
  }

  return (
    <div className="flex-shrink-0">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Quick Questions */}
        {showQuickQuestions && (
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowQuickQuestions(false)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <ChevronUp className="w-4 h-4" />
                Hide quick questions
              </button>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
                {categoryButtons.map((category, index) => {
                  const IconComponent = category.icon

                  // Special handling for "More" button
                  if (category.key === "More") {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          // For "More", directly trigger the drawer without sending a message
                          const moreMessage: Message = {
                            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            role: "assistant",
                            content: "", // Empty content since we're showing the drawer directly
                            timestamp: new Date(),
                            type: "more",
                          }

                          // Add the more message directly to trigger the drawer
                          setMessages((prev: Message[]) => [...prev, moreMessage])
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 text-sm group shadow-sm"
                      >
                        <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: category.color }} />
                        <span className="text-gray-700 group-hover:text-gray-900 font-medium whitespace-nowrap">
                          {category.label}
                        </span>
                      </button>
                    )
                  }

                  // Regular handling for other buttons
                  return (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(category.prompt)}
                      className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 text-sm group shadow-sm"
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: category.color }} />
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium whitespace-nowrap">
                        {category.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {!showQuickQuestions && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowQuickQuestions(true)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <ChevronDown className="w-4 h-4" />
              Show quick questions
            </button>
          </div>
        )}

        {/* Input Field */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="flex items-center rounded-full border border-[#E5E5E9] bg-[#ECECF0] py-2 pr-2 pl-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything"
                className="text-md w-full border-none bg-transparent text-black placeholder:text-gray-500 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="flex items-center justify-center rounded-full bg-[#0171E3] p-2 text-white disabled:opacity-50 hover:bg-[#0157C2] transition-colors"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
