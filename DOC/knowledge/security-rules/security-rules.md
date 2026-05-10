# SECURITY RULES

## SCOPE
Apply to every route handler, service, integration, environment configuration, and data access pattern in any plan produced by this OS.

## RULE S1 — SECRETS NEVER IN SOURCE
- No secret, API key, token, or password may appear in any source file.
- All secrets come from environment variables validated by `src/env.ts`.
- `NEXT_PUBLIC_` prefix is FORBIDDEN for secrets (browser-exposed).
- Git pre-commit hooks MUST scan for accidental secret leakage.

## RULE S2 — INPUT VALIDATION AT EVERY BOUNDARY
- Every route handler MUST validate request body, query params, and path params with `zod`.
- Validation MUST happen before any business logic or DB access.
- Unknown fields MUST be stripped (`zod` `.strip()` mode).
- Oversized payloads MUST be rejected before parsing (size limit middleware).

## RULE S3 — AUTHENTICATION IS DELEGATED
- Authentication is owned by the auth integration (Clerk by default).
- No feature may implement its own auth, session storage, or password hashing.
- Server-side identity MUST be read from `auth()` or `currentUser()` from the auth SDK.
- Client-supplied user IDs MUST NEVER be trusted for authorization decisions.

## RULE S4 — AUTHORIZATION HAPPENS IN SERVICES
- Route handlers check only authentication (is the user logged in?).
- Services check authorization (is this user allowed to perform this action on this resource?).
- Resource ownership MUST be verified against the DB, not against client-supplied claims.
- Multi-tenant plans MUST scope every query to `org_id` or `user_id`.

## RULE S5 — WEBHOOK SIGNATURES ARE VERIFIED
- Every inbound webhook MUST verify the provider signature before parsing the body.
- Signature verification uses the provider's official library (Svix for Clerk, Stripe's `constructEvent`).
- Return `400` on signature failure, never `401` or `403` (to avoid enumeration).
- Raw body MUST be read before any JSON parsing.

## RULE S6 — NO PII IN LOGS
- Logs MUST NEVER contain: passwords, tokens, full credit card numbers, SSNs, full request bodies with user content.
- Structured log fields are allowlisted; free-form message strings are forbidden.
- Sentry breadcrumbs and extra data MUST be scrubbed of PII before transmission.

## RULE S7 — RATE LIMITING IS MANDATORY ON SENSITIVE ROUTES
Routes that MUST have rate limiting:
- All AI/LLM routes (per-user token budget).
- Sign-in / sign-up endpoints (brute-force prevention — handled by Clerk).
- File upload initiation (per-user quota).
- Any route that triggers an email or notification.

Rate limiting implementation: Upstash Ratelimit (sliding window).

## RULE S8 — SQL / INJECTION PREVENTION
- All DB queries MUST go through the ORM (Prisma) with parameterized inputs.
- Raw SQL (`$queryRaw`) is FORBIDDEN except in reviewed migrations.
- Dynamic query construction from user input is FORBIDDEN.

## RULE S9 — CORS IS CONFIGURED
- APIs consumed only by the same-origin Next.js app do NOT need CORS headers.
- Any route exposed to external clients MUST declare an explicit `Access-Control-Allow-Origin` allowlist.
- Wildcard `*` CORS is FORBIDDEN on authenticated routes.

## RULE S10 — CONTENT SECURITY POLICY
- Every HTML response MUST include a `Content-Security-Policy` header.
- Inline scripts are FORBIDDEN (`unsafe-inline` is disallowed).
- CSP is declared in `next.config.ts` headers configuration.

## RULE S11 — DEPENDENCY AUDIT
- `npm audit` MUST run in CI on every build.
- High or critical severity findings MUST block the pipeline.
- Dependencies MUST be locked with a `package-lock.json` or `pnpm-lock.yaml`.

## RULE S12 — FILE UPLOAD SAFETY
- Uploaded files MUST be scanned for MIME type mismatch (magic bytes vs declared type).
- Uploaded files MUST NOT be served from the same origin as the app (use CDN/UploadThing).
- Executable file types (`.exe`, `.sh`, `.php`, etc.) MUST be blocked at the route level.
- Per-user upload quotas MUST be enforced.

## RULE S13 — SENSITIVE OPERATIONS REQUIRE AUDIT LOGS
Operations that MUST be audit-logged:
- Role or permission changes.
- Billing or subscription changes.
- Admin actions on other users' data.
- Mass data exports.

Audit log fields: `{ action, actor_id, target_id, target_type, occurred_at, ip_hash }`.

## RULE S14 — ENVIRONMENT ISOLATION
- Production data MUST NEVER be copied to local or staging environments.
- Staging uses anonymized or synthetic data only.
- Preview environments share no databases with production.

## OWASP TOP 10 MAPPING

| OWASP Risk | Rule(s) |
|------------|---------|
| A01 Broken Access Control | S3, S4 |
| A02 Cryptographic Failures | S1, S6 |
| A03 Injection | S2, S8 |
| A04 Insecure Design | S3, S4, S7 |
| A05 Security Misconfiguration | S9, S10, S14 |
| A06 Vulnerable Components | S11 |
| A07 Auth & Session Mgmt Failures | S3, S5 |
| A08 Software & Data Integrity | S5 |
| A09 Logging & Monitoring Failures | S6, S13 |
| A10 SSRF | S2 (input validation) |
