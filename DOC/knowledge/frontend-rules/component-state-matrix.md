# Component System — Primitive Kit + Composition Rules + State Matrix

This file replaces the prior "fixed component catalog" approach. The OS no longer ships ~30 named components (Card / FeatureBlock / PricingTier / ProductTile / ...) that every project reuses identically — that is a major source of frontend uniformity (template collapse).

Instead it ships:
1. A small **primitive kit** (layout + behaviour primitives).
2. **Composition rules** (how primitives combine).
3. A **state matrix** (every interactive component class must implement these states, regardless of how it's composed).

Site-specific composed components (Card, PricingTier, etc.) are emitted **per project**, not from a global catalog. They become *instances* of the primitive kit + composition rules, customised to the visual archetype, brand, and per-route differentiation map.

---

## Part 1 — Primitive Kit (the layout and behaviour atoms)

These are the universal building blocks. The frontend_planner declares which primitives a project uses; the frontend_developer composes pages and project-specific components from them.

### Layout primitives

| Primitive | Purpose | Behaviour |
|---|---|---|
| **Stack** | Vertical rhythm container | Manages spacing between children using token rhythm; respects responsive intent |
| **Cluster** | Horizontal grouping | Wraps children with consistent gap; supports alignment + justification |
| **Frame** | Bounded surface | Container with surface token + border + radius + padding; the most common "card" foundation |
| **Surface** | Layered background | Implements paper / panel / inset / overlay surface stack from design tokens |
| **Grid** | Multi-column composition | Configurable column count per breakpoint; supports asymmetry (e.g., 60/40, 40/60) |
| **MediaFrame** | Image / video container | Aspect-ratio-locked, lazy-loadable, responsive `sizes`, focal-point support |
| **Trail** | Linear progression | Step indicator, breadcrumb, timeline — implements "ordered traversal" semantics |
| **Reveal** | Scroll-triggered visibility | IntersectionObserver-based; honours reduced-motion; pairs with motion temperament |

These primitives are project-agnostic and ship as the project's `web/src/components/primitives/<name>.tsx`. The frontend_developer generates them from the planner's primitive kit declaration.

### Behaviour primitives (interactive)

These are also primitives — they own a behaviour, not a composed look:

| Primitive | Purpose |
|---|---|
| **Pressable** | Anything tappable / clickable; owns hover / focus-visible / active / disabled / loading; not a "button" — the visual decoration is composed on top |
| **Disclosure** | Show / hide pattern; powers accordion, popover, tooltip, dropdown |
| **Selection** | Single or multi-select; powers radio, checkbox, tab, segmented, chip |
| **TextField** | Editable text input; powers input / textarea / email / search; owns label / helper / error |
| **Surface (modal)** | Focus-trapped overlay; powers modal, drawer, sheet |

---

## Part 2 — Composition Rules (how primitives combine)

The frontend_planner authors per-project composition rules in `component-system.md`. The rules answer: *"how does this project compose primitives into the patterns it needs?"*

### Composition principles

1. **Project-specific instances over generic catalog.**
   The OS does not ship a "PricingTier" component. The project's `frontend_planner` declares "this project's pricing tier is composed of `Stack(Frame(headline + price + features + Pressable))`" — and the frontend_developer emits `web/src/components/pricing/PricingTier.tsx` for THIS project.

2. **Visual archetype guides composition decisions.**
   - `editorial-premium` → composed pricing tier uses layered Frame + Surface stack with editorial type rhythm.
   - `bold-consumer` → composed product card uses MediaFrame-dominant composition.
   - `dashboard-ops` → composed table row uses Cluster + tabular figures + status pill.

3. **Per-page composition is at HIGH latitude.**
   The same conceptual component (e.g., a "feature block") may be composed differently on `home` vs `services` to satisfy the visual differentiation map.

4. **Component reuse is allowed for low-latitude surfaces.**
   Footers, headers, auth forms — these can use a single project-specific component reused across routes.

5. **No shared cross-project component library beyond primitives.**
   Primitives are universal. Anything composed from primitives is per-project.

### What goes in `component-system.md`

The frontend_planner emits this file with:
- **Primitive kit declaration** — which primitives this project uses; project-specific tweaks (e.g., `Frame` defaults to `radius: 12` for this project per design tokens).
- **Per-pattern composition rules** — for each common pattern the project needs (hero, feature block, pricing tier, testimonial, product card, etc.), declare the composition. Vary the composition per route where the differentiation map demands it.
- **Project-specific component list** — `web/src/components/<group>/<ComponentName>.tsx` paths the developer must emit, each with its composition guidance.

---

## Part 3 — State Matrix (mandatory states per interactive class)

Every interactive component, no matter how composed, MUST implement every state for its class. The state matrix is enforced by audit constraint F3 and by the developer's self-audit.

### Interactive atoms

#### Pressable / Button
States: `default`, `hover`, `focus-visible`, `active`, `loading`, `disabled`.
Required behaviour:
- Loading: `aria-busy=true`, original label hidden or replaced by spinner; clickable area preserved.
- Disabled: `aria-disabled=true`, pointer cursor removed, contrast still meets WCAG.
- Icon-only: requires `aria-label`.

#### TextField (Input / Textarea / Email / Search)
States: `default`, `focus-visible`, `filled`, `error`, `success`, `disabled`, `read-only`.
Required behaviour: visible label, persistent helper text slot, error message rendered with `aria-describedby`.

#### Selection — Checkbox / Radio / Switch
States: `default`, `hover`, `focus-visible`, `checked`, `indeterminate` (checkbox only), `disabled`.

#### Selection — Tab / Segmented / Chip
States: per item: `default`, `hover`, `focus-visible`, `active`, `disabled`.

#### Disclosure — Accordion / Popover / Tooltip / Dropdown
States: `closed`, `opening`, `open`, `closing`, `disabled`.
Tooltip behaviour: keyboard-accessible (focus opens), ESC closes.

#### Combobox / Select
States: `default`, `focus-visible`, `open`, `selected`, `error`, `disabled`.

### Composed molecules / organisms

These are composed from primitives. The composition is project-specific. The states they MUST own:

| Composed pattern | Required states |
|---|---|
| Card / Frame-based item | `default`, `hover`, `focus-within`, `selected`, `loading` (skeleton), `disabled` |
| List / Grid / DataTable | `loading` (skeleton), `populated`, `empty`, `filtered-empty`, `error` |
| Form section | `default`, `submitting`, `success`, `server-error`, `validation-error` |
| Modal / Drawer / Sheet | `closed`, `entering`, `open`, `submitting`, `success`, `error`, `closing` (focus-trap mandatory) |
| Toast / Alert | `entering`, `visible`, `exiting` (`role=status` polite by default; `role=alert` for errors) |
| Detail page | `default`, `loading`, `not-found`, `error` |
| Auth section | `default`, `submitting`, `success`, `invalid-credentials`, `server-error`, `mfa-required` |
| Listing / Search panel | `default`, `focus`, `typing`, `loading-results`, `results-shown`, `no-results`, `error` |
| Filter panel | `default`, `mobile-sheet-open`, `applying`, `applied`, `reset` |
| Checkout / Cart | `default`, `validating`, `redirecting-to-payment`, `payment-success`, `payment-failed`, `coupon-applied`, `coupon-invalid` |
| Chat surface | `collapsed`, `greeting`, `active-conversation`, `loading-response`, `streaming`, `handoff`, `offline`, `error` |
| Notification center | `closed`, `open`, `empty`, `populated`, `loading`, `error` |
| Mobile bottom nav | per item: `default`, `active`, `with-badge` |

### Loading skeleton policy

- Every list / grid / detail surface has a skeleton state, not a spinner.
- Skeletons mirror the populated layout (same heights, same column counts).
- Skeleton shimmer respects `prefers-reduced-motion` (static fill instead of animated).

### Empty state policy

- Every empty state must offer a next action ("create your first…", "try a different filter").
- Empty states never show only an illustration with no copy.

### Error state policy

- Every error state must offer a recovery action (retry, contact, alternative path).
- Server errors must distinguish recoverable (5xx) from blocked (403, 401).

### Focus-visible policy

- All interactive elements MUST have a visible focus ring using `--color-focus-ring` and `--shadow-focus`.
- Mouse-only "hover" affordances MUST NOT replace focus rings.

### Mobile parity

- No state may be reachable only by hover.
- All state changes must be available via tap, long-press, or sheet on mobile.

---

## Part 4 — How this changes the planner / developer workflow

### Frontend planner

1. Declares which primitives the project uses (always all 8 layout primitives + the 5 behaviour primitives that are needed).
2. Declares per-pattern composition rules in `component-system.md`. Different routes may compose the same pattern differently.
3. For each interactive component, declares all required states from this file.
4. Authors `components/<ComponentName>.md` per shared composed component (project-specific, not from a global catalog).

### Frontend developer

1. Generates `web/src/components/primitives/*.tsx` for the declared primitive kit.
2. Generates `web/src/components/<group>/<ComponentName>.tsx` for each project-specific composed component, following the planner's composition rule.
3. Implements every required state for the component's interactive class.
4. Self-audit verifies state completeness.

---

## Forbidden in this file

- A global catalog of composed components (Card / FeatureBlock / PricingTier / ProductTile) presented as universal primitives.
- "Use these named components on every project" prescriptions.
- Composition recipes that would force every project's pricing-tier or feature-block to look identical.

The OS ships primitives; the project ships composition.
