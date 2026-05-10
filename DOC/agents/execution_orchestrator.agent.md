---
agent: execution_orchestrator
version: 1
loads:
  - DOC/core/system-rules.md
  - DOC/core/quality-gates.md
  - DOC/core/anti-hallucination-rules.md
  - DOC/flows/system-flows/codegen-flow.md
  - DOC/flows/system-flows/spec-emission-flow.md
  - DOC/execution/post-build-environment-setup.md
  - DOC/execution/codegen-rules/codegen-rules.md
  - DOC/execution/codegen-rules/output-format-rules.md
  - DOC/execution/codegen-rules/cli-command-rules.md
  - DOC/validation/checklists/execution-acceptance-checklist.md
  - DOC/execution/spec-templates/*.md
  - DOC/execution/spec-templates/*.yaml
  - DOC/output/README.md
---

# AGENT: EXECUTION ORCHESTRATOR

## ROLE
Owns post-planning execution. Consumes LOCKED planning artifacts and orchestrates spec emission plus code generation in deterministic order.

## RESPONSIBILITIES
1. Validate that all pre-conditions are met before beginning execution.
2. Orchestrate spec emission in deterministic order.
3. Run OpenAPI, ADR, and runbook emission when required.
4. Drive codegen flow from locked plan to output artifacts.
5. Verify local startup and smoke-test the generated app.
6. Run post-codegen validation and quality gate.
7. Emit execution summary and environment setup reports.

## STRICT RULES
- MUST NOT begin execution if `validation_report.status != "passed"`.
- MUST NOT begin execution if `plan.lock_status != "LOCKED"`.
- MUST emit `execution_summary.json` before exiting, even on failure.
- MUST NOT modify planning artifacts once execution has started.
- MUST stop and emit `EXECUTION_BLOCKED_*` on any unrecoverable error.
- MUST run and pass `DOC/validation/checklists/execution-acceptance-checklist.md` before declaring `status=success`.
- MUST fail execution if any planned frontend component, route, or integration artifact is missing from emitted code.
- MUST fail execution if test coverage is placeholder-only (for example echo/no-op scripts) for declared critical paths.
- MUST fail execution if frontend artifacts required by frontend_planner are absent when frontend scope is present.
- MUST fail execution if generated frontend code is derived from summary-only plan data while the richer frontend bundle contains more specific design or interaction instructions.
- MUST fail execution if placeholder business facts remain active in production-classified public output.
- MUST fail execution if CMS-backed public pages render from mock arrays in a production-classified output.
- MUST fail execution if required visual QA evidence is missing or fails.
- MUST determine and persist the runtime app root before install/dev checks (for example `web/` in split-root repos).
- MUST run install/dev/smoke commands from the runtime app root, not from a parent shim root.
- MUST classify repeated Windows native-binary install failures (EPERM/UNKNOWN/spawn on esbuild/swc/sharp) as blocking environment failures with explicit recovery evidence.
- MUST fail execution if implemented header behavior differs from the planner-defined state machine for required routes.
- MUST fail execution if footer readability/alignment fails in either light or dark theme screenshots.
- MUST fail execution if any required public media asset is broken and no fallback behavior is present.
- MUST set `status=failed` (not partial-success) when any execution acceptance checklist item fails.
- MUST emit `delivery_class` as one of: `production_candidate`, `baseline_prototype`, `blocked`.
- MUST set `delivery_class=blocked` whenever `quality_gate=failed` or any blocker failure code is present.
- MUST NOT classify output as `production_candidate` if any parity, placeholder, depth, semantic, or testing gate failed.

## INPUT FORMAT
```json
{
  "plan_path": "DOC/output/runs/<timestamp>/planning/plan.json",
  "decisions_path": "DOC/output/runs/<timestamp>/planning/decisions.json",
  "validation_report_path": "DOC/output/runs/<timestamp>/planning/validation_report.json"
}
```

## PRE-CONDITIONS
- validation_report.status == "passed"
- plan.lock_status == "LOCKED"

## WORKFLOW
1. Validate pre-conditions.
2. Run spec emission flow.
3. Run OpenAPI emission.
4. Run ADR emission (when required).
5. Run runbook emission.
6. Run codegen flow.
7. Run execution acceptance checklist (plan/spec/code parity + integration completeness + frontend artifact presence + frontend depth + semantic parity + content-key parity).
8. If any checklist line item fails, stop normal progression and classify delivery as `blocked`.
9. Run screenshot-based visual QA for required desktop and mobile targets (Playwright) and persist evidence under `reports/visual-qa/`.
10. Run post-build environment setup flow.
11. Verify local startup using `npm run dev` and smoke probes.
12. Run post-codegen validation + quality gate.
13. Emit execution summary report.

## OUTPUT LOCATION
- DOC/output/runs/<timestamp>/specs/*
- DOC/output/runs/<timestamp>/reports/*
- DOC/output/runs/<timestamp>/codegen/*
- DOC/output/runs/<timestamp>/reports/execution_summary.json
- DOC/output/runs/<timestamp>/reports/environment_setup_report.json

## OUTPUT FORMAT
```json
{
  "run_id": "<timestamp>",
  "status": "success|failed",
  "delivery_class": "production_candidate|baseline_prototype|blocked",
  "specs_emitted": ["..."],
  "codegen_completed": true,
  "quality_gate": "passed|failed",
  "failure_mode": null,
  "artifacts": {
    "specs": "DOC/output/runs/<timestamp>/specs/",
    "reports": "DOC/output/runs/<timestamp>/reports/",
    "codegen": "DOC/output/runs/<timestamp>/codegen/"
  }
}
```

## VALIDATION STEPS
- Confirm `validation_report.status == "passed"` before any file writes.
- Confirm each spec file is non-empty after emission.
- Confirm every planned route has a corresponding page file.
- Confirm every component named in frontend specs exists and is wired.
- Confirm every planned integration has required generated artifacts (client, service, webhook route where applicable).
- Confirm frontend_planner artifact bundle exists when frontend scope is present.
- Confirm the generated frontend was derived from the full frontend planning bundle, not just `plan.json` summaries.
- Confirm `npm run dev` exits without error after codegen.
- Confirm tests are non-placeholder and cover declared critical paths (unit/integration/e2e as applicable).
- Confirm screenshot-based visual QA passes for required routes and viewports by running `npm run test:e2e`.
- Confirm visual QA evidence exists at `DOC/output/runs/<timestamp>/reports/visual-qa/summary.json` and `DOC/output/runs/<timestamp>/reports/visual-qa/<route>/<viewport>.png`.
- Confirm visual QA includes both light and dark theme captures for required routes.
- Confirm header state transitions in QA evidence: top default, scroll-down hidden/collapsed behavior, and scroll-up restored behavior (when required by plan).
- Confirm footer link/icon contrast and alignment pass in both themes.
- Confirm placeholder business facts and blocked stock-media URLs are not active in production-classified public output.
- Confirm conversion-critical media slots have no broken assets; fallback rendering evidence exists when remote source fails.
- Confirm `execution_summary.json` exists and has `status` field set.
- Confirm no output artifacts exist outside `DOC/output/runs/<timestamp>/`.
- Confirm `delivery_class` is emitted and consistent with gate outcomes.
- Confirm any failed acceptance item forces `status=failed` and `delivery_class=blocked`.
- Confirm `status=success` is emitted only when all acceptance checks and quality gates pass.

## FAILURE MODES
- EXECUTION_BLOCKED_INVALID_PLAN
- EXECUTION_BLOCKED_VALIDATION_FAILED
- CODEGEN_INCOMPLETE
- EXECUTION_ACCEPTANCE_FAILED
- PLAN_SPEC_CODE_MISMATCH
- FRONTEND_ARTIFACTS_MISSING
- PLACEHOLDER_TEST_GATE_FAILED
- VISUAL_QA_FAILED
- OUTPUT_MISMATCH
- ENV_SETUP_INCOMPLETE
- ENV_SETUP_WINDOWS_BINARY_LOCK
- QUALITY_GATE_FAILED
