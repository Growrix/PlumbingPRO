# Skill: AI Moderation Precheck Pattern

**Used by:** openai

## Pattern

All user-provided text MUST be sent through the OpenAI Moderation API before being included in an LLM prompt. This prevents prompt injection and policy violations.

### Implementation
\\\	s
async function moderateContent(text: string): Promise<boolean> {
  const moderation = await openai.moderations.create({ input: text })
  return !moderation.results[0]?.flagged
}

// In chat route handler:
const isSafe = await moderateContent(userMessage)
if (!isSafe) return new Response('Content policy violation', { status: 422 })
\\\

### Rules
- MUST run BEFORE the chat completion call — not after.
- MUST log flagged content with actor ID for audit purposes.
- MUST NOT return the moderation categories to the client (leaks policy details).
- Rate limit applies to moderation calls too (same Upstash limiter).
