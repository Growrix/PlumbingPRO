---
archetype: modern-saas
positioning: Stripe / Linear / Vercel-class polish; product clarity over visual flair
best_for: [saas_app, b2b_tools, dev_tools, api_products, internal_tools_with_public_marketing]
---

# Modern SaaS

## Mood references (study, don't copy)

Reference quality bar:
- **Stripe / Linear / Vercel / Resend** — neutral surfaces, vivid brand hue used sparingly, strong typographic clarity, subtle gradient meshes only in hero, fast micro-interactions.
- **Cal.com / Inngest / Clerk** — modular cards, dense feature grids that read fast, screenshots-as-content, dev-friendly tone.
- **Notion product pages / Statsig docs** — column-disciplined, data-as-content, calm dark-mode peer.

The AI should derive composition with these references' *clarity and density* as the bar. Not copy.

## Voice & tone

- Precise, technical, calm.
- Confident product copy; benefit-led headlines.
- Demonstrates depth via structured detail, not adjectives.
- Dark mode is a first-class peer of light mode.

## Latitude windows

| Dimension | Latitude | Notes |
|---|---|---|
| Hero composition | **HIGH** | Side-by-side hero + UI panel, layered card hero, gradient mesh hero — vary per project. |
| Brand hue | **HIGH** | Single distinctive brand hue per project. |
| Accent (signal) hue | **MEDIUM** | High-contrast, single accent. Avoid multiple. |
| Typography | **MEDIUM** | Geometric sans family pairing; project-defined. |
| Section rhythm | **LOW** | 80–96px desktop, 56–64px tablet, 40–48px mobile. |
| Surface stack | **MEDIUM** | Hairline borders + faint shadows; vary surface neutrals. |
| Motion temperament | **HIGH** within `calm-precise` | 160–220ms; spring on chip selection only. |
| Imagery direction | **MEDIUM** | Real product UI; subtle gradient mesh allowed in hero only. |
| Content density | **LOW** | Balanced everywhere. Hero spacious; pricing dense; docs dense. |

## Starting-point tokens

### Color
- background: near-white (light) / near-black (dark)
- surface: pure white (light) / graphite (dark)
- inset: 1–2% darker than surface
- border: low-contrast neutral
- text: graphite
- muted: slate
- primary: vivid brand hue (deep blue / violet / teal class)
- accent: high-signal contrast (cyan / lime / coral)
- semantic palette standard

### Typography
- display: geometric sans (Inter / Geist class)
- body: same family or paired humanist sans
- mono: technical mono
- display scale: 64 / 56 / 48 / 40
- heading scale: 32 / 28 / 24 / 20 / 18 / 16
- body scale: 16 / 14 / 13
- line-height: 1.1 display, 1.25 headings, 1.6 body
- letter-spacing: -2% display, 0% body

### Spacing
- section rhythm: 80–96px desktop / 56–64px tablet / 40–48px mobile

### Radius
- cards 12, panels 16, inputs/buttons 8–10

## Required quality dimensions

- **hero_composition** — 3 (signature surface)
- **narrative_density** — 3 (clarity is the brand)
- **trust_signal_placement** — 2
- **motion_temperament** — 3 (snappy precision)
- **micro_detail_quality** — 3 (focus rings, transitions, hover feedback)
- **content_punch** — 3

Target for `world_class`: ≥ 17/18.

## Forbidden patterns

- Skeuomorphic textures.
- Heavy drop shadows.
- Decorative animation that delays interaction.
- More than one accent hue.
- Full-bleed photography in hero (this is bold-consumer territory).
- Spring easing for macro motion.
- Sticky-everything navigation.
- Hover-only feature reveals.

## Imagery direction

- Real product UI screenshots.
- Component-level mockups.
- Subtle gradient meshes acceptable in hero only.
- Avoid stock photos of people unless a customer story explicitly demands.

## Required trust real estate

- Hero: customer logo strip OR usage metric.
- Pricing: explicit feature comparison + "Talk to sales" for enterprise.
- Below hero: featured testimonial with named customer + role.
- Footer: SOC 2 / GDPR badges where claim is true; security link.

## Iconography

- Outline 1.5–1.75px stroke; can mix filled for active nav items.
- Sizes 16/20/24.

## Anti-template clause

This file declares content CATEGORIES and OUTCOMES required for this archetype. It MUST NOT name specific components, prescribe layouts, or list visual elements that constrain the planner's composition latitude. Categories are universal across this archetype; component names and compositions are project-specific, authored by the frontend planner per the brief and the visual-differentiation map. If a future edit introduces named components in this file, it is template drift and must be reverted.

## Required content categories (outcome-level, component-agnostic)

- `product_value_statement`: express the core product promise and intended user outcome.
- `capability_demonstration`: show how primary capabilities work using product evidence.
- `workflow_orchestration`: explain how the product fits into existing workflows and integrations.
- `social_proof_surface`: show credible customer or usage evidence.
- `trust_and_security_posture`: expose relevant reliability, privacy, and security assurances.
- `pricing_posture`: clarify plan positioning and enterprise path.
- `decision_support`: provide comparison, FAQ, or objection-resolution content.
- `conversion_pathway`: provide primary CTA plus secondary path for lower-intent users.
- `developer_or_docs_path`: include learning or implementation path where product complexity demands it.
- `footer_compliance_identity`: include required compliance links, legal identity, and attribution contract.

## How to deviate intentionally

- Dev-tool subset may push density higher (more compact rows).
- API-product subset may push toward `dashboard-ops` for the app surface.
- AI-first SaaS subset should switch to `ai-product` archetype, not deviate within modern-saas.

Deviation recorded in `design-system.md` overrides with reason.
