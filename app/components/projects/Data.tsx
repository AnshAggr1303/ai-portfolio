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
    title: "ReconAI",
    description:
      "An AI-powered payment reconciliation engine built for the Razorpay Buildathon. A 5-stage pipeline matches orders against bank settlements — deterministic rules first (fee deductions, rounding, missing IDs), LLM fallback only for ambiguous cases — reaching 100% precision and recall against hidden ground truth. Redesigned as a crash-safe, two-pass batch pipeline with database-level claim locking after diagnosing a race condition causing duplicate settlement claims.",
    techStack: ["Python", "FastAPI", "LangGraph", "PostgreSQL", "Supabase", "Next.js", "TypeScript"],
    date: "2026",
    links: [
      {
        name: "GitHub",
        url: "https://github.com/AnshAggr1303/finance-controller",
      },
    ],
    images: [
      { src: "/reconai-1.png", alt: "ReconAI Screenshot 1" },
      { src: "/reconai-2.png", alt: "ReconAI Screenshot 2" },
      { src: "/reconai-3.png", alt: "ReconAI Screenshot 3" },
    ],
  },
  {
    title: "FloatChat",
    description:
      "A natural-language analytics tool over ARGO oceanographic float data, built for Smart India Hackathon (cleared the internal round). A router sends simple questions to text-to-SQL generation and complex spatial queries to tool orchestration, reaching 95% query success. Geospatial data is stored in PostgreSQL/PostGIS with interactive Plotly/Streamlit dashboards for exploring results.",
    techStack: ["Python", "FastAPI", "PostgreSQL", "PostGIS", "LangChain", "ChromaDB", "Groq", "Streamlit", "Plotly"],
    date: "2026",
    links: [
      {
        name: "GitHub",
        url: "https://github.com/AnshAggr1303/FloatChat",
      },
    ],
    images: [
      { src: "/floatchat-1.png", alt: "FloatChat Screenshot 1" },
      { src: "/floatchat-2.png", alt: "FloatChat Screenshot 2" },
      { src: "/floatchat-3.png", alt: "FloatChat Screenshot 3" },
    ],
  },
  {
    title: "Smart Inventory",
    description:
      "An AI-powered inventory management platform for SMBs with a ledger-based stock model enforced by PostgreSQL triggers and atomic transactions. Automates stock entry via OCR bill scanning (Tesseract.js + Gemini Vision) and runs three background agents — reorder, shrinkage, demand forecasting — via Vercel Cron with human approval. User API keys are secured with AES-256-GCM encryption (BYOK).",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Tesseract.js", "Gemini Vision", "Vercel Cron"],
    date: "2026",
    links: [
      {
        name: "GitHub",
        url: "https://github.com/AnshAggr1303/smart-inventory",
      },
    ],
    images: [
      { src: "/smart-inventory-1.png", alt: "Smart Inventory Screenshot 1" },
      { src: "/smart-inventory-2.png", alt: "Smart Inventory Screenshot 2" },
      { src: "/smart-inventory-3.png", alt: "Smart Inventory Screenshot 3" },
    ],
  },
]

interface ProjectProps {
  title: string
  description?: string
  techStack?: string[]
  date?: string
  links?: { name: string; url: string }[]
  images?: { src: string; alt: string; aspectRatio?: "video" | "square" | "portrait" | "auto" | "wide" }[]
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
                if (image.aspectRatio === "wide") return "aspect-[21/9]"
                if (image.aspectRatio === "auto") return "h-auto"
                return "aspect-video" // default landscape
              }

              const getObjectFit = () => {
                if (image.aspectRatio === "auto") return "object-contain"
                return "object-cover"
              }

              return (
                <div
                  key={index}
                  className={`relative overflow-hidden ${
                    projectData.isMobile
                      ? "aspect-[9/16] rounded-2xl w-full max-w-sm shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" 
                      : `${getAspectRatio()} rounded-2xl ${image.aspectRatio === "auto" ? "min-h-[400px]" : ""}`
                  }`}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill={image.aspectRatio !== "auto"}
                    width={image.aspectRatio === "auto" ? 800 : undefined}
                    height={image.aspectRatio === "auto" ? 600 : undefined}
                    className={`${getObjectFit()} transition-transform hover:scale-105 ${
                      image.aspectRatio === "auto" ? "w-full h-auto" : ""
                    }`}
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
    category: "FinTech AI",
    title: "ReconAI",
    src: "/reconai-main.png",
    content: <ProjectContent project={{ title: "ReconAI" }} />,
  },
  {
    category: "Data Analytics",
    title: "FloatChat",
    src: "/floatchat-main.png",
    content: <ProjectContent project={{ title: "FloatChat" }} />,
  },
  {
    category: "SaaS",
    title: "Smart Inventory",
    src: "/smart-inventory-main.png",
    content: <ProjectContent project={{ title: "Smart Inventory" }} />,
  },
]