# DATA FLOW - REALTIME EVENT DISTRIBUTION

## OVERVIEW
Canonical flow for distributing server-side domain events to live client subscribers.

## INTEGRATIONS INVOLVED
- pusher or supabase-realtime (transport)
- inngest (event fan-out and retries)
- upstash (dedupe and transient buffering)
- database (source of truth)

## FLOW: DOMAIN WRITE TO LIVE CLIENT UPDATE

```
[Route Handler or Background Job]
  validates request and writes canonical state to DB
       v
[Service Layer]
  emits domain event with event_id + tenant_id + resource_id
       v
[Inngest Function: publish-realtime-event]
  checks dedupe key in Upstash (event_id)
  if duplicate: acknowledge and stop
  if new: publish to realtime transport
       v
[Realtime Provider]
  emits to scoped channel: tenant:<tenantId>:resource:<resourceId>
       v
[Client Subscription Hook]
  validates event version and applies reducer update
       v
[UI]
  reconciles optimistic state and marks event as confirmed
```

## FLOW: RECONNECT CATCH-UP

```
[Client detects disconnect]
  connection state -> reconnecting
       v
[Client reconnects with backoff]
       v
[Client requests snapshot since last_event_id]
       v
[Server returns authoritative snapshot + missed deltas]
       v
[Client replaces stale cache and reapplies safe local drafts]
```

## ENV VARS INVOLVED
- PUSHER_APP_ID
- PUSHER_KEY
- PUSHER_SECRET
- PUSHER_CLUSTER
- NEXT_PUBLIC_PUSHER_KEY
- NEXT_PUBLIC_PUSHER_CLUSTER
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

## CONSTRAINTS
- Publish only after transactional write commit.
- Event payloads must be tenant-scoped and versioned.
- Dedupe by event_id to prevent duplicate UI mutations.
- Reconnect path must provide snapshot + delta recovery.