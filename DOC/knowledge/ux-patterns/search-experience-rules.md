# Search Experience Rules

## Purpose
Reliable search UX for large SaaS content and entities.

## Required capabilities
- Typeahead suggestions within 200ms target for cached prefixes
- Scoped search filters (all, docs, users, events, etc.)
- Recent searches and pinned searches
- Empty-search guidance and zero-result remediation

## Rules
- Query state and scope must be URL-synced
- Highlight matches in results with keyboard navigation support
- Debounce typing queries and cancel stale requests

## Anti-patterns
- Unscoped cross-tenant search
- No feedback while search is pending