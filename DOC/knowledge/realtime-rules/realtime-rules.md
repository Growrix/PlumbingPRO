# Realtime Rules

## Purpose
Deterministic rules for implementing live updates, collaboration, and presence in SaaS apps.

## Transport selection
- Use WebSockets for bidirectional user interaction (presence, collaborative cursors, live editing).
- Use SSE for server-to-client streaming where client publish is not required.
- Use polling only as a fallback path when realtime transport is unavailable.

## Channel and room naming
- Channel and room identifiers MUST include tenant or workspace scope.
- Channel format SHOULD follow `tenant:<tenantId>:resource:<resourceId>`.
- Never put secrets or raw PII in channel names.

## Auth and authorization
- Private and presence channels MUST require a server-authenticated token.
- Room access checks MUST run on each auth request, not only on session bootstrap.
- Authorization decisions MUST be role-aware for multi-tenant environments.

## State consistency
- Client writes SHOULD apply optimistic updates with rollback on failure.
- Every event payload MUST include a deterministic event id for dedupe.
- Reconnect path MUST support snapshot + delta catch-up to prevent drift.

## Reliability budgets
- Reconnect attempt starts within 1 second, then exponential backoff with jitter.
- UI must expose connection state: connected, reconnecting, offline.
- Event handlers MUST be idempotent on client and server.

## Performance budgets
- Keep payloads compact; prefer ids over denormalized nested payloads.
- Avoid rendering more than 50 on-screen row updates per frame without batching.
- For high-frequency streams, aggregate updates to a 100-250ms render cadence.

## Security constraints
- Do not publish secrets in client-visible payloads.
- Do not subscribe clients to broad wildcard channels unless explicitly public.
- Log authorization denials for channel/room joins for auditability.

## Anti-patterns
- Public channels carrying tenant-private business data.
- Replaying stale optimistic state after reconnect without reconciliation.
- Event schemas without explicit versioning or event ids.

## Required companion skills
- websocket-reconnect-pattern
- optimistic-ui-pattern
- presence-tracking-pattern
- subscription-fanout-pattern