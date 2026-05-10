# Spec Template — Design System

Emitted by `design_system_planner` to:
- `<output_root>/design-system.md` (human narrative)
- `<output_root>/design-system.tokens.json` (machine-readable, consumed by codegen)

`<output_root>` MUST resolve to `DOC/output/runs/<timestamp>/planning/frontend`.

## File frontmatter (design-system.md)

```yaml
---
document_type: design-system
project_name: <slug>
visual_archetype: knowledge/frontend-rules/visual-archetypes/<file>.md
build_stage: 2-design-foundation
depends_on:
  - master-ui-architecture.md
  - brief.json
recommended_next_reads:
  - component-system.md
  - motion-system.md
---
```

## Required sections (design-system.md)

### 1. Visual Direction
- Project name and short visual statement.
- Adopted visual archetype.
- Default theme (light-first / dark-first / both peer).
- Palette seed (if provided).

### 2. Color Tokens
Render the full color token list from `design-tokens-rules.md` with concrete hex values for both light and (where applicable) dark mode. Include semantic tokens (primary / accent / background / surface / inset / border / text / muted / destructive / success / warning / info / focus-ring).

### 3. Theme Logic
- Default theme.
- Alternate theme behavior.
- Accent usage cap (max % of screen).
- High-contrast mode handling.

### 4. Typography
- Display / body / mono families (literal font names, with web-font sources or system fallback).
- Display, heading, body, label, caption scales.
- Line-height policy.
- Letter-spacing policy.
- Weight usage.

### 5. Spacing System
- 8px base.
- Allowed scale rendered.
- Section rhythm tokens for mobile / tablet / desktop.
- Card padding tokens.

### 6. Layout Tokens
- Container max-widths (sm / md / lg / xl / 2xl).
- Grid columns + gutters per breakpoint.
- Content alignment defaults.

### 7. Surface System
- Page base.
- Elevated.
- Inset.
- Overlay.
- Interactive surfaces (filled vs outline).

### 8. Radius and Borders
- Full radius scale (none / xs / sm / md / lg / xl / 2xl / 3xl / full).
- Component-specific radii (button / input / card / panel).
- Border weights and where each is used.

### 9. Shadow and Depth
- Three depths (subtle / interactive / overlay).
- Focus-ring shadow.
- Forbid heavy or decorative shadows.

### 10. Motion Tokens
- Durations (instant / fast / base / slow / cinematic).
- Easings (standard / spring / decel / accel).
- Pointer to `motion-system.md` for the full motion plan.

### 11. Breakpoints
The five breakpoints with their pixel boundaries.

### 12. Iconography
- Stroke style (outline / mixed).
- Stroke widths (thin / base / bold).
- Sizes (xs / sm / md / lg).
- Filled-icon allowed exceptions.

### 13. Imagery and Media
- Photography direction.
- Aspect ratios per content type.
- Allowed file formats and loader rules.
- Off-limits imagery.

### 14. Content Density Rules
- Spacious / balanced / dense definitions and where they apply.

### 15. Mobile App-Like Rules
- Sticky bottom dock?
- Sheet vs modal usage.
- Tap target minimum (44).

### 16. Accessibility Tokens & Rules
- Focus ring spec (color / width / offset).
- Minimum contrast ratios (AA / AAA exceptions).
- Reduced-motion fallback strategy.
- Form label persistence rule.

### 17. Theming and Customization
- Token override layer (per-tenant, per-case-study, per-collection).
- Brand customization affordances without changing layout primitives.

### 18. Token Naming and Output
- Naming convention (kebab-case + namespace).
- Tailwind theme key mapping.
- Output files and how codegen consumes them.

### 19. Forbidden Values
- Raw hex / px / ms in components.
- Inline style attributes for color / spacing / typography.

## design-system.tokens.json structure

```json
{
  "$schema": "design-system-tokens.v1",
  "color": {
    "background":   "#...",
    "surface":      "#...",
    "...": "..."
  },
  "color-dark": { "...": "..." },
  "typography": {
    "fontFamily": { "display": "...", "body": "...", "mono": "..." },
    "fontSize":   { "display-1": "...", "h1": "...", "...": "..." },
    "lineHeight": { "display-1": "...", "h1": "...", "...": "..." },
    "letterSpacing": { "display": "-0.01em", "body": "0", "overline": "0.06em" },
    "fontWeight": { "regular": 400, "medium": 500, "semibold": 600, "bold": 700, "display": 800 }
  },
  "spacing": { "0": 0, "1": 4, "2": 8, "...": "..." },
  "sectionY": { "mobile": "...", "tablet": "...", "desktop": "..." },
  "radius":   { "...": "..." },
  "shadow":   { "1": "...", "2": "...", "3": "...", "focus": "..." },
  "motion": {
    "duration": { "instant": "0ms", "fast": "...", "base": "...", "slow": "...", "cinematic": "..." },
    "easing":   { "standard": "...", "spring": "...", "decel": "...", "accel": "..." }
  },
  "breakpoints": { "sm": 640, "md": 768, "lg": 1024, "xl": 1280, "2xl": 1440 },
  "container":   { "sm": 640, "md": 768, "lg": 960, "xl": 1200, "2xl": 1440 },
  "zIndex":      { "base": 0, "content": 10, "sticky": 20, "...": "..." },
  "icon":        { "size": { "xs": 16, "sm": 20, "md": 24, "lg": 32 }, "stroke": { "thin": 1.5, "base": 1.75, "bold": 2 } }
}
```

## Reviewer checks
- All required tokens present.
- Color tokens meet contrast minimums.
- Section-rhythm tokens declared per breakpoint.
- No invented tokens beyond the schema (extensions go in a `custom` block).
