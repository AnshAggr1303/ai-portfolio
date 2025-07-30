"use client"

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { X, User2, Briefcase, ChevronRight, Sparkles } from "lucide-react"
import { moreQuestions } from "@/constants/quickQuestions"
import { useState, useRef, useEffect } from "react"

interface MoreSectionDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSendMessage: (message: string) => void
}

export default function MoreSectionDrawer({ isOpen, onClose, onSendMessage }: MoreSectionDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  // Motion values for draggable drawer
  const y = useMotionValue(0)
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  useEffect(() => {
    if (isOpen) {
      // When opening, reset y to 0 (fully open)
      y.set(0)
    } else {
      // When closing, animate y to the full height of the drawer to slide it down
      if (drawerRef.current) {
        y.set(drawerRef.current.offsetHeight)
      }
    }
  }, [isOpen, y])

  const handleQuestionClick = (question: string, id: string) => {
    setSelectedCardId(id)
    onSendMessage(question)
    // Keep drawer open for multiple selections
  }

  // Transform y to control the actual height of the drawer
  const drawerHeight = useTransform(springY, (val) => `calc(80vh - ${val}px)`)

  const handleDragStart = () => {
    // Handle drag start
  }

  const handleDrag = (event: any, info: any) => {
    if (info.offset.y > 0) {
      y.set(info.offset.y)
    }
  }

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 100 || info.velocity.y > 200) {
      onClose()
    } else {
      y.set(0)
    }
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
          {/* Blurred Background Image */}
          <div className="absolute inset-0 -z-10">
            <img
              src="/placeholder.svg?height=1080&width=1920"
              alt="Blurred background"
              className="h-full w-full object-cover filter blur-lg"
            />
          </div>

          <motion.div
            ref={drawerRef}
            style={{ y: springY, height: drawerHeight }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative flex w-full max-w-md flex-col rounded-t-3xl bg-white p-6 shadow-lg dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {/* Draggable Handle */}
            <div className="absolute left-1/2 top-0 my-3 h-1.5 w-12 -translate-x-1/2 cursor-grab touch-none rounded-full bg-gray-300" />

            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-6 mt-8 text-2xl font-bold text-gray-900 dark:text-white">More Options</h2>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
              {moreQuestions.map((categoryGroup, index) => (
                <div key={index}>
                  <div className="mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    {categoryGroup.category === "Me" && <User2 className="h-5 w-5" />}
                    {categoryGroup.category === "Professional" && <Briefcase className="h-5 w-5" />}
                    <h3 className="text-lg font-semibold">{categoryGroup.category}</h3>
                  </div>
                  <div className="space-y-2">
                    {categoryGroup.questions.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleQuestionClick(item.question, item.id)}
                        className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors duration-200 ${
                          selectedCardId === item.id
                            ? "bg-black text-white"
                            : "bg-gray-50 text-gray-800 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        }`}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01, rotateY: 2 }}
                      >
                        <span
                          className={`flex items-center gap-2 ${
                            selectedCardId === item.id
                              ? "text-white"
                              : "text-gray-800 group-hover:text-gray-900 dark:text-white"
                          }`}
                        >
                          {selectedCardId === item.id && <Sparkles className="h-4 w-4" />}
                          {item.label}
                        </span>
                        <ChevronRight
                          className={`h-5 w-5 ${
                            selectedCardId === item.id ? "text-white" : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                      </motion.button>
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
