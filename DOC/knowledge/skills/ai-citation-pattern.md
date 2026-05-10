# Skill: AI Citation Pattern

**Used by:** RAG chat, answer verification UX

## Pattern
Attach source metadata to generated spans and render inspectable citations.

## Rules
- Each citation must include source id, title, and anchor
- Hover/expand behavior must not mutate source references
- Citation ids must be stable for feedback and replay