# Brand Translation Rules

Maps brand intent and project context into deterministic UI properties so that downstream agents (design system, components, motion, content) produce coherent output without improvisation.

## Inputs

The intake strategist supplies:
- `project.archetype` — see `project-archetypes.md`
- `project.industry.class` — see `knowledge/industries/README.md`
- `brand.voice` — one word: `premium | modern | trustworthy | playful | technical | editorial`
- `brand.palette_seed` — optional hex
- `audience` — derived

## Default visual archetype matrix

| project_archetype | industry class                | default visual_archetype     |
|-------------------|-------------------------------|------------------------------|
| `marketing_site`  | `local_services`              | `local-business-trust`       |
| `marketing_site`  | `professional_services`       | `editorial-premium`          |
| `marketing_site`  | `consumer_brand`              | `bold-consumer`              |
| `marketing_site`  | `creator_or_portfolio`        | `editorial-premium`          |
| `marketing_site`  | `regulated_finance`           | `editorial-premium`          |
| `marketing_site`  | `regulated_health`            | `local-business-trust`       |
| `marketing_site`  | `regulated_legal`             | `editorial-premium`          |
| `marketing_site`  | `non_profit`                  | `editorial-premium`          |
| `marketing_site`  | `generic`                     | `modern-saas`                |
| `saas_app`        | `b2b`                         | `modern-saas`                |
| `saas_app`        | `ai_first`                    | `ai-product`                 |
| `saas_app`        | `internal_ops`                | `dashboard-ops`              |
| `saas_app`        | (any other)                   | `modern-saas`                |
| `ecommerce`       | `consumer_brand`              | `bold-consumer`              |
| `ecommerce`       | (any other)                   | `modern-saas`                |
| `landing_page`    | (any)                         | `startup-conversion`         |
| `content_site`    | `publication`                 | `editorial-premium`          |
| `content_site`    | (any other)                   | `editorial-premium`          |
| `marketplace`     | (any)                         | `marketplace`                |
| `dashboard_tool`  | (any)                         | `dashboard-ops`              |
| `portfolio_site`  | (any)                         | `portfolio-craft`            |

## Voice override matrix

If the client provides `brand.voice`, the visual archetype is overridden as follows:

| brand.voice    | overrides default to                                                |
|----------------|---------------------------------------------------------------------|
| `premium`      | `editorial-premium`                                                  |
| `modern`       | `modern-saas`                                                        |
| `trustworthy`  | `local-business-trust`                                               |
| `playful`      | `bold-consumer`                                                      |
| `technical`    | `dashboard-ops` (for app product) or `modern-saas` (for marketing)   |
| `editorial`    | `editorial-premium`                                                  |
| `cinematic`    | `portfolio-craft`                                                    |
| `ai-native`    | `ai-product`                                                         |

If the override conflicts with project archetype defaults, the override wins and an assumption is recorded.

## Brand signal → token implications

Every visual archetype carries its own token defaults (see each archetype file). The brand-translation layer also enforces these signal-level rules:

### Premium / editorial signal
- spacing scale shifts up: section rhythm 96px desktop minimum.
- typography display scale increases.
- accent saturation capped at 12% of screen.
- motion duration band 200–280ms.

### Modern SaaS signal
- balanced density.
- dark mode is a peer of light mode.
- motion duration band 160–220ms.

### Conversion / startup signal
- single-CTA discipline.
- accent CTA must be the highest-contrast element on screen.
- motion duration band 160–220ms with spring on chip selection.

### Trust / local signal
- light-first.
- explicit-trust real estate (badges, hours, areas).
- response-time messaging in hero and footer.
- motion duration band 220–280ms (slower, reassuring).

### Cinematic / portfolio signal
- imagery dominance.
- oversized display type allowed.
- motion duration band 240–320ms.

### Dashboard / ops signal
- 8px base, dense rows.
- functional motion only (140–180ms).
- semantic status palette dominates over brand.

### AI-product signal
- chat as primary affordance.
- streaming visuals.
- safety/limit copy near every input.

## Color seed expansion

If `brand.palette_seed` is provided as a single hex:

1. Treat as `primary`.
2. Derive `primary_hover` by darkening 8–12% in HSL lightness.
3. Pick `accent` per the visual archetype's accent rule:
   - `editorial-premium` → warm complementary (copper/amber if seed is cool; teal if seed is warm).
   - `modern-saas` → high-signal contrast hue (rotate hue by 150°).
   - `local-business-trust` → warm CTA hue.
   - `bold-consumer` → contrasting brand hue per client direction.
   - `portfolio-craft` → near-neutral; accent reserved for case-study local override.
   - `dashboard-ops` → muted, accent rarely used decoratively.
   - `marketplace` → trust hue (deep teal/blue).
   - `ai-product` → cool brand hue, single accent for streaming/cursor.
4. Derive neutrals (background, surface, inset, border, text, muted) from the archetype's neutral palette, not from the seed.
5. Keep semantic colors (success, warning, destructive, info) standard regardless of seed.

If `brand.palette_seed` is not provided, use the visual archetype's default palette.

## Audience implications

- **Older audience (50+) primary:** increase body text size by one step, raise contrast minimums to AAA where feasible, prefer light mode default.
- **Mobile-first audience (>70% mobile):** mandate sticky bottom dock for primary CTA on marketing pages.
- **Technical audience (developers, ops):** dark-mode peer required; mono font role active; copy can include code samples.

## Forbidden combinations

- `landing_page` + `dashboard-ops` archetype.
- `local_services` + `dashboard-ops` archetype.
- `dashboard_tool` + `bold-consumer` archetype.
- `regulated_finance` + `bold-consumer` archetype (compliance posture conflict).
- `regulated_health` + `startup-conversion` archetype (urgency-marketing conflict).

The strategist must reject any combination above and pick the next-best per the matrix.

## Outputs back to the strategist

```json
{
  "brand": {
    "voice": "<resolved>",
    "tone": ["<adj1>","<adj2>","<adj3>"],
    "visual_archetype": "knowledge/frontend-rules/visual-archetypes/<file>.md",
    "palette_seed": "#RRGGBB|null",
    "forbidden_words": ["..."]
  }
}
```

Downstream agents (design_system_planner especially) consume this block and the visual_archetype file to materialize tokens.
