---
archetype: dashboard-ops
positioning: information-dense operational interface; data-first product UI
best_for: [internal_tools, admin_panels, ops_dashboards, analytics_products, b2b_apps_with_heavy_data]
---

# Dashboard Ops

## Mood references

- **Linear / Height / GitHub / Vercel dashboard / Stripe dashboard** — neutral surfaces, status palette dominates, hairline borders, mono numerics, dense rows.
- **Datadog / Grafana / Plane** — chart-led with status-led colour; brand hue reserved for primary actions.
- **Retool / Kibana** — table-led with bulk actions and saved views.

Bar: an operator can see status, decide, act — without scrolling.

## Voice & tone

- Operational, terse, precise.
- Status-led copy; verbs over adjectives.
- Numbers, dates, IDs treated as first-class content.

## Latitude windows

| Dimension | Latitude | Notes |
|---|---|---|
| Hero composition | **MEDIUM** | If a marketing hero exists; the app shell is constrained. |
| App shell layout | **LOW** | Top bar + side rail + main panel; standard. |
| Brand hue | **MEDIUM** | Used sparingly for primary actions and active state. |
| Status palette | **LOW** | Non-negotiable: success / warning / destructive / info / pending. |
| Typography | **LOW** | Humanist sans optimised for long scanning + technical mono. |
| Section rhythm | **LOW** | 8px base; 16/12 card padding; 40-48 row height. |
| Surface stack | **LOW** | Hairline border, no shadow. |
| Motion temperament | **MEDIUM** within `calm-precise` | 140–180ms; functional only. |
| Imagery direction | **LOW** | No marketing imagery in the app. Charts, tables, status pills, avatars. |
| Content density | **LOW** | Dense by default. |

## Starting-point tokens

### Color
- background: near-white / near-black
- surface: white / graphite
- inset: slightly darker for tables and side rails
- primary: brand hue used sparingly
- accent: muted secondary
- destructive: clear red
- success: clear green
- warning: amber
- info: blue
- pending: muted slate

### Typography
- body: humanist sans optimised for long scanning
- mono: technical mono for IDs, timestamps, code
- heading scale: 24 / 20 / 18 / 16 / 14
- body scale: 14 / 13
- tabular figures required for numeric columns

### Spacing
- 8px base
- card padding: 16 standard / 12 dense
- row height: 40–48 default / 32 dense

### Radius
- 6–8; sharp-leaning to feel structured

## Required quality dimensions

- **hero_composition** — 1 (app surfaces dominate; marketing hero is secondary)
- **narrative_density** — 3 (data is the content)
- **trust_signal_placement** — 1 (audit + history visible per record; not a hero feature)
- **motion_temperament** — 2 (functional, calm)
- **micro_detail_quality** — 3 (focus rings, hover states, table sort, bulk select)
- **content_punch** — 2 (status labels under 3 words)

Target for `premium`: ≥ 12/18.

## Forbidden patterns

- Decorative gradients in app surfaces.
- Long animations between states.
- Hidden bulk actions; everything must be discoverable.
- Hover-only data (mobile parity required).
- Marketing-style hero in an app surface.
- Auto-refreshing tables that lose user scroll position.
- Modal-heavy workflows (use side panels and inline edits).

## Imagery direction

- No marketing imagery in the app.
- Charts, tables, status pills, inline avatars.

## Required trust real estate

- Audit + history visible per record.
- Permissions visible inline ("you can edit / you can view").
- Last-updated timestamp on every list view.

## Iconography

- Outline 1.5px stroke; sizes 16/20.
- Icon + label by default; icon-only only for repeated rows.

## Anti-template clause

This file declares content CATEGORIES and OUTCOMES required for this archetype. It MUST NOT name specific components, prescribe layouts, or list visual elements that constrain the planner's composition latitude. Categories are universal across this archetype; component names and compositions are project-specific, authored by the frontend planner per the brief and the visual-differentiation map. If a future edit introduces named components in this file, it is template drift and must be reverted.

## Required content categories (outcome-level, component-agnostic)

- `operational_snapshot`: summarize current status, risk, and throughput at glance depth.
- `actionable_work_queue`: present prioritized tasks/items with clear next actions.
- `data_density_surface`: provide filterable/sortable operational records with parity across inputs.
- `exception_and_alerting`: surface warnings/failures with severity and remediation path.
- `auditability_context`: expose history, timestamps, and actor traceability.
- `permission_visibility`: clarify user capability boundaries in context.
- `decision_support`: provide drill-down detail required to execute safely.
- `bulk_action_safety`: define safe batch-operation affordances with confirmation strategy.
- `cross_surface_navigation`: ensure fast movement between list, detail, and settings contexts.
- `footer_or_help_identity`: provide support/help path, legal identity, and attribution contract.

## How to deviate intentionally

- B2B SaaS app surfaces should use this archetype, even when the marketing site uses `modern-saas`.
- Analytics-product subset may push chart density higher.
- AI-tooling dashboards may incorporate `ai-product` patterns for chat surfaces.

Deviation recorded in `design-system.md` overrides with reason.
