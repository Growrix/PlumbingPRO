# Spec Template - Per-Page Frontend Focus Contract

Emitted by frontend_planner when execution mode is frontend_focus.

This template is intentionally strict for visual completeness. It keeps page inventory adaptive to the brief, enforces complete section density, and requires publish-ready section copy plus concrete layout blueprint so output looks like a complete website draft.

---

## Core rule

- Page inventory is dynamic, not fixed.
- Only include routes required by the brief.
- Every included public page must satisfy the minimum section contract below.

---

## Required frontmatter

```yaml
---
document_type: per-page-frontend-focus
page_id: <slug>
route: /...
auth: public|protected
data_source: static|cms|database|integration|mixed
priority: flagship|primary|supporting|utility
build_stage: 4-page-design
depends_on:
  - master-ui-architecture.md
  - design-system.md
  - component-system.md
  - motion-system.md
  - content-library.md
content_keys_used:
  - "<surface>.<context>.<key>"
---
```

---

## Minimum section contract by page priority

### Flagship page (usually Home)
Must have at least 7 sections in visual order:
1. Hero
2. Trust or stats strip
3. Primary value section
4. Proof section (portfolio/testimonial/results)
5. Secondary value section
6. FAQ or objection handling
7. Final CTA band

### Primary pages (services, pricing, about, shop, contact, core conversion pages)
Must have at least 5 sections in visual order:
1. Hero
2. Trust or orientation strip
3. Primary content section
4. Secondary content or proof section
5. Final CTA band

### Supporting pages (blog index, case study index, resources)
Must have at least 4 sections in visual order:
1. Hero or utility intro
2. Primary listing/content block
3. Supporting filter or proof block
4. CTA or next-step block

### Utility pages (404, legal, policy)
May use compact composition with explicit exemption:
- header
- utility body
- footer

---

## Required sections in this order

### 1. Page definition
- User intent
- Conversion outcome
- Primary CTA (content key + destination)
- Secondary CTA (content key + destination)

### 2. Sections in visual order
For each section provide:
- purpose
- required content slots
- section-level draft copy (headline, subhead, body, CTA labels)
- concrete layout blueprint (desktop/tablet/mobile)
- surface style and contrast notes
- interaction notes
- responsive notes
- motion notes with reduced-motion fallback

### 3. Page-level states
- loading
- empty
- error
- success
- offline or reconnect behavior where relevant

### 4. Accessibility plan
- landmarks
- heading outline
- focus behavior
- contrast notes on hero and CTA surfaces

### 5. SEO and metadata
- title
- description
- og fields
- canonical

### 6. Performance plan
- LCP target
- hero media strategy
- route JS budget
- below-fold defer strategy

### 7. Analytics and conversion path
- key events
- primary path
- secondary path

---

## Anti-failure checks

- No page may be a summary stub.
- No route may have fewer sections than its priority contract unless marked utility with explicit reason.
- Do not reuse identical hero composition across flagship and primary pages.
- Every declared section must map to at least one content key.
- Every declared section must include draft copy and layout blueprint (no placeholder text).
