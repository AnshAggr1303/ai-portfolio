"use client"

import FluidCursor from "./components/FluidCursor"
import { Button } from "@/components/ui/button"
import { GithubButton } from "@/components/ui/github-button"
import { motion } from "framer-motion"
import { ArrowRight, BriefcaseBusiness, Laugh, Layers, PartyPopper, UserRoundSearch, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

/* ---------- quick-question data ---------- */
const questions = {
  Me: "Who are you?",
  Projects: "What are your projects? ",
  Skills: "What are your skills? ",
  Fun: "What's the craziest thing you've ever done?",
  Contact: "How can I contact you?",
} as const

const questionConfig = [
  { key: "Me", color: "#329696", icon: Laugh },
  { key: "Projects", color: "#3E9858", icon: BriefcaseBusiness },
  { key: "Skills", color: "#856ED9", icon: Layers },
  { key: "Fun", color: "#B95F9D", icon: PartyPopper },
  { key: "Contact", color: "#C19433", icon: UserRoundSearch },
] as const

/* ---------- component ---------- */
export default function Home() {
  const [input, setInput] = useState("")
  const [isNavigating, setIsNavigating] = useState(false)
  const [loadingQuery, setLoadingQuery] = useState<string | null>(null)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const goToChat = async (query: string) => {
    setIsNavigating(true)
    setLoadingQuery(query)
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300))
    
    router.push(`/chat?query=${encodeURIComponent(query)}`)
  }

  /* hero animations */
  const topElementVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeOut", duration: 0.8 },
    },
  }
  const bottomElementVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeOut", duration: 0.8, delay: 0.2 },
    },
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20">
      {/* Loading Overlay */}
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {/* Simple Professional Loader */}
            <div className="relative">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-slate-100/30 border-t-blue-300/80 rounded-full"
              />
              
              {/* Inner ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 w-14 h-14 border-3 border-slate-50/20 border-t-blue-200/60 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* big blurred footer word */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden bg-gradient-to-b from-neutral-500/10 to-neutral-500/0 bg-clip-text text-[10rem] leading-none font-black text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: "-2.5rem" }}
        >
          Ansh
        </div>
      </div>

      {/* GitHub button */}
      <div className="absolute top-6 right-8 z-20">
        <GithubButton
          animationDuration={1.5}
          label="GitHub Repo"
          size={"sm"}
          repoUrl="https://github.com/AnshAggr1303/ai-portfolio"
        />
      </div>

      <div className="absolute top-6 left-6 z-20">
        <motion.button
          onClick={() => goToChat("Are you looking for an internship?")}
          disabled={isNavigating}
          className="relative flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-black shadow-md transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isNavigating ? { scale: 1.05 } : {}}
          whileTap={!isNavigating ? { scale: 0.95 } : {}}
        >
          {/* Green pulse dot */}
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-green-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          Looking for a talent?
        </motion.button>
      </div>

      {/* header */}
      <motion.div
        className="z-1 mt-24 mb-8 flex flex-col items-center text-center md:mt-4 md:mb-12"
        variants={topElementVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo - Keep original */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vecteezy_avengers-logo-vector-avengers-icon-free-vector_19136349.jpg-jQ2Z7mP0WosUinWFiVSbqQ00PCOhHH.jpeg"
              alt="Ansh Logo"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </motion.div>

        <h2 className="text-secondary-foreground mt-1 text-xl font-semibold md:text-2xl">Hey, I&apos;m Ansh 👋</h2>
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">AI Portfolio</h1>
      </motion.div>

      {/* input + quick buttons */}
      <motion.div
        variants={bottomElementVariants}
        initial="hidden"
        animate="visible"
        className="z-10 mt-4 flex w-full flex-col items-center justify-center md:px-0"
      >
        {/* free-form question */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (input.trim() && !isNavigating) goToChat(input.trim())
          }}
          className="relative w-full max-w-lg"
        >
          <div className="mx-auto flex items-center rounded-full border border-neutral-200 bg-white py-2.5 pr-2 pl-6 shadow-sm transition-all hover:border-neutral-300">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              disabled={isNavigating}
              className="w-full border-none bg-transparent text-base text-black placeholder:text-gray-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isNavigating}
              aria-label="Submit question"
              className="flex items-center justify-center rounded-full bg-[#0171E3] p-2.5 text-white transition-colors hover:bg-blue-600 disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isNavigating && loadingQuery === input.trim() ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {/* quick-question grid */}
        <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {questionConfig.map(({ key, color, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => goToChat(questions[key])}
              disabled={isNavigating}
              variant="outline"
              className="border-border hover:bg-border/30 aspect-square w-full cursor-pointer rounded-2xl border bg-white/30 py-8 shadow-none backdrop-blur-lg active:scale-95 md:p-10 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-700">
                {isNavigating && loadingQuery === questions[key] ? (
                  <>
                    <Loader2 size={22} className="animate-spin" color={color} />
                    <span className="text-xs font-medium sm:text-sm">Loading...</span>
                  </>
                ) : (
                  <>
                    <Icon size={22} strokeWidth={2} color={color} />
                    <span className="text-xs font-medium sm:text-sm">{key}</span>
                  </>
                )}
              </div>
            </Button>
          ))}
        </div>
      </motion.div>
      <FluidCursor />
    </div>
  )
}