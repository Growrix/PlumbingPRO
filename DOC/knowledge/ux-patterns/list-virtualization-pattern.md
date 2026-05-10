# List Virtualization Pattern

## Purpose
Render large data sets with stable performance.

## Rules
- Virtualize lists beyond 50 visible rows
- Use fixed or measured row heights with deterministic keying
- Keep keyboard focus stable when rows mount/unmount
- Preserve aria row counts and context announcements

## Anti-patterns
- Virtualizing short lists and increasing complexity unnecessarily
- Index-based keys for mutable datasets