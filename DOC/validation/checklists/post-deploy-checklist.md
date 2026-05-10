# POST-DEPLOY CHECKLIST

## PURPOSE
Run this checklist after every production deployment. Every item MUST be confirmed before closing the deploy.

## SMOKE TESTS
- [ ] `GET /api/health` → HTTP 200, `{ status: "ok" }`.
- [ ] Homepage renders without JS errors (Playwright smoke test passed).
- [ ] Sign-in page loads and accepts credentials (test account).
- [ ] Primary authenticated route responds within SLO (< 500ms p99).
- [ ] If AI feature present: `/api/chat` accepts a message and returns streaming response.

## DATABASE
- [ ] `prisma migrate status` — no pending migrations in production.
- [ ] DB connection pool healthy (no connection exhaustion errors in logs).
- [ ] Seed data verified (reference data present if required).

## INTEGRATIONS
- [ ] Clerk: webhook endpoint active and verified in Clerk dashboard.
- [ ] Stripe: webhook endpoint active in Stripe dashboard (if payments feature present).
- [ ] Resend: sending domain verified; test email delivered successfully.
- [ ] PostHog: events flowing — verify in PostHog Live Events.
- [ ] Sentry: release tagged; no spike in new error types post-deploy.
- [ ] Axiom: logs flowing — verify in Axiom dataset.
- [ ] Inngest: app registered and functions showing as active in Inngest Cloud.
- [ ] UploadThing: upload routes accessible (if file uploads present).
- [ ] Meilisearch: indexes accessible and search returns results (if search present).
- [ ] Upstash: Redis connection verified via health check or test key.

## OBSERVABILITY
- [ ] Sentry release health monitoring active for 30 minutes post-deploy.
- [ ] No new error class spike above 5% of requests in first 10 minutes.
- [ ] Core Web Vitals report from Vercel Speed Insights or PostHog — LCP ≤ 2500ms.
- [ ] Axiom: structured log lines appearing with correct `release` tag.

## ENV VARS
- [ ] All new env vars for this release have been added to Vercel (Production scope).
- [ ] No env var typos detected (health endpoint validates required vars at boot).

## PERFORMANCE
- [ ] Bundle analyzer report reviewed — initial bundle ≤ 200 KB gzipped.
- [ ] No new slow query alerts firing in Axiom (threshold: > 200ms).
- [ ] Upstash cache hit rate within expected range for hot paths.

## SECURITY
- [ ] No new `HIGH` or `CRITICAL` npm audit findings introduced in this release.
- [ ] CSP header present on HTML responses (verified via browser dev tools).
- [ ] No secrets committed (git-secrets or truffleHog scan passed in CI).

## ROLLBACK READINESS
- [ ] Previous production deployment SHA recorded.
- [ ] Rollback command documented and tested in the runbook.
- [ ] DB down-migration script ready (if schema change was included).

## SIGN-OFF
- [ ] All smoke tests passing.
- [ ] No P1 alerts firing.
- [ ] On-call engineer notified of deploy completion.
- [ ] Deploy record added to changelog (Sentry release or internal log).

## OUTPUT
On all items confirmed → deploy is CLOSED.
On any item failing → initiate rollback procedure and create P1 incident.
