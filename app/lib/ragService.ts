/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/ragService.ts
import { GoogleGenerativeAI } from "@google/generative-ai"
import { v4 as uuidv4 } from "uuid"

// Import all the separated modules
import { 
  Document, 
  ChatMessage, 
  ComponentContext, 
  ProjectData, 
  SkillCategory, 
  Achievement 
} from "./types"
import { APIKeyManager } from "./apiKeyManager"
import { DataProviders } from "./dataProviders"
import { ComponentContextManager } from "./componentContextManager"
import { 
  systemPrompt, 
  philosophyContent, 
  educationContent, 
  goalsContent, 
  experienceContent, 
  availabilityContent, 
  projectDetails 
} from "./knowledgeBase"

export class RAGService {
  private documents: Document[] = []
  private embeddingModel: any
  private generativeModel: any
  private apiKeyManager: APIKeyManager

  constructor() {
    this.apiKeyManager = new APIKeyManager()
    this.initializeModels()
    this.initializeWithSystemPrompt()
  }

  private initializeModels() {
    // Start with first available key
    const firstKey = this.apiKeyManager.getHealthyKey()
    if (!firstKey) {
      throw new Error('No healthy API keys available')
    }

    const genAI = new GoogleGenerativeAI(firstKey.key)
    this.embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" })
    this.generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
  }

  private async initializeWithSystemPrompt() {
    await this.addDocument({
      content: systemPrompt,
      title: "System Prompt - Ansh's Personality",
      type: "system",
    })

    // Add comprehensive knowledge base
    await this.initializeKnowledgeBase()
  }

  private async initializeKnowledgeBase() {
    // Add all knowledge base documents
    await this.addDocument({
      content: philosophyContent,
      title: "Work Philosophy & Approach",
      type: "philosophy",
    })

    await this.addDocument({
      content: educationContent,
      title: "Educational Background",
      type: "education",
    })

    await this.addDocument({
      content: goalsContent,
      title: "Career Goals & Aspirations",
      type: "goals",
    })

    await this.addDocument({
      content: experienceContent,
      title: "Professional Experience",
      type: "experience",
    })

    await this.addDocument({
      content: availabilityContent,
      title: "Availability & Opportunities",
      type: "availability",
    })

    await this.addDocument({
      content: projectDetails,
      title: "Detailed Projects & Achievements",
      type: "projects",
    })
  }

  async addDocument(doc: { content: string; title: string; type: string }) {
    try {
      // Generate embedding using multi-key system
      const result = await this.apiKeyManager.executeWithRetry(async (genAI) => {
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" })
        return await embeddingModel.embedContent(doc.content)
      })

      const embedding = result.embedding.values

      const document: Document = {
        id: uuidv4(),
        content: doc.content,
        metadata: {
          title: doc.title,
          type: doc.type,
          timestamp: Date.now(),
        },
        embedding,
      }

      this.documents.push(document)
      return document.id
    } catch (error) {
      console.error("Error adding document:", error)
      throw error
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  private async retrieveRelevantDocuments(query: string, topK = 3): Promise<Document[]> {
    try {
      // Generate query embedding using multi-key system
      const result = await this.apiKeyManager.executeWithRetry(async (genAI) => {
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" })
        return await embeddingModel.embedContent(query)
      })

      const queryEmbedding = result.embedding.values

      // Calculate similarities and get top-k documents
      const similarities = this.documents
        .filter((doc) => doc.embedding)
        .map((doc) => ({
          document: doc,
          similarity: this.cosineSimilarity(queryEmbedding, doc.embedding!),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK)

      return similarities.map((s) => s.document)
    } catch (error) {
      console.error("Error retrieving documents:", error)
      return []
    }
  }

  // Generate component-specific follow-up responses
  async generateComponentFollowUp(componentContext: ComponentContext, chatHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Build component-specific context
      let contextPrompt = ComponentContextManager.buildComponentContext(componentContext)
      
      // Retrieve relevant documents based on component type
      const relevantDocs = await this.retrieveRelevantDocuments(
        `${componentContext.type} ${componentContext.userQuery}`, 
        3
      )

      // Add document context
      const docContext = relevantDocs
        .map((doc) => `[${doc.metadata.title}]: ${doc.content}`)
        .join("\n\n")

      // Prepare chat history
      const historyContext = chatHistory
        .slice(-3)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")

      // Create enhanced prompt for component follow-up
      const prompt = `
${contextPrompt}

Relevant Knowledge Base:
${docContext}

Recent Conversation:
${historyContext}

Instructions:
- You just showed your ${componentContext.type} component to the user
- Generate a personalized, engaging follow-up response as Ansh
- Reference specific items that were shown in the component
- Add personal commentary, stories, or fun facts about the displayed content
- Keep it casual, friendly, and conversational
- Always end with an engaging question to continue the conversation
- Use **bold text** for emphasis
- Keep response to 2-3 sentences max
- Show genuine enthusiasm about your work
      `

      // Generate response using multi-key system
      const result = await this.apiKeyManager.executeWithRetry(async (genAI) => {
        const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
        return await generativeModel.generateContent(prompt)
      })

      return result.response.text()
    } catch (error) {
      console.error("Error generating component follow-up:", error)
      return ComponentContextManager.getComponentFallbackResponse(componentContext)
    }
  }

  // ENHANCED: Generate response with full context support
  async generateResponse(
    query: string, 
    chatHistory: ChatMessage[] = [], 
    componentContext?: ComponentContext,
    enhancedContext?: string
  ): Promise<string> {
    try {
      // If component context is provided, use component-specific response
      if (componentContext) {
        return await this.generateComponentFollowUp(componentContext, chatHistory)
      }

      // Regular RAG response for general queries with enhanced context
      return await this.generateRegularResponse(query, chatHistory, enhancedContext)
    } catch (error) {
      console.error("Error generating response:", error)
      return "Yo! Something went wrong on my end. Mind trying again? 🤖"
    }
  }

  // Enhanced regular RAG response method with context support
  private async generateRegularResponse(
    query: string, 
    chatHistory: ChatMessage[] = [], 
    enhancedContext?: string
  ): Promise<string> {
    try {
      // Retrieve relevant context
      const relevantDocs = await this.retrieveRelevantDocuments(query, 4)

      // Prepare context from retrieved documents
      const context = relevantDocs.map((doc) => `[${doc.metadata.title}]: ${doc.content}`).join("\n\n")

      // Prepare chat history for context
      const historyContext = chatHistory
        .slice(-4) // Keep last 4 messages for context
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")

      // Create enhanced prompt with all available context
      let prompt = `
Context from knowledge base:
${context}

Recent conversation:
${historyContext}
`

      // Add enhanced context if available
      if (enhancedContext) {
        prompt += `\nAdditional Context:\n${enhancedContext}\n`
      }

      prompt += `
Current question: ${query}

Instructions:
- Respond as Ansh Agrawal based on the context above
- Keep it casual, fun, and personal
- If the question is about philosophy, approach, goals, experience, or education, use the detailed info from the knowledge base
- If there's enhanced context about recently shown components, reference that information appropriately
- For elaboration requests about components (like "craziest thing" after fun component), provide specific detailed stories
- For philosophical questions (like "work philosophy"), give thoughtful personal responses
- Always end with a follow-up question to keep the conversation going
- Use emojis sparingly but effectively
- Use **bold text** for emphasis instead of *asterisks*
- If you don't know something specific, just say so honestly
- Keep responses conversational and engaging
      `

      // Generate response using multi-key system
      const result = await this.apiKeyManager.executeWithRetry(async (genAI) => {
        const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
        return await generativeModel.generateContent(prompt)
      })

      return result.response.text()
    } catch (error) {
      console.error("Error generating regular response:", error)
      return "Yo! Something went wrong on my end. Mind trying again? 🤖"
    }
  }

  // Utility methods - delegated to DataProviders
  getProjectData(): ProjectData[] {
    return DataProviders.getProjectData()
  }

  getSkillsData(): Record<string, SkillCategory> {
    return DataProviders.getSkillsData()
  }

  getAchievementsData(): Achievement[] {
    return DataProviders.getAchievementsData()
  }

  // Utility methods for monitoring
  getDocumentCount(): number {
    return this.documents.length
  }

  getKeyStats() {
    return this.apiKeyManager.getKeyStats()
  }

  getHealthyKeyCount(): number {
    return this.apiKeyManager.getHealthyKeyCount()
  }
}

// Singleton instance
export const ragService = new RAGService()