---
archetype: marketplace
positioning: two-sided platform; discovery for buyers, control for sellers
best_for: [marketplaces, classifieds, service_marketplaces, digital_product_marketplaces, rentals]
---

# Marketplace

## Mood references

- **Airbnb / Vrbo / Etsy / Reverb / Whatnot / Substack creators** — neutral surfaces let listings shine, distinctive trust hue, dense filter rails, sticky search.
- **TaskRabbit / Upwork / Fiverr** — service marketplaces with verification UX, reviews per provider.
- **OpenSea / Foundation** — digital marketplaces with curated discovery.

Bar: a buyer can filter from hundreds to one in three interactions; a seller can list in five steps.

## Voice & tone

- Neutral-platform tone.
- Facilitator, not opinionated.
- Buyer-side: discovery and trust.
- Seller-side: clarity and control.

## Latitude windows

| Dimension | Latitude | Notes |
|---|---|---|
| Hero composition | **MEDIUM** | Search-first hero; category chips below. |
| Brand hue | **MEDIUM** | Trust hue (deep teal / blue / green). |
| Verification hue | **LOW** | High-trust hue (teal-green class) — reserved. |
| Accent (CTA) hue | **MEDIUM** | Conversion hue ("Buy", "Book"). |
| Typography | **LOW** | Humanist sans, friendly. Tabular for prices. |
| Section rhythm | **LOW** | 8px base; listing card padding 16-20; sticky filter rail 16. |
| Surface stack | **MEDIUM** | Card with hairline border + mild shadow; inset for filter rail. |
| Motion temperament | **MEDIUM** within `calm-precise` | 160–220ms; spring on chip selection. |
| Imagery direction | **HIGH** | Listing-driven; aspect ratios standardised per listing kind. |
| Content density | **MEDIUM** | Hero medium. Listings dense. Detail balanced. |

## Starting-point tokens

### Color
- background: off-white
- surface: white
- inset: light grey (filter rail, sticky bars)
- primary: trust hue (deep teal / blue / green)
- accent: conversion hue
- semantic palette standard
- verified: high-trust hue (e.g., teal-green)

### Typography
- display: humanist sans, friendly
- body: same family
- heading scale: 32 / 28 / 24 / 20 / 18 / 16
- body scale: 16 / 14 / 13
- tabular figures for prices

### Spacing
- 8px base
- listing card padding 16–20
- sticky filter rail 16
- gallery 24

### Radius
- cards 12, hero panels 16, inputs 8–10

## Required quality dimensions

- **hero_composition** — 2 (search-first; not a signature hero)
- **narrative_density** — 3 (listings-as-content)
- **trust_signal_placement** — 3 (verification + reviews are the brand)
- **motion_temperament** — 2 (snappy)
- **micro_detail_quality** — 3 (filter chip, hover lift, quick-view)
- **content_punch** — 2

Target for `premium`: ≥ 14/18.

## Forbidden patterns

- Single-side bias (forgetting seller-side surfaces).
- Hover-only listing detail.
- Hidden disclosures (fees, refund policy) — must be inline near the price.
- Filter changes triggering page reload.
- Listings without verification or seller info.

## Imagery direction

- Listing-driven; aspect ratios standardised per listing kind.
- Verified-badge overlays where applicable.
- Seller avatars inline.

## Required trust real estate

- Verification badge inline on every seller mention.
- Review aggregate next to listing title.
- Dispute / safety policy links in footer and at checkout.
- Fee transparency near every price.

## Mobile rules

- Bottom dock: Search, Saved, List, Messages, Account.
- Filter and sort live in bottom sheets.

## Iconography

- Outline 1.5px; sizes 16/20/24.
- Filled for selected category chip and verified badge.

## Anti-template clause

This file declares content CATEGORIES and OUTCOMES required for this archetype. It MUST NOT name specific components, prescribe layouts, or list visual elements that constrain the planner's composition latitude. Categories are universal across this archetype; component names and compositions are project-specific, authored by the frontend planner per the brief and the visual-differentiation map. If a future edit introduces named components in this file, it is template drift and must be reverted.

## Required content categories (outcome-level, component-agnostic)

- `search_and_discovery`: enable fast intent-to-results discovery from broad inventory.
- `filter_and_sort_control`: expose robust narrowing/sorting controls with clear state visibility.
- `listing_quality_signal`: present listing quality cues (verification, reviews, freshness, fulfillment data).
- `seller_or_provider_trust`: show identity, history, and confidence markers for counterparties.
- `price_and_fee_transparency`: make total-cost implications understandable near decision points.
- `transaction_confidence`: communicate policy, protection, and dispute pathways.
- `supply_side_enablement`: provide clear creation/listing path for supply contributors.
- `engagement_retention`: support save, compare, and revisit behaviors.
- `multi_channel_conversion`: maintain clear buy/book/contact flow across device states.
- `footer_policy_identity`: include legal, policy, support, and attribution contract.

## How to deviate intentionally

- Service-marketplace subset may emphasise provider-cards over listing-cards.
- Digital-product subset may use `bold-consumer` patterns for hero (curated drop).
- Rental subset must add date-picker prominence in hero.

Deviation recorded in `design-system.md` overrides with reason.
