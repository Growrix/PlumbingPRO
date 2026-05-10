---
archetype: local-business-trust
positioning: warm, credible, locally-rooted; built for service businesses where trust drives conversion
best_for: [local_services, home_services, healthcare_clinics, legal_services, accounting, restaurants, automotive]
---

# Local Business Trust

## Mood references

- **Top-100 local-service Google Business sites + best-in-class HVAC / plumbing / dental sites** — phone number prominent, badges visible, real photography, light-first.
- **Independent restaurant sites with confident typography** (e.g., NYC neighbourhood restaurants) — voice + place, not generic.
- **Local law / accounting firm sites that read trustworthy without being stuffy** — clean column work, real team photography.

Bar: a homeowner under stress can find the phone number and book in under 15 seconds.

## Voice & tone

- Friendly, plain-spoken, professional.
- Lead with "we serve <area>", "licensed and insured", "<n> years in business".
- Avoid corporate jargon and empty superlatives.
- Light-first; trust is the goal; dark mode optional.

## Latitude windows

| Dimension | Latitude | Notes |
|---|---|---|
| Hero composition | **HIGH** | Real photo or work-site backdrop; outcome statement + locality + multi-channel CTA. |
| Brand hue | **MEDIUM** | Credible deep hue (navy / teal / forest / burgundy). |
| Accent (CTA) hue | **MEDIUM** | Warm CTA hue (amber / orange / copper). |
| Typography | **LOW** | Highly legible humanist; bigger body for older audiences. |
| Section rhythm | **LOW** | 80px desktop / 56px tablet / 40px mobile. |
| Surface stack | **MEDIUM** | Hairline border + mild shadow; vary card density per surface. |
| Motion temperament | **MEDIUM** within `calm-precise` | 220–280ms; reduced-motion fallback mandatory and visually equivalent. |
| Imagery direction | **HIGH** | Real photos of staff, vehicles, work sites, before/after. No stock. |
| Content density | **LOW** | Spacious hero. Balanced services & proof. Dense footer. |

## Starting-point tokens

### Color
- background: off-white warm neutral
- surface: pure white or near-white
- primary: credible deep hue (navy / teal / forest / burgundy)
- accent: warm CTA hue (amber / orange / copper)
- destructive: muted red
- success: forest green
- info: muted steel blue
- warning: amber

### Typography
- display: confident sans with humanist warmth
- body: highly legible humanist sans
- display scale: 56 / 48 / 40 / 32
- heading scale: 32 / 28 / 24 / 20 / 18
- body scale: 18 / 16 / 14
- line-height: 1.15 display, 1.3 headings, 1.65 body (highly readable)

### Spacing
- section rhythm: 80px desktop / 56px tablet / 40px mobile
- card padding: 24 standard / 20 dense mobile

### Radius
- cards 12, hero panels 16, inputs/buttons 10–12

## Required quality dimensions

- **hero_composition** — 3 (real photo + locality + CTA must land)
- **narrative_density** — 2
- **trust_signal_placement** — 3 (license, years, areas, response time, reviews)
- **motion_temperament** — 2 (reassuring restraint)
- **micro_detail_quality** — 2
- **content_punch** — 2

Target for `premium`: ≥ 14/18.

## Forbidden patterns

- Hero illustration that hides what the business looks like.
- Overly playful copy that erodes trust.
- Hidden phone numbers or contact paths.
- Stock photography of "smiling teams" that isn't the actual team.
- Dark mode by default — light mode is the trust default.
- Generic "we are passionate about service" filler copy.
- Multi-step quote forms requiring email before showing pricing.
- Auto-play videos.
- Decorative motion that competes with the phone CTA.

## Imagery direction

- Real photos of staff, vehicles, work sites, before/after galleries.
- Genuine customer photos when permission granted.
- Avoid stock photos of people; locality must feel authentic.
- Aspect ratios: 4:3 features, 1:1 staff portraits, 16:9 work-site.

## Required trust real estate (non-negotiable for this archetype)

- **Header utility:** phone number + business hours.
- **Hero:** licensed/insured badges, years in business, areas served list.
- **Below hero:** review aggregate (rating + count + source).
- **Service detail:** same-day availability badge, response-time promise.
- **Footer:** license numbers, full address, business hours, areas served.
- **Sticky mobile:** primary contact CTA pinned (per `responsive-rules.md`).

## Iconography

- Outline 1.5–2px stroke.
- Filled icons for badges and status.

## Anti-template clause

This file declares content CATEGORIES and OUTCOMES required for this archetype. It MUST NOT name specific components, prescribe layouts, or list visual elements that constrain the planner's composition latitude. Categories are universal across this archetype; component names and compositions are project-specific, authored by the frontend planner per the brief and the visual-differentiation map. If a future edit introduces named components in this file, it is template drift and must be reverted.

## Required content categories (outcome-level, component-agnostic)

- `locality_outcome_statement`: clarify what is delivered, where service is available, and why this business is a fit.
- `urgency_evidence`: surface response-time or availability evidence near the primary conversion path.
- `trust_signal_cluster`: expose licensing, years, certifications, warranty, and other trust proofs relevant to the brief.
- `capability_map`: present core services/offers with clear user-oriented outcomes.
- `customer_voice`: provide testimonial/review evidence with source and context.
- `local_proof`: show area coverage and grounded proof (real work, team, or locality evidence).
- `process_disclosure`: explain how engagement works when process clarity affects conversion.
- `pricing_posture`: communicate range/transparency posture or quote path expectations.
- `objection_handling`: address high-friction questions and risk concerns.
- `multi_channel_conversion`: provide at least one primary and one alternate conversion path across breakpoints.
- `footer_credibility`: include legal/business identity, hours/contact context, and required attribution contract.

## How to deviate intentionally

- Healthcare subset must add HIPAA-aware copy; remove "instant booking" if regulator demands.
- Legal subset must add regulator/license disclaimer footer.
- Premium-tier service business may shift accent toward editorial-premium tones (with documented brief override).

Deviation recorded in `design-system.md` overrides with reason.
