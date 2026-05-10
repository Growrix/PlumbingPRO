# Inline Editing Rules

## Purpose
Edit-in-place workflows without route transitions.

## Required states
- idle, editing, saving, save-failed, conflict

## Rules
- Enter edit mode with explicit affordance and keyboard entry shortcut
- Optimistic save with rollback and toast feedback
- Validation errors must anchor to edited field
- Conflicts must show latest server value and merge options

## Anti-patterns
- Silent auto-commit on blur for destructive fields
- Losing unsaved edits on navigation without warning