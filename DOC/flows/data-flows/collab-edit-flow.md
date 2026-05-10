# DATA FLOW - COLLABORATIVE EDITING

## OVERVIEW
Deterministic flow for multi-user editing with optimistic updates and conflict-safe reconciliation.

## INTEGRATIONS INVOLVED
- liveblocks (collaboration transport)
- database (authoritative persisted state)
- inngest (optional async post-processing)

## FLOW: LOCAL EDIT TO SHARED STATE

```
[Editor Client]
  user performs edit action
       v
[Optimistic Reducer]
  applies local patch immediately and marks pending
       v
[Realtime Mutation]
  sends patch with mutation_id and base_version
       v
[Collaboration Service]
  validates permissions and applies merge strategy
       v
[Broadcast]
  sends accepted patch and new version to all peers
       v
[All Clients]
  acknowledge mutation_id and clear pending state
```

## FLOW: VERSION CONFLICT

```
[Service detects base_version mismatch]
  rejects patch with conflict payload
       v
[Client]
  fetches latest snapshot
  rebases local pending patch if still valid
  retries with new base_version
```

## CONSTRAINTS
- Every mutation must include mutation_id and base_version.
- Merge policy must be deterministic for the same input order.
- Unauthorized edits must be rejected before broadcast.
- Persist checkpoints to DB for recovery and audit.