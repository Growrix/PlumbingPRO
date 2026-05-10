# PRE-DEPLOYMENT CHECKLIST

## PURPOSE
Run this checklist AFTER codegen completes and BEFORE promoting the build to production. Every item MUST be `[x]` or the deployment MUST BLOCK. The reviewer owns this checklist.

## INPUT INTEGRITY
- [ ] `plan.json.lock_status == "LOCKED"`.
- [ ] Codegen output matches plan (no drift).
- [ ] Post-build checklist passed.
- [ ] No file in the build references an entity outside the knowledge base.

## CI / CD
- [ ] Latest CI run is green (lint, typecheck, unit, integration, build, secret-scan, dep-scan).
- [ ] Latest E2E run on preview deployment is green.
- [ ] Visual regression diff reviewed and approved.
- [ ] Database migrations validated against staging.
- [ ] Promotion gates declared in `devops.json.cd.promotion_gates` are satisfied.
- [ ] Rollback command verified working in staging (`vercel rollback <deployment-id>` executes cleanly).

## ENVIRONMENT
- [ ] Every env var in `devops.json.secrets.scopes` is set in the production environment vault.
- [ ] No production env value duplicates a non-production value.
- [ ] Webhook endpoints registered in every provider dashboard:
  - [ ] Stripe → `https://<domain>/api/webhooks/stripe`
  - [ ] Auth provider → `https://<domain>/api/webhooks/<auth>`
  - [ ] CMS revalidation (if applicable) → `https://<domain>/api/webhooks/<cms>`
  - [ ] Resend (delivery events) → `https://<domain>/api/webhooks/resend`
  - [ ] Inngest (background jobs) → registered app URL
- [ ] DNS A / CNAME records pointing to host (apex + www).
- [ ] SSL active and HSTS preload configured.
- [ ] `robots.txt` reachable.
- [ ] `sitemap.xml` reachable.
- [ ] OG image, favicons, and apple-touch-icon present.

## SECURITY GATE
- [ ] `security_report.json.overall == "passed"`.
- [ ] OWASP Top 10 audit clean.
- [ ] `pnpm audit --prod --audit-level=high` clean.
- [ ] Secret scan (`gitleaks`) clean on the deploy commit.
- [ ] CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors verified on a staging request.
- [ ] CORS origin list contains production domain only.
- [ ] Rate-limit configuration verified for auth and public APIs.
- [ ] Audit log writes verified for sign-in, role change, billing change, data export, data delete.

## MONITORING + OBSERVABILITY
- [ ] Sentry release tag set to current git SHA; source maps uploaded.
- [ ] Axiom (or chosen logger) ingesting structured logs from a test request.
- [ ] Uptime probe (`/api/health`) configured and currently 200.
- [ ] PostHog (or chosen metrics provider) receiving events from staging.
- [ ] Every alert in `devops.json.alerts[]` has its runbook file present in `docs/runbooks/alerts/` and resolves to a real path.
- [ ] On-call rotation populated and notified.

## BACKUPS + DR
- [ ] Database backup ran successfully within the retention window.
- [ ] Most recent restore drill within the declared cadence.
- [ ] RTO and RPO declared in `devops.json.dr` are unchanged from the LOCKED plan.

## PERFORMANCE GATE
- [ ] Lighthouse run on production preview meets `performance.json.web_vitals_targets`.
- [ ] Bundle size within `performance.json.bundle_budgets` for every route.
- [ ] No regressions vs the previous deployment baseline.

## ACCESSIBILITY GATE
- [ ] axe-core scan: zero serious or critical violations on the production preview.
- [ ] Manual keyboard walk completed for sign-in / sign-up / primary conversion path / billing.
- [ ] Screen-reader smoke completed (NVDA + VoiceOver).
- [ ] Reduced-motion preview verified.

## CONTENT
- [ ] Every content key referenced in code resolves to `content.<locale>.json`.
- [ ] No forbidden words present.
- [ ] Length budgets honored for SEO titles (≤60) and descriptions (≤155).
- [ ] Schema.org JSON-LD validates for every page where industry pack mandates it.
- [ ] All locales declared in the brief have a complete content file.

## LEGAL / COMPLIANCE
- [ ] Privacy policy reachable at `/privacy`.
- [ ] Terms of service reachable at `/terms`.
- [ ] Cookie consent banner verified where applicable.
- [ ] GDPR data export (`/api/account/export`) and delete (`/api/account/delete`) endpoints reachable for an authenticated user.
- [ ] Sub-processors list published where applicable.
- [ ] DPA template available where applicable.

## COMMERCE (IF APPLICABLE)
- [ ] Stripe live keys in production env; test keys absent.
- [ ] Live webhook secret matches dashboard.
- [ ] Customer portal configured.
- [ ] Tax settings configured per region.
- [ ] Returns/refunds policy reachable from cart and checkout.

## COMMUNICATIONS (IF APPLICABLE)
- [ ] Email sending domain DKIM/SPF/DMARC verified.
- [ ] From-address matches verified domain.
- [ ] Bounce/complaint suppression list active.
- [ ] SMS/voice provider numbers verified per region (where used).

## ROUTINES + SUPPORT
- [ ] Status page (or equivalent) created and linked from footer/support.
- [ ] Support intake (form / email / chat) reaches a real inbox.
- [ ] Escalation path documented and tested.

## FINAL APPROVAL
- [ ] Engineering lead approval on the deployment ticket.
- [ ] Go/no-go window confirmed (no overlap with maintenance / freeze).

## OUTPUT
On success → reviewer emits `pre_deployment.status = passed`; deployment proceeds.
On failure → emit `BLOCK { stage: "pre-deployment", failed: [<rule_ids>] }` with file/line evidence per failed item.
