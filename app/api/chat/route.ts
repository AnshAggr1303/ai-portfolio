// app/api/chat/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { ragService } from "../../lib/ragService"

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      chatHistory, 
      componentContext, 
      enhancedContext,
      intentType 
    } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Convert chat history to the format expected by RAG service
    const formattedHistory =
      chatHistory?.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })) || []

    // Build comprehensive context for RAG service
    let fullContext = ""
    
    // Add component context if available
    if (componentContext) {
      fullContext += `\nCOMPONENT CONTEXT:\n`
      fullContext += `Component Type: ${componentContext.type}\n`
      fullContext += `Component Shown: ${componentContext.shown}\n`
      fullContext += `User Query: "${componentContext.userQuery}"\n`
      
      if (componentContext.availableProjects) {
        fullContext += `Available Projects: ${componentContext.availableProjects.join(', ')}\n`
      }
      if (componentContext.skillCategories) {
        fullContext += `Skill Categories: ${componentContext.skillCategories.join(', ')}\n`
      }
      if (componentContext.adventureHighlights) {
        fullContext += `Adventure Highlights: ${componentContext.adventureHighlights.join(', ')}\n`
      }
    }

    // Add enhanced context
    if (enhancedContext) {
      fullContext += `\nENHANCED CONTEXT:\n${enhancedContext}\n`
    }

    // Add intent information
    if (intentType) {
      fullContext += `\nUSER INTENT: ${intentType}\n`
      
      // Add intent-specific instructions
      switch (intentType) {
        case 'elaboration':
          fullContext += `INSTRUCTION: User wants more details about the recently shown component. Provide specific, detailed information rather than showing new components.\n`
          break
        case 'philosophical':
          fullContext += `INSTRUCTION: User is asking a philosophical/opinion question. Provide thoughtful, personal responses about work philosophy, approach, beliefs, etc.\n`
          break
        case 'component':
          fullContext += `INSTRUCTION: User requested to see a specific component. This message is a follow-up after showing the component.\n`
          break
        case 'informational':
          fullContext += `INSTRUCTION: User wants general information. Use any available context to provide relevant details.\n`
          break
      }
    }

    console.log("🔄 RAG Service Context:", fullContext)

    // Pass comprehensive context to RAG service
    const response = await ragService.generateResponse(
      message, 
      formattedHistory, 
      componentContext,
      fullContext
    )

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}