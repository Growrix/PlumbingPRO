---
archetype: startup-conversion
positioning: aggressive conversion-first landing page voice; high-energy without losing trust
best_for: [landing_page, growth_campaigns, single_offer_pages, beta_launches]
---

# Startup Conversion

## Mood references

- **Loom landing campaigns / Cron landing / Beehiiv landing / Tella.tv** — single offer, single CTA repeated, social proof loud-and-early, bold display type, energetic micro-motion.
- **Gumroad creator pages / Lemonsqueezy** — playful confidence, brand-led colour, product-as-hero.
- **Intercom feature launches** — clear narrative arc from problem → demo → social proof → CTA.

Bar: visitor reaches CTA conviction within 30 seconds.

## Voice & tone

- Direct, benefit-first, urgency-aware.
- One offer; one CTA; ruthless about anything competing.
- Social proof loud and early.

## Latitude windows

| Dimension | Latitude | Notes |
|---|---|---|
| Hero composition | **HIGH** | Bold display headline, layered proof, animated demo embed. |
| Brand hue | **HIGH** | One bold saturated hue. |
| Accent (CTA) hue | **HIGH** | Must be highest-contrast element; varies per project. |
| Typography | **MEDIUM** | Bold geometric sans with weight contrast. |
| Section rhythm | **LOW** | 64–96px desktop, 48–64px tablet, 40–48px mobile. |
| Surface stack | **MEDIUM** | Borderless cards with shadow OR hairline-bordered without shadow. |
| Motion temperament | **HIGH** within `alive-energetic` | 160–220ms; spring on chip selection / button press. |
| Imagery direction | **MEDIUM** | Real screenshots, founder photos, customer logos. Bold supporting graphics. |

## Starting-point tokens

### Color
- background: off-white or near-black depending on brand mood
- surface: white / deep neutral
- primary: bold saturated brand hue
- accent: vivid contrast (electric cyan / lime / coral)
- semantic palette standard

### Typography
- display: bold geometric sans, weight 800/900
- body: humanist sans, weight 400/500
- display scale: 80 / 72 / 64 / 56
- heading scale: 40 / 32 / 28 / 24
- body scale: 18 / 16
- line-height: 1.0–1.1 display, 1.2 headings, 1.6 body

### Spacing
- section rhythm: 64–96px desktop / 48–64px tablet / 40–48px mobile

### Radius
- cards 12, hero panels 16, inputs/buttons 10–12, pill-CTA optional

## Required quality dimensions

- **hero_composition** — 3 (single offer must land hard)
- **narrative_density** — 3 (problem → demo → proof → CTA arc)
- **trust_signal_placement** — 3 (loud and early; logo strip + testimonial)
- **motion_temperament** — 2 (energetic but not noisy)
- **micro_detail_quality** — 2
- **content_punch** — 3 (every word earns; no filler)

Target for `world_class`: ≥ 16/18.

## Forbidden patterns

- More than one offer per page.
- Hero clutter; the CTA must be unmistakable.
- Endless gradient walls; one accent gradient max.
- Site-wide nav menu (kill secondary nav).
- Auto-playing video with sound.
- Pop-up modal on landing.
- Multiple competing CTAs ("Buy now" + "Learn more" + "Book demo" all on hero).
- Footer with full marketing nav (use minimal footer).

## Imagery direction

- Real product screenshots.
- Founder photos (when relevant).
- Customer logos.
- Avoid stock illustrations.
- Bold supporting graphics (oversized arrows, underlines, hand-drawn feel).

## Required trust real estate

- Hero: headline + sub + dual CTA (primary + watch-demo).
- Below hero: customer logo strip → product UI panel → testimonial cluster.
- Repeated CTA at mid-page and footer.

## Iconography

- Mixed: outline for utility, filled for emphasis.
- Sizes 20/24/32.

## Anti-template clause

This file declares content CATEGORIES and OUTCOMES required for this archetype. It MUST NOT name specific components, prescribe layouts, or list visual elements that constrain the planner's composition latitude. Categories are universal across this archetype; component names and compositions are project-specific, authored by the frontend planner per the brief and the visual-differentiation map. If a future edit introduces named components in this file, it is template drift and must be reverted.

## Required content categories (outcome-level, component-agnostic)

- `single_offer_clarity`: present one offer and one core conversion intent without ambiguity.
- `problem_to_outcome_arc`: narrate pain-to-value progression quickly.
- `proof_early_signal`: place social proof and credibility near top decision zone.
- `product_or_demo_evidence`: show tangible evidence of the offer in action.
- `objection_resolution`: handle high-friction objections concisely.
- `urgency_or_timing_context`: communicate urgency/timing when legitimate and non-manipulative.
- `repeat_conversion_prompts`: provide repeated, consistent CTA opportunities along scroll depth.
- `friction_minimization`: reduce navigation and decision overhead on the path to action.
- `post_conversion_expectation`: clarify what happens immediately after conversion.
- `minimal_footer_identity`: preserve policy/legal identity and attribution contract with low distraction.

## How to deviate intentionally

- Beta-launch subset may push the "early access" mood with restrained palette and waitlist UX.
- Creator-tool subset may shift toward `bold-consumer` archetype if the offer is consumer-facing.
- B2B SaaS subset should NOT use this archetype for product pages — use `modern-saas`. This archetype is for *landing campaigns only*.

Deviation recorded in `design-system.md` overrides with reason.
