# SECURITY CONSTRAINTS

## PURPOSE
Hard security rules that enforce the OWASP Top 10 and defense-in-depth principles. Applied by the reviewer agent in addition to the core constraints (C1–C20).

---

## SC1 — NO PLAINTEXT SECRETS IN SOURCE
**Rule:** No source file, config file, or committed env file may contain a literal secret, API key, token, password, or signing key.
**Detection:** Static scan of all planned files for patterns matching known secret formats. `git-secrets` or `truffleHog` must run in CI.
**Failure:** `BLOCK SC1: secret detected in <file>:<line>`.

## SC2 — AUTH TOKEN NOT IN LOGS OR ERRORS
**Rule:** Auth tokens, session cookies, and bearer tokens MUST NEVER appear in log lines, Sentry events, or API error responses.
**Detection:** Audit logger module configuration; audit Sentry `beforeSend` scrubber.
**Failure:** `BLOCK SC2: auth token may leak via <logger|sentry> in <file>`.

## SC3 — WEBHOOK SIGNATURE REQUIRED ON ALL INBOUND WEBHOOKS
**Rule:** Every inbound webhook route MUST verify the provider signature. Routes without signature verification MUST NOT exist.
**Detection:** Review every `/api/webhooks/<provider>/route.ts` for presence of signature verification call.
**Failure:** `BLOCK SC3: webhook <route> missing signature verification`.

## SC4 — RATE LIMIT ON ALL LLM ROUTES
**Rule:** Every route that calls an AI/LLM API MUST have per-user rate limiting via Upstash Ratelimit. No exceptions.
**Detection:** Cross-reference plan's AI routes against rate-limit helper declarations.
**Failure:** `BLOCK SC4: AI route <route> missing per-user rate limit`.

## SC5 — SERVER SDKS NOT IN CLIENT COMPONENTS
**Rule:** Packages that are server-only (Stripe Node SDK, Prisma, Resend, OpenAI, UploadThing server, Axiom, Inngest server, Meilisearch admin) MUST NOT be imported in any file under `src/app/` that uses `"use client"`.
**Detection:** Import graph analysis from plan's folder structure.
**Failure:** `BLOCK SC5: server-only SDK <package> imported in client component <file>`.

## SC6 — FILE UPLOAD MIME VALIDATION
**Rule:** Every file upload route MUST declare an explicit allowed MIME type list. Omitting the MIME constraint or using a wildcard MIME is FORBIDDEN.
**Detection:** Review UploadThing file router definition for each route's `fileTypes`.
**Failure:** `BLOCK SC6: upload route <route> missing MIME type constraint`.

## SC7 — TENANT SCOPE IN EVERY QUERY
**Rule:** In multi-tenant apps, every repository method that reads or writes data MUST include `userId` or `orgId` in the WHERE clause. Queries without a tenant scope are FORBIDDEN except in verified admin-only services.
**Detection:** Review all repository method signatures and query bodies.
**Failure:** `BLOCK SC7: repository <method> missing tenant scope`.

## SC8 — CSP HEADER DECLARED
**Rule:** `next.config.ts` MUST declare a `Content-Security-Policy` header for all HTML responses. The policy MUST NOT include `unsafe-inline` in `script-src`.
**Detection:** Review `next.config.ts` headers configuration.
**Failure:** `BLOCK SC8: CSP header missing or contains unsafe-inline`.

## SC9 — CORS ALLOWLIST EXPLICIT
**Rule:** Any route exposed to external origins MUST declare an explicit `Access-Control-Allow-Origin` allowlist. Wildcard `*` CORS on authenticated routes is FORBIDDEN.
**Detection:** Review CORS configuration for all public API routes.
**Failure:** `BLOCK SC9: wildcard CORS on authenticated route <route>`.

## SC10 — AUDIT LOG FOR SENSITIVE OPERATIONS
**Rule:** The following operation classes MUST produce an audit log entry: role changes, billing changes, admin actions on user data, mass data exports.
**Detection:** Cross-reference plan's admin and billing flows against audit log service.
**Failure:** `BLOCK SC10: <operation> in <service> missing audit log`.

## SC11 — INPUT SIZE LIMITS ON ALL ROUTES
**Rule:** Every route handler MUST either use the default body size limit (1 MB) or declare an explicit smaller limit. Routes that accept large payloads MUST delegate to UploadThing (files) or Inngest (jobs) — never accept large bodies directly.
**Detection:** Review route handler configurations and body parsing settings.
**Failure:** `BLOCK SC11: route <route> has unbounded input size`.

## SC12 — DEPENDENCY AUDIT IN CI
**Rule:** `npm audit --audit-level=high` (or `pnpm audit`) MUST run in CI and block the pipeline on HIGH or CRITICAL findings.
**Detection:** Review `.github/workflows/ci.yml` for audit step.
**Failure:** `BLOCK SC12: dependency audit step missing from CI pipeline`.

## ENFORCEMENT
Security constraints SC1–SC12 are evaluated by the reviewer agent after core constraints C1–C20.
Failures are included in `validation_report.json` under the `security_constraints` key.
Any SC failure blocks the pipeline with the same severity as a core constraint failure.
