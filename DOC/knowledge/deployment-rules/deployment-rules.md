# DEPLOYMENT RULES

## SCOPE
Apply to every environment configuration, deployment pipeline, release process, and post-deploy verification in any plan produced by this OS.

## RULE DEP1 — VERCEL IS THE DEFAULT PLATFORM
- Default deployment target: Vercel.
- Framework preset: Next.js.
- Root directory: repository root (or monorepo package root if declared).
- Build command: `next build` (no custom build scripts unless justified).
- Output directory: `.next` (Next.js default; do not override).

## RULE DEP2 — BRANCH → ENVIRONMENT MAPPING IS FIXED
| Branch | Environment | Domain |
|--------|-------------|--------|
| `main` | production | `app.example.com` |
| `staging` | staging | `staging.example.com` |
| `*` (any PR) | preview | `<hash>.vercel.app` |
| local dev | local | `localhost:3000` |

Mapping MUST be declared in `vercel.json` or the Vercel dashboard.

## RULE DEP3 — ENV VARS ARE SCOPED PER ENVIRONMENT
- Vercel environment variable scopes: `Production`, `Preview`, `Development`.
- Secrets for each scope MUST differ (no shared API keys across environments).
- Stripe: production keys → Production scope only; test keys → Preview + Development.
- Clerk: production instance → Production scope; development instance → Preview + Development.
- Every env var in the plan MUST be mapped to one or more Vercel scopes.

## RULE DEP4 — DEPLOY IS GATED BY CI
The following checks MUST pass before Vercel triggers a production deploy:
1. `eslint --max-warnings 0` (lint).
2. `tsc --noEmit` (type check).
3. `vitest run` (unit + integration tests).
4. `next build` (build succeeds locally in CI before Vercel deploy).

CI is implemented in `.github/workflows/ci.yml`. A failing CI MUST cancel the deploy.

## RULE DEP5 — DATABASE MIGRATIONS RUN BEFORE TRAFFIC
The deployment sequence for any release with migrations:
```
1. Deploy new code to Vercel (zero-downtime rollout).
2. Run `prisma migrate deploy` in a CI step AFTER deploy but BEFORE enabling new code paths.
3. Run smoke tests.
4. Enable new code paths via feature flag or cut over.
```

Migrations that break the current version MUST be staged (backward-compatible first).

## RULE DEP6 — ROLLBACK IS ONE COMMAND
- Vercel Instant Rollback is enabled for all production deployments.
- The rollback command is documented in the deployment runbook.
- Rollback target: the previous successful production deployment SHA.
- DB migrations rolled back via down-migration before rolling back app code (if migration was applied).

## RULE DEP7 — PREVIEW DEPLOYMENTS ARE ISOLATED
- Every PR MUST get a unique preview URL.
- Preview environments use: Stripe test mode, Clerk development instance, a shared preview database (non-production, reset weekly).
- Preview URLs MUST NOT be indexed by search engines (`X-Robots-Tag: noindex` header).
- Preview environments do NOT process real payments or send real emails.

## RULE DEP8 — CUSTOM DOMAINS
- Production domain: configured in Vercel project settings with SSL auto-renewed.
- `www.` redirects to the apex domain (or vice versa, but consistently).
- DNS TTL: 300s during initial setup; raise to 3600s after stability.
- Every new domain change MUST include a DNS verification step in the deploy checklist.

## RULE DEP9 — SMOKE TESTS POST-DEPLOY
After every production deploy, these checks MUST run automatically:
1. `GET /api/health` → `{ status: "ok" }` (HTTP 200).
2. Homepage loads without JS errors (Playwright smoke test).
3. Sign-in flow completes (Playwright, test account).
4. Primary API route responds within SLO.

Smoke test failure MUST trigger automatic Vercel rollback and a P1 alert.

## RULE DEP10 — RELEASE TAGGING
- Every production deploy MUST be tagged: `git tag v<YYYY.MM.DD>.<build_number>`.
- The tag SHA is passed to Sentry as the release identifier.
- Release health in Sentry MUST be monitored for 30 minutes post-deploy.
- If crash rate increases > 5% within 30 minutes → rollback and page on-call.

## DEPLOY CHECKLIST (per release)
```
[ ] CI pipeline passed (lint, typecheck, tests, build).
[ ] PR reviewed and approved.
[ ] Migration is backward-compatible (if schema change).
[ ] Env vars for new features added to Vercel (all scopes).
[ ] Webhooks registered or updated in external dashboards.
[ ] Feature flags configured for gradual rollout (if applicable).
[ ] Smoke tests passing on preview URL.
[ ] Runbook updated (if new infra change).
[ ] Deploy initiated via Vercel Git integration (not manual).
[ ] Post-deploy smoke tests confirmed passing.
[ ] Sentry release tagged and health monitored.
```
