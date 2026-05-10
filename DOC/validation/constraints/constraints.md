# CONSTRAINTS

## PURPOSE
Hard rules that prevent invalid plans and broken architectures. Each constraint has a unique id and a failure mode.

## C1 — INTEGRATION COMPLETENESS
**Rule:** Every feature MUST have its primary integration declared in the plan.
**Detection:** Cross-reference `plan.features` ↔ `feature-integration-map.json`.
**Failure:** `BLOCK C1: missing integration for feature <name>`.

## C2 — INTEGRATION RULE COMPLIANCE
**Rule:** For every declared integration, every item in its rule's `required_components` MUST appear in the plan.
**Detection:** Diff plan vs integration rule.
**Failure:** `BLOCK C2: missing component <component> for integration <name>`.

## C3 — ENV VAR COMPLETENESS
**Rule:** Every env var listed in any used integration rule MUST be in `plan.env_vars`.
**Detection:** Set-difference.
**Failure:** `BLOCK C3: missing env var <name>`.

## C4 — WEBHOOK COMPLETENESS
**Rule:** Every webhook endpoint declared in any used integration rule MUST appear in `plan.routes` AND in the dashboard registration steps.
**Detection:** Cross-reference plan + integration rules.
**Failure:** `BLOCK C4: missing webhook <endpoint>`.

## C5 — CMS REQUIRED FOR CONTENT
**Rule:** If any feature in {`blog`, `marketing_pages`, `documentation`, `changelog`} is present, a CMS integration MUST be in the plan AND its schema MUST be declared.
**Failure:** `BLOCK C5: content feature without CMS or schema`.

## C6 — SLUG SYSTEM REQUIRED
**Rule:** Every CMS document type with a public route MUST have a `slug` field and a corresponding dynamic route.
**Failure:** `BLOCK C6: content type <type> missing slug or route`.

## C7 — AUTH IS CENTRALIZED
**Rule:** At most one auth integration is present. No feature implements its own auth.
**Failure:** `BLOCK C7: multiple auth integrations or local auth`.

## C8 — FRONTEND/BACKEND SEPARATION
**Rule:** No file may exist in both a client and a server folder. Server SDKs (Stripe server, DB clients, Resend) MUST NOT appear in client components.
**Failure:** `BLOCK C8: <file> mixes responsibilities`.

## C9 — NO HARDCODED SECRETS
**Rule:** No file may contain a secret string. All secrets come from env vars validated by `src/env.ts`.
**Failure:** `BLOCK C9: hardcoded secret in <file>`.

## C10 — WEBHOOK SIGNATURE VERIFICATION
**Rule:** Every webhook handler MUST verify the provider signature before parsing the body.
**Failure:** `BLOCK C10: webhook <endpoint> missing signature verification`.

## C11 — IDEMPOTENT WEBHOOKS
**Rule:** Every webhook handler MUST be idempotent by event id.
**Failure:** `BLOCK C11: webhook <endpoint> not idempotent`.

## C12 — SINGLE SOURCE OF TRUTH
**Rule:**
- User identity owned by auth integration; mirrored in `users` table.
- Billing state owned by Stripe; mirrored via webhooks only.
- Content owned by CMS; not duplicated in DB.
**Failure:** `BLOCK C12: ownership violation for <entity>`.

## C13 — NO INVENTED ENTITIES
**Rule:** Every named package, env var, endpoint, SDK method MUST be present in the knowledge base.
**Failure:** `BLOCK C13: invented entity <name>`.

## C14 — NO MID-BUILD PLANNING
**Rule:** Once the plan is LOCKED, codegen MUST NOT introduce new tools, env vars, or features.
**Failure:** `BLOCK C14: codegen drift detected: <diff>`.

## C15 — ENV BOOT VALIDATION
**Rule:** `src/env.ts` MUST validate every required env var at boot using zod.
**Failure:** `BLOCK C15: env boot validation missing for <var>`.

## C16 — RATE LIMITING ON PUBLIC AUTH ROUTES
**Rule:** Sign-in / sign-up / password-reset endpoints MUST be rate-limited.
**Failure:** `BLOCK C16: missing rate limit on <route>`.

## C17 — MIDDLEWARE PUBLIC ROUTES EXPLICIT
**Rule:** `middleware.ts` MUST declare publicRoutes; protected-by-default is enforced.
**Failure:** `BLOCK C17: middleware does not declare publicRoutes`.

## C18 — SERVER-ONLY ENV VARS NOT PUBLIC
**Rule:** Env vars without `NEXT_PUBLIC_` prefix MUST NOT be referenced in client components.
**Failure:** `BLOCK C18: server-only env <name> referenced in client code`.

## C19 — INTEGRATION CLIENT SINGLETONS
**Rule:** Each integration has exactly one client singleton in `src/lib/<integration>.ts`. No inline construction elsewhere.
**Failure:** `BLOCK C19: integration <name> instantiated outside lib singleton`.

## C20 — DATA FLOW ATTACHED
**Rule:** Every feature in the plan MUST be linked to a data flow file.
**Failure:** `BLOCK C20: feature <name> has no data flow`.

## C21 — ZERO-WARNING QUALITY GATE
**Rule:** The plan MUST define zero-warning enforcement for lint/typecheck/test in CI.
**Failure:** `BLOCK C21: zero-warning quality gate missing or weak`.

## C22 — POST-BUILD ENVIRONMENT BOOTSTRAP
**Rule:** The plan MUST include deterministic post-build environment setup including env bootstrap and startup verification.
**Failure:** `BLOCK C22: post-build environment setup not declared`.

## C23 — NPM DEV RUNTIME READINESS
**Rule:** Generated projects MUST be runnable from project root with `npm run dev` after setup.
**Failure:** `BLOCK C23: npm run dev readiness missing`.

## C24 — OPERATION MODE COMPLIANCE
**Rule:** Execution behavior MUST respect user intent mode (run/verify-only vs fix mode) and report blockers before modifying code.
**Failure:** `BLOCK C24: operation mode policy missing`.

## C25 — PLAN/SPEC/CODE PARITY
**Rule:** Every planned route/component/integration artifact MUST exist in generated code and align with emitted specs.
**Failure:** `BLOCK C25: plan-spec-code mismatch for <artifact>`.

## C26 — FRONTEND ARTIFACT COMPLETENESS
**Rule:** If frontend scope is present, frontend planner artifact bundle MUST exist and be referenced by execution.
**Failure:** `BLOCK C26: missing frontend artifact <path>`.

## C27 — NO PLACEHOLDER TEST EXECUTION
**Rule:** Declared critical paths MUST NOT rely on placeholder/no-op test scripts.
**Failure:** `BLOCK C27: placeholder test gate violated`.

## C28 — EXECUTION ACCEPTANCE CHECKLIST REQUIRED
**Rule:** Execution MUST run and pass `DOC/validation/checklists/execution-acceptance-checklist.md` before success.
**Failure:** `BLOCK C28: execution acceptance checklist missing or failed`.

## C29 — EXECUTION SUMMARY EVIDENCE COMPLETENESS
**Rule:** execution_summary.json MUST include explicit evidence for parity checks and acceptance checklist results.
**Failure:** `BLOCK C29: execution summary evidence incomplete`.

## ENFORCEMENT
- Constraints are evaluated in order C1..C29 by the reviewer agent.
- Any failure halts the pipeline.
- Resolution requires updating the plan and re-running validation.
