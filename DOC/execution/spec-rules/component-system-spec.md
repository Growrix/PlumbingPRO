# Spec Template — Component System

Emitted by `component_system_planner`:
- `<output_root>/component-system.md` — index narrative.
- `<output_root>/components/<ComponentName>.md` — one per shared component.

`<output_root>` MUST resolve to `DOC/output/runs/<timestamp>/planning/frontend`.

## Index file frontmatter (component-system.md)

```yaml
---
document_type: component-system
project_name: <slug>
build_stage: 3-component-foundation
depends_on:
  - master-ui-architecture.md
  - design-system.md
recommended_next_reads:
  - motion-system.md
  - pages/
---
```

## Index file required sections

### 1. Strategy
- "Reusable product-grade components only."
- Atoms / Molecules / Organisms layered classification.
- Where components live in the codebase (`src/components/ui/`, `src/components/feature/`, etc.).

### 2. Atoms list
Bullet list of atoms used by this project, each linking to its per-component file:
```
- [Button](components/Button.md)
- [Input](components/Input.md)
- ...
```

### 3. Molecules list
Same shape.

### 4. Organisms list
Same shape.

### 5. Shared Accessibility Rules
Pointer to `knowledge/frontend-rules/accessibility-rules.md` and project-specific notes.

### 6. Responsive Behavior Rules
Pointer to `knowledge/frontend-rules/responsive-rules.md`.

### 7. State Management Guidance
- Cart state: client-persisted (key, schema).
- AI assistant session: scope and persistence.
- Filters: URL-synced.
- Form progress: preserved on temporary navigation.

### 8. Why this pattern fits
1–2 paragraphs grounding the choice of component set in the chosen archetype and audience.

## Per-component file frontmatter (`components/<ComponentName>.md`)

```yaml
---
document_type: component-spec
component: ComponentName
component_class: atom|molecule|organism
file_path: src/components/<...>/<ComponentName>.tsx
build_stage: 3-component-foundation
depends_on:
  - design-system.md
  - motion-system.md
content_keys_consumed:
  - "<surface>.<context>.<key>"
---
```

## Per-component required sections

### 1. Purpose
1–2 sentences: what this component is for and where it lives in the system.

### 2. Variants
List variants and when each is used.
```
- primary | secondary | ghost | destructive | text-link
```

### 3. Props (zod-style schema)
```ts
{
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'text-link',
  size: 'sm' | 'md' | 'lg',
  iconLeft?: ReactNode,
  iconRight?: ReactNode,
  loading?: boolean,
  disabled?: boolean,
  asChild?: boolean,
  children: ReactNode,
  // labelKey is the canonical content-library key for the label
  labelKey: string,
}
```

Reference content keys MUST exist in `content-library.md`.

### 4. States
List every state required by `component-state-matrix.md` for this class. For each state, declare:
- visual treatment (referencing tokens, never raw values)
- aria attributes affected
- motion token used (if any)

### 5. Accessibility
- Role / semantic element.
- ARIA attributes (`aria-busy`, `aria-disabled`, `aria-expanded`, `aria-describedby`, etc.).
- Focus behavior.
- Keyboard interactions.

### 6. Responsive Behavior
For each breakpoint, what changes:
- mobile: full-width, larger tap target
- tablet: same
- desktop: auto-width, default tap target

### 7. Motion
- macro motion (rare for atoms, common for organisms): which tokens, what triggers
- micro motion: hover, focus, press, etc.
- reduced-motion fallback.

### 8. Composition examples
Show 2–4 realistic uses with the components this one composes with. (Example only — not real code; just structural pseudocode.)

### 9. Forbidden uses
- Don't use this for X.
- Don't substitute it for Y.

### 10. Test plan
- States to cover in unit tests.
- States to cover in visual regression.
- ARIA-attribute assertions.

### 11. Related
- Links to other component files.
- Links to data-flow files where this component participates.

## Reviewer checks per component spec
- Every state from `component-state-matrix.md` declared.
- Every visual reference uses a token, not a raw value.
- Every label resolves to a content key.
- Every interactive element has focus + ARIA notes.
- Motion tokens used (no raw ms).
- Responsive declaration for every breakpoint.
