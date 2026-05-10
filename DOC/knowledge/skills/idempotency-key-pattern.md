# Skill: Idempotency Key Pattern

**Used by:** stripe, inngest, neon-postgres, any retried write operation

## Pattern

Any operation that writes to the database as a result of an external event (webhook, job, API call) MUST be idempotent: running it twice produces the same result as running it once.

### Implementation

\\\	s
// Before processing a webhook event, check if already handled
const existing = await db.webhookEvent.findUnique({
  where: { externalId: event.id }
})
if (existing) return new Response('Already processed', { status: 200 })

// Process and record atomically
await db.([
  // ... business logic writes ...
  db.webhookEvent.create({ data: { externalId: event.id, processedAt: new Date() } })
])
\\\

### Table required
\\\sql
CREATE TABLE webhook_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE NOT NULL,
  source      text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);
\\\

### Rules
- MUST wrap business logic + idempotency record in a single transaction.
- MUST return 200 (not 409) when event is already processed — prevents provider retry storms.
- The \external_id\ is provider-specific: Stripe uses \evt_xxx\, Clerk uses Svix message ID.
