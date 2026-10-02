// app/lib/geminiModels.ts
//
// Single source of truth for which Gemini model names this app calls. Google has
// retired models with no migration window before -- gemini-2.0-flash and
// text-embedding-004 both started returning 404s in production with no warning -- so
// the next retirement should be a one-line fix here instead of a multi-file hunt.
//
// Both constants are pinned to a specific stable (non-"-preview", non-"-latest")
// release rather than a rolling alias, so behavior doesn't shift silently out from
// under us the day Google repoints "latest" to something heavier or different.

// Chat/generation model used for all conversational responses -- RAG answers
// (RAGService.generateRegularResponse), component follow-ups
// (RAGService.buildComponentFollowUpText), and APIKeyManager's own health-check ping.
export const GEMINI_CHAT_MODEL = "gemini-3.5-flash-lite"

// Embedding model used both to precompute the knowledge-base document embeddings
// (scripts/precompute-embeddings.ts) and to embed live queries at request time
// (RAGService.retrieveRelevantDocuments). These two call sites must always agree,
// since embeddings from different models aren't comparable via cosine similarity.
export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001"

// Generation configs for the chat model, one per call site. Passed to
// getGenerativeModel({ model, generationConfig }). Embedding calls take no
// generationConfig, so none is defined for GEMINI_EMBEDDING_MODEL.

// APIKeyManager's health-check ping -- only needs to confirm the key works.
export const GEMINI_HEALTH_CHECK_CONFIG = {
  maxOutputTokens: 10,
}

// Component follow-up lines (RAGService.buildComponentFollowUpText) -- the prompt asks
// for 2-3 sentences, so this leaves some headroom above that.
export const GEMINI_COMPONENT_FOLLOWUP_CONFIG = {
  maxOutputTokens: 150,
  temperature: 0.7,
}

// Regular RAG answers (RAGService.generateRegularResponse) -- a real answer needs more
// room than a follow-up line.
export const GEMINI_RAG_RESPONSE_CONFIG = {
  maxOutputTokens: 300,
  temperature: 0.7,
}
