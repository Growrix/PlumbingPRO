# Accessibility Rules

WCAG 2.1 AA is the minimum bar across every surface in every project this OS produces. AAA is required where compliance regimes mandate it (regulated finance / health / legal).

## Targets

- WCAG 2.1 Level AA across the entire site.
- AAA contrast where audience or compliance demands it.
- Lighthouse Accessibility score ≥ 95 on every public route.
- axe-core scan: zero serious or critical violations on any planned page.

## Non-negotiable rules

### Keyboard
- Every interactive element reachable in a logical tab order.
- Focus visible at all times via `--color-focus-ring` + `--shadow-focus`.
- Focus trap on modal / drawer / sheet; ESC closes.
- Skip-link as the first focusable element on every page (`#main-content`).

### Color and contrast
- Body text contrast ≥ 4.5:1.
- Large text (18px+ or 14px bold+) contrast ≥ 3:1.
- Non-text UI (icons that convey info, focus rings, form borders) contrast ≥ 3:1.
- Color is never the sole means of conveying information; always pair with text or icon.

### ARIA discipline
- Use semantic HTML before reaching for ARIA.
- ARIA roles only when no semantic element fits.
- `aria-live` regions for toasts (`polite`) and critical errors (`assertive`).
- `aria-busy` on loading regions.
- `aria-expanded`, `aria-controls`, `aria-selected` on disclosure / accordion / tabs.

### Forms
- Every input has a programmatically-associated label (visible by default).
- Error messages associated via `aria-describedby`.
- Validation errors announced via `role=alert` or `aria-live=assertive`.
- Required fields indicated visually AND via `aria-required=true`.
- Helper text persistent under the field (not in a tooltip-only).

### Images
- Every meaningful image has descriptive `alt`.
- Decorative images use `alt=""` and `aria-hidden=true`.
- SVGs that convey meaning use `<title>` and `role=img`.

### Media
- Videos have captions and a transcript link.
- Audio has a transcript.
- Auto-play with sound is forbidden.
- Pausable carousels per WCAG 2.2.2.

### Motion
- Every animation respects `prefers-reduced-motion: reduce`.
- No content longer than 5s that flashes more than 3 times/second (WCAG 2.3.1).
- No parallax that moves > 8px on scroll for users with reduced-motion.

### Touch
- Tap targets ≥ 44×44px.
- 8px minimum spacing between adjacent targets.

### Headings
- Single H1 per page.
- Heading order is sequential (no jumping H1 → H4).
- Section landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`) used correctly.

### Language
- Page declares `<html lang="...">`.
- Sections in another language declare `lang` on the wrapper.
- Direction (`dir="rtl"`) honored for RTL locales.

### Inputs and authentication
- Auth forms allow paste in password and OTP inputs.
- Email and phone inputs use correct `type` and `autocomplete` attributes.
- OTP inputs use `inputmode="numeric"` and `autocomplete="one-time-code"`.

### Error and recovery
- 401 / 403 messages explain what happened without leaking system info.
- 404 page offers next destinations.
- Form errors describe the problem and the fix.

## Component-level requirements

These complement `component-state-matrix.md`:

| Component | Required a11y notes |
|---|---|
| Button | Focus ring; `aria-busy` while loading; icon-only requires `aria-label` |
| Input | Visible label; `aria-describedby` for errors; required pattern |
| Select / Combobox | Use native `<select>` when possible; for custom comboboxes use combobox ARIA pattern |
| Modal | Focus trap; ESC; `aria-modal=true`; `aria-labelledby` |
| Drawer / Sheet | Focus trap; ESC; touch target sizes |
| Accordion | `aria-expanded`, `aria-controls`; arrow keys to traverse |
| Tabs | `role=tablist`, `role=tab`, `role=tabpanel`; arrow keys to traverse |
| Toast | `role=status` for info / success; `role=alert` for error |
| Tooltip | Focus reveals; ESC closes; never holds critical info |
| Carousel | Pausable; arrow keys; `aria-roledescription="carousel"` |
| Form Section | One `<form>` per logical task; submit via Enter |

## Per-page accessibility plan

Every page spec MUST include:

```yaml
accessibility:
  landmarks: [header, main, footer, nav]
  skip_link: "#main-content"
  heading_outline:
    - h1: home.hero.headline
    - h2: home.value.heading
    - h2: home.proof.heading
    - h2: home.cta.heading
  reading_language: en-US
  rtl_supported: false
  notable_aria:
    - "AccordionItem rows under FAQSection use aria-expanded + aria-controls"
    - "Toast notifications use aria-live polite, except errors use assertive"
  contrast_checks:
    - "Hero headline on background = 7.2:1 (AAA)"
    - "Body on surface = 9.1:1 (AAA)"
  motion_prefers_reduced:
    - "All section reveal animations replaced with instant fade"
    - "Count-up disabled"
```

Reviewer cross-checks `heading_outline` against the content library and `landmarks` against the component spec.

## Testing posture

Frontend QA plan (qa_planner output) must include:

- axe-core run per page on every PR.
- Manual keyboard-only walk of every page archetype before launch.
- Screen reader smoke test (NVDA + Windows; VoiceOver + macOS) for: sign-in, sign-up, primary conversion path, billing.
- High-contrast mode visual snapshot.

## Forbidden patterns

- Hidden focus outlines (`outline: none` without replacement).
- Tooltip-only labels for icon buttons.
- Color-only error indication (must include text and/or icon).
- Auto-focus that disrupts screen readers (no auto-focus inside long forms; allowed only on first field of dedicated auth pages).
- Disabling pinch-zoom (`maximum-scale=1`) — never.
- Time-limited content without an extension affordance.

## Constraints crosswalk

- F4 (interactive states declared) — enforced in component-state-matrix.
- F6 (reduced-motion fallback) — enforced in motion-rules.
- F12 (no hover-only discovery) — enforced in responsive-rules.

The reviewer additionally enforces:
- A11y-1: every page spec includes `accessibility` block above.
- A11y-2: every component spec lists ARIA attributes used.
- A11y-3: every form spec includes error/success/validation announcements.
