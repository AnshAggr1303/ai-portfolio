"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, User2, Briefcase, ChevronRight } from "lucide-react"
import { moreQuestions } from "@/constants/quickQuestions"

interface MoreOptionsPanelProps {
  isOpen: boolean
  onClose: () => void
  onSendMessage: (message: string) => void
}

export default function MoreOptionsPanel({ isOpen, onClose, onSendMessage }: MoreOptionsPanelProps) {
  const handleQuestionClick = (question: string) => {
    onSendMessage(question)
    onClose() // Close the panel after sending a message
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose} // Close when clicking outside
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-lg dark:bg-gray-800 max-h-[80vh] overflow-y-auto" // Added max-h and overflow-y-auto
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <button
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">More Options</h2>
            <div className="space-y-6">
              {moreQuestions.map((categoryGroup, index) => (
                <div key={index}>
                  <div className="mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    {categoryGroup.category === "Me" && <User2 className="h-5 w-5" />}
                    {categoryGroup.category === "Professional" && <Briefcase className="h-5 w-5" />}
                    <h3 className="text-lg font-semibold">{categoryGroup.category}</h3>
                  </div>
                  <div className="space-y-2">
                    {categoryGroup.questions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleQuestionClick(item.question)}
                        className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-left text-gray-800 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
