# DEVOPS PRINCIPLES

## OBJECTIVE
Make every SaaS plan deployable, observable, recoverable, and reproducible from day one.

## HIERARCHY OF DECISIONS

1. Environments (local, preview, staging, production)
2. Secrets management (per environment)
3. CI/CD pipelines (build, test, deploy, rollback)
4. Infrastructure-as-code (declarative config for every cloud resource)
5. Monitoring (logs, metrics, traces, uptime)
6. Alerts (SLO-driven, paging vs ticketing)
7. Backups (frequency, retention, restore drill)
8. Disaster recovery (RTO and RPO targets)

A lower level MUST NEVER bypass a higher level.

## PRINCIPLES

### D1 — Environments are Explicit
Every plan MUST declare exactly four environments: `local`, `preview`, `staging`, `production`.
Each MUST have its own database, its own integration credentials, its own domain.

### D2 — Secrets are Scoped
- No secret may be shared across environments.
- Secrets live in the platform vault (Vercel envs, GitHub Actions secrets), never in source.
- `src/env.ts` validates required secrets at boot.

### D3 — Pipelines are Deterministic
- Build, test, and deploy stages are declared in code.
- Same commit, same pipeline → same artifact.
- No manual steps after merge to main.

### D4 — Infrastructure-as-Code
- Every cloud resource (DNS, CDN rules, queues, caches) is declared in version control.
- Default IaC tool: Terraform (Vercel + database providers + Cloudflare). When the platform is fully managed by Vercel, Vercel project config is the IaC.

### D5 — Observability is Mandatory
- Every request emits a structured log line.
- Every uncaught error reaches the error tracker.
- Every critical user flow emits a metric.
- Every protected route is traced.

### D6 — Alerts are SLO-Driven
- Alerts fire on SLO violation, not on every error.
- Each alert has: a name, an SLO, a runbook link, an escalation policy.
- No alert without a runbook.

### D7 — Backups are Verified
- Backups run on a schedule.
- A restore drill runs at least quarterly.
- Backup retention satisfies compliance (e.g., 30 days for SaaS, 7 years for finance).

### D8 — Disaster Recovery is Declared
- Each plan declares RTO (Recovery Time Objective) and RPO (Recovery Point Objective).
- Default targets: RTO ≤ 1 hour, RPO ≤ 15 minutes.

### D9 — Rollback is a First-Class Action
- Every deploy MUST be reversible to the previous commit in one command.
- Database migrations MUST be backward-compatible for one release.

### D10 — Health is Public
- `/api/health` returns 200 only when all critical dependencies (DB, integrations) are reachable.
- Uptime monitoring polls `/api/health` from at least two regions.

### D11 — On-Call is Defined
- Each plan names an on-call rotation (people or shared inbox), an escalation path, and a paging tool.

### D12 — Cost is Tracked
- The plan declares per-environment cost ceilings and the budget alert threshold.

## DECISION RECORD

Every plan MUST emit `devops.json`:
```json
{
  "environments": ["local","preview","staging","production"],
  "secrets_vault": "vercel|github|aws-secrets-manager",
  "pipelines": {
    "ci": "github_actions",
    "cd": "vercel",
    "stages": ["lint","typecheck","test","build","deploy","smoke"]
  },
  "iac": { "tool": "terraform|vercel_project_config", "modules": ["..."] },
  "monitoring": {
    "logs": "axiom",
    "errors": "sentry",
    "uptime": "vercel_monitoring|betterstack",
    "metrics": "vercel_analytics|posthog"
  },
  "alerts": [{ "name": "...", "slo": "...", "runbook": "..." }],
  "backups": { "schedule": "daily 02:00 UTC", "retention_days": 30, "restore_drill": "quarterly" },
  "dr":      { "rto_minutes": 60, "rpo_minutes": 15 },
  "rollback": { "supported": true, "command": "vercel rollback <deployment-id>" },
  "health":   "/api/health",
  "on_call":  { "rotation": "...", "escalation": "...", "paging_tool": "..." },
  "cost":     { "monthly_ceiling_usd": 0, "alert_threshold_pct": 80 }
}
```
