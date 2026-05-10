# QUALITY GATES

## PURPOSE
Define non-negotiable acceptance gates that must pass before an agent may mark work as complete.

## QG1 — ZERO PROBLEMS GATE
- Workspace-owned files MUST have zero errors and zero warnings in IDE diagnostics.
- ESLint MUST run with `--max-warnings 0`.
- Type checking MUST pass with zero diagnostics.
- Any warning is a blocking failure, not a soft warning.

## QG2 — BUILD + RUNTIME GATE
- Build MUST pass without warnings promoted to errors by policy.
- Dev server MUST start from project root with `npm run dev`.
- If an alternate package manager is primary, `npm run dev` MUST still work via package scripts.

## QG3 — TEST + SMOKE GATE
- Unit, integration, and E2E suites for declared critical paths MUST pass.
- Smoke checks MUST verify at minimum: `/`, auth entry route, health route.

## QG4 — ENVIRONMENT READINESS GATE
- Required env vars MUST be enumerated and validated before runtime.
- Missing env vars MUST block release and be reported with exact names.
- Local development may use placeholders only when explicitly marked non-production.

## QG5 — OPERATION MODE GATE
- If the user asks to run/verify only, agents MUST NOT edit code or install packages unless blocked.
- On blocker, the agent must emit a blocker report and request permission to enter fix mode.
- In fix mode, changes must be minimal, explicit, and reported.

## QG6 — COMPLETION CONTRACT
- A task is complete only when all applicable gates pass and evidence is recorded in run reports.
- Any skipped gate must be explicitly marked as `not-applicable` with rationale.

## QG7 — PLAN/SPEC/CODE PARITY GATE
- Execution MUST prove parity between planning artifacts, emitted specs, and generated code.
- Any missing planned route, component, integration artifact, webhook, or env-validation entry is a blocking failure.
- Frontend scope runs MUST include frontend planner artifacts and motion/content parity evidence.

## QG8 — NON-PLACEHOLDER TEST GATE
- Placeholder tests (for example echo/no-op scripts) are forbidden for declared critical paths.
- Execution MUST include runnable test evidence for critical paths declared in planning artifacts.

## QG9 — SEMANTIC PARITY GATE
- Execution MUST verify semantic parity between plan/spec/code, not only file existence.
- If a spec promises behavior (for example filters, calculators, carousels, coverage checks, dynamic proof blocks), code MUST implement that behavior contract.
- Static placeholders that mimic planned behavior are blocking failures.

## QG10 — FRONTEND DEPTH + CONTENT KEY GATE
- Public marketing pages MUST satisfy section-depth rules from frontend constraints unless explicitly exempt.
- Content libraries MUST be implementation-grade (keyed and route/component scoped), not summary bullets.
- No inline user-facing copy in JSX/TSX where content keys are required by frontend constraints.

## QG11 — DELIVERY CLASSIFICATION GATE
- Every execution summary MUST emit `delivery_class` as one of `production_candidate|baseline_prototype|blocked`.
- Any blocker failure forces `delivery_class=blocked` and `status=failed`.
- `production_candidate` is forbidden unless all applicable quality gates pass.

## QG12 — VISUAL INTEGRITY + THEME PARITY GATE
- Required user-facing routes MUST pass screenshot-based verification in both light and dark themes for desktop and mobile breakpoints.
- Header behavior MUST match planned state transitions (`at top`, `scroll down`, `scroll up`) with no contradictory default state.
- Footer readability and alignment MUST pass in both themes with all interactive elements visibly legible.
- Any contrast regression on key CTAs/navigation elements is a blocking failure.

## QG13 — MEDIA RELIABILITY GATE
- Public media used on conversion-critical surfaces (hero, service cards, testimonial/media proof, featured blocks) MUST resolve successfully or render a defined fallback.
- Broken remote images without fallback are blocking failures.
- Media URL validity checks and fallback evidence MUST be included in execution reports.
