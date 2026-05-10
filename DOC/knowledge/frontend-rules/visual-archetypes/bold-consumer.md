---
archetype: bold-consumer
positioning: confident DTC / consumer-brand voice; product-as-hero
best_for: [ecommerce, dtc_brands, fashion, beauty, lifestyle, food_and_beverage, premium_consumer_products]
---

# Bold Consumer

## Mood references

- **Allbirds / Aesop / Glossier / Faherty Brand / Klean Kanteen** — full-bleed photography, confident typography, brand-led colour, restrained layout.
- **A24 store / Daily Paper / Outdoor Voices** — editorial commerce; product stories.
- **Apple product launches / Polaroid Originals** — cinematic product photography, bold display type.

Bar: visitor's first impression is *the product*, not the navigation.

## Voice & tone

- Confident, brand-led, image-driven.
- Product photography is the hero; copy is short, punchy, branded.
- Strong opinions about lifestyle and fit.

## Latitude windows

| Dimension | Latitude | Notes |
|---|---|---|
| Hero composition | **HIGH** | Full-bleed image, layered editorial, lookbook-style — varies per drop / season. |
| Brand hue | **HIGH** | Brand-defined; one signature hue + broad neutral. |
| Accent (CTA) hue | **MEDIUM** | Contrasting; single. |
| Typography | **HIGH** | Distinctive serif OR bold display sans — brand-defining. |
| Section rhythm | **MEDIUM** | 64–96px desktop / 40–64px mobile; full-bleed surfaces break the rhythm. |
| Surface stack | **HIGH** | Full-bleed, borderless, image-dominant. |
| Motion temperament | **HIGH** within `restrained-cinematic` | 240–320ms; subtle parallax allowed in hero only. |
| Imagery direction | **HIGH** | Editorial product, lifestyle, model shots. No stock. |
| Content density | **MEDIUM** | Spacious hero. PDP rich (gallery + variants + reviews + materials). |

## Starting-point tokens

### Color
- background: brand-tinted neutral or cream
- surface: pure white
- primary: brand signature hue
- accent: contrasting CTA hue
- semantic palette standard

### Typography
- display: distinctive serif OR bold display sans (brand-defining)
- body: readable humanist sans
- display scale: 80 / 72 / 64 / 56 (full-bleed hero)
- heading scale: 40 / 32 / 28 / 24 / 20
- body scale: 18 / 16

### Spacing
- hero often full-viewport
- product grid: 4-col desktop / 2-col mobile
- section rhythm: 64–96px desktop / 40–64px mobile

### Radius
- 8–12; sharp-leaning to feel curated

## Required quality dimensions

- **hero_composition** — 3 (product is the hero)
- **narrative_density** — 2
- **trust_signal_placement** — 2 (reviews + free-shipping banner)
- **motion_temperament** — 3 (cinematic restraint)
- **micro_detail_quality** — 3 (gallery + zoom + variant feedback)
- **content_punch** — 3 (every line earns)

Target for `world_class`: ≥ 16/18.

## Forbidden patterns

- Stock photography.
- Cluttered hero (multiple competing CTAs).
- Over-animation that fights the photography.
- Modal pop-ups blocking first view.
- Auto-play video with sound.
- Generic "free shipping over $X" banner with no design care.
- Filter sidebar that takes >50% of mobile viewport.

## Imagery direction

- Editorial product photography.
- Lifestyle + studio mix.
- Model shots when fit/sizing matters.
- Aspect ratios: 4:5 PDP, 1:1 grid, 3:4 lifestyle, 16:9 storytelling.
- Avoid heavy filters or generic stock.

## Required trust real estate

- Top-of-page banner: free-shipping / returns where applicable.
- Hero: brand statement + featured product.
- PDP: review aggregate + size guide + materials + shipping ETA.
- Mid-page: press / awards strip if available.
- Footer: secure-checkout badges, return policy summary.

## Iconography

- Minimal; mostly text + small icons (cart / wishlist / account / search).
- Outline 1.5px stroke.

## Anti-template clause

This file declares content CATEGORIES and OUTCOMES required for this archetype. It MUST NOT name specific components, prescribe layouts, or list visual elements that constrain the planner's composition latitude. Categories are universal across this archetype; component names and compositions are project-specific, authored by the frontend planner per the brief and the visual-differentiation map. If a future edit introduces named components in this file, it is template drift and must be reverted.

## Required content categories (outcome-level, component-agnostic)

- `brand_impact_statement`: deliver an immediate brand-led value impression.
- `hero_product_focus`: present flagship product or collection with strong visual priority.
- `collection_or_catalog_signal`: help users discover what to browse next.
- `product_evidence_surface`: expose materials, craftsmanship, or usage evidence.
- `social_proof_surface`: include review, press, or community validation.
- `purchase_confidence`: clarify shipping, returns, and sizing/fit confidence signals.
- `storytelling_extension`: include lifestyle/editorial narrative that supports purchase intent.
- `conversion_pathway`: ensure clear buy/shop path with repeated CTA opportunity.
- `post_purchase_trust`: provide guarantees and support-path clarity.
- `footer_commerce_identity`: include legal, policy, support, and attribution contract.

## How to deviate intentionally

- Beauty / skincare subset may push toward soft pastel palettes (within brief override).
- Food / beverage subset may go richer / more textural.
- Premium luxury subset may push display scale even larger.

Deviation recorded in `design-system.md` overrides with reason.
