# Data Table Pattern

## Purpose
Standard behavior for sortable, filterable, high-density SaaS tables.

## Required states
- loading, empty, error, data, selected, bulk-action-in-progress

## Required capabilities
- Column sorting with stable secondary sort
- Multi-filter and clear-all controls
- Bulk row selection with select-visible vs select-all semantics
- Saved views (named filter/sort presets)
- CSV export of current filtered result set

## Performance rules
- Virtualize when visible rows exceed 50
- Server-side pagination for large datasets
- Persist sort/filter/page in URL search params

## Anti-patterns
- Losing selection state on pagination changes
- Client-side filtering of unbounded datasets
- Non-deterministic default sort order