# SYSTEM FLOW - SPEC EMISSION

## OBJECTIVE
Generate deterministic, machine-readable spec artifacts from a LOCKED plan before code generation.

## INPUT
- plan.json (LOCKED)
- decisions.json
- validation_report.json (passed)

## OUTPUT
- Feature specs
- Page specs
- Route specs
- Component specs
- Integration specs
- ADRs, runbooks, and OpenAPI draft

## STAGES
1. Load spec templates and rule files.
2. Emit per-feature specs.
3. Emit per-page specs.
4. Emit per-route specs.
5. Emit per-component specs.
6. Emit per-integration specs.
7. Emit ADRs for non-trivial decisions.
8. Emit runbooks for alerting and integrations.
9. Emit OpenAPI 3.1 spec.
10. Validate cross-links and completeness.
