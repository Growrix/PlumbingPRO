# Automation Rules

## Rule AR1 — Outbound event emission

Every SaaS app with `automation_surface.outbound: enabled` in its tier preset MUST emit the canonical outbound events defined in `outbound-event-taxonomy.md` as described below.

**Emitter**: The Next.js backend (route handler or Inngest job).
**Transport**: HTTPS POST to configured recipient URL(s).
**Signing**: Every emitted payload MUST be signed (see `outbound-webhook-signing.md`).

## Rule AR2 — Event naming

Event type names MUST match the canonical taxonomy exactly (see `outbound-event-taxonomy.md`). Agents MUST NOT invent new event names.

## Rule AR3 — Automation surface in plan.json

When `automation_surface.outbound: enabled`, the `integration_planner` output MUST include an `automation.json` artifact that lists:
- Each event type to be emitted
- The Inngest job or route that emits it
- The signing secret env var name

## Rule AR4 — Runner selection

| Tier | Default outbound runner | Zapier export |
|---|---|---|
| basic | disabled | no |
| standard | n8n | optional |
| advanced | n8n | required if `multi_tenant` |

## Rule AR5 — SSRF protection

All outbound webhook recipient URLs MUST be validated before dispatch:
- Reject private IP ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1, ::1
- Reject cloud metadata endpoints: 169.254.169.254, fd00:ec2::254
- Allow only HTTPS (reject HTTP).

## Rule AR6 — Retry policy

Outbound webhook delivery MUST use exponential backoff:
- Attempt 1: immediate
- Attempt 2: +5 seconds
- Attempt 3: +30 seconds
- Attempt 4: +5 minutes
- Attempt 5: +30 minutes (final)
- After 5 failures: mark delivery as `failed`, alert via Inngest dead-letter queue.
