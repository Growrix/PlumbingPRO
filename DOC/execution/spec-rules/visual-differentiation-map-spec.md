# Spec Template — Visual Differentiation Map

Emitted by `frontend_planner` (Phase 6.5). One file per project, written to `<output_root>/visual-differentiation-map.md`.

This is the **single most important artifact for preventing template collapse.** It declares, for every pair of routes on the site, how those two routes' visual signatures differ.

If two routes can be described by the same composition + same primary section rhythm + same motion temperament + same surface stack + same content density, they have the same visual signature and the audit fails.

---

## Required frontmatter

```yaml
---
document_type: visual-differentiation-map
project_name: <slug>
visual_archetype: knowledge/frontend-rules/visual-archetypes/<file>.md
build_stage: 4-page-design
depends_on:
  - master-ui-architecture.md
  - design-system.md
---
```

---

## Required sections

### 1. Differentiation dimensions

The five dimensions that determine a route's visual signature:

| Dimension | What it captures |
|---|---|
| `composition` | Hero layout pattern (split / centered / full-bleed / layered / asymmetric) and primary section composition |
| `primary_section_rhythm` | Section padding band, section count posture (spacious / balanced / dense) |
| `motion_temperament` | Adopted temperament from `motion-rules.md` AND specific choreography pattern |
| `surface_stack` | Surface layering (paper-only / paper+panel / paper+panel+inset / paper+panel+inset+overlay) |
| `content_density` | Content posture (spacious / balanced / dense) |

### 2. Per-route visual signature

For every route in the site map, declare its signature:

```yaml
routes:
  - route: /
    creative_latitude: HIGH
    composition: "asymmetric_split_hero (60/40), layered surface stack, oversized type"
    primary_section_rhythm: "spacious-irregular (96px hero, 80px value, 64px proof, 96px cta)"
    motion_temperament: "restrained-cinematic"
    motion_choreography_signature: "staggered-reveal-from-eyebrow"
    surface_stack: "paper+panel+inset+overlay"
    content_density: "spacious"
    visual_signature_hash: "asym60-rest-rhythm1-stack4-spacious"

  - route: /services
    creative_latitude: MEDIUM
    composition: "centered_editorial_hero, three-column value grid"
    primary_section_rhythm: "balanced-regular (80px throughout)"
    motion_temperament: "restrained-cinematic"
    motion_choreography_signature: "media-then-text-stagger"
    surface_stack: "paper+panel"
    content_density: "balanced"
    visual_signature_hash: "centered-rest-rhythm2-stack2-balanced"

  - route: /pricing
    creative_latitude: MEDIUM
    composition: "intro_then_comparison_rail"
    primary_section_rhythm: "dense-comparison (56px between tiers)"
    motion_temperament: "calm-precise"
    motion_choreography_signature: "tier-card-cascade"
    surface_stack: "paper+inset"
    content_density: "balanced-dense"
    visual_signature_hash: "intro-comp-calm-rhythm3-stack3-dense"
```

### 3. Pair-wise delta matrix

For every pair of HIGH and MEDIUM latitude routes, declare the delta:

```yaml
deltas:
  - pair: [/, /services]
    different_dimensions: [composition, primary_section_rhythm, surface_stack, content_density]
    same_dimensions: [motion_temperament]
    different_within_same_temperament:
      - dimension: motion_choreography_signature
        delta: "home opens with staggered-reveal-from-eyebrow; services opens with media-then-text-stagger"
    summary: |
      Home uses asymmetric split hero with layered surface stack and spacious-irregular rhythm.
      Services uses centered editorial hero with paper+panel stack and balanced-regular rhythm.
      Both share restrained-cinematic temperament but use distinct choreography signatures.
    audit_pass: true

  - pair: [/, /pricing]
    different_dimensions: [composition, primary_section_rhythm, motion_temperament, surface_stack, content_density]
    same_dimensions: []
    summary: |
      Home is asymmetric, spacious, restrained-cinematic.
      Pricing is intro+comparison-rail, balanced-dense, calm-precise.
    audit_pass: true

  - pair: [/services, /pricing]
    different_dimensions: [composition, primary_section_rhythm, motion_temperament, surface_stack, content_density]
    same_dimensions: []
    summary: "..."
    audit_pass: true
```

### 4. Hash uniqueness check

The `visual_signature_hash` per route is a deterministic shorthand. For HIGH-latitude routes, NO TWO ROUTES MAY SHARE A HASH. For MEDIUM-latitude routes, hash collisions are allowed only if at least two dimensions differ.

```yaml
uniqueness_check:
  high_latitude_routes:
    - route: /
      hash: "asym60-rest-rhythm1-stack4-spacious"
    - route: /work
      hash: "fullbleed-rest-rhythm5-stack3-spacious"
  duplicates_detected: false
  status: passed
```

### 5. Forbidden duplications

Any of these conditions causes audit Q1 to fail:
- Two HIGH-latitude routes share `visual_signature_hash`.
- Two HIGH-latitude routes share all five dimensions.
- Two MEDIUM-latitude routes share four or more dimensions.
- Any pair shares motion_temperament + motion_choreography_signature (i.e., motion is identical).

---

## How the planner builds this

1. After Phase 5 (content library) and before Phase 7 (per-page briefs), the planner walks the site map.
2. For each route, drawing on the visual archetype's latitude windows, the planner picks composition + rhythm + temperament + surface stack + density. The picks must satisfy:
   - The route's user intent and conversion outcome.
   - The route's `creative_latitude` band.
   - The forbidden-duplication rules above.
3. The planner emits the per-route signature.
4. The planner walks every pair of HIGH/MEDIUM routes and emits a delta entry.
5. The planner runs the hash uniqueness check.
6. If duplications appear, the planner re-picks for the offending route(s) until the map is clean.
7. The planner emits this file.

## How the developer uses this

1. Reads the map before authoring `web/src/app/<route>/page.tsx`.
2. Implements composition + rhythm + temperament + surface stack matching the route's signature.
3. Cross-references the per-page brief to confirm composition palette aligns with the signature.
4. Self-audit verifies emitted code matches the declared signature (e.g., a route declared as `asymmetric_split_hero` cannot ship a `centered_editorial_hero`).

## Audit checks (Q1)

- Every route in the site map has a signature entry.
- No two HIGH-latitude routes share a hash.
- Every pair of HIGH/MEDIUM routes has a delta entry.
- Every delta entry's `different_dimensions` is non-empty.
- Every same-temperament pair has a `different_within_same_temperament` entry showing distinct choreography.

If any check fails, audit Q1 fails (BLOCKER).
