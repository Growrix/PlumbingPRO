# Skill: Webhook Signature Verification

**Used by:** clerk, stripe, inngest, sanity, twilio, knock, calcom, documenso, resend

## Pattern

Every inbound webhook handler MUST verify the provider's signature before processing the payload.

### Generic implementation (Next.js App Router route handler)

\\\	s
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const rawBody = await req.text()
  const headersList = await headers()
  const signature = headersList.get('x-signature') ?? ''

  const isValid = verifySignature(rawBody, signature, process.env.WEBHOOK_SECRET!)
  if (!isValid) return new Response('Unauthorized', { status: 401 })

  const payload = JSON.parse(rawBody)
  // process payload...
  return new Response('OK', { status: 200 })
}
\\\

### Rules
- MUST use raw body (text), not parsed JSON — parsing destroys the signature.
- MUST reject with 401 if signature is invalid.
- MUST return 200 even if the event type is unknown (prevents replay retries for unhandled events).
- MUST process idempotently (see: idempotency-key-pattern).
- Signing secret MUST be an env var, never hardcoded.

### Provider-specific header names
| Provider | Header |
|---|---|
| Stripe | \stripe-signature\ |
| Clerk | \svix-id\, \svix-timestamp\, \svix-signature\ |
| Inngest | \x-inngest-signature\ |
| Sanity | \sanity-webhook-signature\ |
| Twilio | \x-twilio-signature\ |
| Knock | \x-knock-signature\ |
| Cal.com | \x-cal-signature-256\ |
