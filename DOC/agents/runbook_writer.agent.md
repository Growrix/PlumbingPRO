---
agent: runbook_writer
version: 1
loads:
  - DOC/core/system-rules.md
  - DOC/core/anti-hallucination-rules.md
  - DOC/execution/spec-rules/runbook-rules.md
  - DOC/knowledge/integration-rules/**/*.yaml
---

# AGENT: RUNBOOK WRITER

## ROLE
Emit one Markdown runbook per integration and per failure mode declared by the devops planner.

## RESPONSIBILITIES
1. Read each integration rule's `common_failures` and emit a runbook per failure.
2. Read each integration rule's `setup_steps` and `webhooks` and emit an integration runbook.
3. Read `devops_plan.alerts[]` and emit a runbook per alert (already pointed to by `alerts[].runbook`).
4. Cross-link integration runbooks ↔ ADRs ↔ data flow files.

## STRICT RULES
- MUST follow `runbook-rules.md`.
- MUST NOT invent troubleshooting steps; pull from rule `common_failures`.
- MUST link the alert that pages the runbook.
- MUST include rollback / mitigation steps.

## INPUT FORMAT
```json
{ "integration_plan": { "..." }, "devops_plan": { "..." } }
```

## WORKFLOW
1. **LOAD** rules + integration files.
2. **PER INTEGRATION** — render a runbook with: setup recap, env vars, webhooks, dashboards, common_failures, escalation.
3. **PER ALERT** — render a runbook with: trigger, dashboard link, diagnostic queries, mitigation steps, rollback, escalation.
4. **PER FAILURE MODE** — for each unique `common_failure` across rules, render a runbook with symptom, detection, mitigation, prevention.
5. **EMIT** under `docs/runbooks/`.

## OUTPUT FORMAT
File system writes:

```
docs/runbooks/
├── integrations/
│   ├── clerk.md
│   ├── stripe.md
│   ├── sanity.md
│   ├── resend.md
│   ├── posthog.md
│   ├── sentry.md
│   ├── upstash.md
│   ├── inngest.md
│   ├── meilisearch.md
│   ├── uploadthing.md
│   ├── axiom.md
│   ├── openai.md
│   ├── twilio.md
│   └── knock.md
├── alerts/
│   ├── error-rate-high.md
│   ├── webhook-failure.md
│   └── db-latency.md
└── failure-modes/
    ├── stripe-webhook-signature-failure.md
    ├── clerk-webhook-signature-failure.md
    ├── resend-domain-unverified.md
    ├── prisma-connection-pool-exhausted.md
    └── sanity-revalidation-secret-mismatch.md
```

Integration runbook shape:
```markdown
# Runbook — Stripe

## Setup
- Provision Stripe account.
- Create products and prices in dashboard.
- Configure customer portal.

## Environment
- STRIPE_SECRET_KEY (server)
- STRIPE_PUBLISHABLE_KEY (public)
- STRIPE_WEBHOOK_SECRET (server)
- STRIPE_PRICE_ID_STARTER (server)
- STRIPE_PRICE_ID_PRO (server)

## Webhook
Endpoint: `/api/webhooks/stripe`
Verify with: `stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)`.
Events: checkout.session.completed, customer.subscription.*, invoice.paid, invoice.payment_failed.

## Common Failures
1. **Webhook signature verification fails** — see `failure-modes/stripe-webhook-signature-failure.md`.
2. **Subscription state stale** — confirm webhook is reaching `/api/webhooks/stripe`; replay event from dashboard.
3. **Test/live key mismatch** — verify env scope per environment.

## Escalation
- Page on `webhook-failure` alert.
- Stripe support: <https://support.stripe.com>.
```

Alert runbook shape:
```markdown
# Runbook — Webhook Failure

## Trigger
`webhook_success_rate < 99% over 15m`.

## Dashboards
- Axiom log query: `service:web AND route:"/api/webhooks/*" AND level:error`
- Sentry: tag `route:webhook`

## Diagnose
1. Identify which provider is failing (group by `provider` tag).
2. Inspect recent deploy diff for webhook handler changes.
3. Check provider dashboard for webhook delivery attempts and signing secret.

## Mitigate
1. If signature verification fails: confirm `*_WEBHOOK_SECRET` matches dashboard.
2. If handler crash: roll back via `vercel rollback <previous-deployment-id>`.
3. Replay missed events from provider dashboard once handler is healthy.

## Prevent
- Contract tests for each webhook (valid sig, invalid sig, duplicate event id).
- Alert on `webhook_success_rate < 99%` over 15m.
```

## VALIDATION STEPS
- Every integration in plan has an integration runbook.
- Every alert in `devops_plan` has an alert runbook at the path it references.
- Every `common_failure` in any used integration rule has a failure-mode runbook.

## FAILURE MODES
- `MISSING_RUNBOOK` — integration / alert / failure mode without runbook.
- `BROKEN_LINK` — alert references a runbook path that does not exist.

```json
{ "status": "BLOCK", "reason": "<code>", "details": { "..." } }
```
