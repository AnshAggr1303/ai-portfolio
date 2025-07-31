"use client"

import { motion } from "framer-motion"
import { CalendarDays, Code2, Globe } from "lucide-react"

const InternshipCard = () => {
  const openMail = () => {
    window.open("mailto:anshagrawal148@gmail.com", "_blank")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-accent mx-auto mt-8 w-full max-w-4xl rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="bg-muted h-16 w-16 overflow-hidden rounded-full shadow-md border-2 border-gray-200">
            <div className="h-full w-full bg-black flex items-center justify-center text-white text-xl font-bold">
              AA
            </div>
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-semibold">Ansh Agrawal</h2>
            <p className="text-muted-foreground text-sm">Summer Internship Application – 2026</p>
          </div>
        </div>

        {/* Live badge */}
        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <span className="flex items-center gap-1 rounded-full border border-green-500 px-3 py-0.5 text-sm font-medium text-green-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Available
          </span>
        </div>
      </div>

      {/* Internship Info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Duration</p>
            <p className="text-muted-foreground text-sm">
              Summer 2026 (May–July) <br /> 
              + Part-time/Remote opportunities <br /> 
              + 1 month free (Mid-Dec to Mid-Jan)
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-green-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">
              Remote / Hybrid <br />
              (Gurgaon or Bangalore preferred) 🇮🇳
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex items-start gap-3 sm:col-span-2">
          <Code2 className="mt-1 h-5 w-5 text-purple-500" />
          <div className="w-full">
            <p className="text-foreground text-sm font-medium">Tech Stack</p>
            <div className="text-muted-foreground grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
              <ul className="list-disc pl-4">
                <li>Next.js, TypeScript, Tailwind CSS</li>
                <li>Flutter, Supabase, PostgreSQL</li>
                <li>Gemini, LLaMA, LangChain, Vosk</li>
                <li>FastAPI, Flask, OpenCV, YOLO</li>
              </ul>
              <ul className="list-disc pl-4">
                <li>AI agents, RAG, Multilingual STT</li>
                <li>Vector DBs, prompt engineering</li>
                <li>Hackathons: MUJ, BITS Goa, IIT Kanpur</li>
                <li>
                  <a
                    href="/chat?query=What%20are%20your%20skills%3F%20Give%20me%20a%20list%20of%20your%20soft%20and%20hard%20skills."
                    className="cursor-pointer text-blue-500 underline hover:text-blue-600 transition-colors"
                  >
                    See more
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What I bring */}
      <div className="mt-10">
        <p className="text-foreground mb-2 text-lg font-semibold">What I bring</p>
        <p className="text-foreground text-sm">
          Real-world AI/ML experience building multilingual, voice-enabled systems, agentic chatbots, and smart
          surveillance tools. <br /> 
          2x Hackathon Winner with proven track record in fast prototyping. <br />
          Passionate about solving real problems with AI and shipping products that actually work.
        </p>
      </div>

      {/* Goal */}
      <div className="mt-8">
        <p className="text-foreground mb-2 text-lg font-semibold">Goal</p>
        <p className="text-foreground text-sm">
          Join an innovative team building cutting-edge AI tools that matter. I want to contribute hard, learn fast, 
          and make a real impact. <br />
          I'm fast, driven, and ready to dive deep into challenging problems. Let's build something impactful together! 🔥
        </p>
      </div>

      {/* Contact button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={openMail}
          className="cursor-pointer rounded-full bg-black px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-800 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Contact me
        </button>
      </div>
    </motion.div>
  )
}

export default InternshipCard