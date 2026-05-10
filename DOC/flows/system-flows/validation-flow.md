# SYSTEM FLOW — VALIDATION

## OBJECTIVE
Describe how the AI OS validates a plan at every stage before allowing the pipeline to advance. Validation is a blocking gate — no stage proceeds until the previous stage passes.

## INPUT
- `plan.json` — aggregated plan from master_planner.
- `decisions.json` — choices and justifications.
- All knowledge artifacts (loaded by reviewer.agent.md).

## OUTPUT
- `validation_report.json` — per-rule status with pass/fail and failure details.
- `BLOCK` events (structured, machine-readable) when any check fails.

## VALIDATION STAGES

### STAGE 1 — SCHEMA VALIDATION
Verify all output artifacts are well-formed:
```
[ ] plan.json parses as valid JSON.
[ ] plan.json contains all required top-level keys: features, integrations, routes, env_vars, db_schema, flows.
[ ] decisions.json parses as valid JSON.
[ ] All referenced file paths in the plan exist in the DOC/ tree.
[ ] If plan.frontend is present, the required frontend planning bundle exists on disk (README, master UI architecture, design tokens, component system, motion system, interaction matrix, content library, per-page specs).
[ ] If a visual reference lock is declared, `planning/frontend/visual-reference-pack.md` exists and is non-empty.
```
Failure → BLOCK `SCHEMA_INVALID`.

### STAGE 2 — FEATURE COMPLETENESS
```
[ ] Every feature in plan.features exists in feature-integration-map.json.
[ ] No feature has "primary": null.
[ ] Every feature has an attached data flow (either from flows/data-flows/ or custom).
```
Failure → BLOCK `MISSING_KNOWLEDGE: unknown feature <name>`.

### STAGE 3 — INTEGRATION RULE COMPLIANCE
For every integration in plan.integrations:
```
[ ] The integration rule file exists in knowledge/integration-rules/<name>.yaml.
[ ] Every item in rule.required_components is present in the plan.
[ ] Every item in rule.env_vars is present in plan.env_vars.
[ ] Every item in rule.webhooks.endpoint is declared in plan.routes.
[ ] Every item in rule.setup_steps is represented in plan.setup_steps.
```
Failure → BLOCK `C2: missing component <component> for integration <name>`.

### STAGE 4 — ENV VAR COMPLETENESS
```
[ ] Union of all integration rule env_vars ⊆ plan.env_vars.
[ ] Every NEXT_PUBLIC_ var is explicitly marked as client-safe.
[ ] No secret name appears in plan.frontend (client-side exposure).
[ ] src/env.ts schema declared for all required vars.
```
Failure → BLOCK `C3: missing env var <name>`.

### STAGE 5 — ANTI-HALLUCINATION SWEEP
```
[ ] Every package name in the plan exists in at least one integration rule's *_packages field.
[ ] Every env var name matches a known pattern from integration rules.
[ ] Every SDK method invoked matches documentation in the integration rule.
[ ] No "TODO", "add later", "for example", "e.g." strings in the plan output.
[ ] No invented service names (e.g., "MyCustomAuthService").
```
Failure → BLOCK `HALLUCINATION: <type> — <detail>`.

### STAGE 6 — OWNERSHIP SWEEP
```
[ ] User identity: owned by auth integration; only mirrored in users table via webhook.
[ ] Billing state: owned by Stripe; only mirrored via webhook, not by direct write.
[ ] Content: owned by CMS; not duplicated in DB.
[ ] File metadata: owned by UploadThing; only metadata (key, url) stored in DB.
```
Failure → BLOCK `C12: ownership violation for <entity>`.

### STAGE 7 — RESPONSIBILITY SWEEP
```
[ ] No server SDK (Stripe, DB, Resend, OpenAI) imported in any client component.
[ ] No business logic in route handlers (only: parse, auth, call service, respond).
[ ] No DB access in frontend pages (only via server actions or route handlers).
[ ] Each integration has exactly one client module in src/lib/.
```
Failure → BLOCK `C8: <file> mixes responsibilities`.

### STAGE 8 — SECURITY SWEEP
```
[ ] Every webhook handler declares signature verification.
[ ] Every webhook handler declares idempotency by event ID.
[ ] No hardcoded secrets in any planned file.
[ ] Every auth-protected route declares auth check.
[ ] AI routes declare per-user rate limit.
[ ] Upload routes declare per-route auth middleware.
```
Failure → BLOCK `C9/C10/C11: <detail>`.

### STAGE 9 — ARCHITECTURE TEMPLATE COMPLIANCE
```
[ ] Plan integrations ⊆ template.integrations ∪ justified_additions.
[ ] All template.required_routes are present in plan.routes.
[ ] All template.required_db_tables are present in plan.db_schema.
[ ] Plan frontend framework matches template.frontend.framework.
```
Failure → BLOCK `TEMPLATE_MISMATCH: <detail>`.

## VALIDATION REPORT FORMAT

```json
{
  "status": "passed" | "failed",
  "evaluated_at": "<ISO timestamp>",
  "stages": {
    "schema_validation": { "status": "passed" },
    "feature_completeness": { "status": "passed" },
    "integration_rule_compliance": {
      "status": "failed",
      "failures": [
        { "rule": "C2", "integration": "uploadthing", "missing": "per_route_auth_middleware" }
      ]
    }
  },
  "blocks": [
    { "rule_id": "C2", "reason": "missing component per_route_auth_middleware for uploadthing", "artifact": "plan.integrations.uploadthing" }
  ]
}
```

## BLOCK PROTOCOL
1. Agent emits BLOCK event immediately on first failure within each stage.
2. Agent continues evaluating remaining stages (does NOT stop at first block).
3. Final report aggregates ALL blocks.
4. Master planner receives the report and enters `BLOCKED` state.
5. Master planner requests resolution from human or upstream agent.
6. After resolution, validation re-runs from Stage 1.

## PASS PROTOCOL
When all stages pass:
1. `validation_report.json.status = "passed"`.
2. Master planner receives APPROVED signal.
3. Plan is LOCKED — no further modifications.
4. Pipeline advances to SCAFFOLD stage.
