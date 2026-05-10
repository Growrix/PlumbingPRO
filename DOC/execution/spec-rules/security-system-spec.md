# Spec Template — Security System

Emitted by `security_auditor` to:
- `docs/security/security-system.md` (human narrative)
- `docs/security/security.json` (machine-readable plan)
- `docs/security/security_report.json` (machine-readable audit)

## File frontmatter

```yaml
---
document_type: security-system
project_name: <slug>
build_stage: 5-security
depends_on:
  - brief.json
  - plan.json
  - backend.spec
  - frontend.spec
  - devops-system.md
recommended_next_reads:
  - testing-system.md
  - performance-system.md
---
```

## Required sections

### 1. Headers
Strict CSP allowlist derived from declared integrations only. No wildcards on script-src.

```yaml
headers:
  csp: |
    default-src 'self';
    script-src 'self' 'nonce-{nonce}' <integration domains>;
    style-src 'self' 'nonce-{nonce}';
    img-src 'self' data: <integration domains>;
    connect-src 'self' <integration domains>;
    frame-src <payment domains>;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  hsts: "max-age=63072000; includeSubDomains; preload"
  x_content_type_options: nosniff
  referrer_policy: strict-origin-when-cross-origin
  permissions_policy: "camera=(), microphone=(), geolocation=()"
```

### 2. CORS
```yaml
cors:
  origins: [https://<domain>, https://staging.<domain>]
  methods: [GET, POST, PUT, PATCH, DELETE, OPTIONS]
  headers: [Content-Type, Authorization]
  credentials: true
  max_age_seconds: 600
```

### 3. Rate Limits
Pulled from backend plan; verified for coverage of auth + public APIs.

```yaml
rate_limits:
  - { route: /sign-in,                scope: ip,   limit: "10/min" }
  - { route: /sign-up,                scope: ip,   limit: "5/min" }
  - { route: /api/billing/checkout,   scope: user, limit: "30/min" }
  - { route: /api/webhooks/*,         scope: ip,   limit: "1000/min", note: trusted_provider }
```

### 4. Audit Log
```yaml
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
```

### 5. Dependency + Secret Scanning
```yaml
dependency_security:
  lockfile: pnpm-lock.yaml
  audit_in_ci: "pnpm audit --prod --audit-level=high"
  bot: dependabot
  secret_scanner: gitleaks
  cadence:
    audit:        every_pr
    secret_scan:  every_pr
    bot_updates:  weekly
```

### 6. PII Tagging
Walk DB schema; tag every column that stores user data.

```yaml
pii:
  - { table: users,       field: email,             category: identifier }
  - { table: users,       field: full_name,         category: name }
  - { table: customers,   field: stripe_customer_id, category: financial_link }
  - { table: email_logs,  field: to_address,        category: identifier }
```

### 7. Compliance Posture
Per regime declared in the brief:

```yaml
compliance:
  gdpr:
    data_export_endpoint: /api/account/export
    data_delete_endpoint: /api/account/delete
    cookie_consent: required
    region_option: eu_workspace_for_sanity_and_db
  soc2:
    access_reviews_quarterly: true
    change_management: github_pull_requests + ci_gates
    vulnerability_management: dependabot + pnpm_audit + gitleaks
    incident_response: documented_runbooks_and_oncall
  pci_via_stripe_only:
    pan_storage: never
    pci_scope_reduction: stripe_elements_or_checkout
```

### 8. OWASP Top 10 Audit
Status per item with evidence.

```yaml
owasp_top_10_audit:
  - { id: A01_broken_access_control,             status: passed|failed, evidence: "..." }
  - { id: A02_cryptographic_failures,            status: passed|failed, evidence: "..." }
  - { id: A03_injection,                         status: passed|failed, evidence: "..." }
  - { id: A04_insecure_design,                   status: passed|failed, evidence: "..." }
  - { id: A05_security_misconfiguration,         status: passed|failed, evidence: "..." }
  - { id: A06_vulnerable_and_outdated,           status: passed|failed, evidence: "..." }
  - { id: A07_identification_and_authentication, status: passed|failed, evidence: "..." }
  - { id: A08_software_and_data_integrity,       status: passed|failed, evidence: "..." }
  - { id: A09_security_logging_failures,         status: passed|failed, evidence: "..." }
  - { id: A10_ssrf,                              status: passed|failed, evidence: "..." }
```

### 9. Webhook Verification
Every webhook from backend plan listed with its signature header + secret env var.

```yaml
webhooks_verified:
  - { route: /api/webhooks/stripe, signature_header: stripe-signature,  secret_env: STRIPE_WEBHOOK_SECRET,         idempotency_key: event.id }
  - { route: /api/webhooks/clerk,  signature_header: svix-signature,    secret_env: CLERK_WEBHOOK_SIGNING_SECRET,  idempotency_key: event.id }
```

### 10. Auth Posture
```yaml
auth_posture:
  provider: clerk
  server_helper_only: true
  client_supplied_user_id_trusted: false
  authorization_in_services: true
  middleware_public_routes_explicit: true
```

## security.json (machine-readable plan)
Mirrors the YAML above as a flat JSON.

## security_report.json (machine-readable audit)
Includes the OWASP audit + per-control pass/fail with evidence:
```json
{
  "owasp": [{ "id": "A01", "status": "passed", "evidence": "..." }],
  "headers":   { "status": "passed", "violations": [] },
  "cors":      { "status": "passed", "violations": [] },
  "rate_limits": { "status": "passed", "violations": [] },
  "audit_log": { "status": "passed", "violations": [] },
  "pii":       { "status": "passed", "violations": [] },
  "compliance":{ "status": "passed", "violations": [] },
  "webhook_verification": { "status": "passed", "violations": [] },
  "overall": "passed"
}
```

## Reviewer checks
- CSP includes every declared integration's required origins; no wildcards on script-src.
- Audit log covers every privileged action declared in the backend plan.
- PII tagging covers every user-data column.
- Every webhook has signature + idempotency declared.
- OWASP audit emits a status for every Top 10 item.
- Compliance posture matches the brief's `compliance` field.
