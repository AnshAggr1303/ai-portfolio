/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Image from "next/image"
import { ChevronRight, Link } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const PROJECT_CONTENT: ProjectProps[] = [
  {
    title: "Study Buddy",
    description:
      "A real-time voice assistant for academic support with contextual memory, agentic behavior, and web search. Built using Gemini 2.0/2.5, Supabase, and LangGraph.",
    techStack: [
      "Next.js",
      "Gemini 2.0/2.5",
      "Supabase",
      "VAD",
      "LangGraph",
      "Ngrok",
      "REST APIs",
      "Web Speech API",
    ],
    date: "2025",
    links: [
      {
        name: "GitHub",
        url: "https://github.com/AnshAggr1303/Agentic-Chatbot-System",
      },
    ],
    images: [
      { src: "/study-buddy-1.png", alt: "Study Buddy Welcome Interface" },
      { src: "/study-buddy-2.png", alt: "Study Buddy Voice Features" },
      { src: "/study-buddy-3.png", alt: "Study Buddy Dashboard" },
      { src: "/study-buddy-4.png", alt: "Study Buddy Advanced Features" },
      { src: "/study-buddy-5.png", alt: "Study Buddy Backpropagation Explanation", aspectRatio: "square" },
    ],
  },
  {
    title: "DATAI",
    description:
      "A modern, AI-powered interface that allows users to query their database using natural language. Built with Next.js, TypeScript, Supabase, and Gemini AI for real-time data visualization.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Google Gemini",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Recharts",
      "Lucide",
    ],
    date: "2025",
    links: [
      {
        name: "GitHub",
        url: "https://github.com/AnshAggr1303/DATAI",
      },
      {
        name: "Live Demo",
        url: "https://dat-ai.netlify.app",
      },
    ],
    images: [
      { src: "/datai-1.png", alt: "DATAI Query Interface" },
      { src: "/datai-2.png", alt: "DATAI Query Processing" },
      { src: "/datai-3.png", alt: "DATAI Data Visualization" },
    ],
  },
  {
    title: "Aarogya AI",
    description:
      "A multilingual, voice-enabled chatbot using LLaMA, FAISS, Vosk, and LangChain. Supports speech/text interaction with contextual vector retrieval.",
    techStack: ["Python", "LLaMA LLM", "FAISS", "Fasttext", "FastAPI", "LangChain", "VOSK", "React", "AWS"],
    date: "2025",
    links: [
      {
        name: "GitHub",
        url: "https://github.com/AnshAggr1303/HackerzStreet-25",
      },
    ],
    images: [
      { src: "/aarogya-ai-1.jpeg", alt: "Aarogya AI Multilingual Chat Interface" },
      { src: "/aarogya-ai-2.png", alt: "Aarogya AI Voice Permission Dialog" },
      { src: "/aarogya-ai-3.png", alt: "Aarogya AI Backend Code Implementation" },
    ],
  },
  {
    title: "Exam Guard",
    description:
      "AI-based cheating detection system for online and offline exams using computer vision and behavior analysis. Integrated with the college website.",
    techStack: [
      "Python",
      "TensorFlow/Keras",
      "OpenCV",
      "YOLO",
      "FastAPI",
      "Flask",
      "DeepSpeech",
      "PostgreSQL",
      "React.js",
    ],
    date: "2025",
    links: [],
    images: [
      { src: "/exam-guard-1.jpeg", alt: "Exam Guard Real-time Detection System" },
      { src: "/exam-guard-2.jpeg", alt: "Exam Guard Upload and Live Alerts Dashboard" },
      { src: "/exam-guard-3.jpeg", alt: "Exam Guard Analytics and Alert Distribution" },
    ],
  },
  {
    title: "MUJeats",
    description:
      "A modern and visually appealing Food Ordering App UI built using Flutter. This project focuses on crafting a seamless and clean user interface for a food delivery application.",
    techStack: ["Flutter", "Dart", "Material Design"],
    date: "2025",
    links: [
      {
        name: "GitHub",
        url: "https://github.com/AnshAggr1303/food-ordering-app-UI",
      },
    ],
    images: [
      { src: "/mujeats-1.jpeg", alt: "MUJeats Home Screen" },
      { src: "/mujeats-2.jpeg", alt: "MUJeats Menu Screen" },
      { src: "/mujeats-3.jpeg", alt: "MUJeats Order Tracking" },
    ],
    isMobile: true,
  },
]

interface ProjectProps {
  title: string
  description?: string
  techStack?: string[]
  date?: string
  links?: { name: string; url: string }[]
  images?: { src: string; alt: string; aspectRatio?: "video" | "square" | "portrait" }[]
  isMobile?: boolean
}

const ProjectContent = ({ project }: { project: ProjectProps }) => {
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title)

  if (!projectData) return <div>Project details not available</div>

  return (
    <div className="space-y-10">
      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-black dark:text-white">
            <span>{projectData.date}</span>
          </div>

          <p className="text-neutral-800 dark:text-white font-sans text-base leading-relaxed md:text-lg">
            {projectData.description}
          </p>

          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-black uppercase dark:text-white font-semibold">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack?.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-black uppercase dark:text-white font-semibold">Links</h3>
            <Link className="text-muted-foreground w-4" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                <span className="font-light capitalize text-neutral-800 dark:text-white">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      )}

      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div
            className={`grid gap-8 ${
              projectData.isMobile 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-7xl mx-auto" 
                : "grid-cols-1"
            }`}
          >
            {projectData.images.map((image, index) => {
              // Determine aspect ratio for each image
              const getAspectRatio = () => {
                if (projectData.isMobile) return "aspect-[9/16]"
                if (image.aspectRatio === "square") return "aspect-square"
                if (image.aspectRatio === "portrait") return "aspect-[3/4]"
                return "aspect-video" // default landscape
              }

              return (
                <div
                  key={index}
                  className={`relative overflow-hidden ${
                    projectData.isMobile
                      ? "aspect-[9/16] rounded-2xl w-full max-w-sm shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" 
                      : `${getAspectRatio()} rounded-2xl`
                  }`}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes={projectData.isMobile ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" : "100vw"}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export const data = [
  {
    category: "AI Assistant",
    title: "Study Buddy",
    src: "/study-buddy-main.png",
    content: <ProjectContent project={{ title: "Study Buddy" }} />,
  },
  {
    category: "SaaS",
    title: "DATAI",
    src: "/datai-main.png",
    content: <ProjectContent project={{ title: "DATAI" }} />,
  },
  {
    category: "Health AI",
    title: "Aarogya AI",
    src: "/aarogya-ai-main.png",
    content: <ProjectContent project={{ title: "Aarogya AI" }} />,
  },
  {
    category: "Proctoring",
    title: "Exam Guard",
    src: "/exam-guard-main.jpeg",
    content: <ProjectContent project={{ title: "Exam Guard" }} />,
  },
  {
    category: "UI/UX",
    title: "MUJeats",
    src: "/mujeats-main.jpeg",
    content: <ProjectContent project={{ title: "MUJeats" }} />,
  },
]