"use client"

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { motion } from "framer-motion"

interface GithubButtonProps {
  animationDuration?: number
  label?: string
  size?: "sm" | "default" | "lg"
  repoUrl: string
}

export function GithubButton({
  animationDuration = 1.5,
  label = "GitHub",
  size = "default",
  repoUrl,
}: GithubButtonProps) {
  const handleClick = () => {
    window.open(repoUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationDuration, ease: "easeOut" }}
    >
      <Button
        onClick={handleClick}
        variant="outline"
        size={size}
        className="flex items-center gap-2 bg-white/30 backdrop-blur-lg border border-gray-200/50 hover:bg-white/60 transition-all duration-300"
      >
        <Github className="w-4 h-4" />
        <span className="font-medium">{label}</span>
      </Button>
    </motion.div>
  )
}
