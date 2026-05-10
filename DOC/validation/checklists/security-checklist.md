# SECURITY CHECKLIST

## PURPOSE
Run this checklist at the end of the planning phase and again during code review. Every item MUST be confirmed before a plan or PR is approved.

## SECRETS AND ENV VARS
- [ ] No secret, API key, or token is hardcoded in any source file.
- [ ] No secret is prefixed with `NEXT_PUBLIC_` (would be exposed to the browser).
- [ ] `src/env.ts` validates all required env vars with `zod` at boot.
- [ ] `.env.example` contains only placeholder values, no real secrets.
- [ ] `.env` files are in `.gitignore` and will never be committed.
- [ ] CI secrets are stored in GitHub Actions secrets or Vercel environment variables.

## AUTHENTICATION AND AUTHORIZATION
- [ ] All protected routes have auth checks via Clerk middleware or `auth()` helper.
- [ ] No feature implements its own auth, password storage, or session management.
- [ ] Client-supplied user IDs are never trusted for authorization decisions.
- [ ] Authorization (ownership checks) happens in services, not route handlers.
- [ ] Multi-tenant plans scope every DB query to `org_id` or `user_id`.
- [ ] Admin-only endpoints are gated by role check in service layer.

## INPUT VALIDATION
- [ ] Every route handler validates request body, query params, and path params with `zod`.
- [ ] `zod` schemas use `.strip()` mode to remove unknown fields.
- [ ] Request size limits are configured (default: 1 MB body limit).
- [ ] File upload routes validate MIME type and file size per route definition.

## WEBHOOKS
- [ ] Every webhook handler verifies the provider signature before parsing.
- [ ] Signature verification uses the provider's official library.
- [ ] Webhook handlers return `400` (not `401`/`403`) on signature failure.
- [ ] Every webhook handler is idempotent by event ID.
- [ ] Raw body is read before any JSON parsing in webhook routes.

## DATA PROTECTION
- [ ] No PII (passwords, SSNs, full card numbers) is stored in the application DB.
- [ ] Auth and billing state are delegated to Clerk and Stripe respectively.
- [ ] Logs never contain PII, secrets, or full request bodies.
- [ ] Sentry breadcrumbs and extra data are scrubbed of PII.
- [ ] Uploaded files are served from UploadThing CDN, not from the app origin.

## RATE LIMITING
- [ ] All AI/LLM routes have per-user rate limits (Upstash Ratelimit).
- [ ] File upload initiation routes have per-user quota enforcement.
- [ ] Email-triggering routes have rate limits to prevent spam abuse.
- [ ] Rate limit rejections return `429` with a `Retry-After` header.

## INJECTION PREVENTION
- [ ] All DB queries go through the ORM (Prisma) with parameterized inputs.
- [ ] No raw SQL with user input in production code.
- [ ] Dynamic query construction from user input is absent.
- [ ] XSS prevention: React escapes all user content by default; no `dangerouslySetInnerHTML` with unsanitized input.

## HEADERS AND TRANSPORT
- [ ] `Content-Security-Policy` header declared in `next.config.ts`.
- [ ] No `unsafe-inline` in the CSP script-src directive.
- [ ] `X-Frame-Options: DENY` or `frame-ancestors 'none'` CSP directive.
- [ ] CORS allowlist is explicit for any public API; no wildcard on authenticated routes.
- [ ] HTTPS enforced in all environments (Vercel provides this by default).

## DEPENDENCIES
- [ ] `npm audit` ran in CI — no HIGH or CRITICAL findings unaddressed.
- [ ] `package-lock.json` or `pnpm-lock.yaml` committed and up to date.
- [ ] No packages with known active CVEs in the dependency tree.

## AUDIT LOGGING
- [ ] Role/permission changes produce an audit log entry.
- [ ] Billing changes (subscription starts/cancels) produce an audit log entry.
- [ ] Admin actions on user data produce an audit log entry.
- [ ] Audit log fields: `action`, `actor_id`, `target_id`, `target_type`, `occurred_at`, `ip_hash`.

## OUTPUT
All items confirmed → security review PASSED.
Any item failing → security review BLOCKED; document each failure with file/line reference.
