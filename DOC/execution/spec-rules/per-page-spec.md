# Spec Template — Per-Page Design Brief

Emitted by `frontend_planner` (page-design phase). One file per route, written to `<output_root>/pages/<route-slug>.md`.

`<output_root>` MUST resolve to `DOC/output/runs/<timestamp>/planning/frontend`.

---

## Philosophy

This is a **design brief + implementation blueprint**. The planner authors outcomes, constraints, and forbidden patterns, then provides a section-by-section blueprint with publish-ready draft copy so the frontend developer can implement without redesigning content or layout strategy.

Pages that look the same across a site = template collapse. Pages that satisfy outcomes + constraints + differentiation = world-class output.

---

## Required frontmatter

```yaml
---
document_type: per-page-design-brief
page_id: <slug>
route: /...
project_archetype: marketing_site|saas_app|...
visual_archetype: knowledge/frontend-rules/visual-archetypes/<file>.md
build_stage: 4-page-design
auth: public|protected
data_source: static|cms|database|integration|mixed
creative_latitude: HIGH|MEDIUM|LOW
quality_target_score: <0-18>
depends_on:
  - master-ui-architecture.md
  - design-system.md
  - component-system.md
  - motion-system.md
  - content-library.md
  - visual-differentiation-map.md
content_keys_used:
  - "<surface>.<context>.<key>"
  - ...
---
```

`creative_latitude` rules:
- **HIGH** — hero, conversion-critical surfaces, signature pages. Planner authors brief; developer composes from primitives. No prescriptive section list.
- **MEDIUM** — supporting feature surfaces, secondary conversion. Planner authors brief + outline; developer composes within outline.
- **LOW** — utility surfaces (404, legal, FAQ, status). Planner authors brief + standard composition; developer follows.

`quality_target_score` is the page's required score against the quality matrix in `quality-bar-scoring.md`. Audit fails if score below target.

---

## Required sections (in this order)

### 1. Page Definition
- **User intent** (1 sentence) — what the visitor wants.
- **Conversion outcome** (1 sentence) — what success looks like; the metric.
- **Primary CTA** (label as content key + destination).
- **Secondary CTA** (label as content key + destination).
- **KPI to optimise** (e.g., booking rate, demo signup rate, CTR).

### 2. Outcomes (what must be true; not how)
List 3–7 outcome statements. Each is a measurable user truth, not a UI prescription.

Examples:
- "Visitor reaches conversion CTA in ≤ 3 scrolls on desktop and ≤ 2 viewports on mobile."
- "Trust evidence appears above the fold for first-time visitors."
- "Pricing surface scrolls without jumping; tier comparison is parseable in 5 seconds."
- "AI streaming feels alive within 200ms of submit."

Forbidden examples (these are HOW, not WHAT):
- ~~"Section 1 is the hero, section 2 is value, section 3 is proof…"~~
- ~~"Use the PricingTable component."~~

### 3. Required content slots
List the **content the page must carry**. This list is exhaustive and must align with the Section Blueprint below.

```yaml
required_content_slots:
  - slot: hero_offer
    type: headline + subhead + primary_cta
    content_keys: [home.hero.headline, home.hero.subheadline, home.hero.cta_primary]
  - slot: trust_evidence
    type: customer_logos | testimonial | metric | review_aggregate
    content_keys: [home.trust.metric_value, home.trust.metric_label]
  - slot: feature_proof
    type: feature_demonstration
    content_keys: [home.features.items[*].title, home.features.items[*].body]
  - slot: conversion_repetition
    type: cta_repetition (must appear ≥ 2× on the page, with at least one in the lower viewport)
    content_keys: [home.cta_band.headline, home.cta_band.cta_primary]
```

### 4. Forbidden patterns
List patterns this page MUST NOT use — usually relative to other routes on the site.

Examples:
- "MUST NOT use the same hero composition as `services` or `pricing`."
- "MUST NOT stack feature cards in a 3-column grid (used by `/services`); use a different composition primitive."
- "MUST NOT use the cinematic motion temperament reserved for the home hero."
- "MUST NOT use generic stock photography."

### 5. Visual differentiation
Reference the relevant entry from `visual-differentiation-map.md`. Restate the deltas:

```yaml
differentiation_vs_routes:
  - route: /services
    delta_dimensions: [hero_composition, primary_section_rhythm, motion_temperament]
    delta_summary: "Home uses asymmetric split hero; services uses centered editorial. Home opens with cinematic reveal; services opens with calm fade."
  - route: /pricing
    delta_dimensions: [content_density, surface_stack]
    delta_summary: "Home is spacious; pricing is balanced-dense with comparison rail."
```

### 6. Composition guidance (per latitude)

**For HIGH latitude:**
List composition primitives and provide a concrete section-order blueprint. Component names remain implementation-defined.
```yaml
composition_palette:
  primitives_allowed: [Stack, Cluster, Frame, Surface, Reveal, Grid, MediaFrame, Trail]
  surface_stack_pattern: "layered (paper base + frosted panel + inset data well + elevated CTA card)"
  rhythm_pattern: "irregular (hero spacious, mid-page dense, conversion spacious)"
  asymmetry_target: "60/40 split hero; 40/60 mid-page reverse"
section_blueprint:
  - section_id: hero
    purpose: "Immediate value proposition and primary conversion"
    draft_copy:
      headline: "..."
      subhead: "..."
      cta_primary: "..."
      cta_secondary: "..."
    layout:
      desktop: "..."
      tablet: "..."
      mobile: "..."
    surface: "..."
    interactions: ["..."]
  - section_id: trust_strip
    purpose: "..."
    draft_copy:
      heading: "..."
      body: "..."
    layout:
      desktop: "..."
      tablet: "..."
      mobile: "..."
    surface: "..."
    interactions: ["..."]
```

**For MEDIUM latitude:**
List a recommended outline plus section-level draft copy and layout intent; developer may deviate with documented reason.
```yaml
recommended_outline:
  - hero
  - value_proof
  - feature_demonstration
  - faq_or_objection_handling
  - conversion_band
  - footer
deviation_allowed: yes
deviation_must_document: "Deviation note in component spec or audit file."
section_blueprint_required: true
```

**For LOW latitude:**
Specify the standard composition explicitly with section-level draft copy and responsive layout notes.
```yaml
standard_composition:
  - header
  - hero (utility)
  - body (legal text, FAQ accordion, or 404 message)
  - footer
section_blueprint_required: true
```

### 6.1 Section blueprint (required for all latitudes)
For every planned section in visual order, include:
- `section_id` and UX purpose
- `content_slots` mapped to keys
- `draft_copy` (publish-ready, not placeholder)
- desktop/tablet/mobile layout intent
- surface treatment and contrast notes
- interaction and state hooks for this section

If facts are client-specific and unknown, provide realistic draft copy and flag the exact field in section-level open questions.

### 7. Motion temperament
Reference the chosen temperament from `motion-system.md`. State the surface's mood and key moments.

```yaml
motion:
  temperament: restrained-cinematic | alive-energetic | calm-precise | playful-staccato
  key_moments:
    - moment: hero_entrance
      purpose: hierarchy
      reduced_motion_fallback: instant_fade
    - moment: scroll_reveal_value
      purpose: clarity
      reduced_motion_fallback: instant
    - moment: cta_hover_lift
      purpose: feedback
      reduced_motion_fallback: shadow_only
forbidden_motion:
  - "no parallax outside hero"
  - "no auto-play with sound"
```

### 8. Page-level state requirements
- Loading skeleton (where & what).
- Error fallback (where & how to recover).
- Empty / filtered-empty (where applicable).
- Auth state (when protected: redirect or block).
- Network offline (where applicable, e.g., chat, real-time).

### 9. Responsive intent (not prescription)
Describe the **intent** at each breakpoint, not the layout literally.

```yaml
responsive_intent:
  desktop: "spacious, asymmetric, layered surfaces; hero claims 80vh"
  tablet:  "compress laterally; preserve asymmetry; hero claims 70vh"
  mobile:  "single column; hero claims 90vh; sticky bottom CTA appears below the fold"
```

### 10. SEO and metadata
```yaml
seo:
  title:           "..."
  description:     "..."
  og_title:        "..."
  og_description:  "..."
  og_image:        <key or path>
  canonical:       "<url pattern>"
  schema_org:
    "@context": "https://schema.org"
    "@type":    "..."
    properties:
      ...
```

### 11. Conversion path
- `primary_path`: ordered surfaces.
- `secondary_path`: ordered alternative.
- `exit_points`: legitimate next destinations.

### 12. Accessibility plan
```yaml
accessibility:
  landmarks: [header, main, footer, nav]
  skip_link: "#main-content"
  heading_outline:
    - h1: <key>
    - h2: <key>
  notable_aria:
    - "<note>"
  contrast_checks:
    - "<check result>"
  motion_prefers_reduced:
    - "<adapted behaviour>"
```

### 13. Performance plan
```yaml
performance:
  lcp_target_ms: 2500
  hero_image:
    path_or_key: <key>
    format: avif
    weight_kb_target: 200
    priority: true
  route_js_budget_kb_gz: 90
  client_components:
    - <name>: <reason it must be client>
  defer_below_fold: true
```

### 14. Data fetching plan
For each surface with a non-static data source:
- Fetch location: server component / route handler / client.
- Cache strategy: `force-cache` | `revalidate: <seconds>` | `no-store`.
- Failure mode: how the surface degrades if the source fails.

### 15. Form plan (if the page contains a form)
- Field list with labels (content keys), types, required-flag, validation rules (zod).
- Submit endpoint and method.
- Success / error / validation / network states.
- Privacy notice content key (placed adjacent to submit).

### 16. Analytics plan
- Page-view event name + properties.
- Conversion events (CTA clicks, form submits, signups, purchases).
- Event names referenced from a typed events constant module.

### 17. Quality bar scoring (target + dimensions)
Reference `quality-bar-scoring.md`. List the page's target score and the dimensions to score:

```yaml
quality_bar:
  target_score: 17  # of 18 (world_class)
  dimensions:
    hero_composition:        target: 3
    narrative_density:       target: 3
    trust_signal_placement:  target: 3
    motion_temperament:      target: 3
    micro_detail_quality:    target: 3
    content_punch:           target: 2
```

### 18. Open questions for human
Anything the planner could not resolve from the brief and rules — flagged for the human.

### 19. Section-level open questions ledger
For each unresolved field in any section blueprint, list:
- `section_id`
- `field`
- `current_draft_value`
- `client_replacement_needed` (yes/no)
- `impact_if_unchanged`

---

## Reviewer checks per page brief

- Frontmatter declares `creative_latitude` and `quality_target_score`.
- `outcomes[]` present with ≥ 3 measurable user-truth statements.
- `required_content_slots[]` present and exhaustively enumerates visible content (no missing labels).
- `forbidden_patterns[]` present and references at least one differentiation rule per HIGH/MEDIUM-latitude page.
- `differentiation_vs_routes[]` covers every other route on the site (cross-checked against `visual-differentiation-map.md`).
- `composition_palette` (HIGH) or `recommended_outline` (MEDIUM) or `standard_composition` (LOW) present per latitude.
- Section blueprint present for every section with publish-ready draft copy and responsive layout intent.
- Motion temperament + key moments + reduced-motion fallback declared.
- SEO + Schema.org + accessibility + performance + conversion path all present.
- Quality bar dimensions declared with per-dimension targets summing to `quality_target_score`.
- Every content key referenced resolves to `content-library.md`.
- No prescriptive "Section 1: Hero, Section 2: Value..." list (template-collapse pattern).
 - No placeholder draft copy (`TODO`, `lorem`, `sample text`, `coming soon`) in section blueprint.

## Forbidden in this brief
- Numbered section lists that prescribe HOW to compose. Use outcomes + content slots + composition palette instead.
- References to specific composed components (e.g., "PricingTable", "FeatureCard") on HIGH-latitude surfaces. Reference primitives or content slots instead.
- Identical brief content across multiple routes on the same site. The reviewer hashes briefs and rejects duplicates.
