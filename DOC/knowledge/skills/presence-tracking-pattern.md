# Skill: Presence Tracking Pattern

**Used by:** liveblocks, collaborative workspaces, shared editors

## Pattern
Represent online/active users via tenant-scoped rooms with heartbeat and expiry semantics.

## Implementation
```ts
const roomId = `tenant:${tenantId}:doc:${docId}`
const presence = {
  userId,
  displayName,
  avatarUrl,
  status: "active",
  lastSeenAt: Date.now()
}

room.updatePresence(presence)
setInterval(() => {
  room.updatePresence({ status: "active", lastSeenAt: Date.now() })
}, 15000)
```

## Rules
- Room id MUST include tenant scope.
- Presence payload MUST exclude private data.
- Heartbeat interval SHOULD be 10-30 seconds.
- Consumers MUST drop stale presence records after timeout.