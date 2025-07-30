"use client"

import type React from "react"
import { MessageCircle } from "lucide-react"
import type { Message } from "../../types/chat"
import ProfileCard, { profileData } from "../ui/ProfileCard"
import Skills from "../ui/skills"
import Contact from "../ui/contact"
import Resume from "../ui/resume"
import Crazy from "../ui/crazy"
import AllProjects from "../projects/AllProjects"
import InternshipCard from "../ui/internship-card"
import { ChatBubble, ChatBubbleMessage } from "../ui/chat/chat-bubble"
import { motion, AnimatePresence } from "framer-motion"
import MoreDrawer from "./MoreDrawer"

interface MessagesAreaProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  onSendMessage: (message: string) => void
}

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: "easeOut" as const,
  },
}

export default function MessagesArea({ messages, isLoading, messagesEndRef, onSendMessage }: MessagesAreaProps) {
  // Helper function to determine if chat icon should be shown
  const shouldShowChatIcon = (currentIndex: number, messages: Message[]): boolean => {
    if (currentIndex === 0) return true // Always show for first message

    const currentMessage = messages[currentIndex]
    const previousMessage = messages[currentIndex - 1]

    // Show chat icon if:
    // 1. Current message is from user, OR
    // 2. Previous message is from user (role change)
    return currentMessage.role === "user" || previousMessage.role === "user"
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 pt-20">
        {messages.length === 0 && (
          <motion.div className="text-center text-gray-600 mt-20" {...MOTION_CONFIG}>
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-2">Start a conversation!</p>
            <p className="text-sm text-gray-500">Ask me about projects, skills, or anything else.</p>
          </motion.div>
        )}

        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => {
              const showIcon = shouldShowChatIcon(index, messages)

              return (
                <motion.div key={message.id} {...MOTION_CONFIG} className="w-full">
                  {/* Only show chat bubble if there's content */}
                  {message.content && (
                    <ChatBubble variant={message.role === "user" ? "sent" : "received"}>
                      <ChatBubbleMessage variant={message.role === "user" ? "sent" : "received"} className="w-full">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </ChatBubbleMessage>
                    </ChatBubble>
                  )}

                  {message.type === "projects" && (
                    <motion.div className="mt-6 w-full" {...MOTION_CONFIG}>
                      <AllProjects />
                    </motion.div>
                  )}

                  {message.type === "profile" && (
                    <motion.div className="mt-6 w-full" {...MOTION_CONFIG}>
                      <ProfileCard {...profileData} />
                    </motion.div>
                  )}

                  {message.type === "skills" && (
                    <motion.div className="mt-6 w-full" {...MOTION_CONFIG}>
                      <Skills />
                    </motion.div>
                  )}

                  {message.type === "contact" && (
                    <motion.div className="mt-6 w-full" {...MOTION_CONFIG}>
                      <Contact />
                    </motion.div>
                  )}

                  {message.type === "resume" && (
                    <motion.div className="w-full rounded-lg" {...MOTION_CONFIG}>
                      <Resume />
                    </motion.div>
                  )}

                  {message.type === "fun" && (
                    <motion.div className="mt-6 w-full" {...MOTION_CONFIG}>
                      <Crazy />
                    </motion.div>
                  )}

                  {message.type === "internship" && (
                    <motion.div className="mt-6 w-full" {...MOTION_CONFIG}>
                      <InternshipCard />
                    </motion.div>
                  )}

                  {message.type === "more" && (
                    <motion.div className="mt-6 w-full" {...MOTION_CONFIG}>
                      <MoreDrawer onSendMessage={onSendMessage} />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {isLoading && (
            <motion.div {...MOTION_CONFIG}>
              <ChatBubble variant="received">
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            </motion.div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
