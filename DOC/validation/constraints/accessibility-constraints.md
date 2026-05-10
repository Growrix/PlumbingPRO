# Accessibility Constraints

Hard rules for any plan produced by this OS. Each constraint has an id, rule, detection method, and failure code. The `reviewer` evaluates AC1..AC12 in order; any failure halts the pipeline.

WCAG 2.1 Level AA is the baseline. AAA applies where compliance regimes (regulated finance / health / legal) require it.

## AC1 — Keyboard navigation
**Rule:** Every interactive element MUST be reachable in a logical tab order. Focus trap engages on modal / drawer / sheet; ESC closes.
**Detection:** Walk page specs and component specs for interactive elements; verify each has keyboard interaction notes.
**Failure:** `BLOCK AC1: <element> at <ref> missing keyboard interaction`.

## AC2 — Focus visibility
**Rule:** Every interactive element MUST declare a visible focus ring using `--color-focus-ring` and `--shadow-focus`. `outline: none` without replacement is forbidden.
**Detection:** Walk component specs for focus-visible state.
**Failure:** `BLOCK AC2: <component> at <ref> missing focus-visible treatment`.

## AC3 — Color contrast
**Rule:** Body text contrast ≥ 4.5:1; large text (18px+ or 14px bold+) ≥ 3:1; non-text UI ≥ 3:1. Color is never the sole means of conveying information.
**Detection:** Inspect `design-system.tokens.json` color pairings; cross-check page specs for color-only signaling.
**Failure:** `BLOCK AC3: contrast <ratio> below threshold for <pairing>`.

## AC4 — Semantic HTML and landmarks
**Rule:** Every page spec MUST declare landmarks (header, main, footer, nav). Use semantic HTML before reaching for ARIA. Single H1 per page; sequential heading order.
**Detection:** Inspect page specs `accessibility.landmarks` and `accessibility.heading_outline`.
**Failure:** `BLOCK AC4: page <route> missing landmarks or heading outline drift`.

## AC5 — Form labels and errors
**Rule:** Every input MUST have a programmatically-associated label (visible by default). Errors associated via `aria-describedby`. Required fields marked visually AND `aria-required=true`. Helper text persistent.
**Detection:** Walk form plans inside page specs.
**Failure:** `BLOCK AC5: form field <field> at <route> missing label or error association`.

## AC6 — Image alt text
**Rule:** Every meaningful image has descriptive `alt`. Decorative images use `alt=""` and `aria-hidden=true`. Meaningful SVGs use `<title>` and `role=img`.
**Detection:** Inspect content library `image_*` keys and component specs.
**Failure:** `BLOCK AC6: image at <ref> missing alt or alt=""+aria-hidden`.

## AC7 — Reduced motion
**Rule:** Every animation MUST respect `prefers-reduced-motion: reduce`, with a fallback that preserves the final visual state without layout shift.
**Detection:** Walk motion declarations in component specs and page specs.
**Failure:** `BLOCK AC7: motion <id> at <ref> missing reduced_motion fallback`.

## AC8 — Touch targets
**Rule:** Tap targets ≥ 44×44px. Adjacent targets separated by ≥ 8px. Pinch-zoom never disabled.
**Detection:** Walk component specs for tap target sizing.
**Failure:** `BLOCK AC8: <component> tap target below 44px`.

## AC9 — Skip link
**Rule:** Every page MUST declare a skip link as the first focusable element pointing to `#main-content`.
**Detection:** Inspect page specs `accessibility.skip_link`.
**Failure:** `BLOCK AC9: page <route> missing skip link`.

## AC10 — ARIA discipline
**Rule:** ARIA used only when no semantic element fits. `aria-live=polite` for toasts; `aria-live=assertive` for critical errors only. `aria-busy` on loading regions. `aria-expanded`, `aria-controls`, `aria-selected` on disclosure / accordion / tabs.
**Detection:** Walk component specs for ARIA notes; cross-check against state matrix.
**Failure:** `BLOCK AC10: <component> at <ref> ARIA misuse or missing required attribute`.

## AC11 — No hover-only discovery
**Rule:** No information or action may be reachable only via hover. Every interactive disclosure has a tap-equivalent on mobile.
**Detection:** Walk component specs for hover-only behaviors without tap parity.
**Failure:** `BLOCK AC11: hover-only behavior at <ref> without mobile parity`.

## AC12 — Language and direction
**Rule:** Every page declares `<html lang>`. Sections in another language declare `lang` on the wrapper. RTL locales render with logical CSS properties.
**Detection:** Inspect master-ui-architecture `localization` block and per-page spec.
**Failure:** `BLOCK AC12: page <route> missing lang declaration or RTL handling`.

## Enforcement
The `reviewer` evaluates AC1..AC12 in order. Multiple failures may be reported in a single pass; the pipeline halts on any failure.

All AC-constraints are critical. There are no warnings; the gate is binary.

## Output
The reviewer adds an `accessibility` block to `validation_report.json`:

```json
{
  "accessibility": {
    "status": "passed|failed",
    "checks": [
      { "id": "AC1",  "status": "passed|failed", "evidence": "..." },
      { "id": "AC2",  "status": "passed|failed", "evidence": "..." },
      { "id": "AC3",  "status": "passed|failed", "evidence": "..." },
      { "id": "AC4",  "status": "passed|failed", "evidence": "..." },
      { "id": "AC5",  "status": "passed|failed", "evidence": "..." },
      { "id": "AC6",  "status": "passed|failed", "evidence": "..." },
      { "id": "AC7",  "status": "passed|failed", "evidence": "..." },
      { "id": "AC8",  "status": "passed|failed", "evidence": "..." },
      { "id": "AC9",  "status": "passed|failed", "evidence": "..." },
      { "id": "AC10", "status": "passed|failed", "evidence": "..." },
      { "id": "AC11", "status": "passed|failed", "evidence": "..." },
      { "id": "AC12", "status": "passed|failed", "evidence": "..." }
    ]
  }
}
```

## Cross-references
- `knowledge/frontend-rules/accessibility-rules.md` — full rule rationale.
- `knowledge/frontend-rules/component-state-matrix.md` — required states per component class.
- `knowledge/frontend-rules/motion-rules.md` — reduced-motion contract.
- `validation/constraints/frontend-constraints.md` — F4 (interactive states), F6 (reduced-motion), F12 (mobile parity) overlap with AC; both sets fire so the gate is double-checked.
