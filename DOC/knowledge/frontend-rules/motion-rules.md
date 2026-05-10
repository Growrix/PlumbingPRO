# Motion Rules — Temperament + Choreography (NOT a Catalog)

Motion is a *creative dimension*, not a fixed catalog. The OS no longer prescribes "use these named effects from this list." It declares **temperaments** the AI must match and **choreography rules** for combining motion primitives within a temperament.

This prevents motion uniformity (the prior catalog approach made every site's hover lift identical, every section reveal identical, every page transition identical).

Motion still serves three masters — **clarity, feedback, hierarchy**. Anything that does not serve one of those is decoration and is forbidden.

---

## The four temperaments

A temperament defines the *feel* of a surface's motion. Per-surface temperament is declared in the page brief; the planner picks from these four (or composes a hybrid where the archetype permits).

### `restrained-cinematic`
- Slow, controlled, considered.
- Macro motion duration: 240–320ms.
- Micro motion: 140–200ms.
- Easing: ease-out preferred; no spring on macro; subtle spring allowed on small interactive feedback (chip selection).
- Voice analogy: a measured, confident speaker who pauses for effect.
- Default for: `editorial-premium`, `bold-consumer`, `portfolio-craft`.

### `alive-energetic`
- Fast, springy, alive.
- Macro motion duration: 160–220ms.
- Micro motion: 100–160ms.
- Easing: spring on chip selection, button press; ease-out on macro.
- Voice analogy: an enthusiastic guide moving you through a story.
- Default for: `startup-conversion`, hero of `bold-consumer` drops.

### `calm-precise`
- Snappy, functional, no flair.
- Macro motion duration: 160–220ms.
- Micro motion: 100–160ms.
- Easing: standard ease-out; no spring on macro.
- Voice analogy: a competent professional doing their job.
- Default for: `modern-saas`, `marketplace`, `dashboard-ops`.

### `playful-staccato`
- Snappy, bouncy, attention-grabbing per element.
- Macro motion duration: 180–240ms.
- Micro motion: 120–180ms; spring everywhere.
- Easing: spring on most interactions.
- Voice analogy: a cheerful guide that nudges you with each step.
- Default for: rare; consumer subsets that explicitly want playfulness.

### `alive-precise` (hybrid; AI-product specific)
- Streaming-text temperament: fast, micro-staggered, alive within a precise framing.
- Token chunk: 100–140ms appear with slight slide-up.
- Suggestion chip: spring lift 1.02.
- Default for: `ai-product`.

---

## Choreography rules (how motion primitives combine within a temperament)

Motion primitives are: `translate`, `opacity`, `scale`, `rotate`, `sequence`, `stagger`, `delay`. The planner composes choreography from primitives to match the chosen temperament. The OS does NOT name "section reveal effect" or "hover lift effect" — those names locked the AI into uniformity.

### Choreography principles

1. **Match the temperament.** Every motion declared on a surface must read as the surface's chosen temperament. Audit Q3 (motion temperament) scores this.
2. **One purpose per motion.** Every motion declares one of: `clarity` (state change), `feedback` (user input acknowledged), `hierarchy` (attention direction). Decorative is forbidden.
3. **Reduced-motion fallback for every animation.** Final visual state must be preserved without layout shift. Translation becomes instant; opacity becomes instant; scale becomes instant or subtle shadow swap.
4. **Performance budget.** `transform` and `opacity` only. No `top` / `left` / `width` / `height` animation. 60fps on mid-range mobile. Use `will-change` sparingly and remove after.
5. **Motion does not block interaction.** No animation > 320ms on a critical path. CTAs respond within one frame.
6. **No cross-route motion uniformity.** If `home` and `services` use the same temperament, their hero choreography must still differ (different stagger pattern, different element entry order, different motion key moments). Audit Q1 (visual differentiation) scores this.

### Choreography invariants per macro effect

These are categories of motion (not catalog entries). The planner declares which categories each surface uses; the developer composes the actual motion within the temperament + choreography rules.

| Category | Purpose | Temperament-driven duration |
|---|---|---|
| **Surface entry** (section becomes visible on scroll, page transitions, modal opens) | hierarchy | per temperament |
| **Element press** (button, chip, link tap) | feedback | per temperament micro band |
| **Element hover** (desktop) | hierarchy | per temperament micro band |
| **Element focus** (keyboard) | feedback (with focus ring) | per temperament micro band |
| **Inline state change** (validation, badge swap, count update) | clarity | per temperament micro band |
| **Disclosure** (accordion, popover, tooltip, dropdown) | clarity | per temperament |
| **Overlay** (drawer, sheet, modal, toast) | hierarchy + clarity | per temperament |
| **Streaming** (AI tokens, realtime status, progress) | clarity + feedback | per temperament; streaming chunks 100–140ms |

### Example — `restrained-cinematic` choreography

The planner authors something like:

```yaml
home:
  hero:
    temperament: restrained-cinematic
    surface_entry:
      sequence:
        - element: eyebrow
          properties: opacity 0→1, translateY 8→0
          duration: 240ms
          easing: ease-out
        - element: headline
          properties: opacity 0→1, translateY 12→0
          duration: 280ms
          easing: ease-out
          delay: 80ms (after eyebrow)
        - element: subhead
          properties: opacity 0→1, translateY 8→0
          duration: 240ms
          easing: ease-out
          delay: 80ms (after headline)
        - element: cta_primary
          properties: opacity 0→1, scale 0.96→1
          duration: 280ms
          easing: ease-out
          delay: 120ms (after subhead)
      reduced_motion: instant fade per element, no stagger
      purpose: hierarchy
```

This is **specific** (named elements, named properties, named durations, named delays) but **not catalog-bound** — the same temperament could choreograph the `services` hero with different elements and a different stagger pattern, satisfying differentiation.

### Example — `services` hero same temperament, different choreography

```yaml
services:
  hero:
    temperament: restrained-cinematic
    surface_entry:
      sequence:
        - element: media_panel
          properties: opacity 0→1, scale 1.02→1
          duration: 320ms
          easing: ease-out
        - element: text_column
          properties: opacity 0→1, translateY 16→0
          duration: 280ms
          easing: ease-out
          delay: 120ms (after media)
      reduced_motion: instant
      purpose: hierarchy
```

Same temperament, different choreography. This is the variance that prevents template collapse without losing motion quality.

---

## Streaming motion (AI product surfaces)

Special category for `ai-product` archetype.

### AI token streaming
- Per-chunk: opacity 0→1 + 2–4px translateY → 0.
- Duration per chunk: 100–140ms.
- Reduced-motion: chunks appear instantly per chunk (no opacity/translate).
- Streaming cursor: 1Hz blink.

### Realtime status badge change
- Pill background cross-fade.
- Duration: per temperament base.

### Upload progress
- Linear progress bar fill.
- No bouncing or indeterminate spinners when progress is known.

---

## Forbidden motion

These are universal — no temperament can opt in.

- Decorative parallax beyond the hero (no parallax in mid-page sections).
- Continuous looping animations (bouncing icons, pulsing CTAs) outside specific status indicators.
- Cursor-follow effects in non-portfolio archetypes.
- Hijacked scroll (locking the user to scroll-driven scenes).
- Page-loading splash screens.
- Auto-playing video with sound on.
- Scroll-jacking carousels.
- Animations that delay first-meaningful-paint.
- Naming a motion "subtle entrance" or "smooth transition" without specifying primitives, properties, and durations. Vague motion is forbidden.

---

## Reduced-motion contract

Every motion declaration MUST include a `reduced_motion` line stating the fallback behaviour. The fallback MUST:
- Preserve the final visual state.
- Avoid layout shift.
- Avoid cross-fade timing that depends on opacity transitions (unless duration is set to instant).
- Be visually equivalent in information presented.

If a motion cannot satisfy reduced-motion, it cannot ship.

---

## Performance budget

- 60fps on mid-range mobile.
- `transform` and `opacity` properties only.
- No layout-thrashing properties (`top`, `left`, `width`, `height`, `margin`).
- `will-change` only on elements that animate at least once per session, removed after.
- IntersectionObserver thresholds set to fire well before the element enters viewport (e.g., `rootMargin: '0px 0px -10% 0px'`).

---

## What `motion-system.md` (planner output) must contain

1. **Adopted temperament(s)** per surface (route-by-route).
2. **Per-surface choreography** for every motion key moment (surface entry, press, hover, focus, inline state change, disclosure, overlay, streaming where applicable). Each includes: element, properties, duration, easing, delay (where chained), reduced-motion fallback, purpose.
3. **Forbidden motion list** specific to this project (e.g., "no parallax outside `/`").
4. **Performance budget** explicit per page (e.g., "no animation > 240ms on `/checkout` critical path").

---

## What the developer implements

1. Imports the declared motion library (Framer Motion or equivalent).
2. Implements every choreography exactly per the planner's specification.
3. Wraps in `useReducedMotion()` (or equivalent) and applies the declared fallback when reduced-motion is set.
4. Runs the self-audit verifying:
   - Every motion uses motion tokens (no raw `ms`).
   - Every motion has a reduced-motion fallback.
   - Every motion cites a purpose.
   - No forbidden motion patterns appear.
   - Surfaces with the same temperament across routes show different choreography (audit Q1 differentiation).

---

## Forbidden in this file

- A named catalog of effects ("Section reveal effect", "Hover lift effect", "Card lift effect"). The catalog approach forces uniformity.
- Per-component motion prescriptions that lock all projects to identical animations.
- Generic "subtle animations encouraged" language without specificity.
