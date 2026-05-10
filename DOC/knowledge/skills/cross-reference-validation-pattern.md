# Skill — Cross-Reference Validation Pattern

## Purpose
Verify that every reference declared in source artifact A actually resolves to a real artifact B. Used by `system_architect AUDIT` Section B (the highest-yield section for catching broken builds).

## When to use
- Verifying agent `loads:` paths resolve.
- Verifying preset `integrations:` map to YAMLs.
- Verifying `required_skills:` map to skill files.
- Verifying `emits_outbound_events:` map to taxonomy entries.
- Verifying constraint id references resolve to constraint definitions.
- Verifying feature-map `primary` and `alternatives` map to integration YAMLs.

## Inputs
- Source artifact (path).
- Field path within source (e.g., `loads`, `integrations`, `required_skills`).
- Target resolution rule (a glob pattern or exact path constructor).

## Procedure
1. `Read` the source artifact.
2. Parse the field. Extract every reference value.
3. For each value, run `Glob:<target_pattern>` (substitute the value into the pattern).
4. Confirm match count is ≥ 1 (or == 1 if exact-match expected).
5. Capture every reference with: source path, field, value, resolution status, target path found.

## Anti-patterns (do not do)
- **Do not** trust frontmatter `loads:` because the file mentions a path; glob it.
- **Do not** "spot-check" — every reference must be verified.
- **Do not** skip globs that look obviously valid; they're often wrong on subfolder paths after reorganisations.

## Output schema
```yaml
cross_references:
  - source: <source-path>
    field: <field-name>
    value: <reference-value>
    target_pattern: <glob-or-path>
    resolved_to: <target-path | null>
    status: pass | fail
    severity: blocker | advisory
```

## Examples

### Example 1 — agent loads
```yaml
- source: DOC/agents/integration_planner.agent.md
  field: loads
  value: "DOC/knowledge/integration-rules/**/*.yaml"
  target_pattern: "DOC/knowledge/integration-rules/**/*.yaml"
  resolved_to: "87 files"
  status: pass
  severity: n/a
```

### Example 2 — broken integration reference in preset
```yaml
- source: DOC/knowledge/integration-presets/tier-standard-saas.yaml
  field: integrations.email_marketing
  value: "lops"
  target_pattern: "DOC/knowledge/integration-rules/**/lops.yaml"
  resolved_to: null
  status: fail
  severity: blocker
```

### Example 3 — broken skill reference in integration
```yaml
- source: DOC/knowledge/integration-rules/payments/stripe.yaml
  field: required_skills[0]
  value: "webhook-signature-verification"
  target_pattern: "DOC/knowledge/skills/webhook-signature-verification.md"
  resolved_to: "DOC/knowledge/skills/webhook-signature-verification.md"
  status: pass
  severity: n/a
```

## Aggregate handling
After every reference is checked, group results by source artifact. A source with even one broken reference fails Section B.

## Failure modes
- `BROKEN_REFERENCE` — value does not resolve.
- `AMBIGUOUS_REFERENCE` — multiple resolutions where exactly one was expected.
- `WRONG_TYPE` — resolution succeeded but target is not the expected kind (e.g., a directory instead of a YAML file).
