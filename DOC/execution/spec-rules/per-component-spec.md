# Spec Template — Per-Component

Pointer file. The full template lives in `component-system-spec.md` under "Per-component required sections". This file exists so that `spec_writer` and `component_system_planner` can reference a single canonical location for the per-component shape.

## Output location
`<output_root>/components/<ComponentName>.md` — one file per shared component.

`<output_root>` MUST resolve to `DOC/output/runs/<timestamp>/planning/frontend`.

## Required structure
See `component-system-spec.md` → "Per-component required sections" for the full field list:

1. Frontmatter (document_type, component, component_class, file_path, build_stage, depends_on, content_keys_consumed)
2. Purpose
3. Variants
4. Props (zod-style schema)
5. States — every state required by `component-state-matrix.md` for this class
6. Accessibility
7. Responsive Behavior
8. Motion (with reduced-motion fallback)
9. Composition examples
10. Forbidden uses
11. Test plan
12. Related links

## Reviewer checks
- Every required state declared.
- Every visual reference uses a token, not a raw value.
- Every label resolves to a content key.
- Every interactive element has focus + ARIA notes.
- Motion tokens used (no raw ms).
- Responsive declaration for every breakpoint.
