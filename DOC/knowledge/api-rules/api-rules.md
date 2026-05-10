# API RULES

## SCOPE
Apply to every route handler, API endpoint, webhook receiver, and server action in any plan produced by this OS.

## RULE A1 — ROUTE HANDLER STRUCTURE
Every route handler MUST follow this exact structure:
```
1. Parse and validate input (zod schema).
2. Authenticate (verify session via auth SDK).
3. Call a service function (no inline business logic).
4. Map result to HTTP response.
5. Catch errors via a central error-to-response helper.
```

Route handlers that contain business logic or DB access directly BLOCK the plan.

## RULE A2 — RESPONSE FORMAT IS CONSISTENT
All JSON API responses MUST follow:
```json
// Success
{ "data": <payload> }
// Error
{ "error": { "code": "SNAKE_CASE_CODE", "message": "Human-readable message" } }
```

Never return raw objects at the top level without a `data` or `error` wrapper.

## RULE A3 — HTTP STATUS CODES ARE CORRECT
| Scenario | Code |
|----------|------|
| Successful read | 200 |
| Successful create | 201 |
| Successful delete with no body | 204 |
| Validation failure | 400 |
| Unauthenticated | 401 |
| Unauthorized (forbidden) | 403 |
| Not found | 404 |
| Conflict (duplicate) | 409 |
| Rate limited | 429 |
| Server error | 500 |

Using `200` for errors is FORBIDDEN.

## RULE A4 — INPUT SCHEMAS ARE TYPED AND REUSED
- Every route's input schema is declared in `src/lib/schemas/<domain>.ts`.
- Schemas are shared between route handlers and service functions (no duplication).
- Schema files export named types derived from zod schemas (`z.infer<typeof schema>`).
- Schemas are versioned in the file name when breaking changes are needed.

## RULE A5 — PAGINATION IS REQUIRED FOR LIST ENDPOINTS
- All endpoints returning multiple items MUST support pagination.
- Default pagination strategy: cursor-based (safer for real-time data).
- Fallback: offset-based for simple read-only admin panels.
- Maximum `limit` per request: 100 rows. Exceeding it returns 400.
- Response MUST include: `{ "data": [...], "nextCursor": "..." }` or `{ "data": [...], "total": N }`.

## RULE A6 — IDEMPOTENCY KEYS FOR MUTATIONS
- All POST/PUT endpoints that trigger external side effects MUST accept an `Idempotency-Key` header when the integration supports it.
- Idempotency keys are stored in Upstash Redis with TTL = 24 hours.
- Duplicate requests with the same key return the cached response without re-executing.

## RULE A7 — SERVER ACTIONS ARE TYPED
- Server Actions MUST be declared in `src/server/actions/<domain>.ts`.
- Server Actions MUST validate input with `zod` before calling services.
- Server Actions MUST NOT be called from API route handlers (they are for form submissions only).
- Server Actions MUST return `{ success: true, data: ... }` or `{ success: false, error: "..." }`.

## RULE A8 — CORS POLICY IS EXPLICIT
- APIs consumed only by the Next.js app itself: no CORS headers needed.
- Public APIs or APIs consumed by external clients: declare explicit `Access-Control-Allow-Origin` allowlist in `next.config.ts`.
- Wildcard CORS (`*`) on authenticated routes is FORBIDDEN.

## RULE A9 — REQUEST SIZE LIMITS
- Default max request body size: 1 MB.
- File upload endpoints: delegated to UploadThing (no large bodies through Next.js).
- Next.js config MUST set `api.bodyParser.sizeLimit` for relevant routes.

## RULE A10 — STREAMING RESPONSES
- AI/LLM completion routes that stream MUST use Vercel AI SDK `StreamingTextResponse` or equivalent.
- Streaming routes MUST set the correct `Content-Type: text/event-stream` header.
- Streaming routes MUST run on the Node.js runtime (not Edge) unless the model provider supports Edge.

## RULE A11 — INTERNAL ROUTE NAMING
| Purpose | Pattern |
|---------|---------|
| Public resource CRUD | `/api/<resource>` |
| Webhook receiver | `/api/webhooks/<provider>` |
| Auth callbacks | `/api/auth/<action>` |
| Background job endpoint | `/api/inngest` |
| Health check | `/api/health` |
| Server-sent events / streaming | `/api/<resource>/stream` |

Non-conforming route names BLOCK the plan.

## RULE A12 — NO RAW ERROR EXPOSURE
- Stack traces MUST NEVER be included in API responses.
- Error responses MUST use the `{ error: { code, message } }` format.
- Internal error details (DB errors, integration errors) are logged server-side only.
- `console.error` in route handlers is FORBIDDEN; use the structured logger.
