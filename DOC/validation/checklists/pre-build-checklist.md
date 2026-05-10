# PRE-BUILD CHECKLIST

## PURPOSE
Run this checklist BEFORE codegen begins. Every item MUST be `[x]` or codegen MUST BLOCK.

## PLAN INTEGRITY
- [ ] `plan.json` exists and parses.
- [ ] `decisions.json` exists and parses.
- [ ] `validation_report.json.status == "passed"`.
- [ ] Plan is LOCKED — no pending edits.

## INTEGRATIONS MAPPED
- [ ] Every feature in the plan has an integration assigned.
- [ ] Every assigned integration has a `setup_steps` list captured.
- [ ] Every integration's required components are present in the plan.

## DATA FLOW
- [ ] Each feature has an attached data flow.
- [ ] Each data flow declares: Frontend → Backend → Integration → Database → Response.
- [ ] Webhooks are explicitly listed where required.

## FRONTEND COMPLETENESS
- [ ] Every page declares data source, query, cache strategy, metadata, states.
- [ ] Every CMS-backed content type declares schema and slug.
- [ ] Every protected route declares auth requirement.
- [ ] `loading.tsx`, `error.tsx`, `not-found.tsx` are planned for each route segment boundary where applicable.
- [ ] If the brief includes a visual reference lock, `planning/frontend/visual-reference-pack.md` exists and enumerates the locked surfaces.

## BACKEND COMPLETENESS
- [ ] Every route handler is declared with input schema, auth, service call.
- [ ] Every service is declared with dependencies.
- [ ] Every repository is declared with aggregate.
- [ ] Every webhook declares signature verification.
- [ ] DB schema declares all tables, columns, indexes, foreign keys.

## ENV + OPS
- [ ] Every env var from every integration is in the plan.
- [ ] Every env var has scope (`server-only` vs `NEXT_PUBLIC_`).
- [ ] Every webhook endpoint is registered or planned for registration.
- [ ] Every external dashboard configuration step is listed.
- [ ] Every domain/DNS step is listed (if applicable).

## EXTERNAL SERVICES
- [ ] Auth provider account is provisionable (e.g., Clerk app exists or is creatable).
- [ ] Payments provider account is provisionable.
- [ ] Email provider sending domain verification step is included.
- [ ] CMS project is provisionable.
- [ ] Database instance is provisionable.

## QUALITY GATES
- [ ] Zero warnings policy is defined and enforceable in CI.
- [ ] Lint command is configured with max warnings = 0.
- [ ] Reviewer has explicit quality-gate validation responsibility.

## RUNTIME READINESS
- [ ] Post-build environment setup flow is declared.
- [ ] `ENV.example` generation and `.env.local` bootstrap steps are declared.
- [ ] `npm run dev` startup verification is declared.
- [ ] Smoke probes for `/`, auth entry route, and `/api/health` are declared.

## ANTI-HALLUCINATION GATE
- [ ] No invented packages.
- [ ] No invented env var names.
- [ ] No invented endpoints.
- [ ] No invented SDK methods.
- [ ] No `TODO` / `add later` / `for example` strings in the plan.

## OUTPUT
On success → execution proceeds to STAGE: SCAFFOLD.
On failure → emit `BLOCK { stage: "pre-build", failed: [<rule_ids>] }`.
