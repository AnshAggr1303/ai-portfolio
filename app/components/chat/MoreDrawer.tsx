"use client"

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { 
  X, 
  User2, 
  Briefcase, 
  ChevronRight, 
  Sparkles, 
  Trophy, 
  Code, 
  Clock, 
  Heart, 
  Zap 
} from "lucide-react"
import { moreQuestions } from "@/constants/quickQuestions"
import { useState, useRef } from "react"

interface MoreDrawerProps {
  onSendMessage: (message: string) => void
}

// Category icon and color mapping
const getCategoryConfig = (category: string) => {
  switch (category) {
    case "Professional":
      return { icon: Briefcase, color: "bg-green-500/10", iconColor: "text-green-600" }
    case "Achievements & Recognition":
      return { icon: Trophy, color: "bg-yellow-500/10", iconColor: "text-yellow-600" }
    case "Tech & Code":
      return { icon: Code, color: "bg-purple-500/10", iconColor: "text-purple-600" }
    case "Journey & Timeline":
      return { icon: Clock, color: "bg-indigo-500/10", iconColor: "text-indigo-600" }
    case "Hobbies & Interests":
      return { icon: Heart, color: "bg-pink-500/10", iconColor: "text-pink-600" }
    case "Quick Facts":
      return { icon: Zap, color: "bg-orange-500/10", iconColor: "text-orange-600" }
    case "Me":
      return { icon: User2, color: "bg-blue-500/10", iconColor: "text-blue-600" }
    default:
      return { icon: Sparkles, color: "bg-gray-500/10", iconColor: "text-gray-600" }
  }
}

export default function MoreDrawer({ onSendMessage }: MoreDrawerProps) {
  const [open, setOpen] = useState(true) // Start open immediately
  const drawerRef = useRef<HTMLDivElement>(null)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  // Motion values for draggable drawer
  const y = useMotionValue(0)
  const springY = useSpring(y, { stiffness: 400, damping: 35 })

  const handleQuestionClick = (question: string, id: string) => {
    setSelectedCardId(id)
    onSendMessage(question)
    // Close drawer after showing selection
    setTimeout(() => {
      setOpen(false)
    }, 600)
  }

  const drawerHeight = useTransform(springY, (val) => `calc(85vh - ${Math.max(0, val)}px)`)

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 120
    const velocity = info.velocity.y

    if (info.offset.y > threshold || velocity > 250) {
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
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-md"
            style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              ref={drawerRef}
              style={{ y: springY, height: drawerHeight }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 35, 
                stiffness: 400,
                mass: 0.8
              }}
              className="relative flex w-full max-w-lg flex-col bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={handleDragEnd}
            >
              {/* Apple-style Drag Handle */}
              <div className="flex justify-center pt-3 pb-4">
                <div className="w-10 h-1.5 bg-gray-300/80 rounded-full" />
              </div>

              {/* Close Button */}
              <button
                className="absolute right-6 top-6 z-10 w-8 h-8 rounded-full bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 flex items-center justify-center transition-all duration-200 hover:bg-gray-200/80 hover:scale-105 active:scale-95"
                onClick={() => setOpen(false)}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              {/* Header */}
              <div className="px-6 pb-2">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-3xl font-bold text-gray-900 tracking-tight"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}
                >
                  More Options
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-base text-gray-500 mt-1 font-medium"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  Choose what you'd like to explore
                </motion.p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="space-y-8">
                  {moreQuestions.map((categoryGroup, categoryIndex) => {
                    const categoryConfig = getCategoryConfig(categoryGroup.category)
                    const CategoryIcon = categoryConfig.icon
                    
                    return (
                      <motion.div
                        key={categoryIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: 0.3 + categoryIndex * 0.1,
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      >
                        {/* Category Header with Dynamic Icons */}
                        <div className="mb-4 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${categoryConfig.color}`}>
                            <CategoryIcon className={`h-5 w-5 ${categoryConfig.iconColor}`} />
                          </div>
                          <h3 
                            className="text-xl font-semibold text-gray-900 tracking-tight"
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}
                          >
                            {categoryGroup.category}
                          </h3>
                        </div>

                        <div className="space-y-2">
                          {categoryGroup.questions.map((item, itemIndex) => (
                            <motion.button
                              key={item.id}
                              onClick={() => handleQuestionClick(item.question, item.id)}
                              className={`group relative w-full rounded-2xl p-4 text-left transition-all duration-300 ${
                                selectedCardId === item.id
                                  ? "bg-blue-500 shadow-lg shadow-blue-500/25"
                                  : "bg-gray-50/80 hover:bg-gray-100/80 hover:shadow-md"
                              }`}
                              whileTap={{ scale: 0.96 }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: 0.4 + categoryIndex * 0.1 + itemIndex * 0.05,
                                duration: 0.4,
                                ease: [0.25, 0.46, 0.45, 0.94]
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  {selectedCardId === item.id && (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{ 
                                        type: "spring", 
                                        stiffness: 500, 
                                        damping: 25 
                                      }}
                                    >
                                      <Sparkles className="h-4 w-4 text-white" />
                                    </motion.div>
                                  )}
                                  <span
                                    className={`font-medium text-base ${
                                      selectedCardId === item.id
                                        ? "text-white"
                                        : "text-gray-900 group-hover:text-gray-900"
                                    }`}
                                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                                  >
                                    {item.label}
                                  </span>
                                </div>
                                <ChevronRight
                                  className={`h-5 w-5 transition-all duration-200 ${
                                    selectedCardId === item.id
                                      ? "text-white transform translate-x-0.5"
                                      : "text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5"
                                  }`}
                                />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Footer hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="px-6 py-4 bg-gray-50/50 backdrop-blur-sm border-t border-gray-200/50"
              >
                <p 
                  className="text-xs text-gray-500 text-center font-medium"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  Drag down or tap outside to close
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}