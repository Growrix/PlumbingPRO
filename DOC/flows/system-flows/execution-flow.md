# SYSTEM FLOW — EXECUTION

## OBJECTIVE
Turn a LOCKED plan into runnable code: folder structure, full file contents, run commands. No new decisions are made here.

## PRECONDITION
- `plan.json`, `decisions.json`, `validation_report.json` exist.
- `validation_report.json.status == "passed"`.
- No further inputs required from the user.

## INPUT
- `plan.json`
- `decisions.json`

## OUTPUT
- A complete folder structure under the project root.
- Every file with full content (no placeholders).
- A `RUN.md` file containing setup, install, migrate, dev, build, deploy commands.
- An `ENV.example` file listing every required env var.

## STAGES

### STAGE 1 — RECEIVE PLAN
- Load `plan.json`.
- Refuse to proceed if `validation_report.json.status != "passed"`.

### STAGE 2 — SCAFFOLD STRUCTURE
- Materialize the `folder_structure` from the chosen architecture template.
- Create directories first, then files.

### STAGE 3 — GENERATE INTEGRATION CLIENTS
For each integration in the plan:
- Generate `src/lib/<integration>.ts` exactly per the integration rule.
- Generate `src/server/services/<integration>.ts`.
- Generate `src/server/repositories/<aggregate>.ts` for each owned aggregate.

### STAGE 4 — GENERATE ROUTES
For each route in the plan:
- Generate `route.ts` with input zod schema, auth check, service call, error mapping.
- Generate webhook handlers with signature verification.

### STAGE 5 — GENERATE PAGES
For each page in the plan:
- Generate the server component with declared data source and cache strategy.
- Generate `loading.tsx`, `error.tsx`, `not-found.tsx` as required by F13.
- Generate `generateMetadata` per F5.

### STAGE 6 — GENERATE CMS STUDIO (IF SANITY)
- Generate `studio/sanity.config.ts`.
- Generate one schema file per content type from the integration rule.
- Generate desk structure for editorial UX.

### STAGE 7 — GENERATE DB LAYER
- Generate `prisma/schema.prisma` with every required model.
- Emit migration command into `RUN.md`.

### STAGE 8 — GENERATE EMAILS (IF RESEND)
- Generate React Email templates listed in the plan.
- Generate `src/server/services/email.ts` with a typed template map.

### STAGE 9 — GENERATE MIDDLEWARE
- Generate `middleware.ts` declaring publicRoutes and protected routes.

### STAGE 10 — GENERATE ENV BOOT
- Generate `src/env.ts` with zod validation of every required env var.
- Generate `ENV.example` listing every var.

### STAGE 11 — GENERATE RUN MANUAL
Emit `RUN.md` containing:
- Prereqs (Node version, package manager, DB).
- Install commands.
- Env setup steps.
- Database migrate / generate.
- Dev server.
- Build.
- Deploy.
- Webhook registration steps (per integration rule).
- Smoke tests.

### STAGE 12 — SELF-AUDIT
- Re-read every emitted file.
- For every named entity (package, env var, route, function, schema), confirm presence in plan + knowledge.
- If any drift detected → regenerate that file from the plan.

## OUTPUT CONTRACT

For every codegen response, emit:
1. **Folder structure** — tree of files to be created.
2. **Files** — complete contents, one fenced block per file, with the path as a header.
3. **Commands** — list of CLI commands to run, in order.

No file may be omitted. No file may contain placeholders.

## STATE MACHINE

```
RECEIVE ──► SCAFFOLD ──► CLIENTS ──► ROUTES ──► PAGES ──► CMS ──► DB ──► EMAIL ──► MIDDLEWARE ──► ENV ──► RUN ──► AUDIT ──► DONE
```

Any stage that detects a deviation from the plan MUST stop and emit `EXECUTION_DRIFT` with the diff. No silent fixes.
