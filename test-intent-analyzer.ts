// test-intent-analyzer.ts
// Standalone test for IntentAnalyzer. Zero Gemini API calls — this class is
// pure keyword/regex logic, so we can batch-test hundreds of messages for free.
// Run with: npx tsx test-intent-analyzer.ts

import { IntentAnalyzer } from "./app/lib/intentAnalyzer"
import type { Message } from "./app/types/chat"

interface TestCase {
    message: string
    expectedIntent: string
    expectedComponent?: string
    recentComponent?: string
    note?: string
}

function makeRecentComponentMessage(type: string): Message {
    return {
        id: "test",
        role: "assistant",
        content: "",
        timestamp: new Date(),
        type: type as any,
        componentContext: { type, shown: true, userQuery: "previous query" } as any,
    }
}

const cases: TestCase[] = [
    // --- straightforward direct triggers, should just work ---
    { message: "show me your projects", expectedIntent: "component", expectedComponent: "projects" },
    { message: "what are your skills", expectedIntent: "component", expectedComponent: "skills" },
    { message: "how can I reach you", expectedIntent: "component", expectedComponent: "contact" },
    { message: "can I see your resume", expectedIntent: "component", expectedComponent: "resume" },
    { message: "tell me your craziest experience", expectedIntent: "component", expectedComponent: "fun" },
    { message: "are you open to internships", expectedIntent: "component", expectedComponent: "internship" },
    { message: "what have you built", expectedIntent: "component", expectedComponent: "projects" },

    // --- suspected bare-word false positives ---
    {
        message: "what's your work philosophy", expectedIntent: "philosophical",
        note: "contains 'work' -> projects component matches on the word alone"
    },
    {
        message: "does remote work interest you", expectedIntent: "informational",
        note: "bare 'work' match"
    },
    {
        message: "what's your favorite piece of artwork", expectedIntent: "informational",
        note: "'artwork' contains 'work' as a substring"
    },
    {
        message: "what other activities does your dev team do", expectedIntent: "informational",
        note: "bare 'activities' match -> could misfire to 'fun'"
    },
    {
        message: "let's resume the conversation later", expectedIntent: "informational",
        note: "'resume' used as a verb, substring-matches the resume trigger"
    },
    {
        message: "what email service do you use", expectedIntent: "informational",
        note: "'email' substring matches the contact trigger"
    },

    // --- elaboration: needs a recent component in history ---
    { message: "tell me more about that", expectedIntent: "elaboration", recentComponent: "projects" },
    {
        message: "how did you build study buddy", expectedIntent: "elaboration", recentComponent: "projects",
        note: "specific elaboration regex for projects"
    },
    {
        message: "how did you build study buddy", expectedIntent: "informational",
        note: "same message, no recent component -- should fall through cleanly, not crash"
    },

    // --- philosophical ---
    { message: "what's your approach to solving hard problems", expectedIntent: "philosophical" },
    { message: "what do you think about AI replacing developers", expectedIntent: "philosophical" },

    // --- round 2: bare substrings elsewhere in the same file ---
    {
        message: "how do I design a good user profile page for my app", expectedIntent: "informational",
        note: "'profile' bare substring in a direct trigger -> misfires to profile component"
    },
    {
        message: "what's the hiring process like at FAANG companies", expectedIntent: "informational",
        note: "'hiring' bare substring -> misfires to internship, but it's about a different company entirely"
    },
    {
        message: "what's your calendar availability like for a coffee chat", expectedIntent: "informational",
        note: "'availability' bare substring -> misfires to internship for an unrelated scheduling question"
    },
    {
        message: "climbing the corporate ladder isn't really my goal", expectedIntent: "informational",
        note: "'climbing' bare substring (metaphor) -> misfires to fun/adventures component"
    },
    {
        message: "will TypeScript help me in this role", expectedIntent: "informational", recentComponent: "skills",
        note: "BUG CANDIDATE: contains bare 'this' -> CONTEXT_KEYWORDS hijacks a fresh, unrelated question into 'elaboration' on whatever was last shown"
    },
    {
        message: "is that a common tech stack for startups", expectedIntent: "informational", recentComponent: "skills",
        note: "same bug via bare 'that'"
    },

    // --- round 3: checking the fix generalizes, not just the exact cases above ---
    {
        message: "what soft skills matter most to you in a teammate", expectedIntent: "informational",
        note: "'skills' was never in round 1/2 -- almost certainly still bare/unguarded"
    },
    {
        message: "what's the best way to contact recruiters on LinkedIn", expectedIntent: "informational",
        note: "'contact' bare -- about contacting OTHER people, not Ansh; likely still unguarded"
    },
    {
        message: "how do you build a diversified investment portfolio", expectedIntent: "informational",
        note: "'portfolio' bare, financial sense -- likely still unguarded since only 'work' inside this trigger group was addressed"
    },
    {
        message: "do you have any openings for a summer intern", expectedIntent: "component", expectedComponent: "internship",
        note: "regression check: doesn't say 'internship' literally -- did removing bare hiring/availability leave a real gap?"
    },
    {
        message: "is this recent", expectedIntent: "elaboration", recentComponent: "projects",
        note: "genuinely short + vague (3 words) -- should still elaborate after the length-gate fix"
    },
    {
        message: "why is that important for scaling a team", expectedIntent: "informational", recentComponent: "skills",
        note: "6 words, contains 'that', but is a substantive new question, not a vague follow-up -- tests whether word-count alone is actually distinguishing vagueness or just length"
    },
    {
        message: "I'm not big on climbing corporate hierarchies either", expectedIntent: "informational",
        note: "different phrasing than the exact 'climbing the corporate ladder' case -- checks whether the exclusion generalizes or is a narrow lookahead tied to that literal phrase"
    },

    // --- More Options drawer: every item's exact `question` from app/constants/quickQuestions.ts ---
    // recentComponent is deliberately unset. The "more" message is created without a
    // componentContext (componentHandlers.ts), and getRecentComponentContext() only counts
    // assistant messages with componentContext.shown, so a drawer tap sees no recent component
    // unless the PREVIOUS tap produced a real one (see the matrix in the investigation, not here).
    // Professional
    { message: "Can I see your resume?", expectedIntent: "component", expectedComponent: "resume", note: "more:resume" },
    { message: "Are you available for internships?", expectedIntent: "component", expectedComponent: "internship", note: "more:availability" },
    { message: "What is your work philosophy and approach?", expectedIntent: "philosophical", note: "more:work-philosophy" },
    { message: "What makes you a valuable team member?", expectedIntent: "informational", note: "more:team-value" },
    // Achievements & Recognition
    { message: "how many hackathon have you won?", expectedIntent: "informational", note: "more:hackathon-wins" },
    { message: "What are your key achievements and awards?", expectedIntent: "informational", note: "more:achievements" },
    { message: "What certifications do you have?", expectedIntent: "informational", note: "more:certifications" },
    { message: "Show me your competition statistics", expectedIntent: "informational", note: "more:competition-stats" },
    // Tech & Code
    { message: "Show me a cool C code snippet of Fibonacci Sequence", expectedIntent: "informational", note: "more:favorite-code" },
    { message: "What's your complete tech stack?", expectedIntent: "informational", note: "more:tech-stack" },
    { message: "What are you currently learning?", expectedIntent: "informational", note: "more:learning" },
    { message: "What are your favorite development tools?", expectedIntent: "informational", note: "more:favorite-tools" },
    { message: "How did you get started in programming?", expectedIntent: "informational", note: "more:coding-journey" },
    // Journey & Timeline
    { message: "What are your key career milestones?", expectedIntent: "informational", note: "more:milestones" },
    { message: "Where do you see yourself in 5 years?", expectedIntent: "informational", note: "more:5-years" },
    { message: "What was your biggest professional challenge?", expectedIntent: "informational", note: "more:biggest-challenge" },
    // Hobbies & Interests
    { message: "What sports and gaming activities do you enjoy?", expectedIntent: "informational", note: "more:sports" },
    { message: "Share some of your adventure stories and travels", expectedIntent: "component", expectedComponent: "fun", note: "more:adventures" },
    { message: "Describe your passion for cars", expectedIntent: "informational", note: "more:cars-passion" },
    { message: "List your other hobbies and interests", expectedIntent: "informational", note: "more:hobbies" },
    // Quick Facts
    { message: "Show me your quick professional stats", expectedIntent: "informational", note: "more:quick-stats" },
    { message: "Tell me some fun facts about yourself", expectedIntent: "component", expectedComponent: "fun", note: "more:fun-facts (the Fun Facts quick button maps to the fun component)" },
    { message: "What are your favorite frameworks and tools?", expectedIntent: "informational", note: "more:favorites" },
    { message: "Describe your personality ", expectedIntent: "informational", note: "more:personality" },
]

let pass = 0
let fail = 0
const failures: TestCase[] = []

for (const tc of cases) {
    const recentMessages: Message[] = tc.recentComponent
        ? [makeRecentComponentMessage(tc.recentComponent)]
        : []

    const result = IntentAnalyzer.analyzeIntent(tc.message, recentMessages)

    const intentOk = result.intentType === tc.expectedIntent
    const componentOk = tc.expectedComponent ? result.componentType === tc.expectedComponent : true
    const ok = intentOk && componentOk

    ok ? pass++ : fail++
    if (!ok) failures.push(tc)

    console.log(`${ok ? "PASS" : "FAIL"} | "${tc.message}"${tc.recentComponent ? ` [recent: ${tc.recentComponent}]` : ""}`)
    console.log(`     expected: intent=${tc.expectedIntent}${tc.expectedComponent ? `, component=${tc.expectedComponent}` : ""}`)
    console.log(`     got:      intent=${result.intentType}${result.componentType ? `, component=${result.componentType}` : ""}`)
    if (tc.note) console.log(`     note: ${tc.note}`)
    console.log("")
}

console.log("=".repeat(60))
console.log(`RESULT: ${pass}/${cases.length} passed`)
if (failures.length) {
    console.log("\nFailed:")
    failures.forEach(f => console.log(`  - "${f.message}"`))
}