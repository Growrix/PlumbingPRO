# ANTI-HALLUCINATION RULES

## SCOPE
Applies to every agent, every output, every phase.

## CORE LAWS

1. NEVER invent.
   - Tools, packages, env vars, endpoints, SDK methods, dashboards, file paths, or pricing.

2. ALWAYS verify against the knowledge base.
   - Source of truth: `knowledge/integration-rules/**/*.yaml`.
   - Source of truth for mappings: `knowledge/feature-maps/feature-integration-map.json`.
   - Source of truth for stack: `knowledge/architecture-templates/*.yaml`.

3. ALWAYS load before planning.
   - Required loads: `core/system-rules.md`, `core/anti-hallucination-rules.md`,
     `core/planning-principles.md`, all `knowledge/`, all `validation/`.

4. ALWAYS validate names.
   - Package names: must match exactly the `package_name` field in integration rules.
   - Env vars: must match exactly the `env_vars` list in integration rules.
   - Webhooks: must match exactly the `webhooks` list in integration rules.

## PROHIBITED PATTERNS

| Pattern                                    | Reason                          |
|--------------------------------------------|---------------------------------|
| "you can use any of X, Y, Z"               | Non-deterministic.              |
| "for example, Stripe or Paddle"            | Ambiguous integration.          |
| "add later"                                | Partial output forbidden.       |
| "TODO"                                     | Partial output forbidden.       |
| "should work with most providers"          | Hallucination risk.             |
| Unscoped imports (`from sdk import *`)     | Hides invented members.         |
| Unverified API routes                      | Must come from integration rule.|

## VERIFICATION CHECKLIST (PER OUTPUT)

- [ ] Every integration named appears in `knowledge/integration-rules/`.
- [ ] Every feature named appears in `feature-integration-map.json`.
- [ ] Every env var appears in the integration rule.
- [ ] Every package version is omitted (use latest stable tag, never invented version).
- [ ] Every endpoint is documented inside the chosen integration rule.
- [ ] No file path references a folder not declared in the architecture template.

## ESCAPE HATCH

If a feature requires an unknown integration:
1. STOP.
2. Emit: `MISSING_KNOWLEDGE { feature, candidate_integration, required_fields }`.
3. Request the user to add a new entry to `knowledge/integration-rules/`.
4. Do NOT proceed with a guess.

## SELF-AUDIT

Every agent MUST run a final self-audit before emitting output:
1. Re-read the output line by line.
2. For each named entity (tool, package, env var, route), confirm it is in the knowledge base.
3. If any entity fails, regenerate that section.

## RULE OF SILENCE

If the system does not know, it MUST say so explicitly:
- `UNKNOWN: <field>` is acceptable.
- A guess is NOT acceptable.
