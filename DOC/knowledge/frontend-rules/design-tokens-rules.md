# Design Tokens Rules

The design system is the only source of styling truth. No raw values may appear in component code. These rules govern token taxonomy, naming, and the centralized definition file.

## Token Categories (mandatory)

1. `color`
2. `typography`
3. `spacing`
4. `radius`
5. `shadow`
6. `motion`
7. `breakpoints`
8. `z_index`
9. `iconography`
10. `imagery`

## Naming convention

- All tokens are kebab-case, namespaced by category.
- Example: `--color-primary`, `--space-section-y-desktop`, `--radius-card`, `--motion-duration-fast`.
- Tailwind theme keys mirror token names: `colors.primary`, `spacing['section-y-desktop']`, `borderRadius.card`, `transitionDuration.fast`.

## Color tokens (required slots)

```
--color-background
--color-surface
--color-inset
--color-overlay              (rgba string)
--color-border
--color-text
--color-text-muted
--color-primary
--color-primary-hover
--color-primary-foreground   (text on primary)
--color-accent
--color-accent-foreground
--color-destructive
--color-destructive-foreground
--color-success
--color-warning
--color-info
--color-focus-ring
```

Plus semantic-tier tokens used in components:
```
--color-card
--color-card-foreground
--color-popover
--color-popover-foreground
--color-input
--color-ring
```

Dark-mode variants live under a parallel namespace and are activated by the chosen theme strategy (CSS variables, `data-theme`, or class-based).

## Typography tokens (required slots)

Families:
```
--font-display       (display headings)
--font-body          (UI + body)
--font-mono          (technical, code, metrics)
```

Scales (mobile-first; desktop overrides via media query):
```
--font-size-display-1     --font-line-height-display-1
--font-size-display-2     --font-line-height-display-2
--font-size-h1            --font-line-height-h1
--font-size-h2            --font-line-height-h2
--font-size-h3            --font-line-height-h3
--font-size-h4            --font-line-height-h4
--font-size-h5            --font-line-height-h5
--font-size-h6            --font-line-height-h6
--font-size-lead          --font-line-height-lead
--font-size-body-lg       --font-line-height-body-lg
--font-size-body          --font-line-height-body
--font-size-body-sm       --font-line-height-body-sm
--font-size-label         --font-line-height-label
--font-size-caption       --font-line-height-caption
--font-size-overline      --font-line-height-overline
--font-size-mono          --font-line-height-mono
```

Weights:
```
--font-weight-regular
--font-weight-medium
--font-weight-semibold
--font-weight-bold
--font-weight-display    (often 700/800)
```

Letter-spacing:
```
--letter-spacing-display    (negative)
--letter-spacing-body       (0)
--letter-spacing-overline   (positive)
```

## Spacing tokens (required scale)

Base unit: 8px. Allowed scale:
```
--space-0       (0)
--space-1       (4)
--space-2       (8)
--space-3       (12)
--space-4       (16)
--space-6       (24)
--space-8       (32)
--space-12      (48)
--space-16      (64)
--space-24      (96)
--space-32      (128)
```

Section rhythm tokens:
```
--space-section-y-mobile
--space-section-y-tablet
--space-section-y-desktop
```

Card and panel padding:
```
--space-card-padding-dense
--space-card-padding
--space-card-padding-premium
```

## Radius tokens (required scale)

```
--radius-none     (0)
--radius-xs       (4)
--radius-sm       (6)
--radius-md       (8)
--radius-lg       (12)
--radius-xl       (16)
--radius-2xl      (24)
--radius-3xl      (32)
--radius-full     (9999)
--radius-button
--radius-input
--radius-card
--radius-panel
```

## Shadow tokens (required scale)

```
--shadow-1   (subtle separation)
--shadow-2   (interactive lift)
--shadow-3   (overlay depth)
--shadow-focus  (focus ring shadow)
```

No "shadow-bigger" tokens. Three depths only.

## Motion tokens (required slots)

```
--motion-duration-instant   (0ms; reduced-motion fallback)
--motion-duration-fast      (140ms)
--motion-duration-base      (200ms)
--motion-duration-slow      (260ms)
--motion-duration-cinematic (320ms)
--motion-easing-standard    (cubic-bezier per archetype)
--motion-easing-spring      (when relevant)
--motion-easing-decel       (cubic-bezier(0, 0, 0.2, 1))
--motion-easing-accel       (cubic-bezier(0.4, 0, 1, 1))
```

Reduced-motion handling: every animation in a component MUST reference these tokens (not raw ms) so `prefers-reduced-motion: reduce` can swap to `--motion-duration-instant` and disable easing.

## Breakpoint tokens (required)

```
--breakpoint-sm    640
--breakpoint-md    768
--breakpoint-lg    1024
--breakpoint-xl    1280
--breakpoint-2xl   1440
```

Container max-widths:
```
--container-sm     640
--container-md     768
--container-lg     960
--container-xl     1200
--container-2xl    1440
```

## Z-index tokens (required ladder)

```
--z-base           0
--z-content        10
--z-sticky         20
--z-dropdown       30
--z-overlay        40
--z-modal          50
--z-toast          60
--z-tooltip        70
--z-debug          90
```

No raw z-index numbers allowed in components.

## Iconography tokens

```
--icon-size-xs     16
--icon-size-sm     20
--icon-size-md     24
--icon-size-lg     32
--icon-stroke-thin    1.5
--icon-stroke-base    1.75
--icon-stroke-bold    2
```

Style: outline-first (per archetype) with allowed filled exceptions.

## Imagery tokens (required policies)

- Allowed aspect ratios per archetype (declared in archetype file).
- Required formats: `avif`, `webp`.
- Default loader: `next/image` (Next.js) or framework equivalent.
- Loading strategy: lazy by default, eager only above the fold.
- `sizes` attribute mandatory.

## Token output file

The design_system_planner emits a single JSON file at `<output_root>/design-system.tokens.json` and a Markdown narrative at `<output_root>/design-system.md`. The JSON file is consumed by codegen to produce:
- `tailwind.config.ts` (for Tailwind projects)
- `src/styles/tokens.css` (for raw CSS-variable projects)
- typed token references (TS) for runtime use

`<output_root>` MUST resolve to `DOC/output/runs/<timestamp>/planning/frontend`.

## Forbidden in component code

- Raw hex (`#RRGGBB`), `rgb()`, `hsl()` values.
- Raw `px`, `rem`, `em`, `ms` literals (Tailwind utility classes mapping to tokens are allowed).
- Inline style attributes for color/spacing/typography.
- One-off values like `style={{ marginTop: 23 }}`.

The reviewer enforces this via constraint **F1** (see `validation/constraints/frontend-constraints.md`).
