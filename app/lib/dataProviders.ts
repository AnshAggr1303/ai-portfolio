// app/lib/dataProviders.ts

import { ProjectData, SkillCategory, Achievement } from "./types"

export class DataProviders {
  // Utility method to get component-specific project data
  static getProjectData(): ProjectData[] {
  return [
    {
      name: "Study Buddy",
      description: "Voice-based agentic learning assistant",
      tech: ["Next.js", "Gemini AI", "Supabase", "Speech Recognition"],
      impact: "This project can be used by companies who are making their own SLM for edtech.",
      status: "Deployed",
      category: "AI/Education",
    },
    {
      name: "Aarogya AI",
      description: "Multilingual RAG health chatbot",
      tech: ["LLaMA", "FAISS", "FastAPI", "VOSK", "Python"],
      impact: "Prototype stage; potential for NGO healthcare use.",
      status: "Not deployed",
      category: "AI/NLP",
    },
    {
      name: "Exam Guard",
      description: "Real-time AI cheat detection system",
      tech: ["YOLOv5", "OpenCV", "MediaPipe", "Flask", "TensorFlow"],
      impact: "Built for university-level AI proctoring.",
      status: "Not deployed",
      category: "AI/Computer Vision",
    },
    {
      name: "MUJeats",
      description: "Zomato-style food ordering app UI",
      tech: ["Flutter", "Supabase", "Firebase", "Dart"],
      impact: "UI-ready for backend integration.",
      status: "Not deployed",
      category: "Mobile/UX",
    },
    {
      name: "DATAI",
      description: "Natural language interface for database querying",
      tech: ["Next.js", "Supabase", "LangGraph", "Gemini API"],
      impact: "Deployed demo for SQL querying and visualization.",
      status: "Deployed",
      category: "AI/Tools",
    },
  ]
}


  // Utility method to get skills data
  static getSkillsData(): Record<string, SkillCategory> {
    return {
      frontend: {
        name: "Frontend Development",
        skills: [
          { name: "React", level: 90, experience: "3+ years" },
          { name: "TypeScript", level: 85, experience: "2+ years" },
          { name: "Tailwind CSS", level: 88, experience: "2+ years" },
          { name: "Flutter", level: 75, experience: "1+ year" },
          { name: "Next.js", level: 85, experience: "2+ years" },
        ],
      },
      backend: {
        name: "Backend Development",
        skills: [
          { name: "Node.js", level: 87, experience: "2+ years" },
          { name: "Python", level: 92, experience: "3+ years" },
          { name: "FastAPI", level: 80, experience: "1+ year" },
          { name: "Supabase", level: 85, experience: "1+ year" },
          { name: "PostgreSQL", level: 75, experience: "2+ years" },
          { name: "MySQL", level: 70, experience: "1+ year" },
        ],
      },
      aiml: {
        name: "AI/ML",
        skills: [
          { name: "TensorFlow", level: 78, experience: "1+ year" },
          { name: "OpenCV", level: 85, experience: "1+ year" },
          { name: "YOLOv5", level: 80, experience: "1+ year" },
          { name: "LangGraph", level: 75, experience: "8+ months" },
          { name: "FAISS", level: 70, experience: "6+ months" },
          { name: "Gemini", level: 85, experience: "8+ months" },
          { name: "Vosk", level: 75, experience: "6+ months" },
        ],
      },
      tools: {
        name: "Tools & DevOps",
        skills: [
          { name: "Git/GitHub", level: 90, experience: "3+ years" },
          { name: "Docker", level: 65, experience: "6+ months" },
          { name: "GCP", level: 70, experience: "8+ months" },
          { name: "Firebase", level: 80, experience: "2+ years" },
          { name: "Vercel", level: 85, experience: "2+ years" },
        ],
      },
    }
  }

  // Utility method to get achievements data
  static getAchievementsData(): Achievement[] {
    return [
      {
        title: "1st Place - The Hackathon (MUJ)",
        date: "2025",
        description: "Built AI-based cheating detection system (Exam Guard)",
        category: "Competition",
        impact: "Led a 4-member team, won top prize",
      },
      {
        title: "3rd Place - Assesli Hackathon",
        date: "2025",
        description: "Built real-time agentic chatbot system with voice pipeline",
        category: "Competition",
        impact: "Received interview offer from organizers",
      },
      {
        title: "4th Place - BITS Goa CODESTORM",
        date: "2025",
        description: "Created full-stack AI financial tool",
        category: "Competition",
        impact: "Presented to industry judges, top tech stack use",
      },
      {
        title: "Top 5 - IIT Kanpur TechKriti (ML Hackathon)",
        date: "2025",
        description: "Built ML model for stock trend forecasting",
        category: "Competition",
        impact: "Recognized among best AI teams nationwide",
      },
      {
        title: "Top 5 - IIT Kanpur TechKriti (Product Challenge)",
        date: "2025",
        description: "Designed AI-powered stock simulator and analytics platform",
        category: "Competition",
        impact: "Commended for product UX + ML pipeline",
      },
    ]
  }
}
