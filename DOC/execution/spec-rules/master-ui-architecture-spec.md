# Spec Template — Master UI Architecture

Emitted by `ux_director` to `<output_root>/master-ui-architecture.md`, where `<output_root>` MUST resolve to `DOC/output/runs/<timestamp>/planning/frontend`.

This is the top-level frontend spec. It is the only artifact that captures cross-page logic (journeys, navigation models, conversion infrastructure). All page specs reference this file.

When a run declares a visual reference lock, premium-quality target, or trust-led marketing archetype, this file must also anchor the shared visual contract for header, footer, and the mobile hero/navigation system.

## File frontmatter

```yaml
---
document_type: master-ui-architecture
project_name: <slug>
project_archetype: marketing_site|saas_app|...
visual_archetype: knowledge/frontend-rules/visual-archetypes/<file>.md
industry_pack: knowledge/industries/<file>.md
build_stage: 1-architecture
depends_on:
  - brief.json
recommended_next_reads:
  - design-system.md
  - component-system.md
---
```

## Required sections (in this order)

### 1. Product Intent
One paragraph: what the site is for, who it serves, what success looks like.

### 2. Experience Direction
Bullet list pulled from the chosen visual archetype + brief.brand:
- visual theme
- default mood
- brand personality (3 adjectives)
- mobile posture (app-like / web-like)

### 3. Experience Principles
3–6 sentences capturing the operating principles for the site (e.g., "Lead with proof before complexity").

### 4. Core Journeys
List of named journeys, each with ordered steps:
```
- New prospect: Home → Services → Service detail → Book
- Returning customer: Home → Account → Order history → Reorder
- ...
```

### 5. Site Map
Two columns: route + name. Mark required vs optional. Group by section if useful (Marketing / Commerce / Auth / App).

### 6. Global Navigation Model
- Header links
- Persistent primary CTA
- Persistent secondary utilities (chat, WhatsApp, cart)
- Footer groups
- Deep-link behavior (every X routes to Y)

### 7. Mobile Navigation Model
- Bottom dock items (or "no dock" with reason)
- Sticky mobile action bar (or "none")
- Drawer menu contents
- Sheet/modal usage

### 8. Shared Conversion Infrastructure
- Where the primary CTA appears (hero, mid-page, footer, sticky)
- Chat / WhatsApp / phone / form / booking entry points
- Account / sign-in entry points (if applicable)

### 9. Frontend Visual Strategy
Pulled from the visual archetype: hero composition pattern, surface treatment, imagery direction, repeating motifs (if any).

### 10. Shared Visual Contract
- Header composition: utility strip, nav placement, CTA hierarchy, background treatment.
- Footer composition: column structure, trust density, legal grouping, contact density.
- Mobile hero/navigation composition: stacked order, media placement, drawer or dock behavior.
- Reference-locked surfaces: explicit notes for any screenshot-driven hero or section that codegen must preserve.
- Required trust data slots: business name, phone, license, service area, review aggregate/proof counts.

### 11. Layout System
- Desktop / tablet / mobile column counts and gutters (from `responsive-rules.md`).
- Max content widths per shell (marketing / reading / dense / app).
- Section rhythm.

### 12. Page Inventory
For every page in the site map, one mini-block:
```
### Home
- Goal: …
- Primary CTA: …
- Secondary CTA: …
```

### 13. Cross-Page Components
List of organisms shared across pages: header, footer, chat widget, cookie banner, sticky dock, etc.

### 14. Shared State Requirements
- Forms: default / focus / validation-error / submitting / success / server-error
- Listings: loading / loaded / empty / filtered-empty / error
- Chat: collapsed / greeting / typing / active / handoff / offline
- Checkout (if applicable): editable cart / coupon-applied / processing / success / failure
- Navigation: default / hover / active / open / sticky / mobile-expanded

### 15. Motion Posture
- Default duration band (from archetype)
- Default easing
- Macro motion defaults
- Micro motion defaults
- Reduced-motion stance

### 16. Accessibility Posture
- Target standard (WCAG 2.1 AA / AAA where required)
- Skip-link, landmarks, focus rings declared as standard

### 17. Localization Posture
- Default locale
- i18n required: yes/no
- RTL: yes/no
- Locale switcher location

### 18. Implementation Stack (Frontend Only)
- Framework (e.g., Next.js App Router)
- Styling (Tailwind + shadcn/ui)
- State (RSC + Zustand for client state)
- Forms (react-hook-form + zod)
- Motion (Framer Motion / CSS transitions)
- Image (next/image)

### 19. Route Map
A flat list of every route the site exposes, in canonical order.

### 20. File Output Inventory
The list of files this frontend planning round will produce, with paths under `<output_root>/`.

### 21. AI Consumption Guidance
A short block explaining:
- Which file is the AI first-stop (`<output_root>/ai-context.yaml`).
- Which file is the human first-stop (`<output_root>/README.md`).
- `<output_root>` MUST stay inside `DOC/output/runs/<timestamp>/planning/frontend/`.
- Read order for incremental implementation.

## Forbidden in this file
- Per-section copy or per-component visual detail (those belong to page specs and component specs).
- Tokens (those belong to design-system.md).
- Code.
