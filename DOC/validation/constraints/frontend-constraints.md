# Frontend Constraints

Hard rules for any frontend plan produced by this OS. Each constraint has an id, rule, detection method, and failure code. The `reviewer` evaluates F1..F12 in order; any failure halts the pipeline.

## F1 — No raw values in components
**Rule:** Components MUST NOT contain raw color (`#hex`, `rgb()`, `hsl()`), spacing (`px`, `rem`, `em`), radius, shadow, duration (`ms`), or z-index literals. Tailwind utility classes that map to declared tokens are allowed; raw arbitrary values are not.
**Detection:** Lint emitted JSX/TSX for forbidden literal patterns; verify `tailwind.config.ts` only uses tokens from `design-system.tokens.json`.
**Failure:** `BLOCK F1: raw value <value> at <file>:<loc>`.

## F2 — Minimum sections per public page
**Rule:** Every public page MUST declare ≥7 sections (header, hero, value, proof, conversion, supporting, footer). Pages explicitly marked `min_sections_exempt: true` (404, legal, narrow utility) are allowed to omit, with the reason recorded.
**Detection:** Count sections in each page spec.
**Failure:** `BLOCK F2: page <route> has <n> sections without exempt flag`.

## F3 — Component states declared
**Rule:** Every component spec MUST declare every state required by `knowledge/frontend-rules/component-state-matrix.md` for its component class.
**Detection:** Cross-check component spec states against the matrix.
**Failure:** `BLOCK F3: component <name> missing state <state>`.

## F4 — Interactive element states
**Rule:** Every interactive element (button, link with action, input, control) MUST declare hover, `focus-visible`, active, disabled, loading where applicable, with visual treatment + ARIA + motion tokens.
**Detection:** Walk component specs and page specs for interactive elements.
**Failure:** `BLOCK F4: <element> at <ref> missing <state>`.

## F5 — No inline copy
**Rule:** Every visible string in a component or page MUST resolve to a key in the frontend planning content library at `<output_root>/content-library.md`, where `<output_root>` resolves to `DOC/output/runs/<timestamp>/planning/frontend`. No hardcoded English strings in JSX/TSX, except documented third-party labels with explicit exception.
For planning artifacts, every referenced key MUST also have publish-ready default copy in `content.<locale>.json`.
**Detection:** Scan for inline strings; verify referenced keys exist.
**Failure:** `BLOCK F5: inline string "<text>" at <file>:<loc>`.

## F6 — Reduced-motion fallback
**Rule:** Every animation declared in any component or page spec MUST declare a `reduced_motion` fallback that preserves the final visual state without layout shift.
**Detection:** Walk motion declarations.
**Failure:** `BLOCK F6: motion <id> at <ref> missing reduced_motion fallback`.

## F7 — Page spec completeness
**Rule:** Every page spec MUST contain: page definition, sections in visual order, page-level state requirements, responsive adaptation, SEO+metadata, conversion path, accessibility plan, performance plan, data fetching plan.
Every page spec MUST also include a section blueprint where each section declares draft copy, content-key mapping, and desktop/tablet/mobile layout intent.
**Detection:** Schema-check each page spec frontmatter + required sections.
**Failure:** `BLOCK F7: page <route> missing section <section>`.

## F8 — Data source declared
**Rule:** Every dynamic section in a page spec MUST declare `data_source` (one of: `static`, `cms`, `database`, `integration`) AND the exact query/call. Static sections must declare `static`.
**Detection:** Walk sections in page specs.
**Failure:** `BLOCK F8: section <name> in <route> missing data_source`.

## F9 — Micro-animation purpose
**Rule:** Every micro-animation declaration MUST cite one of: `clarity`, `feedback`, `hierarchy`. Decorative motion is forbidden.
**Detection:** Walk motion declarations; reject any micro-animation without a `purpose` field or with a value outside the allowed set.
**Failure:** `BLOCK F9: micro-animation <id> at <ref> missing or invalid purpose`.

## F10 — Form completeness
**Rule:** Every form spec MUST declare: field list with content keys, validation rules (zod), submitting state, success state, server-error state, validation-error state, recovery affordance, privacy notice content key.
**Detection:** Walk form plans inside page specs.
**Failure:** `BLOCK F10: form at <route> missing <field>`.

## F11 — Single visual archetype
**Rule:** A project MUST select exactly one visual archetype from `knowledge/frontend-rules/visual-archetypes/`. Per-case-study or per-collection accent overrides are allowed only when the archetype explicitly permits them (`portfolio-craft`, `bold-consumer`).
**Detection:** Inspect `brief.brand.visual_archetype` and per-page accent declarations.
**Failure:** `BLOCK F11: multiple archetypes detected or unauthorized accent override`.

## F12 — Mobile parity (no hover-only discovery)
**Rule:** No information or action may be reachable only via hover. Every interactive disclosure MUST have a tap-equivalent on mobile.
**Detection:** Walk component specs for hover-only behaviors without tap parity.
**Failure:** `BLOCK F12: hover-only behavior at <ref> without mobile parity`.

## F13 — No shared route wrapper
**Rule:** MUST NOT implement multiple distinct-purpose routes (e.g., Home, Services, About, Blog, Contact) using a single shared wrapper component that accepts content via props. Each route's primary content sections MUST be implemented as unique, purpose-built composition. Shared organisms (Header, Footer, nav, mobile dock) are exempt.
**Detection:** Scan `web/src/app/**/page.tsx` for repeated wrapper component imports; if the same non-layout component appears as the root render of >2 distinct routes, fail.
**Failure:** `BLOCK F13: shared route wrapper <ComponentName> used across routes <list>`.

## F14 — Motion must be implemented
**Rule:** If `framer-motion` (or any declared animation library) is listed in `web/package.json`, it MUST be imported and actively used in at least: one hero section, one card/item hover interaction, and one modal or drawer transition. Installing motion tooling and leaving it unused is equivalent to planning a feature and not delivering it.
**Detection:** Search `web/src/` for `from "framer-motion"` (or the declared library); confirm usages exist in ≥3 distinct component files covering the three required use-case classes.
**Failure:** `BLOCK F14: motion library declared but not implemented in required surface classes`.

## F15 — Visual differentiation across routes
**Rule:** Every public marketing route MUST have a measurably distinct visual composition for its hero section and its primary content section. "Distinct" means: different layout split (e.g., 50/50 vs full-bleed vs text-left/media-right vs stacked), different media framing treatment, or different typographic scale hierarchy — at least two of these three must differ from any other route's hero.
**Detection:** Read all page specs; compare hero `Visual contract → desktop composition` declarations across routes; flag any two routes with identical descriptions.
**Failure:** `BLOCK F15: routes <A> and <B> have identical hero composition — differentiate layout split, media framing, or type hierarchy`.

## F16 — Publish-ready content copy completeness
**Rule:** `content.<locale>.json` MUST read like a finished website draft, not placeholders. Forbidden values include `TODO`, `lorem`, `sample`, `insert text`, `coming soon`, and key-echo values.
**Detection:** Scan content files for placeholder patterns and key-echo strings; sample-check trust-critical and conversion-critical keys.
**Failure:** `BLOCK F16: placeholder copy detected at <key>`.

## F17 — Footer attribution deterministic default
**Rule:** Planner output MUST include `footer.attribution.*` keys. If brief footer attribution is absent, planner MUST fallback to: text `Built and maintenance by`, link text `Growrix OS`, URL `https://www.growrixos.com`, placement `footer_bottom_bar`.
**Detection:** Inspect intake brief, content library keys, footer spec, and planner summary for fallback behavior.
**Failure:** `BLOCK F17: footer attribution contract missing or fallback not applied`.

## Enforcement order
The `reviewer` evaluates F1..F17 in order. Multiple failures may be reported in a single pass; the pipeline halts on any failure.

## Severity mapping
- F1, F5, F11: critical — almost always cause hardcoding or visual drift.
- F2, F3, F4, F7, F8, F10: critical — incomplete plan = improvising codegen.
- F6, F9, F12: critical — accessibility or quality risk.
- F13: critical — single wrapper collapse = all pages look identical.
- F14: critical — declared motion library unused = broken motion contract.
- F15: critical — identical route compositions = generic, unprofessional output.
- F16: critical — placeholder copy prevents production-grade planning.
- F17: critical — missing footer attribution contract breaks footer requirements.
- CC1..CC6: critical — planned scope not fully implemented = incomplete frontend delivery.

## Q-constraints — Quality bar (added in template-collapse fix)

These constraints address the central failure mode that produced uniform, mediocre frontends despite the F-constraint set. They operationalise quality enforcement at the audit layer where it belongs, instead of relying on aspirational language in templates.

### Q1 — Visual differentiation enforced across routes
**Rule:** Every project MUST emit `visual-differentiation-map.md` per `visual-differentiation-map-spec.md`. No two HIGH-latitude routes may share a `visual_signature_hash`. Every pair of HIGH/MEDIUM-latitude routes MUST have a non-empty `different_dimensions` list. Pairs sharing `motion_temperament` MUST cite distinct `motion_choreography_signature`.
**Detection:** Read `<output_root>/visual-differentiation-map.md`. Walk per-route signatures and pair-wise deltas. Compute hash uniqueness. Verify `different_dimensions` non-empty for HIGH/MEDIUM pairs. Verify same-temperament pairs cite distinct choreography signatures.
**Failure:** `BLOCK Q1: <reason>` — examples: `duplicate signature hash for routes [/, /work]`; `pair [/, /services] has no different_dimensions`; `pair [/, /pricing] same temperament without distinct choreography signature`.

### Q2 — Per-page quality bar score met
**Rule:** Every per-page brief MUST declare a `quality_bar.target_score` and per-dimension targets per `quality-bar-scoring.md`. The auditor scores 0–3 per dimension with cited evidence. Sum MUST meet target. The developer's self-audit MUST also score and cite evidence.
**Detection:** Read each `pages/<route-slug>.md` brief; read declared targets. Read emitted code (where available); score per dimension; cite evidence (file path or spec section). Compute sum. Compare to target.
**Failure:** `BLOCK Q2: route <route> scored <sum>/<target> on dimensions [<failed>]` — cite evidence per failed dimension.

### Q3 — Creative latitude utilisation
**Rule:** HIGH-latitude surfaces MUST show evidence of custom composition and choreography (i.e., the planner authored unique composition palette and choreography for this surface; the developer implemented it without falling back to defaults). LOW-latitude surfaces MUST follow the standard composition declared in the brief.
**Detection:** For each HIGH-latitude route, verify the brief's `composition_palette` is unique to this route (cross-check against other HIGH-latitude routes' palettes). Verify the motion choreography is declared concretely (not "subtle entrance"). Sample emitted code; verify composition matches the brief's declared latitude band.
**Failure:** `BLOCK Q3: HIGH-latitude route <route> shows defaults instead of custom composition` — cite the offending palette / choreography reference.

### Q-constraint enforcement order
- Q1 evaluated first (cheapest; catches most template-collapse failures upfront).
- Q2 evaluated per page after Q1 passes for the project.
- Q3 evaluated per HIGH-latitude route last.

All Q-constraints are critical. There are no warnings; the gate is binary.

## CC-constraints — Developer completeness contract

These constraints ensure the developer implements the full planned scope, not just a compilable subset.

### CC1 — Component coverage
**Rule:** Every component declared in `component-system.md` and every `components/<ComponentName>.md` spec MUST produce a concrete `.tsx` implementation under `web/src/components/**`.
**Detection:** Parse component names from planning artifacts and cross-check emitted component filenames.
**Failure:** `BLOCK CC1: missing component implementations [<names>]`.

### CC2 — Required content-slot coverage
**Rule:** For each route brief, every `required_content_slots[]` entry MUST be represented in the emitted route composition (direct section or imported section component).
**Detection:** Read `pages/<route>.md` slot declarations and verify corresponding usage in `web/src/app/**/page.tsx` + route-specific section imports.
**Failure:** `BLOCK CC2: route <route> missing required content slots [<slot categories>]`.

### CC3 — Section density threshold by latitude
**Rule:** Route composition depth MUST satisfy:
- HIGH-latitude home: `>= 8` sections
- HIGH-latitude non-home marketing: `>= 6` sections
- MEDIUM-latitude: `>= 5` sections
- LOW-latitude: `>= 3` sections unless `min_sections_exempt: true`
**Detection:** Count top-level section surfaces in route composition and compare against route latitude + role.
**Failure:** `BLOCK CC3: route <route> has <n> sections, required <min>`.

### CC4 — Extraction discipline
**Rule:** Oversized inline page composition is forbidden. Any route section over ~30 JSX LOC MUST be extracted into `web/src/components/sections/`. Route page files exceeding 200 LOC without valid rationale indicate under-extracted composition.
**Detection:** Static LOC scan of route files + section blocks.
**Failure:** `BLOCK CC4: extraction discipline violated in <file>`.

### CC5 — Card variety by content type
**Rule:** Each distinct project content type carried in the plan (services, projects, testimonials, articles, materials, financing options, team, areas, etc.) MUST have a dedicated card component in `web/src/components/cards/`.
**Detection:** Derive content types from planning briefs/content keys; verify corresponding card component coverage.
**Failure:** `BLOCK CC5: missing card components for content types [<types>]`.

### CC6 — Footer attribution completeness
**Rule:** When `brief.brand.footer_attribution.enabled` is true, emitted footer MUST render the declared attribution contract (`text`, `link_text`, `url`, behavior). Placeholder URLs (e.g., `example.com`) are invalid.
**Detection:** Inspect planner footer spec + content keys, then inspect emitted footer implementation.
**Failure:** `BLOCK CC6: footer attribution missing or mismatched in <file>`.

CC-constraints are critical. There are no warnings; the gate is binary.

---

All F-constraints are critical. There are no warnings; the gate is binary.

## Output
The reviewer adds a `frontend` block to `validation_report.json`:

```json
{
  "frontend": {
    "status": "passed|failed",
    "checks": [
      { "id": "F1", "status": "passed|failed", "evidence": "..." },
      { "id": "F2", "status": "passed|failed", "evidence": "..." },
      { "id": "F3", "status": "passed|failed", "evidence": "..." },
      { "id": "F4", "status": "passed|failed", "evidence": "..." },
      { "id": "F5", "status": "passed|failed", "evidence": "..." },
      { "id": "F6", "status": "passed|failed", "evidence": "..." },
      { "id": "F7", "status": "passed|failed", "evidence": "..." },
      { "id": "F8", "status": "passed|failed", "evidence": "..." },
      { "id": "F9", "status": "passed|failed", "evidence": "..." },
      { "id": "F10","status": "passed|failed", "evidence": "..." },
      { "id": "F11","status": "passed|failed", "evidence": "..." },
      { "id": "F12","status": "passed|failed", "evidence": "..." },
      { "id": "F13","status": "passed|failed", "evidence": "..." },
      { "id": "F14","status": "passed|failed", "evidence": "..." },
      { "id": "F15","status": "passed|failed", "evidence": "..." },
      { "id": "F16","status": "passed|failed", "evidence": "..." },
      { "id": "F17","status": "passed|failed", "evidence": "..." },
      { "id": "Q1", "status": "passed|failed", "evidence": "..." },
      { "id": "Q2", "status": "passed|failed", "evidence": "..." },
      { "id": "Q3", "status": "passed|failed", "evidence": "..." },
      { "id": "CC1", "status": "passed|failed", "evidence": "..." },
      { "id": "CC2", "status": "passed|failed", "evidence": "..." },
      { "id": "CC3", "status": "passed|failed", "evidence": "..." },
      { "id": "CC4", "status": "passed|failed", "evidence": "..." },
      { "id": "CC5", "status": "passed|failed", "evidence": "..." },
      { "id": "CC6", "status": "passed|failed", "evidence": "..." }
    ]
  }
}
```
