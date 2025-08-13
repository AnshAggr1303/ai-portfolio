import { Briefcase, Laugh, Layers, PartyPopper, User2, MoreHorizontal } from "lucide-react"

/* ---------- Updated quick-question data with more specific prompts ---------- */
export const questions = {
  Me: "Show me your profile",
  Projects: "Show me your projects", 
  Skills: "Show me your skills",
  Fun: "Show me your adventure photos",
  Contact: "Show me your contact details",
  More: "Show me more options",
} as const

/* ---------- Comprehensive More section with new categories ---------- */
export const moreQuestions = [
  {
    category: "Professional",
    questions: [
      { id: "resume", question: "Can I see your resume?", label: "View Resume" },
      { id: "availability", question: "Are you available for internships?", label: "Availability Status" },
      { id: "work-philosophy", question: "What is your work philosophy and approach?", label: "Work Philosophy" },
      { id: "team-value", question: "What makes you a valuable team member?", label: "Team Collaboration" },
    ],
  },

  {
    category: "Achievements & Recognition",
    questions: [
      { id: "hackathon-wins", question: "how many hackathon have you won?", label: "Hackathon Wins" },
      { id: "achievements", question: "What are your key achievements and awards?", label: "Awards & Recognition" },
      { id: "certifications", question: "What certifications do you have?", label: "Certifications" },
      { id: "competition-stats", question: "Show me your competition statistics", label: "Competition Stats" },
    ],
  },
  
  {
    category: "Tech & Code",
    questions: [
      { id: "favorite-code", question: "Show me a cool C code snippet of Fibonacci Sequence", label: "Cool Code Snippet" },
      { id: "tech-stack", question: "What's your complete tech stack?", label: "Tech Stack Deep Dive" },
      { id: "learning", question: "What are you currently learning?", label: "Current Learning" },
      { id: "favorite-tools", question: "What are your favorite development tools?", label: "Favorite Tools" },
      { id: "coding-journey", question: "How did you get started in programming?", label: "Coding Journey" },
    ],
  },
  {
    category: "Journey & Timeline",
    questions: [
      
      { id: "milestones", question: "What are your key career milestones?", label: "Key Milestones" },
      { id: "5-years", question: "Where do you see yourself in 5 years?", label: "Future Goals" },
      { id: "biggest-challenge", question: "What was your biggest professional challenge?", label: "Biggest Challenge" },
    ],
  },
  {
    category: "Hobbies & Interests",
    questions: [
      { id: "sports", question: "What sports and gaming activities do you enjoy?", label: "Sports & Gaming" },
      { id: "adventures", question: "Share some of your adventure stories and travels", label: "Adventures & Travel" },
      { id: "cars-passion", question: "Describe your passion for cars", label: "Cars & Automotive" },
      { id: "hobbies", question: "List your other hobbies and interests", label: "Other Hobbies" },
    ],
},

  {
    category: "Quick Facts",
    questions: [
      { id: "quick-stats", question: "Show me your quick professional stats", label: "Professional Stats" },
      { id: "fun-facts", question: "Tell me some fun facts about yourself", label: "Fun Facts" },
      { id: "favorites", question: "What are your favorite frameworks and tools?", label: "Tech Favorites" },
      { id: "personality", question: "Describe your personality ", label: "Personality & Style" },
    ],
  },
]

/* ---------- Apple-inspired color palette and refined category buttons ---------- */
export const categoryButtons = [
  {
    key: "Me",
    color: "#007AFF", // Apple Blue
    icon: User2,
    label: "About Me",
    prompt: questions.Me,
  },
  {
    key: "Projects",
    color: "#34C759", // Apple Green
    icon: Briefcase,
    label: "Projects",
    prompt: questions.Projects,
  },
  {
    key: "Skills",
    color: "#5856D6", // Apple Purple
    icon: Layers,
    label: "Skills",
    prompt: questions.Skills,
  },
  {
    key: "Fun",
    color: "#FF2D92", // Apple Pink
    icon: PartyPopper,
    label: "Fun Facts",
    prompt: questions.Fun,
  },
  {
    key: "Contact",
    color: "#FF9500", // Apple Orange
    icon: Laugh,
    label: "Contact",
    prompt: questions.Contact,
  },
  {
    key: "More",
    color: "#8E8E93", // Apple Gray
    icon: MoreHorizontal,
    label: "More",
    prompt: questions.More,
  },
] as const