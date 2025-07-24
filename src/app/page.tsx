"use client"

import { motion } from "framer-motion"
import { ArrowRight, Briefcase, Laugh, Layers, PartyPopper, User2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import LoadingScreen from "../components/loading-screen"

/* ---------- quick-question data ---------- */
const questions = {
  Me: "Who are you? I want to know more about you.",
  Projects: "What are your projects? What are you working on right now?",
  Skills: "What are your skills? Give me a list of your soft and hard skills.",
  Fun: "What's the craziest thing you've ever done? What are your hobbies?",
  Contact: "How can I contact you?",
} as const

const questionConfig = [
  { key: "Me", color: "#329696", icon: Laugh },
  { key: "Projects", color: "#3E9858", icon: Briefcase },
  { key: "Skills", color: "#856ED9", icon: Layers },
  { key: "Fun", color: "#B95F9D", icon: PartyPopper },
  { key: "Contact", color: "#C19433", icon: User2 },
] as const

/* ---------- Neural Network Component ---------- */
const NeuralNetwork = () => {
  const [nodes, setNodes] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Use deterministic positioning to avoid hydration issues
    const generateNodes = () => {
      const newNodes = []
      for (let i = 0; i < 12; i++) {
        newNodes.push({
          x: (i * 17 + 13) % 100, // Deterministic pseudo-random
          y: (i * 23 + 7) % 100,
          id: i,
        })
      }
      setNodes(newNodes)
    }
    generateNodes()
  }, [])

  if (!isClient) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connections */}
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((otherNode, j) => {
            const distance = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2))
            if (distance < 25) {
              return (
                <motion.line
                  key={`${node.id}-${otherNode.id}`}
                  x1={node.x}
                  y1={node.y}
                  x2={otherNode.x}
                  y2={otherNode.y}
                  stroke="url(#neuralGradient)"
                  strokeWidth="0.1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, delay: i * 0.1 }}
                />
              )
            }
            return null
          }),
        )}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="0.3"
            fill="url(#nodeGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}

        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

/* ---------- Floating Tech Particles ---------- */
const FloatingTechParticles = () => {
  const [isClient, setIsClient] = useState(false)
  const techSymbols = ["⚛️", "🔧", "💻", "🚀", "⚡", "🎯", "🔮", "💡"]

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {techSymbols.map((symbol, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          initial={{
            x: 100 + (i * 150), // Deterministic positioning
            y: 850,
            rotate: 0,
          }}
          animate={{
            y: -50,
            rotate: 360,
            x: 50 + (i * 120), // Slight horizontal drift
          }}
          transition={{
            duration: 15 + (i % 3) * 5, // Varied but deterministic duration
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  )
}

/* ---------- component ---------- */
export default function Home() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const goToChat = (query: string) => router.push(`/chat?query=${encodeURIComponent(query)}`)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setTimeout(() => setShowContent(true), 100)
  }

  /* hero animations */
  const topElementVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "tween" as const, duration: 0.8 },
    },
  }

  const bottomElementVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "tween" as const, duration: 0.8, delay: 0.2 },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20 bg-gradient-to-br from-gray-50 via-white to-blue-50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Neural Network Background */}
      <NeuralNetwork />

      {/* Floating Tech Particles */}
      <FloatingTechParticles />

      {/* Enhanced Animated Blue Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.15)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.12)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0.03)" />
            </linearGradient>
            <linearGradient id="wave3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 197, 253, 0.18)" />
              <stop offset="100%" stopColor="rgba(147, 197, 253, 0.06)" />
            </linearGradient>
          </defs>

          {/* Interactive Wave 1 */}
          <motion.path
            fill="url(#wave1)"
            d="M0,400 C300,300 600,500 1200,400 L1200,800 L0,800 Z"
            animate={{
              d: [
                "M0,400 C300,300 600,500 1200,400 L1200,800 L0,800 Z",
                "M0,450 C300,350 600,550 1200,450 L1200,800 L0,800 Z",
                "M0,400 C300,300 600,500 1200,400 L1200,800 L0,800 Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.path
            fill="url(#wave2)"
            d="M0,500 C400,400 800,600 1200,500 L1200,800 L0,800 Z"
            animate={{
              d: [
                "M0,500 C400,400 800,600 1200,500 L1200,800 L0,800 Z",
                "M0,520 C400,420 800,620 1200,520 L1200,800 L0,800 Z",
                "M0,500 C400,400 800,600 1200,500 L1200,800 L0,800 Z",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.path
            fill="url(#wave3)"
            d="M0,600 C200,550 400,650 600,600 C800,550 1000,650 1200,600 L1200,800 L0,800 Z"
            animate={{
              d: [
                "M0,600 C200,550 400,650 600,600 C800,550 1000,650 1200,600 L1200,800 L0,800 Z",
                "M0,580 C200,530 400,630 600,580 C800,530 1000,630 1200,580 L1200,800 L0,800 Z",
                "M0,600 C200,550 400,650 600,600 C800,550 1000,650 1200,600 L1200,800 L0,800 Z",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* big blurred footer word - Made darker */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden bg-gradient-to-b from-white/30 to-white/10 bg-clip-text text-[10rem] leading-none font-black text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: "-2.5rem" }}
        >
          Ansh
        </div>
      </div>

      {/* Looking for talent button with reduced shadow opacity */}
      <motion.div className="absolute top-6 left-6 z-20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button
          onClick={() => goToChat("Are you looking for an internship?")}
          className="relative flex cursor-pointer items-center gap-2 rounded-full border bg-white/30 px-4 py-1.5 text-sm font-medium text-black shadow-sm backdrop-blur-lg transition-all duration-300 hover:bg-white/60 hover:shadow-md"
        >
          {/* Enhanced pulse dot */}
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-green-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          Looking for a talent?
        </button>
      </motion.div>

      {/* Enhanced header */}
      <motion.div
        className="z-10 mt-24 mb-8 flex flex-col items-center text-center md:mt-4 md:mb-12"
        variants={topElementVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar - Solid color */}
        <motion.div
          className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-indigo-200"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 10px 25px -5px rgba(99, 102, 241, 0.2)",
              "0 15px 35px -5px rgba(99, 102, 241, 0.4)",
              "0 10px 25px -5px rgba(99, 102, 241, 0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="text-white text-3xl font-bold"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            A
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-secondary-foreground mt-1 text-xl font-semibold md:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Hey, I'm Ansh 👋
        </motion.h2>

        {/* Original AI Portfolio animation */}
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">AI Portfolio</h1>
      </motion.div>

      {/* Enhanced input + quick buttons */}
      <motion.div
        variants={bottomElementVariants}
        initial="hidden"
        animate="visible"
        className="z-10 mt-8 flex w-full flex-col items-center justify-center md:px-0"
      >
        {/* Enhanced form - Brighter background and gray border */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (input.trim()) goToChat(input.trim())
          }}
          className="relative w-full max-w-2xl mb-8"
        >
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything"
              className="w-full px-8 py-5 text-lg bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full focus:outline-none focus:bg-white focus:ring-0 transition-all duration-300 pr-20 text-gray-700 placeholder-gray-500"
              whileFocus={{
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                backgroundColor: "rgba(255, 255, 255, 1)",
              }}
            />
            <motion.button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </form>

        {/* Enhanced quick-question grid with 3D effects */}
        <motion.div
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {questionConfig.map(({ key, color, icon: Icon }, index) => (
            <motion.button
              key={key}
              onClick={() => goToChat(questions[key])}
              className="flex flex-col items-center gap-2 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:border-indigo-200 hover:bg-white hover:shadow-lg transition-all duration-300 group"
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <motion.div
                className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="w-full h-full" style={{ color }} />
              </motion.div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {key}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}