# Spec Template — DevOps System

Emitted by `devops_planner` to `docs/ops/devops-system.md` (human) and `docs/ops/devops.json` (machine).

This is the deterministic shape of the operational layer. Every key is required unless explicitly marked optional. Codegen consumes the JSON to scaffold CI/CD workflows, env files, and IaC.

## File frontmatter (devops-system.md)

```yaml
---
document_type: devops-system
project_name: <slug>
build_stage: 5-operations
depends_on:
  - brief.json
  - plan.json
  - master-ui-architecture.md
recommended_next_reads:
  - testing.json
  - security.json
  - performance.json
---
```

## Required sections (in order)

### 1. Environments
Four environments, each with isolated DB, integration credentials, and domain.

```yaml
environments:
  - { name: local,      domain: localhost:3000,      database: local_postgres,      branch_strategy: feature/* }
  - { name: preview,    domain: "*.<host>.app",      database: branched_database,   branch_strategy: pull_request }
  - { name: staging,    domain: staging.<domain>,    database: staging_postgres,    branch_strategy: main → staging }
  - { name: production, domain: <domain>,            database: production_postgres, branch_strategy: tagged_release }
```

### 2. Secrets
- Vault declared (e.g., Vercel, GitHub Actions, AWS Secrets Manager).
- Every env var listed with scope (`server` / `public`) AND environment binding.
- Forbid sharing the same secret value across environments.

```yaml
secrets:
  vault: vercel
  scopes:
    - { name: STRIPE_SECRET_KEY,                  scope: server, environments: [preview, staging, production] }
    - { name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, scope: public, environments: [preview, staging, production] }
    # ... aggregated from backend_planner.env_boot.vars + integration-rules
```

### 3. CI Pipelines
GitHub Actions (default). Each workflow declares a file path + ordered stages.

```yaml
ci:
  provider: github_actions
  workflows:
    - file: .github/workflows/ci.yml
      stages: [install, lint, typecheck, unit, integration, build, secret_scan, dep_scan]
    - file: .github/workflows/e2e.yml
      stages: [install, e2e_against_preview]
    - file: .github/workflows/migrations.yml
      stages: [install, prisma_migrate_deploy]
```

### 4. CD Pipeline
- Provider (Vercel by default).
- Promotion path (preview → staging → production).
- Rollback command.
- Required gates per promotion.

```yaml
cd:
  provider: vercel
  promotion: [preview, staging, production]
  promotion_gates:
    preview:    [ci_green]
    staging:    [ci_green, e2e_green, migrations_applied]
    production: [staging_green, smoke_green, manual_approval]
  rollback_command: "vercel rollback <deployment-id>"
```

### 5. Infrastructure as Code
- Tool (Terraform | Vercel project config | mixed).
- Modules declared.

```yaml
iac:
  tool: vercel_project_config
  modules:
    - { name: vercel_project,    declared_in: vercel.json + dashboard }
    - { name: dns,               declared_in: terraform/dns.tf, optional: true }
    - { name: managed_postgres,  declared_in: provider_dashboard }
    - { name: cdn,               declared_in: vercel_default }
```

### 6. Monitoring
Logs, errors, uptime, metrics — each with provider + how it ingests.

```yaml
monitoring:
  logs:    { provider: axiom,         ingestion: pino_to_axiom }
  errors:  { provider: sentry,        client: "@sentry/nextjs" }
  uptime:  { provider: betterstack,   probes: ["/api/health"] }
  metrics: { provider: posthog }
```

### 7. Alerts
Every alert MUST cite an SLO and a runbook path. No alert without a runbook.

```yaml
alerts:
  - { name: error_rate_high,    slo: "error_rate < 1% over 5m",                  runbook: docs/runbooks/alerts/error-rate.md }
  - { name: webhook_failure,    slo: "webhook_success_rate >= 99% over 15m",    runbook: docs/runbooks/alerts/webhook-failure.md }
  - { name: db_latency,         slo: "p95_query_ms < 200",                      runbook: docs/runbooks/alerts/db-latency.md }
  - { name: lcp_regression,     slo: "p75_LCP <= 2500ms",                       runbook: docs/runbooks/alerts/lcp-regression.md }
```

### 8. Backups
- Schedule (cron).
- Retention days.
- Restore drill cadence.

```yaml
backups:
  database: { schedule: "0 2 * * *", retention_days: 30, restore_drill: quarterly }
  cms:      { schedule: managed_by_provider, retention_days: 30, restore_drill: annual }
```

### 9. Disaster Recovery
- RTO (recovery time objective).
- RPO (recovery point objective).

```yaml
dr:
  rto_minutes: 60
  rpo_minutes: 15
```

### 10. Health
Endpoint + the dependencies it checks.

```yaml
health:
  endpoint: /api/health
  checks: [database, stripe, clerk, resend, sanity]
```

### 11. On-Call
- Rotation source (rotation tool, shared inbox, named individuals).
- Escalation path.
- Paging tool.

```yaml
on_call:
  rotation: shared_inbox_or_pagerduty
  escalation: [primary, secondary, engineering_lead]
  paging_tool: pagerduty
```

### 12. Cost
Monthly ceiling and budget alert threshold per environment.

```yaml
cost:
  monthly_ceiling_usd: 250
  alert_threshold_pct: 80
  per_environment:
    preview:    { ceiling_usd: 25 }
    staging:    { ceiling_usd: 75 }
    production: { ceiling_usd: 150 }
```

## devops.json (machine-readable)

A flat JSON whose keys mirror the YAML above. Codegen scaffolds:
- `.github/workflows/ci.yml`, `e2e.yml`, `migrations.yml`
- `vercel.json`
- `ENV.example`
- `docs/runbooks/alerts/*.md` stubs (filled in by `runbook_writer`)
- `src/app/api/health/route.ts`

## Reviewer checks
- Every env var from `backend_planner.env_boot.vars` appears in `secrets.scopes`.
- Every integration appears in `monitoring` (logs or errors).
- Every alert has a runbook path.
- Health endpoint covers every critical dependency.
- RTO/RPO declared.
- Rollback command declared.
- Cost ceilings declared per environment.
