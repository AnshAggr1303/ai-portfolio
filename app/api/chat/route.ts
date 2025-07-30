import { type NextRequest, NextResponse } from "next/server"
import { ragService } from "../../lib/ragService"

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Convert chat history to the format expected by RAG service
    const formattedHistory =
      chatHistory?.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })) || []

    const response = await ragService.generateResponse(message, formattedHistory)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
