# Skill: WebSocket Reconnect Pattern

**Used by:** pusher, supabase-realtime, liveblocks

## Pattern
Recover from transient disconnects with bounded retries, backoff, and state catch-up.

## Implementation
```ts
let attempt = 0

function nextDelayMs() {
  const base = Math.min(30000, 1000 * 2 ** attempt)
  const jitter = Math.floor(Math.random() * 250)
  return base + jitter
}

async function reconnect() {
  while (!socket.isOpen()) {
    await sleep(nextDelayMs())
    attempt += 1
    await socket.connect()
  }
  attempt = 0
  await syncSnapshotSince(lastEventId)
}
```

## Rules
- First reconnect attempt MUST start within 1 second.
- Backoff MUST cap to avoid retry storms.
- Client MUST expose connection status to the UI.
- Reconnect success MUST trigger snapshot-plus-delta reconciliation.