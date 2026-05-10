# SECURITY PRINCIPLES

## OBJECTIVE
Make every SaaS plan secure-by-default. Treat every input as hostile, every secret as leaked-tomorrow, every dependency as compromised-someday.

## HIERARCHY OF CONTROLS

1. Identity (auth integration owns)
2. Authorization (server-side, never client-supplied)
3. Input validation (zod at every boundary)
4. Output encoding (no raw HTML, no SQL string concat)
5. Transport (HTTPS only, HSTS preload)
6. Secrets (vaulted, scoped, rotated)
7. Auditability (who did what, when, from where)
8. Compliance (GDPR / SOC 2 / PCI as applicable)

## PRINCIPLES

### S1 — Authenticate at the Edge, Authorize at the Service
- Auth integration validates the session.
- Authorization checks happen in services, never in route handlers.
- Authorization MUST receive the resolved server-side `userId`/`orgId` and the resource.

### S2 — Validate Every Input
- Every route handler validates with zod before passing to a service.
- Every webhook validates the provider signature before parsing the body.
- Every Server Action validates input.
- Numeric inputs are bounded; string inputs are length-limited.

### S3 — Encode Every Output
- HTML rendering uses React's escaping; never `dangerouslySetInnerHTML` without explicit allowlist.
- Database queries use parameterized statements (Prisma is parameterized by default).
- Logs MUST NOT include passwords, tokens, full PAN, or session cookies.

### S4 — Secrets are Never in Code
- All secrets via env vars, validated by `src/env.ts`.
- Pre-commit secret scanning (gitleaks) MUST run in CI.
- Secrets rotate quarterly or on suspected leak.

### S5 — Headers and Transport
Every response MUST set:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy:` strict allowlist of script/style/img origins
- `X-Frame-Options: DENY` (or CSP `frame-ancestors`)

### S6 — CORS is Explicit
- Public APIs declare allowed origins, methods, headers.
- No wildcard origins for authenticated endpoints.
- Preflight responses MUST be cacheable (`Access-Control-Max-Age`).

### S7 — Rate Limit Everywhere
- Auth endpoints: per-IP and per-identifier.
- Public APIs: per-IP.
- Authenticated APIs: per-user.
- Webhooks: trust the provider but cap to provider's known event volume.

### S8 — Audit Log Immutable Writes
- Every privileged action emits an audit log entry: actor, action, target, timestamp, request_id, result.
- Audit logs are append-only.

### S9 — Dependencies are Pinned and Scanned
- Lockfile committed.
- Dependabot or Renovate enabled.
- CI fails on `pnpm audit` high-severity findings.

### S10 — Webhooks are Verified and Idempotent
- Provider signature verified before parsing.
- Event id persisted; duplicates ignored.
- Same handler invoked twice → same end state.

### S11 — PII is Minimized
- Collect only what is needed.
- Tag PII fields in DB schema.
- Provide deletion paths to satisfy data-subject requests.

### S12 — Production is Different
- Test data never reaches production.
- Production access requires MFA and audit.
- No `console.log`, no debug endpoints, no sample users.

### S13 — Compliance is a Feature
- If GDPR applies: data export, data deletion, data processor agreements, EU region option.
- If SOC 2 applies: access reviews, change management, vulnerability management, incident response.
- If PCI applies: never store PAN; rely on Stripe Elements / Checkout.

## DECISION RECORD

Every plan MUST emit `security.json`:
```json
{
  "headers": { "csp": "...", "hsts": "...", "frame_ancestors": "self", "permissions_policy": "..." },
  "cors":    { "origins": ["..."], "methods": ["..."], "headers": ["..."], "credentials": true },
  "rate_limits": [{ "scope": "ip|user", "route": "...", "limit": "..." }],
  "audit_log_table": "audit_logs",
  "secret_scanning": "gitleaks",
  "dependency_scanning": "pnpm-audit + dependabot",
  "compliance": ["gdpr","soc2"],
  "pii_fields": [{ "table": "...", "field": "...", "category": "email|name|address|payment" }]
}
```
