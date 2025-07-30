"use client"

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { X, User2, Briefcase, ChevronRight, Sparkles, Grip } from "lucide-react"
import { moreQuestions } from "@/constants/quickQuestions"
import { useState, useRef, useEffect } from "react"

interface MoreDrawerProps {
  onSendMessage: (message: string) => void
}

export default function MoreDrawer({ onSendMessage }: MoreDrawerProps) {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  // Motion values for draggable drawer
  const y = useMotionValue(0)
  const springY = useSpring(y, { stiffness: 400, damping: 40 })

  // Auto-open the drawer when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true)
    }, 100) // Small delay for smooth animation
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (open) {
      y.set(0)
    } else {
      if (drawerRef.current) {
        y.set(drawerRef.current.offsetHeight)
      }
    }
  }, [open, y])

  const handleQuestionClick = (question: string, id: string) => {
    setSelectedCardId(id)
    onSendMessage(question)
    // Close drawer after a short delay to show selection
    setTimeout(() => {
      setOpen(false)
    }, 500)
  }

  const drawerHeight = useTransform(springY, (val) => `calc(85vh - ${Math.max(0, val)}px)`)

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 150
    const velocity = info.velocity.y

    if (info.offset.y > threshold || velocity > 300) {
      setOpen(false)
    } else {
      y.set(0)
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              ref={drawerRef}
              style={{ y: springY, height: drawerHeight }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative flex w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl border-t border-gray-100"
              onClick={(e) => e.stopPropagation()}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={handleDragEnd}
            >
              {/* Enhanced Draggable Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 cursor-grab active:cursor-grabbing">
                  <Grip className="h-4 w-4 text-gray-400" />
                  <div className="h-1 w-8 rounded-full bg-gray-300" />
                  <Grip className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Close Button */}
              <button
                className="absolute right-6 top-6 z-10 rounded-full bg-gray-100 p-2.5 text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:scale-105 active:scale-95"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="px-6 pb-4">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  More Options
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-500 mt-1"
                >
                  Choose what you'd like to know more about
                </motion.p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="space-y-6">
                  {moreQuestions.map((categoryGroup, categoryIndex) => (
                    <motion.div
                      key={categoryIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + categoryIndex * 0.1 }}
                    >
                      <div className="mb-4 flex items-center gap-3 text-gray-700">
                        <div className="p-2 rounded-lg bg-gray-50">
                          {categoryGroup.category === "Me" && <User2 className="h-5 w-5 text-blue-600" />}
                          {categoryGroup.category === "Professional" && (
                            <Briefcase className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <h3 className="text-lg font-semibold">{categoryGroup.category}</h3>
                      </div>

                      <div className="space-y-3">
                        {categoryGroup.questions.map((item, itemIndex) => (
                          <motion.button
                            key={item.id}
                            onClick={() => handleQuestionClick(item.question, item.id)}
                            className={`group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-300 ${
                              selectedCardId === item.id
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-[1.02]"
                                : "bg-gray-50 text-gray-800 hover:bg-gray-100 hover:shadow-md hover:scale-[1.01]"
                            }`}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + categoryIndex * 0.1 + itemIndex * 0.05 }}
                          >
                            <span
                              className={`flex items-center gap-3 font-medium ${
                                selectedCardId === item.id ? "text-white" : "text-gray-800 group-hover:text-gray-900"
                              }`}
                            >
                              {selectedCardId === item.id && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                >
                                  <Sparkles className="h-4 w-4" />
                                </motion.div>
                              )}
                              {item.label}
                            </span>
                            <ChevronRight
                              className={`h-5 w-5 transition-transform duration-200 ${
                                selectedCardId === item.id
                                  ? "text-white translate-x-1"
                                  : "text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1"
                              }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="px-6 py-4 border-t border-gray-100 bg-gray-50/50"
              >
                <p className="text-xs text-gray-500 text-center">Drag down or tap outside to close</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
