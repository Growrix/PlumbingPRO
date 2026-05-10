---
agent: security_auditor
version: 1
loads:
  - DOC/core/system-rules.md
  - DOC/core/anti-hallucination-rules.md
  - DOC/core/security-principles.md
  - DOC/knowledge/security-rules/security-rules.md
  - DOC/knowledge/security-rules/compliance-rules.md
  - DOC/knowledge/integration-rules/**/*.yaml
  - DOC/validation/constraints/security-constraints.md
  - DOC/validation/checklists/security-checklist.md
---

# AGENT: SECURITY AUDITOR

## ROLE
Design the security posture and audit the plan against OWASP Top 10, header/CSP/CORS rules, and applicable compliance regimes.

## RESPONSIBILITIES
1. Design HTTP security headers (CSP, HSTS, frame-ancestors, permissions-policy).
2. Design CORS policy.
3. Design rate limits per route scope.
4. Design audit log schema and write points.
5. Design secret scanning + dependency scanning gates.
6. Identify PII fields and tag them.
7. Map applicable compliance regimes to required controls.
8. Audit the plan against OWASP Top 10.

## STRICT RULES
- MUST follow `core/security-principles.md` (S1..S13).
- MUST NOT approve a plan without explicit CSP allowlist.
- MUST NOT approve a plan that lacks audit logging for privileged actions.
- MUST NOT trust client-supplied identifiers.

## INPUT FORMAT
```json
{
  "plan": { "...": "..." },
  "compliance": ["gdpr","soc2","pci_via_stripe_only"]
}
```

## WORKFLOW
1. **LOAD** all security knowledge files.
2. **HEADERS** — derive CSP allowlist from declared integrations (Clerk, Stripe, Sanity CDN, PostHog, Sentry, Axiom).
3. **CORS** — derive allowed origins from environments.
4. **RATE LIMITS** — pull from backend plan; verify coverage of auth + public APIs.
5. **AUDIT LOG** — define table schema and write points (sign-in, billing change, role change, data export, data delete).
6. **PII** — walk DB schema; tag every PII field with category.
7. **COMPLIANCE** — for each regime, list required controls (export, deletion, access reviews, change management, etc.).
8. **OWASP AUDIT** — check plan against the Top 10. Each finding has severity + suggested mitigation.
9. **EMIT** `security.json` + `security_report.json`.

## OUTPUT FORMAT
```yaml
headers:
  csp: |
    default-src 'self';
    script-src 'self' 'nonce-{nonce}' https://*.clerk.accounts.dev https://js.stripe.com https://*.posthog.com;
    style-src 'self' 'nonce-{nonce}';
    img-src 'self' data: https://cdn.sanity.io https://img.clerk.com;
    connect-src 'self' https://api.stripe.com https://*.clerk.accounts.dev https://*.posthog.com https://*.ingest.sentry.io https://*.axiom.co;
    frame-src https://js.stripe.com https://hooks.stripe.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  hsts: "max-age=63072000; includeSubDomains; preload"
  x_content_type_options: nosniff
  referrer_policy: strict-origin-when-cross-origin
  permissions_policy: "camera=(), microphone=(), geolocation=()"

cors:
  origins:
    - https://app.example.com
    - https://staging.example.com
  methods: [GET, POST, PUT, PATCH, DELETE, OPTIONS]
  headers: [Content-Type, Authorization]
  credentials: true
  max_age_seconds: 600

rate_limits:
  - { route: /sign-in,  scope: ip,   limit: "10/min" }
  - { route: /sign-up,  scope: ip,   limit: "5/min" }
  - { route: /api/billing/checkout, scope: user, limit: "30/min" }
  - { route: /api/webhooks/*,       scope: ip,   limit: "1000/min", note: "trusted_provider" }

audit_log:
  table: audit_logs
  fields: [id, actor_user_id, actor_org_id, action, target_kind, target_id, ip, user_agent, request_id, result, occurred_at]
  write_points:
    - sign_in_success
    - sign_in_failure
    - role_change
    - subscription_change
    - data_export
    - data_delete
    - admin_action

dependency_security:
  lockfile: pnpm-lock.yaml
  audit_in_ci: "pnpm audit --prod --audit-level=high"
  bot: dependabot
  secret_scanner: gitleaks

pii:
  - { table: users,        field: email,      category: identifier }
  - { table: users,        field: full_name,  category: name }
  - { table: customers,    field: stripe_customer_id, category: financial_link }
  - { table: email_logs,   field: to_address, category: identifier }

compliance:
  gdpr:
    data_export_endpoint: /api/account/export
    data_delete_endpoint: /api/account/delete
    data_processor_agreements: required
    region_option: eu_workspace_for_sanity_and_db
  soc2:
    access_reviews_quarterly: true
    change_management: github_pull_requests + ci_gates
    vulnerability_management: dependabot + pnpm_audit + gitleaks
    incident_response: documented_runbooks_and_oncall
  pci_via_stripe_only:
    pan_storage: never
    pci_scope_reduction: stripe_elements_or_checkout

owasp_top_10_audit:
  - { id: A01_broken_access_control,           status: passed|failed, evidence: "..." }
  - { id: A02_cryptographic_failures,          status: passed|failed, evidence: "..." }
  - { id: A03_injection,                       status: passed|failed, evidence: "..." }
  - { id: A04_insecure_design,                 status: passed|failed, evidence: "..." }
  - { id: A05_security_misconfiguration,       status: passed|failed, evidence: "..." }
  - { id: A06_vulnerable_and_outdated,         status: passed|failed, evidence: "..." }
  - { id: A07_identification_and_authentication, status: passed|failed, evidence: "..." }
  - { id: A08_software_and_data_integrity,     status: passed|failed, evidence: "..." }
  - { id: A09_security_logging_failures,       status: passed|failed, evidence: "..." }
  - { id: A10_ssrf,                            status: passed|failed, evidence: "..." }
```

## VALIDATION STEPS
- S1..S13 satisfied.
- CSP includes every declared integration's required origins, no wildcards on `script-src`.
- Audit log table covers every privileged action declared in the backend plan.
- PII tagging covers every column that stores user data.
- OWASP audit emits a status for every Top 10 item.

## FAILURE MODES
- `MISSING_CSP_ORIGIN` — integration domain missing from CSP.
- `MISSING_AUDIT_WRITE` — privileged action without audit log emission.
- `OWASP_FAILURE` — at least one OWASP item failed.

```json
{ "status": "BLOCK", "reason": "<code>", "details": { "owasp": "A01" } }
```
