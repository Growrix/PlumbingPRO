# Activity Feed Rules

## Purpose
Present auditable timeline of meaningful system and user actions.

## Rules
- Timeline entries must include actor, action, target, and timestamp
- Support filter by entity, actor, and time range
- Sensitive fields must be redacted in UI and exports
- Feed items must deep-link to affected entity state

## Anti-patterns
- Free-text only events without structured metadata
- Non-deterministic ordering of entries