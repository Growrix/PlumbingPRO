# DEVOPS RULES

## SCOPE
Apply to every deployment pipeline, infrastructure declaration, environment configuration, and operational runbook in any plan produced by this OS.

## RULE DO1 — ENVIRONMENTS ARE MANDATORY
Every plan MUST declare exactly four environments: `local`, `preview`, `staging`, `production`.
Each environment MUST have:
- Its own set of secrets (no cross-environment sharing).
- Its own database instance.
- Its own integration credentials (Clerk app, Stripe account, etc.).
- Its own deployment domain.

## RULE DO2 — SECRETS VAULT
- All secrets live in the platform vault (Vercel environment variables or GitHub Actions secrets).
- Secrets MUST NEVER appear in source code, `.env` files committed to VCS, or logs.
- `src/env.ts` MUST validate every required secret at boot using `zod`.
- Missing required secrets MUST fail boot immediately, not at request time.

## RULE DO3 — CI/CD IS DECLARATIVE
- The full pipeline (lint → typecheck → test → build → deploy) MUST be declared in a `.github/workflows/` file or equivalent.
- No manual deployment steps after merge to main.
- Same commit hash MUST produce the same artifact on every run.
- Failed pipeline stages MUST block the deploy.

## RULE DO4 — DATABASE MIGRATIONS ARE CONTROLLED
- All schema changes are managed by the ORM migration system (e.g., Prisma migrate).
- Migrations MUST be backward-compatible for at least one release (no instant drops or renames).
- Migration files MUST be committed to VCS and reviewed before apply.
- Production migrations run in CI, never manually from a developer machine.

## RULE DO5 — HEALTH ENDPOINT IS REQUIRED
- Every deployed app MUST expose `GET /api/health`.
- The endpoint MUST verify DB connectivity and return `{ status: "ok" }` with HTTP 200 only when all dependencies are reachable.
- Uptime monitoring (e.g., Vercel, Better Uptime) MUST poll this endpoint from at least two regions.
- A failing health check MUST trigger a P1 alert.

## RULE DO6 — ROLLBACK IS FIRST-CLASS
- Every deploy MUST be reversible to the previous version in one command or one click.
- Rollback procedure MUST be documented in the deployment runbook.
- Database migrations MUST support rollback or have a companion down-migration.

## RULE DO7 — OBSERVABILITY IS NON-NEGOTIABLE
Every production request MUST:
1. Emit a structured log line (via Axiom or equivalent) with: `request_id`, `method`, `route`, `status`, `latency_ms`, `user_id`.
2. Propagate a `request_id` through all downstream calls.
3. Capture any uncaught error in the error tracker (Sentry).
4. Record critical user-flow events in the analytics tool (PostHog).

## RULE DO8 — ALERTS ARE SLO-DRIVEN
- Alerts MUST fire on SLO violations, NOT on every individual error.
- Every alert MUST have: a name, an SLO threshold, a runbook link, an escalation policy.
- Runbooks MUST exist before alerts are created.
- Paging alerts (P1/P2) are distinct from ticketing alerts (P3/P4).

## RULE DO9 — COST IS TRACKED
- The plan MUST declare per-environment cost ceilings.
- Budget alerts MUST be configured in all cloud provider dashboards.
- AI-related routes (OpenAI) MUST have per-user rate limits to prevent runaway spend.
- Token/credit usage MUST be logged to `ai_usage` table.

## RULE DO10 — DISASTER RECOVERY IS DECLARED
- Each plan declares RTO (Recovery Time Objective) and RPO (Recovery Point Objective).
- Default targets: RTO ≤ 1 hour, RPO ≤ 15 minutes.
- Database backups MUST run on a daily schedule with 30-day retention minimum.
- A restore drill MUST be scheduled quarterly.

## RULE DO11 — PREVIEW DEPLOYS ARE REQUIRED
- Every pull request MUST trigger an isolated preview deployment.
- Preview environments share NO data with production.
- Preview environments use Stripe test mode and Clerk development instance.

## RULE DO12 — INFRASTRUCTURE IS CODE
- Every cloud resource (DNS records, CDN rules, queue configs) MUST be declared in version control.
- Manual console changes are forbidden in staging and production.
- Default IaC approach: Vercel project config for frontend/functions; Terraform or provider-native config for databases and external services.

## RULE DO13 — ZERO-WARNING DELIVERY GATE
- CI MUST enforce zero warnings on lint/type/build/test quality stages.
- Any warning is merge-blocking and promotion-blocking.

## OUTPUT REQUIREMENT
Every plan MUST emit `devops.json`:
```json
{
  "environments": ["local", "preview", "staging", "production"],
  "secrets_vault": "vercel",
  "ci_cd_file": ".github/workflows/ci.yml",
  "health_endpoint": "/api/health",
  "rollback_strategy": "vercel_instant_rollback",
  "rto_minutes": 60,
  "rpo_minutes": 15,
  "backup_retention_days": 30,
  "cost_ceiling_usd_per_month": { "staging": 50, "production": 500 }
}
```
