# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interactive AI-powered developer portfolio (Next.js 16 App Router, React 19, TypeScript). Instead of static sections, visitors chat with a Gemini-powered assistant ("Ansh") that answers questions and renders portfolio UI components (projects, skills, resume, etc.) inline in the conversation.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build     # production build
npm run start     # run a production build
npm run lint      # next lint
```

There is no test suite configured (no `test` script in package.json, no test files in the repo) despite README references to `npm run test` / `test:e2e` — treat those as aspirational, not real commands.

Both ESLint and TypeScript errors are ignored during build (`next.config.js`: `eslint.ignoreDuringBuilds`, `typescript.ignoreBuildErrors`), so `npm run build` succeeding does not mean the code lints or type-checks cleanly. Run `npm run lint` / `tsc --noEmit` separately to actually verify.

**Config file gotcha:** both `next.config.js` and `next.config.mjs` exist with slightly different content. Next.js resolves `next.config.js` first, so `next.config.mjs` is dead and silently ignored — edit `next.config.js` for changes to take effect.

## Environment variables

The app round-robins across up to six Gemini API keys to work around free-tier rate limits:

```
GEMINI_API_KEY_1 ... GEMINI_API_KEY_6
```

At least one must be set or `RAGService`/`APIKeyManager` throw at startup (see below).

## Architecture

### Two routes, one chat engine

- `app/page.tsx` — marketing/landing page with quick-question buttons; on submit it navigates to `/chat?query=<text>` rather than sending the message itself.
- `app/chat/page.tsx` — the actual chat UI. `useChatLogic` (`app/hooks/useChatLogic.ts`) picks up the `query` search param on mount and feeds it through the same pipeline as a normal typed message.

### Message pipeline (client-side orchestration before any network call)

1. `useChatLogic.processMessage` receives raw text and hands it to `MessageProcessor.processMessage` (`app/lib/messageProcessor.ts`).
2. `MessageProcessor` delegates classification to `IntentAnalyzer.analyzeIntent` (`app/lib/intentAnalyzer.ts`), which returns one of four intents, checked in priority order:
   - `component` — message matches a keyword/regex trigger for a specific UI component (profile/projects/skills/contact/resume/fun/internship/more).
   - `elaboration` — user is asking for more detail about a component shown in the last few messages (uses `ConversationMemory` to know what was recently shown).
   - `philosophical` — opinion/approach-style question, answered via RAG with no component.
   - `informational` — default fallback, answered via RAG.
3. Based on intent, `useChatLogic` calls either `handleComponentMessage` or `handleRAGResponse` (`app/lib/componentHandlers.ts`).
   - `handleComponentMessage` immediately appends a component message (rendered by `MessagesArea`/`ChatScreen` based on `Message.type`), then — after a short delay — calls `/api/chat` again to get a personalized follow-up line to append as a second message.
   - `handleRAGResponse` calls `/api/chat` directly for a plain text reply, attaching whatever component was recently shown as context.
4. `ConversationMemory` (`app/lib/conversationMemory.ts`) tracks the most recently shown component across turns and builds extra context strings injected into RAG prompts, independent of the intent analysis above.

### Server side: `/api/chat` → RAGService

- `app/api/chat/route.ts` is the only API route. It assembles a plain-text "context blob" (component context + enhanced context + intent-specific instructions) and calls `ragService.generateResponse(...)`.
- `RAGService` (`app/lib/ragService.ts`) is a module-level singleton (not per-request) that:
  - Seeds an in-memory document store from static content in `app/lib/knowledgeBase.ts` (system prompt/personality, philosophy, education, goals, experience, availability, project details), embedding each with Gemini's `text-embedding-004` at construction time.
  - On each query, embeds the query, does cosine-similarity retrieval (`retrieveRelevantDocuments`) over the in-memory documents (no vector DB), and stuffs the top-k chunks plus recent chat history plus the context blob into a prompt for `gemini-2.0-flash`.
  - If `componentContext` is present, takes a different path (`generateComponentFollowUp`) that builds a component-specific prompt via `ComponentContextManager.buildComponentContext` instead of the generic RAG prompt.
- `APIKeyManager` (`app/lib/apiKeyManager.ts`) wraps every Gemini call (`executeWithRetry`). It round-robins across the configured `GEMINI_API_KEY_*` keys, tracks per-key request/error counts, and distinguishes three failure modes with different recovery behavior: per-minute 429 (short cooldown), per-day quota 429 (disabled until UTC midnight), and 401/403 (permanently disabled, never retried). A background `setInterval` health-checks disabled keys every 5 minutes.

Because `RAGService` and `APIKeyManager` are constructed once at module load (not per-request), all in-memory state — documents, key health, rate-limit counters — is shared across requests within a server process and reset on redeploy/restart.

### Component context vs. chat state

Two related but distinct context mechanisms exist — don't conflate them when tracing a bug:
- `ComponentContext` (`app/lib/componentContextManager.ts` + `app/types/chat.ts`) — describes *what component was shown and why*, used to build prompts server-side.
- `ConversationMemory` (`app/lib/conversationMemory.ts`) — client-side memory of recent messages/components, used to decide if a new message is an elaboration and to enrich the context blob sent to `/api/chat`.

### UI structure

- `app/components/chat/` — chat screen composition (`ChatScreen`, `MessagesArea`, `ChatInput`, `ChatLanding`, `MoreDrawer`/`MoreOptionsPanel`/`MoreSectionDrawer` for the "more" component type).
- `app/components/ui/` — shadcn/ui primitives (button, card, drawer, etc.) plus portfolio-specific display components (`ProfileCard`, `skills`, `contact`, `resume`, `crazy` (fun/adventures), `internship-card`, `photos`). A `Message`'s `type` field selects which of these renders inline in the chat.
- `app/components/projects/` — project data (`Data.tsx`) and the Apple-style cards carousel used for the projects component.
- Path alias `@/*` → `app/*` (see `tsconfig.json`); shadcn aliases in `components.json` point `@/components`, `@/lib`, `@/hooks` at the same tree.

## Editing knowledge/personality content

The assistant's "personality" and factual knowledge (bio, philosophy, project descriptions, availability) live as plain strings in `app/lib/knowledgeBase.ts`. Their embeddings are **precomputed**, not generated at server start: `RAGService` reads them synchronously from the checked-in `app/lib/knowledgeBase.embeddings.json` at construction and verifies a content hash for each document against what's in `knowledgeBase.ts`, throwing a clear error naming the stale document if they've drifted apart.

After editing `knowledgeBase.ts`, you must run `npm run precompute-embeddings` (needs at least one real `GEMINI_API_KEY_*` in `.env`/`.env.local`) and commit the updated `app/lib/knowledgeBase.embeddings.json` before deploying — otherwise the server throws at startup instead of silently serving stale embeddings.

Both the precompute script and `RAGService`'s own live query-embedding call (in `retrieveRelevantDocuments`) use the `gemini-embedding-001` model — keep them in sync if you ever change it, since query and document embeddings must come from the same model to be comparable via cosine similarity. (`text-embedding-004`, the model this code used previously, has been fully retired by Google — confirmed via `ListModels` — so if you see 404s from an embedding call, that's almost certainly the cause.)

## Known issues to prioritize when touching the backend

1. **Key-rotation state doesn't survive across concurrent/cold-started instances.** This deploys to Netlify, where API routes run as serverless functions (no `netlify.toml`/`vercel.json` in the repo, so it's the default Next.js-runtime behavior — confirm this hasn't changed before assuming otherwise). `APIKeyManager`'s round-robin index, per-key request counts, and daily-exhaustion flags live in the module-level singleton described above. On a single warm process that's fine; across multiple concurrent serverless instances, each one holds its own copy of that state, so the "6-key rotation" isn't actually coordinated — one instance can hammer a key another instance already marked exhausted. The 5-minute `setInterval` health check is also unreliable here since a frozen/recycled function doesn't keep timers running between invocations. This is almost certainly the real cause of any lingering rate-limit pain despite having 6 keys — the rotation logic itself is sound, it just isn't backed by shared state.
2. ~~Knowledge-base docs are re-embedded from scratch on every process start~~ — **done.** Embeddings are now precomputed and read from `app/lib/knowledgeBase.embeddings.json` at construction (see "Editing knowledge/personality content" above).
3. **No response caching** — identical/common questions re-hit Gemini fresh every time.
4. **`@google/generative-ai` is pinned as `"latest"`** in package.json — not reproducible across installs.

## Suggested order of work

1. ~~Precompute/cache the knowledge-base embeddings~~ — done.
2. Move key-rotation/quota state to something shared across invocations — Upstash Redis or Vercel KV are the lowest-friction options for a Next.js app on serverless — so the rotation is actually global instead of per-instance. This is the fix that addresses the root cause in issue #1.
3. Add response caching for repeated/common queries (hash of query, short TTL).
4. Pin `@google/generative-ai` to a specific version.