# Comments and Mentions Rules

## Purpose
Collaborative discussion UX with reliable mention delivery.

## Rules
- Mention entities must store immutable user ids and display snapshots
- Comment threads must support resolved/unresolved state transitions
- Mention notifications must route to inbox and deep-link to context
- Edit and delete operations must preserve audit metadata

## Anti-patterns
- Free-text @mentions without id binding
- Comment ordering without deterministic timestamp rules