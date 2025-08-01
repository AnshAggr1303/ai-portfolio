"use client"

import { motion } from "framer-motion"

interface InitialLoadingScreenProps {
  query?: string
}

export default function InitialLoadingScreen({ query }: InitialLoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
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
    </div>
  )
}