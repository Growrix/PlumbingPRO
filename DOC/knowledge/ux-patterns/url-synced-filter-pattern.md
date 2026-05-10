# URL-Synced Filter Pattern

## Purpose
Make views shareable and restorable through URL state.

## Rules
- All table/search filters must serialize to query params
- On load, URL params are source of truth for view state
- Invalid params should be normalized to defaults and reflected in URL
- Filter changes update URL without full page navigation

## Anti-patterns
- Duplicating URL state and local state with divergent truth
- Non-shareable filtered views