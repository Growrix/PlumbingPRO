# Skill: Subscription Fan-out Pattern

**Used by:** pusher, supabase-realtime, notification center, live dashboards

## Pattern
Publish one domain event to multiple subscriber channels using deterministic routing keys.

## Implementation
```ts
const targets = [
  `tenant:${tenantId}:resource:${resourceId}`,
  `tenant:${tenantId}:activity`,
  `user:${actorUserId}:inbox`
]

for (const channel of targets) {
  await publish(channel, {
    eventId,
    eventType,
    occurredAt,
    payload
  })
}
```

## Rules
- Fan-out channel list MUST be deterministic for the same event input.
- Event payload MUST include event id for dedupe.
- Publisher MUST be idempotent when retries occur.
- Tenant and user scoping MUST be explicit in routing keys.