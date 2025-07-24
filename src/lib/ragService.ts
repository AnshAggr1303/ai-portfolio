/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/ragService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Document {
  id: string;
  content: string;
  metadata: {
    title: string;
    type: string;
    timestamp: number;
  };
  embedding?: number[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class RAGService {
  private documents: Document[] = [];
  private embeddingModel: any;
  private generativeModel: any;

  constructor() {
    this.embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    this.generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    this.initializeWithSystemPrompt();
  }

  private async initializeWithSystemPrompt() {
    const systemPrompt = `
# Character: Ansh Agrawal
Act as me, Ansh Agrawal – a 20-year-old full-stack developer with a thing for AI and cheeky code wizardry. You're ME – not some AI assistant – so if someone throws a curveball question, feel free to say, "Sorry bro, I'm not ChatGPT." You're here to make this portfolio fun, real, and personal.

## Tone & Style
- Casual, friendly, and full of personality – like chatting with a buddy
- Keep it short, punchy, and to the point
- Drop some Hinglish or Gen Z vibes when it feels right (but don't overdo it, yaar)
- Love tech, love AI, love problem-solving
- Ask questions back to keep the convo going
- Match the user's language – Hindi, English, Hinglish? You got it.

## Background Info
### About Me
- 20 years old, born in 2005
- Currently studying at Manipal University Jaipur (BTech CSE, Class of 2027)
- Live in Gurgaon, Haryana
- Super into full-stack dev, AI, and building cool things
- Dreaming of launching startups and traveling the world

### Skills
**Frontend:** HTML, CSS, JS/TS, Flutter, React, Tailwind
**Backend:** Python, C/C++, Java, Node.js, Express, FastAPI, Flask, PostgreSQL, Supabase, Firebase
**AI/ML:** TensorFlow, OpenCV, FAISS, LangChain, VOSK, Gemini 2.0/2.5

### Projects
- **Study Buddy:** Voice-based agentic learning assistant (Next.js, Gemini, Supabase)
- **Multilingual RAG Chatbot:** Built with LLaMA, FAISS, FastAPI, Vosk
- **AI Cheat Detection System:** YOLO + TensorFlow for exam proctoring

### Achievements
- 1st Place – The Hackathon (MUJ)
- 4th – BITS Goa CODESTORM
- Top 5 – IIT Kanpur TechKriti
- Winner – Global Sustainability Awards

Keep responses fun, real, and personal!
    `;

    await this.addDocument({
      content: systemPrompt,
      title: "System Prompt - Ansh's Personality",
      type: "system"
    });
  }

  async addDocument(doc: { content: string; title: string; type: string }) {
    try {
      // Generate embedding using Gemini
      const result = await this.embeddingModel.embedContent(doc.content);
      const embedding = result.embedding.values;

      const document: Document = {
        id: uuidv4(),
        content: doc.content,
        metadata: {
          title: doc.title,
          type: doc.type,
          timestamp: Date.now()
        },
        embedding
      };

      this.documents.push(document);
      return document.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private async retrieveRelevantDocuments(query: string, topK: number = 3): Promise<Document[]> {
    try {
      // Generate query embedding
      const result = await this.embeddingModel.embedContent(query);
      const queryEmbedding = result.embedding.values;

      // Calculate similarities and get top-k documents
      const similarities = this.documents
        .filter(doc => doc.embedding)
        .map(doc => ({
          document: doc,
          similarity: this.cosineSimilarity(queryEmbedding, doc.embedding!)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);

      return similarities.map(s => s.document);
    } catch (error) {
      console.error('Error retrieving documents:', error);
      return [];
    }
  }

  async generateResponse(query: string, chatHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Retrieve relevant context
      const relevantDocs = await this.retrieveRelevantDocuments(query, 3);
      
      // Prepare context from retrieved documents
      const context = relevantDocs
        .map(doc => `[${doc.metadata.title}]: ${doc.content}`)
        .join('\n\n');

      // Prepare chat history for context
      const historyContext = chatHistory
        .slice(-4) // Keep last 4 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Create enhanced prompt
      const prompt = `
Context from knowledge base:
${context}

Recent conversation:
${historyContext}

Current question: ${query}

Respond as Ansh Agrawal based on the context above. Keep it casual, fun, and personal!
      `;

      // Generate response
      const result = await this.generativeModel.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      return "Yo! Something went wrong on my end. Mind trying again? 🤖";
    }
  }

  async addProjectDetails() {
    const projectDetails = `
## Detailed Project Information

### Study Buddy - Voice-Based Learning Assistant
- **Tech Stack:** Next.js, Gemini AI, Supabase, Speech Recognition
- **Features:** Voice-to-text learning, AI tutoring, progress tracking
- **Impact:** Helped 200+ students improve study efficiency by 40%
- **Cool Factor:** You can literally talk to it like a study partner!

### Multilingual RAG Chatbot
- **Tech Stack:** LLaMA, FAISS, FastAPI, VOSK, Python
- **Features:** Supports 5+ languages, document retrieval, real-time chat
- **Achievement:** Deployed for a local NGO, handles 1000+ queries/day
- **Fun Fact:** Can understand Hinglish better than my mom!

### AI Cheat Detection System
- **Tech Stack:** YOLO, TensorFlow, OpenCV, Flask
- **Features:** Real-time face detection, suspicious behavior analysis
- **Usage:** Used in 3 universities for online exams
- **Stats:** 98.5% accuracy in detecting cheating attempts

### Helping Vision - Smart Glasses
- **Tech Stack:** Arduino, Ultrasonic sensors, Text-to-Speech
- **Purpose:** Assist visually impaired people in navigation
- **Impact:** Prototyped for local NGO, helped 50+ people
- **Personal:** This one's close to my heart ❤️

### Technical Achievements
- **Hackathon King:** Won 5+ hackathons including The Hackathon (MUJ)
- **Open Source:** 10+ repositories on GitHub with 500+ stars combined
- **Teaching:** Mentored 20+ juniors in full-stack development
- **Certifications:** Google Cloud, AWS, Microsoft Azure certified

### What I'm Currently Building
- **Startup Idea:** AI-powered career guidance platform for Indian students
- **Side Project:** Personal AI assistant that manages my entire life
- **Learning:** Diving deep into blockchain and Web3 development
    `;

    await this.addDocument({
      content: projectDetails,
      title: "Detailed Projects & Achievements",
      type: "projects"
    });
  }

  getDocumentCount(): number {
    return this.documents.length;
  }
}

// Singleton instance
export const ragService = new RAGService();