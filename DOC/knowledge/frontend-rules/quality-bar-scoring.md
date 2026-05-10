# Quality Bar Scoring — Operational Quality Gate

The OS no longer enforces world-class quality through aspirational language ("make it Stripe-class"). It enforces it through a **per-surface scoring matrix** that the planner targets and the auditor verifies.

This file is the canonical scoring rubric. It is consumed by:
- `frontend_planner` — to target a quality score per surface.
- `frontend_developer` — to score the emitted output as part of self-audit.
- `system_architect AUDIT` — to verify scores meet targets (constraint Q2).

---

## The six dimensions

Every public surface is scored on six dimensions, each 0–3:

### 1. `hero_composition` (0–3)
Does the hero composition feel intentional, distinct, and signature for this surface?
- **0** — generic centered hero with one headline + one CTA; same shape as every other route.
- **1** — recognisable hero pattern but no distinctive choices; matches archetype defaults.
- **2** — distinct composition for this route; layered surfaces or asymmetric layout; clear focal hierarchy.
- **3** — signature composition that differs from every other route; intentional asymmetry, layered media, considered type rhythm; world-class.

### 2. `narrative_density` (0–3)
Does the page reward reading? Is every paragraph earning its place?
- **0** — filler copy; placeholder-quality; "we are passionate".
- **1** — functional copy; achieves the message but isn't memorable.
- **2** — concrete, evidence-backed copy with named outcomes / metrics / quotes.
- **3** — every line carries weight; voice is unmistakable; world-class editorial discipline.

### 3. `trust_signal_placement` (0–3)
Is trust evidence in the right place at the right time?
- **0** — trust signals missing or hidden in footer only.
- **1** — trust signals present but generic ("Award-winning", "Industry leader").
- **2** — concrete trust signals (named clients, real metrics, dated reviews) placed near hero and CTA.
- **3** — trust evidence is contextual and proportional throughout the page; appears at moments of decision; world-class.

### 4. `motion_temperament` (0–3)
Does motion feel like this archetype's temperament without imitating other surfaces on the site?
- **0** — no motion, OR motion that fights the temperament (e.g., spring on a `restrained-cinematic` surface).
- **1** — motion present but generic; matches the catalog default.
- **2** — motion clearly matches the temperament; reduced-motion fallback present.
- **3** — choreography is signature for this surface; differs from sibling routes' choreography even when sharing temperament; alive within the temperament's restraint band.

### 5. `micro_detail_quality` (0–3)
Are corners, focus rings, hover transitions, button feedback, table sorts, gallery interactions all considered?
- **0** — focus rings missing; hover states inconsistent; transitions abrupt.
- **1** — basic micro-interactions present; functional but unremarkable.
- **2** — every interactive element has a considered hover / focus / press state; transitions feel intentional.
- **3** — micro-detail is a defining quality; focus rings styled for the brand; press feedback polished; world-class.

### 6. `content_punch` (0–3)
Does every CTA have an active verb? Does every headline land in 5 seconds? Is the hero's value parseable instantly?
- **0** — vague CTAs ("Learn more", "Click here"); slogan-style headlines; no specificity.
- **1** — CTAs are active but generic ("Get started"); headlines functional.
- **2** — CTAs reflect the actual offer ("Book your audit", "Start your free 14-day trial"); headlines are concrete.
- **3** — every word earns its place; CTA labels are unmistakable; headlines are memorable; world-class voice.

---

## Per-archetype dimension weights

Different archetypes weight dimensions differently. The visual archetype file declares the weights; the planner targets them; the auditor enforces them.

### `editorial-premium`
| Dimension | Weight |
|---|---|
| hero_composition | 3 |
| narrative_density | 3 |
| trust_signal_placement | 2 |
| motion_temperament | 3 |
| micro_detail_quality | 3 |
| content_punch | 3 |
**Sum target (world_class): ≥ 17/18.**

### `modern-saas`
| Dimension | Weight |
|---|---|
| hero_composition | 3 |
| narrative_density | 3 |
| trust_signal_placement | 2 |
| motion_temperament | 3 |
| micro_detail_quality | 3 |
| content_punch | 3 |
**Sum target (world_class): ≥ 17/18.**

### `startup-conversion`
| Dimension | Weight |
|---|---|
| hero_composition | 3 |
| narrative_density | 3 |
| trust_signal_placement | 3 |
| motion_temperament | 2 |
| micro_detail_quality | 2 |
| content_punch | 3 |
**Sum target (world_class): ≥ 16/18.**

### `local-business-trust`
| Dimension | Weight |
|---|---|
| hero_composition | 3 |
| narrative_density | 2 |
| trust_signal_placement | 3 |
| motion_temperament | 2 |
| micro_detail_quality | 2 |
| content_punch | 2 |
**Sum target (premium): ≥ 14/18.**

### `bold-consumer`
| Dimension | Weight |
|---|---|
| hero_composition | 3 |
| narrative_density | 2 |
| trust_signal_placement | 2 |
| motion_temperament | 3 |
| micro_detail_quality | 3 |
| content_punch | 3 |
**Sum target (world_class): ≥ 16/18.**

### `dashboard-ops`
| Dimension | Weight |
|---|---|
| hero_composition | 1 |
| narrative_density | 3 |
| trust_signal_placement | 1 |
| motion_temperament | 2 |
| micro_detail_quality | 3 |
| content_punch | 2 |
**Sum target (premium): ≥ 12/18.**

### `marketplace`
| Dimension | Weight |
|---|---|
| hero_composition | 2 |
| narrative_density | 3 |
| trust_signal_placement | 3 |
| motion_temperament | 2 |
| micro_detail_quality | 3 |
| content_punch | 2 |
**Sum target (premium): ≥ 14/18.**

### `ai-product`
| Dimension | Weight |
|---|---|
| hero_composition | 2 |
| narrative_density | 3 |
| trust_signal_placement | 3 |
| motion_temperament | 3 |
| micro_detail_quality | 3 |
| content_punch | 2 |
**Sum target (world_class): ≥ 16/18.**

### `portfolio-craft`
| Dimension | Weight |
|---|---|
| hero_composition | 3 |
| narrative_density | 3 |
| trust_signal_placement | 2 |
| motion_temperament | 3 |
| micro_detail_quality | 3 |
| content_punch | 3 |
**Sum target (world_class): ≥ 17/18.**

---

## Quality target bands (project-level)

The project's `quality_target` (declared in the brief or defaulted by `frontend_planner`) maps to:

| Band | Per-surface sum target | Use cases |
|---|---|---|
| `standard` | ≥ 10/18 | rapid prototypes, internal tools |
| `premium` | ≥ 14/18 | most agency work; SMB clients |
| `world_class` | ≥ 16/18 (≥ 17 for editorial-premium / portfolio-craft) | flagship sites; agency portfolio work; high-trust verticals |

---

## How scoring works

### Planner side
Per-page brief declares the target score and per-dimension targets:
```yaml
quality_bar:
  target_score: 17
  dimensions:
    hero_composition:        target: 3
    narrative_density:       target: 3
    trust_signal_placement:  target: 3
    motion_temperament:      target: 3
    micro_detail_quality:    target: 3
    content_punch:           target: 2
```

### Auditor side
The auditor reads the spec and, where possible, the emitted code, and assigns a 0–3 score per dimension with evidence (cite the spec section or code path). If the cumulative score is below target, the page fails Q2.

### Developer side
The developer self-audits as part of `web/.audit/frontend-self-audit.md`. Score per page; cite evidence. If any page is below target, mark `BLOCK FRONTEND_BUILD_INCOMPLETE`.

---

## Scoring is per-route, not per-project

Different routes have different targets (declared per brief). A `/404` may target 10/18 (`standard`); the home may target 17/18 (`world_class`). The auditor checks per-route.

---

## Forbidden in scoring

- Self-scoring of 3/3 without specific evidence cited from the spec or code.
- Averaging across surfaces (every surface must individually meet its target).
- Silent below-target passes.
