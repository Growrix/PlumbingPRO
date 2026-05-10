# Skill: Outbound Webhook Signing Pattern

**Used by:** n8n automation surface, /api/events endpoint

## Pattern

Every outbound webhook emitted by the app MUST be HMAC-SHA256 signed so that receivers can verify authenticity.

### Implementation
\\\	s
import { createHmac } from 'crypto'

function signPayload(payload: string, secret: string): string {
  return 'sha256=' + createHmac('sha256', secret).update(payload).digest('hex')
}

async function emitEvent(event: OutboundEvent, recipientUrl: string) {
  const payload = JSON.stringify(event)
  const signature = signPayload(payload, process.env.OUTBOUND_WEBHOOK_SECRET!)

  await fetch(recipientUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature-256': signature,
      'X-Event-Type': event.type,
      'X-Delivery-Id': crypto.randomUUID(),
    },
    body: payload,
  })
}
\\\

### Delivery log table
\\\sql
outbound_webhook_deliveries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id  uuid UNIQUE NOT NULL,
  event_type   text NOT NULL,
  recipient_url text NOT NULL,
  status       text NOT NULL,  -- delivered | failed | retrying
  response_code int,
  attempts     int NOT NULL DEFAULT 1,
  created_at   timestamptz NOT NULL DEFAULT now()
)
\\\

### Rules
- Secret MUST be per-customer if SaaS exposes webhooks to its own users.
- MUST implement exponential backoff retry (max 5 attempts).
- MUST log every delivery attempt with response code.
- Receiver URL MUST be validated (SSRF prevention: reject internal IPs).
