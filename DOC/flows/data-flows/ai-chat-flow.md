# DATA FLOW — AI CHAT SYSTEM

## OVERVIEW
End-to-end flow for OpenAI-powered chat with streaming responses, conversation persistence, per-user rate limiting, cost tracking, and long-running completion dispatch via Inngest.

## INTEGRATIONS INVOLVED
- `openai` (primary — completions)
- `database` (conversations, messages, ai_usage tables)
- `upstash` (rate limiting)
- `inngest` (long-running completions, async processing)
- `clerk` (user identity)
- `axiom` (structured logging)

## ENTITIES
- `conversations` (DB: id, user_id, title, model, created_at, updated_at)
- `messages` (DB: id, conversation_id, role, content, created_at)
- `ai_usage` (DB: id, user_id, route, model, prompt_tokens, completion_tokens, cost_cents, occurred_at)

## FLOW: STREAMING CHAT COMPLETION

```
[Browser]
  User submits message in chat UI (useChat hook from Vercel AI SDK)
  POST /api/chat with { conversationId, message, model }
       ↓
[Next.js Route Handler /api/chat — Node.js runtime]
  const { userId } = auth()
  validate input (zod): { conversationId, message (max 4096 chars), model }
       ↓
[Rate Limit Check — Upstash Ratelimit]
  key: "ai_chat:<userId>"
  window: sliding 1 minute, limit: 20 requests
  if exceeded: return 429 { error: "rate_limit_exceeded" } with Retry-After header
       ↓
[services.conversations.addMessage]
  persist user message to messages table
  load conversation history (last N messages within context window)
       ↓
[services.ai.streamCompletion]
  call openai.chat.completions.create({
    model: "gpt-4o",
    messages: [systemPrompt, ...history, { role: "user", content: message }],
    stream: true,
    max_tokens: 2048
  })
       ↓
[Route Handler]
  return new StreamingTextResponse(stream)
       ↓
[Browser — Vercel AI SDK useChat]
  renders tokens as they arrive
  onFinish callback fires with complete message + usage
       ↓
[Browser]
  POST /api/chat/[id]/persist { assistantMessage, usage }
       ↓
[Route Handler /api/chat/[id]/persist]
  services.conversations.addMessage({ role: "assistant", content })
  services.ai.trackUsage({
    userId,
    route: "/api/chat",
    model,
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    costCents: calculateCost(model, usage)
  })
       ↓
[repositories.aiUsage.create]
  inserts row into ai_usage table
       ↓
  axiom.logger.info("ai_completion", { userId, model, tokens, costCents, latencyMs })
```

## FLOW: LONG-RUNNING COMPLETION (INNGEST)

```
[Browser]
  User submits a large-document analysis request
  POST /api/ai/analyze { documentId }
       ↓
[Route Handler]
  authenticate, validate
  emit Inngest event: "ai.analysis_requested" { userId, documentId }
  return 202 { jobId: inngestEventId }
       ↓
[Browser]
  polls GET /api/ai/analyze/<jobId>/status
       ↓
[Inngest Function: analyze-document]
  step.run("load-document") → fetch document from DB
  step.run("chunk") → split into 2000-token chunks
  for each chunk:
    step.run("complete-chunk-<n>") → openai.chat.completions.create(...)
    step.run("persist-<n>") → save partial result
  step.run("aggregate") → merge partial results
  step.run("notify") → emit "ai.analysis_completed" { userId, resultId }
       ↓
[Inngest Function: send-analysis-complete-email]
  services.email.send({ template: "analysis-complete", ... })
```

## FLOW: NEW CONVERSATION

```
[Browser]
  User clicks "New Chat"
  POST /api/conversations
       ↓
[Route Handler]
  authenticate
  services.conversations.create({ userId, title: "New Chat", model: "gpt-4o" })
       ↓
[repositories.conversations.create]
  inserts conversation row
  returns { id, title, createdAt }
       ↓
[Browser]
  navigates to /dashboard/chat/<id>
```

## ENV VARS INVOLVED
- `OPENAI_API_KEY`
- `OPENAI_ORG_ID`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

## CONSTRAINTS
- OPENAI_API_KEY must be server-side only; never exposed to client.
- Per-user rate limit is mandatory on all AI routes.
- Streaming routes must use Node.js runtime (not Edge) unless verified compatible.
- ai_usage table must log every completion with token counts and cost.
- Long completions (> 30s) must use Inngest, not block the request thread.
- Messages must be validated for moderation if user content policy requires it.
