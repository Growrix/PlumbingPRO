# BACKEND RULES

## SCOPE
Apply to every API route, service, repository, and integration handler in any plan produced by this OS.

## RULE B1 — LAYERED STRUCTURE
Backend code MUST be organized in three layers:
1. **Route handlers** under `src/app/api/**/route.ts` — HTTP only, no business logic.
2. **Services** under `src/server/services/*.ts` — orchestration and business logic.
3. **Repositories** under `src/server/repositories/*.ts` — data access only.

Crossing layers (e.g., a route handler querying the DB directly) is FORBIDDEN.

## RULE B2 — VALIDATION AT BOUNDARIES
- Every route handler MUST validate input with `zod`.
- Every webhook MUST verify provider signature before parsing the body.
- Every service function MUST accept typed inputs (no `any`).

## RULE B3 — AUTHENTICATION
- Authentication is delegated to the auth integration (Clerk by default).
- Server helpers (`auth()`, `currentUser()`) are the ONLY way to read identity.
- Client-supplied user IDs MUST NEVER be trusted for authorization.
- Authorization checks MUST happen in services, not in route handlers.

## RULE B4 — INTEGRATIONS ARE ENCAPSULATED
- Each integration has one client in `src/lib/<integration>.ts`.
- Each integration has one service in `src/server/services/<integration>.ts`.
- Route handlers import services, never SDKs.

## RULE B5 — DATABASE ACCESS
- ORM client (`prisma`) is initialized once in `src/server/db/client.ts`.
- All queries go through repositories.
- Repositories return domain types, not raw ORM types when leakage matters.
- Multi-row writes that must be atomic MUST use transactions.

## RULE B6 — WEBHOOKS
Every webhook route MUST:
1. Read the raw body (not the parsed JSON).
2. Verify the signature with the provider's library.
3. Return `400` on signature failure.
4. Be idempotent — the same event delivered twice MUST NOT corrupt state.
5. Persist a log entry per event for auditing.
6. Respond with `2xx` quickly; offload long work.

## RULE B7 — ERROR HANDLING
- Throw typed errors from services (e.g., `NotFoundError`, `UnauthorizedError`).
- Route handlers map errors to HTTP responses in a single helper.
- Never leak stack traces or internal paths to clients.
- Log errors with structured context (`request_id`, `user_id`, `route`).

## RULE B8 — IDEMPOTENCY
- All POST/PUT/PATCH endpoints that trigger external side effects MUST accept an idempotency key when the integration supports it (Stripe).
- Webhook processing MUST be idempotent by event id.

## RULE B9 — ENV VARS
- Every required env var is declared in `src/env.ts` and validated with zod at boot.
- Server-only env vars MUST NOT be prefixed with `NEXT_PUBLIC_`.
- Missing required env vars MUST fail boot, not at request time.

## RULE B10 — RATE LIMITING
- Public unauthenticated endpoints MUST be rate-limited.
- Auth endpoints (sign-in, password reset) MUST be rate-limited per IP and per identifier.
- Limits are declared centrally and applied via middleware.

## RULE B11 — LOGGING
- One structured logger across the app.
- Required fields: `level`, `message`, `request_id`, `user_id`, `route`, `latency_ms`.
- No `console.log` in production code paths.

## RULE B12 — BACKGROUND WORK
- Long-running tasks MUST be moved out of the request lifecycle.
- Default mechanism: external scheduler/queue invoking a route handler with a shared secret.
- The route handler validates the secret, then performs the work.

## RULE B13 — DATA OWNERSHIP
- User identity → owned by the auth integration; mirrored in `users` table.
- Billing state → owned by Stripe; mirrored in `subscriptions` and `invoices` via webhooks.
- Content → owned by the CMS; not duplicated in DB.

## RULE B14 — API CONTRACT
- Every route handler MUST declare an input zod schema and an output type.
- Response shape MUST be `{ ok: true, data }` or `{ ok: false, error }`.
- HTTP status codes MUST match semantics (`400`, `401`, `403`, `404`, `409`, `429`, `5xx`).

## RULE B15 — SCALABILITY BY DEFAULT
- Route handlers and services MUST remain stateless to allow horizontal scaling.
- Expensive operations MUST be queued or offloaded from request-response paths.
- Caching strategy for read-heavy endpoints MUST be declared.

## RULE B16 — RESILIENCE CONTROLS
- External integration calls MUST define timeout behavior and failure mapping.
- Retries are allowed only for idempotent operations and must use bounded attempts.
- Circuit-breaking or graceful degradation MUST be defined for critical upstream outages.

## RULE B17 — WARNING-FREE BACKEND QUALITY
- Backend code MUST pass lint/typecheck/test with zero warnings.
- Any warning in backend-owned files is a blocking failure.

## OUTPUT CONTRACT
Every backend plan MUST emit:
```yaml
routes:
  - path: /api/billing/checkout
    method: POST
    input_schema: CreateCheckoutInput
    auth: required
    service: billing.createCheckoutSession
    rate_limit: 30/min/user
services:
  - name: billing
    file: src/server/services/billing.ts
    depends_on: [stripe_lib, users_repo, subscriptions_repo]
repositories:
  - name: subscriptions
    file: src/server/repositories/subscriptions.ts
    aggregate: subscription
```
