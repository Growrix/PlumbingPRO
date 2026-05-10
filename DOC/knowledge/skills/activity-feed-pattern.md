# Skill: Activity Feed Pattern

**Used by:** audit-style feeds, customer-visible timelines

## Pattern
Normalize domain events into renderable timeline records.

## Rules
- Include actor, action, target, timestamp, and trace id
- Redact sensitive payload fields before persistence
- Preserve deterministic sort order (timestamp then id)