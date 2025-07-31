import type React from "react"
import MessagesArea from "./MessagesArea"
import ChatInput from "./ChatInput"
import type { Message } from "../../types/chat"

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
}: ChatScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
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