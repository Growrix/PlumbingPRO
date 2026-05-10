# Undo and Revert Rules

## Purpose
Provide safe reversal for high-impact user actions.

## Rules
- Destructive operations should offer immediate undo window when feasible
- Persisted version history must support explicit revert action
- Undo/revert operations must be idempotent and auditable
- UI must clearly communicate reversible vs irreversible actions

## Anti-patterns
- Showing undo affordance for non-reversible operations
- Reverting without conflict checks