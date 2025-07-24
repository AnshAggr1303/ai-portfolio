"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingScreenProps {
  onComplete: () => void
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [loadingStage, setLoadingStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stages = [
      { delay: 500, stage: 1, progress: 25 },
      { delay: 800, stage: 2, progress: 50 },
      { delay: 1200, stage: 3, progress: 75 },
      { delay: 1500, stage: 4, progress: 100 },
    ]

    stages.forEach(({ delay, stage, progress: stageProgress }) => {
      setTimeout(() => {
        setLoadingStage(stage)
        setProgress(stageProgress)
      }, delay)
    })

    // Complete loading after all stages
    setTimeout(() => {
      onComplete()
    }, 2000)
  }, [onComplete])

  const loadingTexts = [
    "Initializing AI Portfolio...",
    "Loading Neural Networks...",
    "Connecting Data Streams...",
    "Optimizing Experience...",
    "Ready to Explore!",
  ]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="loading-screen"
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              initial={{
                x: (i * 137) % 1200,
                y: (i * 97) % 800,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Main Loading Container */}
        <div className="relative flex flex-col items-center justify-center space-y-8">
          {/* Animated Logo/Avatar */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Outer Ring */}
            <motion.div
              className="w-24 h-24 border-4 border-blue-200 rounded-full absolute"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Middle Ring */}
            <motion.div
              className="w-20 h-20 border-3 border-indigo-300 rounded-full absolute top-2 left-2"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* Avatar - Solid color */}
            <motion.div
              className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 relative top-4 left-4"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 10px 25px -5px rgba(99, 102, 241, 0.3)",
                  "0 20px 40px -5px rgba(99, 102, 241, 0.5)",
                  "0 10px 25px -5px rgba(99, 102, 241, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="text-white text-2xl font-bold flex items-center justify-center w-full h-full"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ lineHeight: 1 }}
              >
                A
              </motion.span>
            </motion.div>

            {/* Orbiting Dots */}
            {Array.from({ length: 3 }, (_, i) => {
              // Pre-calculated positions to avoid hydration issues
              const positions = [
                { x: 40, y: 0 },     // 0 degrees
                { x: -20, y: -34.64 }, // 120 degrees
                { x: -20, y: 34.64 }   // 240 degrees
              ]
              
              return (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute w-2 h-2 bg-blue-500 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: "0 0",
                  }}
                  animate={{
                    rotate: 360,
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                  }}
                  initial={{
                    x: positions[i].x,
                    y: positions[i].y,
                  }}
                />
              )
            })}
          </motion.div>

          {/* Loading Text with Typewriter Effect */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl font-bold text-gray-800"
              key={`text-${loadingStage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {loadingTexts[loadingStage]}
            </motion.h2>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>

            {/* Progress Percentage */}
            <motion.p
              className="text-sm text-gray-600 font-medium"
              key={`progress-${progress}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {progress}%
            </motion.p>
          </motion.div>

          {/* Neural Network Loading Animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <defs>
                <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Animated Connections */}
              {Array.from({ length: 8 }, (_, i) => {
                // Pre-calculated positions to avoid hydration issues
                const positions = [
                  { x1: 280, y1: 200, x2: 200, y2: 200 }, // 0°
                  { x1: 256.57, y1: 143.43, x2: 200, y2: 200 }, // 45°
                  { x1: 200, y1: 120, x2: 200, y2: 200 }, // 90°
                  { x1: 143.43, y1: 143.43, x2: 200, y2: 200 }, // 135°
                  { x1: 120, y1: 200, x2: 200, y2: 200 }, // 180°
                  { x1: 143.43, y1: 256.57, x2: 200, y2: 200 }, // 225°
                  { x1: 200, y1: 280, x2: 200, y2: 200 }, // 270°
                  { x1: 256.57, y1: 256.57, x2: 200, y2: 200 } // 315°
                ]
                
                return (
                  <motion.line
                    key={`connection-${i}`}
                    x1={positions[i].x1}
                    y1={positions[i].y1}
                    x2={positions[i].x2}
                    y2={positions[i].y2}
                    stroke="url(#loadingGradient)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  />
                )
              })}

              {/* Center Node */}
              <motion.circle
                cx="200"
                cy="200"
                r="4"
                fill="#3b82f6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              />

              {/* Outer Nodes */}
              {Array.from({ length: 8 }, (_, i) => {
                // Pre-calculated positions to avoid hydration issues
                const positions = [
                  { cx: 280, cy: 200 }, // 0°
                  { cx: 256.57, cy: 143.43 }, // 45°
                  { cx: 200, cy: 120 }, // 90°
                  { cx: 143.43, cy: 143.43 }, // 135°
                  { cx: 120, cy: 200 }, // 180°
                  { cx: 143.43, cy: 256.57 }, // 225°
                  { cx: 200, cy: 280 }, // 270°
                  { cx: 256.57, cy: 256.57 } // 315°
                ]
                
                return (
                  <motion.circle
                    key={`node-${i}`}
                    cx={positions[i].cx}
                    cy={positions[i].cy}
                    r="3"
                    fill="#6366f1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                  />
                )
              })}
            </svg>
          </motion.div>

          {/* Floating Code Snippets */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {["AI", "ML", "React", "Next.js", "TypeScript"].map((tech, i) => (
              <motion.div
                key={`tech-${tech}`}
                className="absolute text-xs font-mono text-blue-400/40 font-semibold"
                initial={{
                  x: 50 + (i * 80),
                  y: 400,
                  opacity: 0,
                }}
                animate={{
                  y: -50,
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Pulse Indicator */}
        <motion.div
          className="absolute bottom-12 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={`pulse-${i}`}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LoadingScreen