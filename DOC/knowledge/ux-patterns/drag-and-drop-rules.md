# Drag and Drop Rules

## Purpose
Deterministic reorder/move interactions for boards and list management.

## Rules
- Every drop target must have visible affordance before drop
- Keyboard equivalent reorder actions are mandatory
- Reorder payload must include source index, destination index, and version
- Persist order changes atomically and idempotently

## Accessibility
- Announce drag start, target change, and drop completion via aria-live

## Anti-patterns
- Drag-only interactions without keyboard parity
- Reordering without optimistic placeholder