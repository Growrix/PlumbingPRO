# PRE-PLANNING CHECKLIST

## PURPOSE
Run this checklist BEFORE the planner starts producing a plan. Every item MUST be `[x]` or the planner MUST BLOCK.

## INPUT INTEGRITY
- [ ] User request is captured verbatim.
- [ ] Ambiguous terms have been clarified or marked `UNKNOWN`.
- [ ] No silent assumptions are made about scope.

## KNOWLEDGE BASE LOADED
- [ ] `core/system-rules.md` loaded.
- [ ] `core/anti-hallucination-rules.md` loaded.
- [ ] `core/planning-principles.md` loaded.
- [ ] All `knowledge/integration-rules/**/*.yaml` loaded.
- [ ] `knowledge/feature-maps/feature-integration-map.json` loaded.
- [ ] All `knowledge/architecture-templates/*.yaml` loaded.
- [ ] `knowledge/frontend-rules/frontend-rules.md` loaded.
- [ ] `knowledge/backend-rules/backend-rules.md` loaded.

## FEATURE EXTRACTION
- [ ] Features are listed using ONLY names from `feature-integration-map.json`.
- [ ] Every feature has a `primary` integration in the feature map.
- [ ] No feature is `UNKNOWN`. (If yes → BLOCK with `MISSING_KNOWLEDGE`.)

## INTEGRATION PRECONDITIONS
- [ ] Every required integration has a corresponding rule file.
- [ ] Every integration's `env_vars` list is captured.
- [ ] Every integration's `webhooks` are captured.
- [ ] Every integration's `setup_steps` are captured.

## ARCHITECTURE PRECONDITIONS
- [ ] At least one architecture template covers every required integration.
- [ ] The chosen template's `folder_structure` is captured.
- [ ] The chosen template's `required_env_vars` is captured.

## ENVIRONMENT
- [ ] Target deployment platform is captured.
- [ ] Database host strategy is captured.
- [ ] Domain/DNS requirements are captured (if any integration requires it).

## OUTPUT
On success → planner proceeds to STAGE: EXTRACT.
On failure → emit `BLOCK { stage: "pre-planning", failed: [<rule_ids>] }`.
