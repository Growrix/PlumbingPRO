# Skill — Frontmatter Schema Validation Pattern

## Purpose
Verify that every Markdown / YAML file with a frontmatter block conforms to the schema declared for its document type. Used by `system_architect AUDIT` Section C and to enforce consistency across agent files, integration YAMLs, presets, and spec-rule templates.

## When to use
- Auditing agent files (`*.agent.md` → `agent`, `version`, `loads`).
- Auditing integration YAMLs (full schema in `_schema.md`).
- Auditing presets (`preset`, `applies_to`, `integrations`, `forbidden`, `optional`, `automation_surface`).
- Auditing spec-rule templates.

## Inputs
- The file path.
- The expected schema for the document type (a list of required keys + optional keys + value type per key).
- An exemption table for stub-mode documents (e.g., integration YAMLs with `status: stub` only require minimal metadata).

## Procedure
1. `Read` file.
2. Extract the frontmatter block (between the first `---` pair, or top-level YAML for `.yaml` files).
3. Parse to a key/value map.
4. For each required key in the schema:
   - If absent → record `missing_field`.
   - If present but wrong type → record `type_mismatch`.
5. If the schema declares `status: stub` exemptions and the document has `status: stub`, only enforce the stub-required subset.
6. Capture any unknown keys (extra fields) as `unknown_field` (advisory).
7. Verify section heading order in the body if the schema declares one (use Grep for heading patterns).

## Anti-patterns (do not do)
- **Do not** parse the frontmatter manually with regex; use a YAML parser semantically (mentally if needed).
- **Do not** skip the `status: stub` check; misclassifying stubs causes false-positive blockers.
- **Do not** infer schema from the most popular file in the folder; use the `_schema.md` declaration.

## Output schema
```yaml
schema_validation_results:
  - file: <path>
    document_type: <agent | integration | preset | spec-rule>
    status_field: full | stub
    required_present: [<keys>]
    missing_fields: [<keys>]
    type_mismatches:
      - field: <name>
        expected: <type>
        actual: <type>
    unknown_fields: [<keys>]
    section_headings_ok: true | false
    overall: pass | fail
```

## Examples

### Example 1 — agent file passes
```yaml
- file: DOC/agents/reviewer.agent.md
  document_type: agent
  status_field: full
  required_present: [agent, version, loads]
  missing_fields: []
  type_mismatches: []
  unknown_fields: [model_hint]
  section_headings_ok: true
  overall: pass
```

### Example 2 — integration YAML with stub correctly exempted
```yaml
- file: DOC/knowledge/integration-rules/hosting/vercel.yaml
  document_type: integration
  status_field: stub
  required_present: [integration, category, role, tier, status]
  missing_fields: []
  type_mismatches: []
  overall: pass
```

### Example 3 — full integration missing required field
```yaml
- file: DOC/knowledge/integration-rules/payments/stripe.yaml
  document_type: integration
  status_field: full
  required_present: [integration, category, role, tier, env_vars, webhooks, setup_steps, ...]
  missing_fields: [runbook]
  overall: fail
```

## Schema sources (canonical)
- Agent files: see [DOC/agents/reviewer.agent.md](../../agents/reviewer.agent.md) and [DOC/agents/integration_planner.agent.md](../../agents/integration_planner.agent.md) as the structural template.
- Integration YAMLs: see [DOC/knowledge/integration-rules/_schema.md](../integration-rules/_schema.md).
- Presets: see [DOC/knowledge/integration-presets/](../integration-presets/) for the consensus shape; required keys per `audit-template.md` Section C.2.
- Spec-rule templates: see [DOC/execution/spec-rules/master-ui-architecture-spec.md](../../execution/spec-rules/master-ui-architecture-spec.md) for the pattern.

## Failure modes
- `MISSING_REQUIRED_FIELD` — a required schema key is absent.
- `TYPE_MISMATCH` — value type differs from the schema declaration.
- `STUB_MISCLASSIFIED` — file marked stub but appears as primary in a preset (cross-check with C.4).
- `SECTION_HEADING_DRIFT` — body sections are out of canonical order or missing required headings.
