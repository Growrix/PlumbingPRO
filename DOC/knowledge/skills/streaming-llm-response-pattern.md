# Skill: Streaming LLM Response Pattern

**Used by:** openai, anthropic, vercel-ai-sdk

## Pattern

LLM responses MUST be streamed via the Vercel AI SDK \streamText\ or \streamObject\ helper. Never buffer the entire response before responding.

### Implementation (Next.js App Router)

\\\	s
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    onFinish: ({ usage }) => {
      // track usage for cost
    },
  })

  return result.toDataStreamResponse()
}
\\\

### Rules
- MUST use \	oDataStreamResponse()\ for client-compatible streaming.
- MUST handle AbortSignal to cancel upstream requests when client disconnects.
- MUST run a moderation precheck BEFORE calling the LLM (see ai-moderation-precheck-pattern).
- MUST rate-limit per user (see rate-limit-with-upstash-pattern).
- MUST track usage per user (see ai-cost-tracking-pattern).
