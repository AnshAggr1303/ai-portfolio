"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, type Variants } from "framer-motion"
import {
  Code,
  Cpu,
  PenTool,
  Users,
  FileText,
  Database,
  Globe,
  Smartphone,
  Brain,
  Palette,
  Terminal,
  GitBranch,
  Container,
  Eye,
  MessageSquare,
  Camera,
  Video,
  Presentation,
  Zap,
  Cloud,
} from "lucide-react"

const Skills = () => {
  const skillsData = [
    {
      category: "Frontend Development",
      icon: <Code className="h-5 w-5" />,
      skills: [
        { name: "HTML", icon: <FileText className="h-4 w-4" /> },
        { name: "CSS", icon: <Palette className="h-4 w-4" /> },
        { name: "JavaScript/TypeScript", icon: <Terminal className="h-4 w-4" /> },
        { name: "Flutter", icon: <Smartphone className="h-4 w-4" /> },
        { name: "Tailwind CSS", icon: <Palette className="h-4 w-4" /> },
        { name: "Next.js", icon: <Globe className="h-4 w-4" /> },
        { name: "React", icon: <Code className="h-4 w-4" /> },
      ],
    },
    {
      category: "Backend, AI & Systems",
      icon: <Cpu className="h-5 w-5" />,
      skills: [
        { name: "Python", icon: <Terminal className="h-4 w-4" /> },
        { name: "OpenCV", icon: <Eye className="h-4 w-4" /> },
        { name: "YOLOv5", icon: <Eye className="h-4 w-4" /> },
        { name: "Keras", icon: <Brain className="h-4 w-4" /> },
        { name: "MediaPipe", icon: <Camera className="h-4 w-4" /> },
        { name: "LangGraph", icon: <Brain className="h-4 w-4" /> },
        { name: "LLMs (Gemini, GPT-4, Claude)", icon: <MessageSquare className="h-4 w-4" /> },
        { name: "Prompt Engineering", icon: <Brain className="h-4 w-4" /> },
        { name: "RAG (Retrieval-Augmented Generation)", icon: <Brain className="h-4 w-4" /> },
        { name: "Vector DBs (FAISS, ChromaDB)", icon: <Database className="h-4 w-4" /> },
        { name: "Vosk & IndicTrans2", icon: <MessageSquare className="h-4 w-4" /> },
        { name: "Prisma", icon: <Database className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <Database className="h-4 w-4" /> },
        { name: "MySQL", icon: <Database className="h-4 w-4" /> },
        { name: "Git", icon: <GitBranch className="h-4 w-4" /> },
      ],
    },
    {
      category: "Cloud & DevOps",
      icon: <Cloud className="h-5 w-5" />,
      skills: [
        { name: "Firebase", icon: <Database className="h-4 w-4" /> },
        { name: "Supabase", icon: <Database className="h-4 w-4" /> },
        { name: "Vercel", icon: <Globe className="h-4 w-4" /> },
        { name: "Docker", icon: <Container className="h-4 w-4" /> },
      ],
    },
    {
      category: "Design & Tools",
      icon: <PenTool className="h-5 w-5" />,
      skills: [
        { name: "Figma", icon: <Palette className="h-4 w-4" /> },
        { name: "Canva", icon: <Palette className="h-4 w-4" /> },
        { name: "DaVinci Resolve", icon: <Video className="h-4 w-4" /> },
        { name: "Keynote", icon: <Presentation className="h-4 w-4" /> },
      ],
    },
    {
      category: "Soft Skills",
      icon: <Users className="h-5 w-5" />,
      skills: [
        { name: "Communication", icon: <MessageSquare className="h-4 w-4" /> },
        { name: "Problem-Solving", icon: <Brain className="h-4 w-4" /> },
        { name: "Teamwork", icon: <Users className="h-4 w-4" /> },
        { name: "Creativity", icon: <Palette className="h-4 w-4" /> },
        { name: "Focus", icon: <Eye className="h-4 w-4" /> },
        { name: "Adaptability", icon: <Zap className="h-4 w-4" /> },
        { name: "Hackathon Agility", icon: <Zap className="h-4 w-4" /> },
        { name: "Learning Agility", icon: <Brain className="h-4 w-4" /> },
      ],
    },
  ]

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const },
    },
  }

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  }

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] as const }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none px-0 pb-12 shadow-none bg-transparent">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-black px-0 text-4xl font-bold">Skills & Expertise</CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div className="space-y-8 px-0" variants={containerVariants} initial="hidden" animate="visible">
            {skillsData.map((section, index) => (
              <motion.div key={index} className="space-y-3 px-0" variants={itemVariants}>
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-lg font-semibold">{section.category}</h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-gray-800 text-gray-100 border-gray-700 px-3 py-1.5 font-normal flex items-center gap-2"
                      >
                        {skill.icon}
                        {skill.name}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Skills
