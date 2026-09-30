/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/ragService.ts
import { GoogleGenerativeAI } from "@google/generative-ai"
import { v4 as uuidv4 } from "uuid"
import { createHash } from "crypto"

// Import all the separated modules
import {
  Document,
  ChatMessage,
  ComponentContext,
  ProjectData,
  SkillCategory,
  Achievement
} from "./types"
import type { ComponentType } from "./messageProcessor"
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
import precomputedEmbeddings from "./knowledgeBase.embeddings.json"

interface PrecomputedEmbedding {
  title: string
  type: string
  contentHash: string
  embedding: number[]
}

// Must match scripts/precompute-embeddings.ts's hashContent() exactly, or every document
// will look "stale" at startup even when nothing changed.
function hashDocumentContent(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex")
}

export class RAGService {
  private documents: Document[] = []
  private embeddingModel: any
  private generativeModel: any
  private apiKeyManager: APIKeyManager

  // One AI-personalized component follow-up is generated and cached per component TYPE
  // on this RAGService singleton, so it's shared across every visitor hitting this warm
  // server process instead of being regenerated per request. followUpPriming guards
  // against concurrent requests for the same type each kicking off their own Gemini call.
  private followUpCache: Map<ComponentType, string> = new Map()
  private followUpPriming: Set<ComponentType> = new Set()

  constructor() {
    this.apiKeyManager = new APIKeyManager()
    this.initializeModels()
    this.loadPrecomputedDocuments()
  }

  private initializeModels() {
    // Start with first available key
    const firstKey = this.apiKeyManager.getHealthyKey()
    if (!firstKey) {
      throw new Error('No healthy API keys available')
    }

    const genAI = new GoogleGenerativeAI(firstKey.key)
    this.embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" })
    this.generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  }

  // Loads the ~7 static knowledge-base documents with their embeddings precomputed by
  // scripts/precompute-embeddings.ts (see app/lib/knowledgeBase.embeddings.json) instead
  // of calling the Gemini embedding API for each of them on every process cold start.
  // Synchronous: no request can reach this RAGService instance before its documents are
  // loaded, unlike the old fire-and-forget async initialization.
  private loadPrecomputedDocuments() {
    const knowledgeBaseEntries: { title: string; type: string; content: string }[] = [
      { title: "System Prompt - Ansh's Personality", type: "system", content: systemPrompt },
      { title: "Work Philosophy & Approach", type: "philosophy", content: philosophyContent },
      { title: "Educational Background", type: "education", content: educationContent },
      { title: "Career Goals & Aspirations", type: "goals", content: goalsContent },
      { title: "Professional Experience", type: "experience", content: experienceContent },
      { title: "Availability & Opportunities", type: "availability", content: availabilityContent },
      { title: "Detailed Projects & Achievements", type: "projects", content: projectDetails },
    ]

    const precomputedByTitle = new Map(
      (precomputedEmbeddings as PrecomputedEmbedding[]).map((entry) => [entry.title, entry])
    )

    for (const entry of knowledgeBaseEntries) {
      const precomputed = precomputedByTitle.get(entry.title)
      if (!precomputed) {
        throw new Error(
          `No precomputed embedding found for "${entry.title}" in app/lib/knowledgeBase.embeddings.json. ` +
          `Run \`npm run precompute-embeddings\` and commit the updated file.`
        )
      }

      const currentHash = hashDocumentContent(entry.content)
      if (currentHash !== precomputed.contentHash) {
        throw new Error(
          `Precomputed embedding for "${entry.title}" is stale (content hash mismatch). ` +
          `app/lib/knowledgeBase.ts was edited without re-running \`npm run precompute-embeddings\`. ` +
          `Re-run it and commit the updated app/lib/knowledgeBase.embeddings.json.`
        )
      }

      this.documents.push({
        id: uuidv4(),
        content: entry.content,
        metadata: {
          title: entry.title,
          type: entry.type,
          timestamp: Date.now(),
        },
        embedding: precomputed.embedding,
      })
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
        const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" })
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

  // Generate component-specific follow-up responses. Always returns fast: the cached
  // AI-personalized line for this component type if one exists yet, otherwise the
  // hand-written fallback -- never blocks the request on a Gemini call. If nothing is
  // cached yet, priming is kicked off in the background for next time.
  async generateComponentFollowUp(componentContext: ComponentContext, chatHistory: ChatMessage[] = []): Promise<string> {
    const cached = this.followUpCache.get(componentContext.type)
    if (cached) {
      return cached
    }

    this.primeFollowUpCache(componentContext, chatHistory)
    return ComponentContextManager.getComponentFallbackResponse(componentContext)
  }

  // Fire-and-forget: generates the AI-personalized follow-up for this component type and
  // caches it for every subsequent request, guarded so concurrent requests for the same
  // type don't each trigger their own Gemini call.
  private primeFollowUpCache(componentContext: ComponentContext, chatHistory: ChatMessage[]): void {
    const type = componentContext.type

    if (this.followUpCache.has(type) || this.followUpPriming.has(type)) {
      return
    }

    this.followUpPriming.add(type)

    this.buildComponentFollowUpText(componentContext, chatHistory)
      .then((text) => {
        if (text) {
          this.followUpCache.set(type, text)
        }
      })
      .catch((error) => {
        console.error("Error priming component follow-up cache:", error)
      })
      .finally(() => {
        this.followUpPriming.delete(type)
      })
  }

  private async buildComponentFollowUpText(componentContext: ComponentContext, chatHistory: ChatMessage[]): Promise<string> {
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
      const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      return await generativeModel.generateContent(prompt)
    })

    return result.response.text()
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
        const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
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