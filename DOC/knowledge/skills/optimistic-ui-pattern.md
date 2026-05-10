# Skill: Optimistic UI Pattern

**Used by:** pusher, supabase-realtime, liveblocks, dynamic dashboard interactions

## Pattern
Apply a local state change immediately, then reconcile with authoritative server result.

## Implementation
```ts
const mutationId = crypto.randomUUID()
applyLocalPatch({ mutationId, patch, status: "pending" })

try {
  const result = await api.applyPatch({ mutationId, patch, baseVersion })
  commitServerPatch(result)
  markMutationConfirmed(mutationId)
} catch (error) {
  rollbackMutation(mutationId)
  showErrorToast("Update failed. Your change was reverted.")
}
```

## Rules
- Every optimistic mutation MUST have a stable mutation id.
- Rollback path MUST exist for every optimistic mutation type.
- Server ack MUST include authoritative version to prevent drift.
- UI MUST indicate pending state for long-running mutations.