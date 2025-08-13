import type React from "react"
import MessagesArea from "./MessagesArea"
import ChatInput from "./ChatInput"
import type { Message } from "../../types/chat"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface ChatScreenProps {
  messages: Message[]
  inputValue: string
  setInputValue: (value: string) => void
  isLoading: boolean
  showQuickQuestions: boolean
  setShowQuickQuestions: (show: boolean) => void
  handleSendMessage: (messageContent?: string) => void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onSendMessage?: (message: string) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  onBack?: () => void
}

export default function ChatScreen({
  messages,
  inputValue,
  setInputValue,
  isLoading,
  showQuickQuestions,
  setShowQuickQuestions,
  handleSendMessage,
  messagesEndRef,
  textareaRef,
  onSendMessage,
  setMessages,
  onBack,
}: ChatScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50 relative">
      {/* Apple-style Back Button */}
      {onBack && (
        <motion.button
          onClick={onBack}
          className="fixed top-6 left-6 z-50 w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
          style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          whileTap={{ scale: 0.96 }}
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" strokeWidth={2.5} />
        </motion.button>
      )}

      {/* Messages Area */}
      <MessagesArea
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        onSendMessage={onSendMessage || handleSendMessage}
      />

      {/* Chat Input */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        showQuickQuestions={showQuickQuestions}
        setShowQuickQuestions={setShowQuickQuestions}
        handleSendMessage={handleSendMessage}
        textareaRef={textareaRef}
        setMessages={setMessages}
      />
    </div>
  )
}