# SYSTEM FLOW — PLANNING

## OBJECTIVE
Convert a free-text user request into a deterministic, validated SaaS plan that can be executed without further decisions.

## INPUT
- Natural language description of the SaaS app.

## OUTPUT
- `plan.json` — structured machine-readable plan.
- `decisions.json` — choices made and their justifications.
- `validation_report.json` — checklist results.

## STAGES

### STAGE 1 — LOAD
Load every artifact in this OS:
- `core/system-rules.md`
- `core/anti-hallucination-rules.md`
- `core/planning-principles.md`
- `knowledge/integration-rules/**/*.yaml`
- `knowledge/feature-maps/feature-integration-map.json`
- `knowledge/architecture-templates/*.yaml`
- `knowledge/frontend-rules/frontend-rules.md`
- `knowledge/backend-rules/backend-rules.md`
- `flows/data-flows/*.md`
- `validation/checklists/*.md`
- `validation/constraints/*.md`

Failure to load any required file → BLOCK.

### STAGE 2 — EXTRACT FEATURES
- Read user request.
- Extract a list of features using only names from `feature-integration-map.json`.
- For unknown features → emit `MISSING_KNOWLEDGE` and BLOCK.

### STAGE 3 — MAP INTEGRATIONS
For each feature:
- Look up `primary` and `secondary` integrations from `feature-integration-map.json`.
- Load each integration rule from `knowledge/integration-rules/`.
- Aggregate the union of all required components, env vars, webhooks, schemas.

### STAGE 4 — SELECT TEMPLATE
- Score templates against the integration set.
- Choose the template that fully covers the integrations with no missing requirement.
- If multiple templates qualify → choose the one with the fewest extra integrations.
- If none qualify → BLOCK with `NO_MATCHING_TEMPLATE`.

### STAGE 5 — DESIGN FRONTEND
Apply `frontend-rules.md`:
- Enumerate routes from the chosen template + features.
- For each route declare data source, query, cache strategy, metadata, states.
- For each content feature declare CMS schema and slug.

### STAGE 6 — DESIGN BACKEND
Apply `backend-rules.md`:
- Enumerate route handlers.
- Enumerate services and repositories.
- Define DB schema (tables, columns, indexes, foreign keys).
- Define webhook handlers and signature verification.

### STAGE 7 — RESOLVE DATA FLOWS
For each feature, attach the corresponding data flow from `flows/data-flows/`:
- `auth` → `auth-flow.md`
- `payments`/`subscriptions` → `payment-flow.md`
- `blog`/`marketing_pages`/`documentation` → `blog-flow.md`
- For features without a dedicated flow file → emit a custom flow following the same shape.

### STAGE 8 — ENV + OPS
- Aggregate env vars from all integration rules + the chosen template.
- List dashboards to configure.
- List webhooks to register.
- List DNS records (e.g., Resend domain verification).
- Define environments: local, preview, production.

### STAGE 9 — VALIDATE
- Run `validation/checklists/pre-planning-checklist.md`.
- Run `validation/checklists/pre-build-checklist.md`.
- Run `validation/constraints/constraints.md` rules.
- If any item fails → BLOCK with `validation_failure` and the failed rule id.

### STAGE 10 — EMIT
Produce three artifacts:
1. `plan.json` — full structured plan.
2. `decisions.json` — feature→integration choices, template choice, justifications.
3. `validation_report.json` — every checklist item + status.

Plan is now LOCKED. Proceed to execution flow.

## STATE MACHINE

```
LOAD ──► EXTRACT ──► MAP ──► TEMPLATE ──► FRONTEND ──► BACKEND ──► FLOWS ──► OPS ──► VALIDATE ──► EMIT
  │         │         │         │           │            │          │        │         │
  └─ BLOCK ◄┴─────────┴─────────┴───────────┴────────────┴──────────┴────────┘
```

Any stage may emit BLOCK. BLOCK stops the pipeline; resolution requires user input or knowledge-base updates.
