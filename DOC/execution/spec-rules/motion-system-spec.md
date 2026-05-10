# Spec Template — Motion System

Emitted by `motion_planner` to `<output_root>/motion-system.md`, where `<output_root>` MUST resolve to `DOC/output/runs/<timestamp>/planning/frontend`.

## File frontmatter

```yaml
---
document_type: motion-system
project_name: <slug>
visual_archetype: knowledge/frontend-rules/visual-archetypes/<file>.md
build_stage: 2-design-foundation
depends_on:
  - design-system.md
  - component-system.md
recommended_next_reads:
  - pages/
---
```

## Required sections

### 1. Motion Posture
- Adopted duration band (cite archetype defaults).
- Adopted easing curves.
- Macro vs micro vs streaming policy.
- Reduced-motion stance.

### 2. Macro Motion Catalog
For each macro effect declared on this project, render:
```
- Section reveal:
  duration: --motion-duration-slow (220ms)
  easing:   --motion-easing-decel
  effect:   opacity 0→1 + translateY 12→0
  trigger:  IntersectionObserver, threshold 0.15
  stagger:  90ms between siblings, max 5
  reduced:  instant fade-in
```

Required entries (only those used):
- Section reveal
- Page transition
- Modal open/close
- Drawer open/close
- Sheet open/close
- Toast entry/exit

### 3. Micro Motion Catalog
For each micro effect declared, same shape:
```
- Hover lift:
  duration: --motion-duration-fast (150ms)
  easing:   --motion-easing-standard
  effect:   scale 1.0 → 1.02 + shadow shift to --shadow-2
  reduced:  shadow shift only, no scale
  purpose:  hierarchy
```

Required entries (only those used):
- Hover lift
- Press feedback
- Focus ring
- Tab/segmented switch
- Chip selection
- Accordion reveal
- Inline validation appear
- Count-up

### 4. Streaming Motion Catalog (only if applicable)
- AI token streaming
- Realtime status pill
- Upload progress

### 5. Component-by-Component Motion Declarations
List every component that animates and what it uses:
```
- Button:                press feedback + focus ring + (loading: aria-busy spin via spinner)
- Card:                  hover lift
- ChatWidget:            streaming token motion
- HeroSection:           section reveal
- Toast:                 toast entry/exit
- AccordionItem:         accordion reveal
- Modal/Drawer/Sheet:    open/close motion
- TabGroup:              tab switch indicator
```

### 6. Performance Budget
- 60fps on a mid-range mobile.
- `transform` and `opacity` only.
- `will-change` policy.

### 7. Forbidden in this Project
List anything the archetype + project context disallows (e.g., "no parallax outside hero", "no auto-playing video with sound", "no scroll-jacking").

### 8. Reduced-Motion Plan
A consolidated table showing the reduced-motion fallback per effect:

| Effect | Default | Reduced-Motion Fallback |
|---|---|---|
| Section reveal | fade + translateY | instant fade |
| Hover lift | scale + shadow | shadow only |
| Count-up | 0→target | static target |
| Modal open | scale + fade | instant |
| ... | ... | ... |

## Reviewer checks
- Every animated component listed.
- Every effect uses motion tokens, no raw ms.
- Every effect has a reduced-motion fallback.
- Every micro motion cites a purpose (clarity / feedback / hierarchy).
