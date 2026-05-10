# Skill: Comments and Mentions Pattern

**Used by:** liveblocks comment threads, collaboration panels

## Pattern
Structured comment threads with @mention id binding and notification fan-out.

## Rules
- Mention references must store immutable user ids
- Thread resolution state transitions must be auditable
- Mention notifications must include deep-link context