# Saved Views Rules

## Purpose
Allow users to persist and share high-value query/filter contexts.

## Rules
- Saved views must store filter, sort, columns, and scope
- View ownership and sharing scope must be explicit (private, team, org)
- Default view selection must be reversible
- Invalid saved view definitions must degrade gracefully to defaults

## Anti-patterns
- Saving only display label without query state
- Hidden shared views without provenance