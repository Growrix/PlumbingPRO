# Skill: AI Cost Tracking Pattern

**Used by:** helicone, openai, anthropic

## Pattern

Every LLM call MUST record token usage per user to enable per-user cost attribution, abuse detection, and spend caps.

### Usage table
\\\sql
ai_usage (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES users(id),
  model        text NOT NULL,
  prompt_tokens    int NOT NULL,
  completion_tokens int NOT NULL,
  total_tokens int NOT NULL,
  estimated_cost_usd numeric(10,6),
  route        text,  -- which API route triggered this
  created_at   timestamptz NOT NULL DEFAULT now()
)
\\\

### Vercel AI SDK integration
\\\	s
const result = streamText({
  model: openai('gpt-4o'),
  messages,
  onFinish: async ({ usage }) => {
    await db.aiUsage.create({
      data: {
        userId,
        model: 'gpt-4o',
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        estimatedCostUsd: (usage.totalTokens / 1000) * 0.005,
        route: '/api/chat'
      }
    })
  }
})
\\\

### Rules
- MUST track usage even for streaming responses (use \onFinish\ callback).
- MUST enforce per-user monthly spend cap (reject with 402 when exceeded).
- Cost estimates are approximate; use Helicone for accurate billing.
