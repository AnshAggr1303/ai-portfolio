// scripts/precompute-embeddings.ts
//
// The knowledge-base documents in app/lib/knowledgeBase.ts are static content, but
// RAGService used to call Gemini's embedding API for all of them on every process
// cold start. This script computes those embeddings once and writes them to
// app/lib/knowledgeBase.embeddings.json, which RAGService reads synchronously at
// construction instead.
//
// Run with: npm run precompute-embeddings
// Re-run and commit the updated JSON file whenever knowledgeBase.ts content changes --
// RAGService verifies a content hash at startup and throws if the two drift apart.

import { createHash } from "crypto"
import { writeFileSync, readFileSync, existsSync } from "fs"
import { join } from "path"
import { GoogleGenerativeAI } from "@google/generative-ai"
import {
  systemPrompt,
  philosophyContent,
  educationContent,
  goalsContent,
  experienceContent,
  availabilityContent,
  projectDetails,
} from "../app/lib/knowledgeBase"
import { GEMINI_EMBEDDING_MODEL } from "../app/lib/geminiModels"

const ROOT_DIR = join(__dirname, "..")
const OUTPUT_PATH = join(ROOT_DIR, "app/lib/knowledgeBase.embeddings.json")

// This must match RAGService's own hashContent() exactly, or every document will look
// "stale" at startup even when nothing changed.
function hashContent(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex")
}

// Node scripts don't get Next.js's automatic .env loading, so read the same files by
// hand (.env.local wins over .env, matching Next's own precedence) without pulling in
// an extra dependency.
function loadEnvFiles() {
  for (const filename of [".env", ".env.local"]) {
    const path = join(ROOT_DIR, filename)
    if (!existsSync(path)) continue

    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue

      const equalsIndex = trimmed.indexOf("=")
      if (equalsIndex === -1) continue

      const key = trimmed.slice(0, equalsIndex).trim()
      const value = trimmed.slice(equalsIndex + 1).trim()
      if (key) {
        process.env[key] = value
      }
    }
  }
}

interface KnowledgeBaseEntry {
  title: string
  type: string
  content: string
}

// Same title/type pairing RAGService has always used for these seven documents.
const entries: KnowledgeBaseEntry[] = [
  { title: "System Prompt - Ansh's Personality", type: "system", content: systemPrompt },
  { title: "Work Philosophy & Approach", type: "philosophy", content: philosophyContent },
  { title: "Educational Background", type: "education", content: educationContent },
  { title: "Career Goals & Aspirations", type: "goals", content: goalsContent },
  { title: "Professional Experience", type: "experience", content: experienceContent },
  { title: "Availability & Opportunities", type: "availability", content: availabilityContent },
  { title: "Detailed Projects & Achievements", type: "projects", content: projectDetails },
]

async function main() {
  loadEnvFiles()

  const apiKey = [1, 2, 3, 4, 5, 6]
    .map((n) => process.env[`GEMINI_API_KEY_${n}`])
    .find((key) => !!key)

  if (!apiKey) {
    throw new Error(
      "No GEMINI_API_KEY_1..6 found in the environment (.env / .env.local). Set at least one before running this script."
    )
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const embeddingModel = genAI.getGenerativeModel({ model: GEMINI_EMBEDDING_MODEL })

  const output = []
  for (const entry of entries) {
    console.log(`Embedding "${entry.title}"...`)
    const result = await embeddingModel.embedContent(entry.content)

    output.push({
      title: entry.title,
      type: entry.type,
      contentHash: hashContent(entry.content),
      embedding: result.embedding.values,
    })
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8")
  console.log(`Wrote ${output.length} embeddings to ${OUTPUT_PATH}`)
}

main().catch((error) => {
  console.error("Failed to precompute embeddings:", error)
  process.exit(1)
})
