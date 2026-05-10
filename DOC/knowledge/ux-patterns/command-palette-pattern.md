# Command Palette Pattern

## Purpose
Global command launcher for productivity-focused SaaS applications.

## Trigger
- Default shortcut: Cmd/Ctrl+K

## Required capabilities
- Fuzzy search across actions, entities, and navigation targets
- Grouped sections: Navigate, Create, Run, Recent
- Context-aware actions scoped to current tenant/workspace

## Rules
- Palette actions must be role-aware and permission-checked
- Every action must define label, shortcut, and deterministic handler
- Include recent history and pinned actions

## Anti-patterns
- Executing destructive actions without confirmation flow
- Showing actions user cannot execute