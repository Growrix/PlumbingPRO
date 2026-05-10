# EXECUTION ACCEPTANCE CHECKLIST

## PURPOSE
Hard acceptance gate between codegen and final success status. If any check fails, execution MUST return failed with explicit blocker code.

## PLAN -> SPEC -> CODE PARITY
- [ ] Every route in planning artifact exists in emitted code (page file or route handler).
- [ ] Every component named in frontend specs exists in emitted code.
- [ ] Every integration in plan has required generated artifacts (client/service/webhook) present.
- [ ] Every webhook in plan appears as an implemented route.
- [ ] Every env var in plan appears in src/env.ts validation and ENV.example.
- [ ] Every page-level promise in build-plan/specs has a corresponding implemented surface (not just route existence).
- [ ] Every declared critical conversion path in planning has matching page wiring and implementation primitives.

## FRONTEND QUALITY PARITY
- [ ] Frontend planner artifact bundle exists when frontend scope is present:
  - DOC/output/runs/<timestamp>/planning/frontend/README.md
  - DOC/output/runs/<timestamp>/planning/frontend/master-ui-architecture.md
  - DOC/output/runs/<timestamp>/planning/frontend/design-system.md
  - DOC/output/runs/<timestamp>/planning/frontend/design-system.tokens.json
  - DOC/output/runs/<timestamp>/planning/frontend/component-system.md
  - DOC/output/runs/<timestamp>/planning/frontend/motion-system.md
  - DOC/output/runs/<timestamp>/planning/frontend/content-library.md
  - DOC/output/runs/<timestamp>/planning/frontend/interaction-matrix.md
  - DOC/output/runs/<timestamp>/planning/frontend/pages/*.md
- [ ] No hardcoded page-level placeholder copy where content keys are required.
- [ ] Motion declarations exist for key interactive surfaces and include reduced-motion fallback.
- [ ] Form specs map to implemented zod schemas and submission handlers.
- [ ] No user-facing inline copy in JSX/TSX where content-library keys are required (documented third-party exceptions only).
- [ ] Content library is implementation-ready (keyed entries by section/component), not summary bullets.
- [ ] Per-page specs include section-level composition detail, conversion paths, and state declarations.
- [ ] When execution reads frontend scope, generated code proves it consumed the full frontend artifact bundle rather than only route names and summary metadata.

## FRONTEND DEPTH GATE
- [ ] Every non-exempt public page implements a full section architecture (header, hero, value, proof, conversion, supporting content, footer).
- [ ] Trust-led pages include real trust signals (compliance data slots, proof blocks, and clear contact pathways).
- [ ] Media-heavy sections use real media binding contracts (CMS/data source) instead of visual placeholder shells.
- [ ] Service, review, and proof pages include meaningful narrative and decision-support content (not just card lists).
- [ ] Shared header and footer match the planned trust posture, utility detail density, and CTA hierarchy.

## SEMANTIC PARITY GATE
- [ ] If plan/spec says a surface is interactive (filters, carousel, map, checker, estimator), implementation provides the interaction contract.
- [ ] If plan/spec says a page is CMS-backed, implementation uses data modules/queries and not static hardcoded arrays.
- [ ] If plan/spec calls for proof mechanisms (reviews aggregate, case outcomes), implementation includes data-backed proof rendering.
- [ ] If plan/spec declares local-business trust posture, implementation includes trust-copy blocks in hero/utility/footer surfaces.
- [ ] Public frontend config does not ship active placeholder business facts or mock-only trust placeholders in production-classified output.
- [ ] Public real-media surfaces do not ship `images.unsplash.com` URLs in production-classified output.

## VISUAL QA GATE
- [ ] Screenshot parity passes for desktop and mobile home page.
- [ ] Screenshot parity passes for desktop and mobile primary conversion route.
- [ ] Screenshot parity passes for desktop and mobile primary proof route.
- [ ] Visual QA confirms no hidden/empty main content regions on key routes.
- [ ] Visual QA confirms no critical contrast or overflow regressions on key routes.
- [ ] Visual QA evidence is emitted under `reports/visual-qa/`.

## TESTING + RUNTIME
- [ ] Test scripts are real (no placeholder echo/no-op scripts).
- [ ] Declared critical paths have executable tests (unit/integration/e2e as applicable).
- [ ] Build passes.
- [ ] npm run dev starts from project root.
- [ ] Smoke probes pass for /, primary conversion route, and /api/health.

## REPORTING
- [ ] execution_summary.json includes explicit pass/fail evidence per checklist section.
- [ ] environment_setup_report.json includes exact blocker details when failed.
- [ ] execution_summary.json includes `delivery_class` and its rationale.

## DELIVERY CLASS RULE
- [ ] delivery_class is `production_candidate` only when every applicable gate passes.
- [ ] delivery_class is `baseline_prototype` only when non-blocking advisories remain and no blocker check fails.
- [ ] delivery_class is `blocked` when any blocker gate fails.
- [ ] status must be `failed` whenever delivery_class is `blocked`.

## FAILURE CODES
- EXECUTION_ACCEPTANCE_FAILED
- PLAN_SPEC_CODE_MISMATCH
- FRONTEND_ARTIFACTS_MISSING
- PLACEHOLDER_TEST_GATE_FAILED
- RUNTIME_SMOKE_FAILED
- VISUAL_QA_FAILED
