# Chart Rules

## Purpose
Deterministic chart planning for dashboard and analytics surfaces.

## Library guidance
- Default: Recharts for standard dashboards
- Use Visx for custom interactions and large datasets

## Required states
- loading, empty, error, stale-data-warning, interactive

## Rules
- Every chart must declare metric source, refresh cadence, and aggregation interval
- Axes and legends must be keyboard navigable when interactive
- Tooltips must have equivalent textual data summary nearby
- Color encodings must be contrast-safe and not color-only

## Performance budgets
- Initial render target under 150ms for standard dashboard panels
- Aggregate high-frequency updates into 100-250ms paint windows

## Anti-patterns
- 3D chart types
- Unlabeled units and hidden time ranges