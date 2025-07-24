// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ragService } from '@/lib/ragService';

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Initialize project details on first load
    if (ragService.getDocumentCount() === 1) {
      await ragService.addProjectDetails();
    }

    const response = await ragService.generateResponse(message, chatHistory || []);

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'AI Portfolio Chat API is running!',
    documentCount: ragService.getDocumentCount()
  });
}