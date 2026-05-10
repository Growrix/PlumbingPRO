# Infinite Scroll Pattern

## Purpose
Progressive loading for feeds and timelines.

## Rules
- Use cursor-based pagination only
- Preserve scroll position across route transitions
- Show deterministic loading sentinel and end-of-list state
- Provide alternate paginated mode for accessibility contexts

## Anti-patterns
- Offset pagination with mutable datasets
- No way to recover from load-more failure