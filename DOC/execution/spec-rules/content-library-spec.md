# Spec Template — Content Library

Emitted by `content_planner`:
- `<output_root>/content-library.md` — human narrative + key index.
- `<output_root>/content.<locale>.json` — machine-readable per locale.

`<output_root>` MUST resolve to `DOC/output/runs/<timestamp>/planning/frontend`.

## File frontmatter (content-library.md)

```yaml
---
document_type: content-library
project_name: <slug>
default_locale: en-US
locales: [en-US]
i18n_required: false
build_stage: 2-design-foundation
depends_on:
  - master-ui-architecture.md
  - design-system.md
  - brief.json
---
```

## Required sections (content-library.md)

### 1. Voice & Tone
- Voice (1 word) — from brief.
- Tone (3 adjectives).
- Reading-level target.
- Forbidden words list (from industry pack + brand override).

### 2. Naming Convention
- Dot-notated keys.
- Surface-first (`home.*`, `pricing.*`).
- `component.*` for shared components.
- `errors.*`, `validation.*` for messages.

### 3. Content Surfaces
For each surface (= each page or shared component group), render:

```markdown
## Surface: home

### home.hero
- home.hero.eyebrow:        "..."
- home.hero.headline:       "..."
- home.hero.subheadline:    "..."
- home.hero.cta_primary:    "..."
- home.hero.cta_secondary:  "..."
- home.hero.cta_primary_aria: "..."   (optional aria-label override)

### home.value
- home.value.heading:       "..."
- home.value.body:          "..."
- home.value.items[0].title:"..."
- home.value.items[0].body: "..."
- ...
```

Repeat per surface. The page_planner declares which keys it uses; the content_planner ensures every declared key has a value here.

### 4. Shared Component Surfaces
```markdown
## Surface: component

### component.button
- component.button.loading_label: "Working…"

### component.toast
- component.toast.success.title: "..."
- component.toast.success.body:  "..."
- component.toast.error.title:   "..."
- ...
```

### 5. Errors and Validation
```markdown
## Surface: errors

### errors.network
- errors.network.title:  "..."
- errors.network.body:   "..."
- errors.network.retry:  "..."

### errors.unauthorized
- errors.unauthorized.title: "..."
- errors.unauthorized.body:  "..."

### errors.not_found
- errors.not_found.title: "..."
- errors.not_found.body:  "..."

## Surface: validation

### validation.email
- validation.email.required: "..."
- validation.email.format:   "..."
```

### 6. SEO Block
```markdown
## Surface: seo

- seo.home.meta_title:        "..."   ≤60
- seo.home.meta_description:  "..."   ≤155
- seo.home.og_title:          "..."
- seo.home.og_description:    "..."
- ...
```

One per page.

### 7. Schema.org Snippets
For pages where industry pack mandates structured data:
```markdown
## Surface: schema_org

- schema.home.local_business:
    @type: LocalBusiness
    name: "..."
    address: "..."
    telephone: "..."
    openingHours: ["..."]
- schema.product.<slug>:
    @type: Product
    ...
```

### 8. Trust Copy
For trust-led archetypes, mandatory keys:
- `trust.license`
- `trust.years`
- `trust.areas`
- `trust.response_time`
- `trust.guarantee`
- `trust.privacy`

### 9. Forbidden Words Audit
The content_planner self-audits and lists any flagged forbidden-word usage with its replacement.

### 10. Open Questions
Anything the content_planner could not author confidently — flagged for the human (e.g., "Need 3 customer testimonials with consent.").

## content.<locale>.json structure

A flat object keyed by dot-path:

```json
{
  "home.hero.eyebrow": "...",
  "home.hero.headline": "...",
  "home.hero.subheadline": "...",
  "component.button.loading_label": "Working…",
  "errors.network.title": "...",
  "validation.email.required": "..."
}
```

Per-locale files are siblings: `content.en-US.json`, `content.es-ES.json`, etc.

## Reviewer checks
- Every key declared in any page spec or component spec exists in content-library.md.
- No forbidden word remains.
- Length budgets honored.
- For every locale declared, a JSON file exists with the same key set.
- SEO title and description per page within length budgets.
