# SYSTEM FLOW — CODEGEN

## OBJECTIVE
Convert a LOCKED, validated plan into a complete, runnable SaaS codebase. Codegen is deterministic: the same locked plan always produces the same output.

## PRE-CONDITION
- `plan.json` exists and is LOCKED.
- `validation_report.json.status == "passed"`.
- `decisions.json` exists.
- Pre-build checklist passed.

## EXECUTION PROFILES
Codegen supports two deterministic execution profiles. The profile is selected from plan scope (no human choice during execution).

### Profile A — FRONTEND-FIRST
Use when the run is marketing-heavy and backend complexity is low (for example `plan.backend.database == "none"`).

Objective: generate the frontend + real E2E/visual QA gates early so layout regressions are caught immediately and iteration can happen before integrations/back-end wiring.

Order (high level):
1) Scaffold
2) Frontend layer
3) Configuration files
4) Validation gate (tsc/eslint/vitest/playwright + visual QA evidence)
5) Integrations/back-end only as required by the plan

### Profile B — FULL-STACK
Default for SaaS runs with a real backend/database.

## INPUT
- `plan.json`
- `decisions.json`
- `validation_report.json`
- All run-scoped planning artifacts referenced by `plan.json`
- All knowledge artifacts (integration rules, frontend/backend/domain rules).

## OUTPUT
- Complete folder structure with all files.
- `setup_commands.sh` — ordered CLI commands to bootstrap the project.
- `env.example` — all env vars with placeholder values.
- `README.md` — generated project README.

## CODEGEN STAGES

### STAGE 1 — SCAFFOLD
Create the base Next.js project structure:
```
1. npx create-next-app@latest <app-name> --typescript --tailwind --eslint --app --src-dir
2. Install all packages from plan.packages (union of all integration packages).
3. Create folder structure per architecture template's folder_structure.
4. Create src/env.ts with zod validation for all plan.env_vars.
5. Create .env.example with all env var names and placeholder values.
```

### STAGE 2 — INTEGRATION SETUP
For each integration in plan.integrations (in dependency order):
```
Load integration rule yaml.
Execute setup_steps in order:
  - Create client module: src/lib/<integration>.ts
  - Create service module: src/server/services/<integration>.ts
  - Create integration-specific route handlers (webhooks, etc.)
Validate: every required_component is now present in the codebase.
```

Integration dependency order (to avoid circular imports):
```
1. database (no deps)
2. auth (no deps)
3. cache_and_rate_limit (no deps)
4. logging (no deps)
5. error_tracking (no deps)
6. emails (depends on: database)
7. payments (depends on: database, auth, emails)
8. analytics (depends on: auth)
9. search (depends on: database, background_jobs)
10. file_uploads (depends on: database, auth)
11. ai (depends on: database, cache_and_rate_limit, background_jobs)
12. background_jobs (depends on: database)
```

### STAGE 3 — DATABASE SCHEMA
```
1. Write prisma/schema.prisma with all tables from plan.db_schema.
2. Declare all indexes from plan.db_schema.indexes.
3. Declare all enums from plan.db_schema.enums.
4. Write prisma/seed.ts with idempotent seed data.
5. Generate Prisma client: npx prisma generate.
6. Create first migration: npx prisma migrate dev --name init.
```

### STAGE 4 — BACKEND LAYER
For each entity in plan.backend:
```
1. Write repository: src/server/repositories/<entity>.ts
   - Implements: findById, findMany, create, update, delete (soft if applicable).
   - All queries scoped by user_id or org_id.
2. Write service: src/server/services/<entity>.ts
   - Orchestrates repository + integration clients.
   - Contains all business logic.
3. Write route handlers: src/app/api/<resource>/route.ts
   - Parse → Auth → Service → Respond pattern.
   - No business logic inline.
4. Write webhook handlers: src/app/api/webhooks/<provider>/route.ts
   - Raw body read → signature verify → idempotent handler.
```

### STAGE 5 — FRONTEND LAYER
Before generating any frontend file:
```
1. Read the full frontend planning bundle referenced by plan.frontend.artifacts.
2. Read per-page specs for every route being generated.
3. Read component-system, design-system, motion-system, content-library, and interaction-matrix artifacts.
4. If the route depends on a visual reference lock, load the route-specific visual contract before emitting JSX or CSS.
```

For each route in plan.frontend.routes:
```
1. Create page file: src/app/<route>/page.tsx
   - Declare data source, query function, cache strategy.
   - Use React Server Component by default.
   - Wrap client-interactive sections in "use client" leaf components.
2. Create loading.tsx, error.tsx, not-found.tsx for each segment.
3. Create layout.tsx at each segment boundary.
4. Implement generateMetadata per route.
5. For CMS-backed routes: implement generateStaticParams.
```

### STAGE 6 — BACKGROUND JOBS
For each Inngest function in plan.background_jobs:
```
1. Create function: src/inngest/functions/<name>.ts
2. Register in src/app/api/inngest/route.ts
3. Emit events from services where declared in data flows.
```

### STAGE 7 — CONFIGURATION FILES
```
1. next.config.ts — CSP headers, image domains, redirects, withSentryConfig wrapper.
2. middleware.ts — Clerk auth, Edge runtime.
3. tailwind.config.ts — shadcn/ui preset.
4. .eslintrc.json — strict rules, no-console, import order.
5. vitest.config.ts — test setup, coverage thresholds.
6. playwright.config.ts — E2E base URL, test directory.
7. .github/workflows/ci.yml — lint, typecheck, test, build pipeline.
8. vercel.json — headers, redirects, function runtime configs.
```

### STAGE 8 — VALIDATION GATE (POST-CODEGEN)
Before declaring codegen complete:
```
[ ] tsc --noEmit — zero type errors.
[ ] eslint --max-warnings 0 — zero lint warnings or errors.
[ ] vitest run — all tests pass.
[ ] next build — build succeeds.
[ ] Every route in plan.frontend.routes has a corresponding page file.
[ ] Every webhook in plan.integrations has a corresponding route handler.
[ ] Every env var in plan.env_vars is in src/env.ts schema.
[ ] Execution acceptance checklist passes: DOC/validation/checklists/execution-acceptance-checklist.md
[ ] No placeholder test scripts for declared critical paths.
[ ] Frontend planner artifact bundle exists for frontend scope runs.
[ ] Screenshot-based visual QA passes for required mobile and desktop targets.
[ ] No blocked frontend placeholder flags remain in generated public output.
```
Failure → BLOCK `CODEGEN_INCOMPLETE: <missing_artifact>`.

Failure in execution acceptance checks → BLOCK `EXECUTION_ACCEPTANCE_FAILED: <reason>`.

Failure in screenshot parity or visual rendering checks → BLOCK `VISUAL_QA_FAILED: <reason>`.

## CODEGEN OUTPUT FORMAT
All generated files MUST be emitted in this structure:
```
FILE: <relative-path>
LANG: <typescript|yaml|json|bash>
---
<file contents>
---
END FILE
```

Multiple files are concatenated in scaffold → integration → backend → frontend order.

## FORBIDDEN IN CODEGEN
- No placeholder comments: `// TODO: implement this`.
- No unused imports.
- No `any` types (TypeScript strict mode enforced).
- No hardcoded secrets or env var values.
- No `console.log` in production paths (use logger).
- No business logic in route handlers.
- No DB access in client components.
