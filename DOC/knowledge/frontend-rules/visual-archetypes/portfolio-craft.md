---
archetype: portfolio-craft
positioning: craft-led personal / studio / agency portfolio; project work as the centerpiece
best_for: [creator_portfolio, studio_site, agency_portfolio, designer_portfolio, photographer, freelancer]
---

# Portfolio Craft

## Mood references

- **Bruno Simon / Rauno Freiberg / Ueno / Locomotive Studio / Resn** — cinematic case studies, oversized type, cursor-follow accents, scroll storytelling.
- **The New York Times "Snow Fall" / Pitchfork best-of features** — editorial scrolling, layered media, narrative-led.
- **Photographers' folios (Nick Knight / Tim Walker)** — image-first, restrained chrome, gallery-led.

Bar: each project case study feels distinct enough that a viewer can't tell two are from the same studio at first glance.

## Voice & tone

- Confident, work-led, low ego.
- Project speaks first, narrative second.
- Selective: a few strong cases beats many weak ones.

## Latitude windows

| Dimension | Latitude | Notes |
|---|---|---|
| Hero composition | **HIGH** | Oversized statement, layered editorial, full-bleed media — varies per studio. |
| Brand hue | **MEDIUM** | Restrained; signature studio hue. |
| Per-case-study accent override | **HIGH** | Each case study may locally override accent to match the project brand — encouraged. |
| Typography | **HIGH** | Distinctive — serif or display sans — brand-defining. |
| Section rhythm | **MEDIUM** | 96–128px desktop; generous case-study padding. |
| Surface stack | **HIGH** | Borderless cards, image dominance, oversized media frames. |
| Motion temperament | **HIGH** within `restrained-cinematic` | 240–320ms; subtle parallax in case-study heroes; cursor-follow allowed if subtle. |
| Imagery direction | **HIGH** | High-quality project work (UI screens, photography, video reels). |
| Content density | **LOW** | Spacious project showcase. |

## Starting-point tokens

### Color
- background: near-white or near-black depending on mood
- surface: pure white / graphite
- inset: very subtle neutral
- primary: signature studio hue
- accent: contextual (per-case-study override allowed)
- semantic palette standard

### Typography
- display: distinctive — serif or display sans (brand-defining)
- body: humanist sans
- display scale: 96 / 80 / 64 / 56 (oversized hero common)
- heading scale: 40 / 32 / 24 / 20
- body scale: 18 / 16
- line-height: 1.0–1.05 display (oversized), 1.3 headings, 1.7 body

### Spacing
- section rhythm: 96–128px desktop / 64px tablet / 48px mobile
- generous case-study padding

### Radius
- 8–16; sharp-leaning for craft feel

## Required quality dimensions

- **hero_composition** — 3 (every case study hero must be distinct)
- **narrative_density** — 3 (work + outcome + role + context)
- **trust_signal_placement** — 2 (clients list, named outcomes)
- **motion_temperament** — 3 (cinematic restraint)
- **micro_detail_quality** — 3 (gallery, scroll-trigger, hover state)
- **content_punch** — 3 (every case study earns its space)

Target for `world_class`: ≥ 17/18.

## Forbidden patterns

- Templated stock visuals.
- Loud animations that distract from the work.
- Mixed visual systems across case studies (each can have its own accent, but layout primitives stay consistent).
- Generic "we are passionate" copy.
- Walls of text without media breaks.
- Hidden case studies (everything visible from the work index).

## Imagery direction

- High-quality project work (UI screens, photography, video reels).
- Aspect ratios standardised per case-study type.
- Avoid stock imagery entirely.

## Case-study structure mandate

Every case study spec MUST include:
- Hero image with project name and role.
- Context (client, year, team).
- Problem.
- Approach.
- Solution media (screens, photos, video).
- Outcome (metrics or testimonial).
- Next-project navigator at the bottom.

The *composition* of these surfaces is at HIGH latitude — each case study should feel different.

## Required trust real estate

- Clients list (logo strip or named list).
- Per-case outcome (metric or named result).
- Founder / studio bio with real photo.
- Press / awards strip if applicable.

## Iconography

- Used sparingly; outline 1.5px.

## Anti-template clause

This file declares content CATEGORIES and OUTCOMES required for this archetype. It MUST NOT name specific components, prescribe layouts, or list visual elements that constrain the planner's composition latitude. Categories are universal across this archetype; component names and compositions are project-specific, authored by the frontend planner per the brief and the visual-differentiation map. If a future edit introduces named components in this file, it is template drift and must be reverted.

## Required content categories (outcome-level, component-agnostic)

- `craft_identity_statement`: establish maker/studio identity and value proposition.
- `work_index_surface`: provide navigable overview of selected work.
- `case_study_proof`: include project-level evidence with context and outcomes.
- `process_or_methodology`: show how work is approached where it improves trust.
- `client_or_collaboration_signal`: provide collaboration credibility (clients, roles, partners, testimonials).
- `media_depth_surface`: present multi-modal work proof (visuals, interactions, narrative).
- `service_or_engagement_path`: clarify how prospects can engage.
- `distinctive_visual_signature`: ensure each major project surface is visually differentiated.
- `insight_or_reflection_extension`: add thinking/notes layer where relevant to credibility.
- `footer_identity_and_attribution`: include legal/contact identity and attribution contract.

## How to deviate intentionally

- Photographer subset emphasises gallery + lightbox over UI screens.
- Developer-portfolio subset may push toward `modern-saas` for the work index.
- Studio portfolio with productised offerings may add a small `bold-consumer` shop overlay.

Deviation recorded in `design-system.md` overrides with reason.
