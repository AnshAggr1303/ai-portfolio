// app/lib/componentContextManager.ts

import type { ComponentContext } from "../types/chat"

export class ComponentContextManager {
  static buildComponentContext(componentContext: ComponentContext): string {
    switch (componentContext.type) {
      case "projects":
        return `
Component Context: Displayed projects showcase:
${componentContext.availableProjects?.map(p => `- ${p}`).join('\n') || '- Study Buddy\n- Aarogya AI\n- Exam Guard\n- DATAI\n- MUJeats\n- Agentic Chatbot System'}

User Query: "${componentContext.userQuery}"
Component Status: ${componentContext.shown ? 'Displayed successfully' : 'Tried but failed'}

PROJECT CONTEXT:
- Study Buddy: Voice AI learning tool (6 months dev)
- Aarogya AI: Multilingual chatbot using RAG
- Exam Guard: AI cheat detection (1st prize @ MUJ)
- DATAI: Natural language to database tool
- MUJeats: Flutter food ordering UI
- Agentic Chatbot System: 3rd place @ Assesli, got interview offer

Context: User saw interactive project cards with tech badges and achievements.
        `

      case "skills":
        return `
Component Context: Displayed skills matrix:
${componentContext.skillCategories?.map(s => `- ${s}`).join('\n') || '- Full-stack Dev, AI/ML, Flutter, Cloud, DBs'}

User Query: "${componentContext.userQuery}"
Component Status: ${componentContext.shown ? 'Displayed successfully' : 'Tried but failed'}

SKILLS CONTEXT:
- Loves React + Python
- Good at building full-stack AI apps
- Specializes in GenAI, Flutter, and Supabase magic

Context: Skills section with icons, categories, and tech stack highlights.
        `

      case "fun":
        return `
Component Context: Displayed adventure gallery:
${componentContext.adventureHighlights?.map(h => `- ${h}`).join('\n') || '- Kedarnath trek (22 km)\n- Goa beach exploration on scooty'}

User Query: "${componentContext.userQuery}"
Component Status: ${componentContext.shown ? 'Displayed successfully' : 'Tried but failed'}

ADVENTURE CONTEXT:
- Kedarnath Trek: 22 km trek, post-1st year, with 3 friends
- Experience: Spiritual, intense, soul-touching
- Goa: Finalist @ BITS Hackathon, beach-hopping on scooty

Context: Fun section showing real-life adventures and crazy bits.
        `

      case "profile":
        return `
Component Context: Displayed profile details:
- Student @ MUJ, CSE 3rd year
- From Gurgaon, 8+ CGPA
- Into full-stack, GenAI, adventures
- Hobbies: Cricket, basketball, chess, pool, TT, gaming (console > mobile), car lover 🏎️

User Query: "${componentContext.userQuery}"
Component Status: ${componentContext.shown ? 'Displayed successfully' : 'Tried but failed'}

Context: User saw intro card with story, academic track, and interests.
        `

      case "contact":
        return `
Component Context: Displayed contact info:
- Email, GitHub, LinkedIn
- Location: Gurgaon
- Status: Open to internships/freelance

User Query: "${componentContext.userQuery}"
Component Status: ${componentContext.shown ? 'Displayed successfully' : 'Tried but failed'}

Context: User got clickable links to reach out on multiple platforms.
        `

      case "internship":
        return `
Component Context: Displayed internship availability:
${componentContext.availability ? `- Availability: ${componentContext.availability}` : '- Summer 2026, part-time anytime'}
${componentContext.interests?.map(i => `- Interest: ${i}`).join('\n') || '- Full-stack, GenAI, startup vibes'}

User Query: "${componentContext.userQuery}"
Component Status: ${componentContext.shown ? 'Displayed successfully' : 'Tried but failed'}

Context: Shared availability and roles I’m targeting with preferred work styles.
        `

      case "resume":
        return `
Component Context: Resume download option displayed:
- Updated resume with hackathons, projects, experience

User Query: "${componentContext.userQuery}"
Component Status: ${componentContext.shown ? 'Displayed successfully' : 'Tried but failed'}

Context: Resume card with link to downloadable PDF.
        `

      default:
        return `
Component Context: Displayed generic content for ${componentContext.type}
User Query: "${componentContext.userQuery}"
Component Status: ${componentContext.shown ? 'Displayed successfully' : 'Tried but failed'}
        `
    }
  }

  static getComponentFallbackResponse(componentContext: ComponentContext): string {
    const fallbacks = {
      projects: "**10+ projects** in my arsenal! My favs? **Study Buddy**, **Exam Guard**, and **Aarogya AI**. Wanna dive into one?",
      skills: "My toolkit's sharp – **React, Python, Gemini, Supabase, Flutter**, and more! What tech are you into?",
      fun: "Bro, that **Kedarnath trek** (22 km uphill madness) changed me. And Goa? Beaches + scooty = unbeatable vibe. You into adventure?",
      profile: "**Techie by day, trekker by heart.** Gurgaon boy, 20 y/o, living dev life with 10+ projects and no regrets 😎 What about you?",
      contact: "Reach out on **LinkedIn, GitHub, or email** – I reply faster than a CI/CD pipeline deploys.",
      internship: "**Summer 2026 ready!** Full-stack, GenAI, product roles – send ‘em my way!",
      resume: "**Updated resume** is one click away. Curious about anything specific inside?"
    }

    return fallbacks[componentContext.type as keyof typeof fallbacks] ||
           "That was fun to show! Want to know more about me or something else?"
  }

  static getContextAwareResponse(componentContext: ComponentContext, recentQueries: string[]): string {
    const base = this.getComponentFallbackResponse(componentContext)

    if (recentQueries.some(q => /crazy|trek|adventure/i.test(q)) && componentContext.type === "fun") {
      return "**Kedarnath trek** was wild – 22km, freezing wind, legs dead – but the holy vibes? Worth every step 🛐 You done something this mad?"
    }

    if (recentQueries.some(q => /philosophy|approach|work/i.test(q))) {
      return "Work ethic? **Build, break, learn.** Clean code. Real problems. No fluff. You got a dev philosophy too?"
    }

    return base
  }
}
