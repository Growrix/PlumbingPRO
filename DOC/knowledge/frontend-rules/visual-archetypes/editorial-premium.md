---
archetype: editorial-premium
positioning: premium product studio meets editorial publication
best_for: [professional_services, creator_or_portfolio, content_site, publication, agency_site]
---

# Editorial Premium

## Mood references (study, don't copy)

Reference quality bar — what world-class output in this archetype feels like:
- **Stripe blog / Pitch.com / Linear changelog** — refined typography hierarchy, generous whitespace, restrained chromatic accent.
- **Field Notes brand site / Are.na** — paper-like surfaces, editorial rhythm, content-as-protagonist.
- **Apple Newsroom / Bloomberg Businessweek microsite** — column discipline, photography-as-statement, restrained motion.

The AI should derive composition and signature moments at the *quality* of these references. Not copy them.

## Voice & tone

- Refined, calm, high-trust.
- Whitespace is content.
- Typographic hierarchy carries the design weight; decoration is restrained.
- Premium without ostentation.

## Latitude windows (where the AI may exercise design judgment)

| Dimension | Latitude | Notes |
|---|---|---|
| Hero composition | **HIGH** | Asymmetric splits, layered surfaces, oversized type, editorial column overrides — all encouraged. Avoid clichés. |
| Accent color | **MEDIUM** | Stay within warm-complementary band of the primary; avoid neon. |
| Typography pairing | **MEDIUM** | Display + body + mono pairing must satisfy the scale below; the actual font choice is project-driven. |
| Section rhythm | **LOW** | Stay within 80–128px desktop section padding. |
| Surface stack | **HIGH** | Layered (paper / panel / inset / overlay) compositions encouraged; vary per route. |
| Motion temperament | **HIGH** within `restrained-cinematic` | 200–280ms band; ease-out preferred; no spring. |
| Imagery direction | **MEDIUM** | Editorial photography, real product UI, annotated mockups; avoid stock. |
| Content density | **LOW** | Spacious on hero, value, proof. Balanced on listings and detail. |

## Starting-point tokens (overridable per latitude)

These are starting points the design_system_planner uses when no project-specific override is provided. The HIGH/MEDIUM latitude dimensions above grant override authority.

### Color
- background: warm paper (e.g., `#F5F1E8`)
- surface: near-white (e.g., `#FFFDF8`)
- inset: slightly darker neutral
- border: low-contrast neutral
- text: deep graphite
- muted: slate-grey
- primary: deep teal or deep navy
- accent: warm copper / amber
- destructive / success / info / warning: standard semantic palette

### Typography
- display family: refined geometric sans (e.g., Cabinet Grotesk class)
- body family: humanist sans (e.g., Manrope class)
- mono family: technical-feel mono (e.g., JetBrains Mono class)
- display scale: 72 / 64 / 56 / 48
- heading scale: 40 / 32 / 28 / 24 / 20 / 18
- body scale: 18 / 16 / 14
- line-height: 1.05–1.15 display, 1.2–1.35 headings, 1.55–1.7 body
- letter-spacing: -1% display, 0% body, +6% overline/eyebrow

### Spacing
- section rhythm: 96px desktop / 64px tablet / 48px mobile
- card padding: 24 standard / 32 premium / 16 dense mobile

### Surfaces
- page base: warm paper with subtle grid noise
- elevated: soft white, hairline border, mild shadow
- inset: slightly darker neutral
- overlay: blurred dark translucent

### Radius
- cards 16, hero panels 24, inputs/buttons 12

## Required quality dimensions (for scoring)

Weighted importance for this archetype:
- **hero_composition** — 3 (signature surfaces must be uniquely composed)
- **narrative_density** — 3 (typography carries the experience)
- **trust_signal_placement** — 2 (calm trust, not aggressive)
- **motion_temperament** — 3 (cinematic restraint is a defining signal)
- **micro_detail_quality** — 3 (corners, focus rings, hover transitions matter)
- **content_punch** — 3 (every line earns its place)

Total target for `quality_target_score: world_class`: ≥ 17/18.

## Forbidden patterns (cliché tropes — never use)

- "Premium hero" with massive blurred gradient and one-line CTA only — overused.
- Neon gradient backgrounds.
- Oversaturated chromatic accent (>15% of screen at any moment).
- More than two accent hues on screen simultaneously.
- Decorative motion that does not aid clarity.
- Spring easing for macro motion.
- Hover scale > 1.02.
- Stock photography.
- Generic developer "team-at-laptop" hero.
- Heavy drop-shadows for editorial surfaces (use hairline borders).
- Section reveals with > 16px translateY.

## Imagery direction

- Editorial photography, real product UI, annotated mockups.
- Aspect ratios: 16:10 panels, 4:3 features, 9:16 mobile.
- Black-and-white or muted-color photography preferred for personality surfaces; avoid heavy filters.
- Custom illustration only when commissioned (no clip-art).

## Required trust real estate (per-page constraints)

- Hero: outcome statement + restrained proof (logo strip, metric line, named testimonial).
- Below hero: featured proof artefact (case study with named outcome).
- Footer: named registered address (or registered company line) where applicable.

## Iconography

- Outline-first, 1.75px stroke, sizes 16/20/24/32.
- Filled icons reserved for status badges.

## Anti-template clause

This file declares content CATEGORIES and OUTCOMES required for this archetype. It MUST NOT name specific components, prescribe layouts, or list visual elements that constrain the planner's composition latitude. Categories are universal across this archetype; component names and compositions are project-specific, authored by the frontend planner per the brief and the visual-differentiation map. If a future edit introduces named components in this file, it is template drift and must be reverted.

## Required content categories (outcome-level, component-agnostic)

- `editorial_outcome_statement`: establish a clear thesis and user value in premium editorial voice.
- `credibility_evidence`: provide named trust proof (outcomes, clients, credentials, or references).
- `narrative_backbone`: structure long-form supporting narrative with scannable hierarchy.
- `featured_proof_artifact`: include one high-signal proof artifact with context.
- `capability_or_service_overview`: clarify offering scope without collapsing into generic templates.
- `differentiation_surface`: communicate what sets the offering apart with specific claims.
- `decision_support`: resolve objections with contextual FAQ, methodology, or process transparency.
- `conversion_pathway`: provide clear primary and secondary actions aligned to intent.
- `insight_or_content_extension`: include an editorial extension surface (insights, highlights, or references).
- `footer_credibility_identity`: preserve legal identity, trust links, and attribution contract.

## How to deviate intentionally

The HIGH-latitude dimensions encourage deviation when the brief or industry pack signals it. Examples of *intentional* deviation:
- A finance / legal subset of editorial-premium might shift accent to muted oxblood instead of copper — recorded as a brief override.
- A creator portfolio variant might shift section rhythm down to 80px and use oversized type — recorded under the project's design-system overrides.

Deviation MUST be recorded in `design-system.md` overrides block with reason. Undocumented deviation is drift.
