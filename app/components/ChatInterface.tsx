/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import ChatScreen from "./chat/ChatScreen"
import InitialLoadingScreen from "./InitialLoadingScreen"
import { useChatLogic } from "../hooks/useChatLogic"

export default function ChatInterface() {
  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    initialLoading,
    showQuickQuestions,
    setShowQuickQuestions,
    handleSendMessage,
    messagesEndRef,
    textareaRef,
  } = useChatLogic()

  // Show initial loading screen when processing first query
  if (initialLoading && messages.length === 1) {
    return <InitialLoadingScreen query={messages[0]?.content} />
  }

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