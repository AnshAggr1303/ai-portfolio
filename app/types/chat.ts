// types/chat.ts
export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date // Add this line
  type?: "profile" | "projects" | "skills" | "contact" | "resume" | "fun" | "more" | "internship" // Add internship type
}
