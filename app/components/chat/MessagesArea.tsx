"use client"

import type React from "react"
import { MessageCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
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
  messagesEndRef: React.RefObject<HTMLDivElement | null>
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

// Custom components for ReactMarkdown
const MarkdownComponents = {
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''
    
    if (!inline && language) {
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          className="rounded-lg my-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      )
    }
    
    return (
      <code 
        className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" 
        {...props}
      >
        {children}
      </code>
    )
  },
  p: ({ children }: any) => (
    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
  ),
  h1: ({ children }: any) => (
    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{children}</h3>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="text-sm leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: any) => (
    <a 
      href={href} 
      className="text-blue-600 dark:text-blue-400 hover:underline" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-gray-300 dark:border-gray-600">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
      {children}
    </td>
  ),
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
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown components={MarkdownComponents}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
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