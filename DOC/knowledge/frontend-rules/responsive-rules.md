# Responsive Rules

The frontend must behave like a thoughtfully-designed app on every breakpoint. Mobile is not a scaled-down desktop.

## Breakpoints (mobile-first)

Authoritative values come from `design-tokens-rules.md`:

| Token              | Width range               | Class    |
|--------------------|---------------------------|----------|
| (default)          | 0–639px                   | mobile   |
| `sm` (640)         | 640–767px                 | large mobile |
| `md` (768)         | 768–1023px                | tablet   |
| `lg` (1024)        | 1024–1279px               | desktop  |
| `xl` (1280)        | 1280–1439px               | wide     |
| `2xl` (1440)       | 1440+                     | ultrawide |

Mobile and tablet are designed first; desktop is an enhancement of the mobile composition.

## Container widths

| Class         | Max width |
|---------------|-----------|
| `container-sm`| 640       |
| `container-md`| 768       |
| `container-lg`| 960       |
| `container-xl`| 1200      |
| `container-2xl`| 1440     |

Default page max width: 1200 (marketing) / 1440 (wide marketing) / 1024 (reading) / 100% (app shell).

## Grid

| Breakpoint | Columns | Gutter |
|------------|---------|--------|
| mobile     | 4       | 16     |
| tablet     | 8       | 20     |
| desktop+   | 12      | 24     |

Cards span column counts, not arbitrary widths.

## Section rhythm

| Breakpoint | Vertical section padding |
|------------|--------------------------|
| mobile     | 40–48px                  |
| tablet     | 56–64px                  |
| desktop+   | 80–96px (archetype-overridden up to 128 for portfolio-craft) |

Use `--space-section-y-mobile`, `--space-section-y-tablet`, `--space-section-y-desktop` tokens.

## Touch targets

- Minimum tap target: 44×44px (Apple HIG / WCAG 2.5.5 AA).
- Minimum spacing between adjacent targets: 8px.
- Sticky CTAs reserve safe-area-inset on iOS via `env(safe-area-inset-bottom)`.

## Mobile navigation patterns

Per archetype:

| Archetype                  | Top nav (mobile)              | Bottom dock?                                      |
|----------------------------|-------------------------------|---------------------------------------------------|
| `local-business-trust`     | Logo + hamburger              | Yes — primary contact CTA pinned                  |
| `editorial-premium`        | Logo + hamburger              | Optional — only if site has high mobile traffic   |
| `modern-saas`              | Logo + hamburger              | Usually no                                        |
| `bold-consumer`            | Logo + cart + hamburger       | Yes — Search / Browse / Saved / Bag / Account     |
| `marketplace`              | Logo + search + hamburger     | Yes — Search / Saved / List / Messages / Account  |
| `dashboard-ops`            | Top bar + drawer toggle       | Optional — surface-specific                       |
| `portfolio-craft`          | Logo + hamburger              | No                                                |
| `ai-product`               | Logo + new-chat              | Yes — Chats / Discover / Account                  |
| `startup-conversion`       | Logo + single CTA             | No — keep distractions out                        |

## Sheet / drawer / modal rules on mobile

- Filters: bottom sheet with sticky apply/reset.
- Cart: side drawer or bottom sheet.
- Auth: full-screen on mobile, modal on tablet+.
- Confirmations: bottom sheet on mobile, dialog on desktop.

## Hover-only forbidden

No information or action may be gated behind hover. Mobile-equivalent must always exist.

## Image responsiveness

- `next/image` (Next.js) or framework equivalent.
- `sizes` attribute mandatory.
- Allowed formats: `avif`, `webp`. Fallback `jpg/png` only when source demands it.
- Above-the-fold images: `priority`/`eager`.
- Below-the-fold: `lazy`.
- Aspect ratios standardized per archetype's imagery rules.

## Typography responsiveness

Type scales shrink on smaller breakpoints. Use clamp:
- Display: `clamp(40px, 6vw, 72px)` typical.
- H1: `clamp(28px, 4vw, 48px)`.
- Body: `clamp(15px, 1vw + 14px, 18px)`.

Token implementations may use fluid scales or step-based media queries; either is acceptable so long as the token is the single source.

## Hero composition rules

- Desktop: split or layered composition with media panel; max two CTAs.
- Tablet: one-column compressed hero with media; CTAs visible above the fold.
- Mobile: single column; primary CTA must be inside the first 100vh.

## Forms

- Desktop: multi-column when fields naturally pair (city/state, first/last).
- Tablet: same.
- Mobile: single column always; full-width inputs; full-width primary CTA.
- Stack labels above fields on mobile; inline labels allowed on desktop only.

## Tables

- Desktop: full table with sortable columns.
- Tablet: same.
- Mobile: collapse rows into cards or summary rows; do not render full table at <768px unless data forces it.

## Sticky patterns

- Sticky header allowed across breakpoints. Compress on scroll.
- Sticky bottom CTA on mobile only, per archetype rule.
- Sticky filter rail on desktop listing pages allowed.
- Avoid stacking multiple sticky elements; one sticky per axis (top, bottom).

## Performance budgets

| Metric (mid-range mobile) | Target |
|---------------------------|--------|
| LCP                       | ≤ 2.5s |
| INP                       | ≤ 200ms |
| CLS                       | ≤ 0.1 |
| TTFB                      | ≤ 0.8s |
| First-load JS (route)     | ≤ 90KB gz |
| Total JS (initial route)  | ≤ 180KB gz |
| Hero image weight         | ≤ 200KB (avif/webp) |

The performance_auditor enforces these; the responsive plan must not violate them by composition.

## Accessibility intersection

- All breakpoints must satisfy WCAG 2.1 AA (see `accessibility-rules.md`).
- Focus rings render correctly on all breakpoints.
- Skip-link visible at the top of every page.

## Deliverable

The page_planner declares per page, per section, the responsive adaptation as one of:

- `same` — visual structure identical across breakpoints.
- `compress` — desktop composition reflows to mobile single-column without changing content order.
- `reorder` — content order changes (e.g., proof above content on mobile); must list new order.
- `replace` — element swapped (e.g., desktop side rail → mobile bottom sheet); must list the replacement component.

Reviewer checks that every section has a responsive declaration.
