# PLANNING PRINCIPLES

## OBJECTIVE
Produce a SaaS plan that any agent or human can execute without further decisions.

## HIERARCHY OF DECISIONS

1. Features (extracted from user request)
2. Integrations (from `feature-integration-map.json`)
3. Architecture template (from `architecture-templates/`)
4. Frontend rules (from `frontend-rules/`)
5. Backend rules (from `backend-rules/`)
6. Data flows (from `flows/data-flows/`)
7. Validation (from `validation/`)

A lower level MUST NEVER override a higher level.

## PRINCIPLES

### P1 — Feature First
Start by listing features as discrete, named units.
Each feature MUST be one of:
- `auth`
- `payments`
- `blog`
- `marketing_pages`
- `dashboard`
- `emails`
- `analytics`
- `file_uploads`
- `notifications`
- `marketplace_listings`
- `search`
- `admin_panel`

If a feature is not listed, it MUST be added to the feature map before planning.

### P2 — Integration is Mandatory
Every feature MUST be backed by exactly one primary integration.
Secondary integrations are allowed only when declared in the architecture template.

### P3 — Content Implies CMS
If ANY feature involves user-visible content beyond static marketing,
the plan MUST include:
- a CMS (e.g., Sanity)
- a schema definition
- a slug/route system
- preview mode rules

### P4 — Auth is Centralized
Authentication is a single integration shared across the app.
No feature may implement its own auth.

### P5 — Data Flow Before Code
Each feature MUST have a documented data flow:
`Frontend → Backend → Integration → Database → Response`.
No code is generated until the flow is approved by the validator.

### P6 — Environment is Explicit
Every plan MUST list:
- env vars (exact names)
- third-party dashboards required
- webhooks to register
- DNS / domain steps (if any)

### P7 — Output is Reproducible
The plan MUST be:
- executable as-is
- runnable with declared CLI commands
- testable with declared smoke tests

### P8 — Smallest Viable Stack
Pick the architecture template that satisfies ALL features with the fewest moving parts.
Adding a tool requires explicit feature justification.

### P9 — Single Source of Truth
- Schema lives in CMS or DB, never duplicated.
- Auth user identity is owned by the auth integration.
- Billing state is owned by the payments integration.

### P10 — No Mid-Build Planning
Once a plan is locked, the codegen phase may not introduce new tools, env vars, or features.
Changes require returning to the PLAN phase.

### P11 — Runtime Readiness Is Planned
Every plan MUST include deterministic post-build environment setup and startup verification using `npm run dev`.

### P12 — Intent-Safe Execution
Run/verify requests are execution-only by default.
If blocked, agents must report blockers first and only enter fix mode explicitly.

## DECISION RECORD

Every plan MUST emit a `decisions.json` containing:
```json
{
  "features": ["..."],
  "integrations": { "feature": "integration" },
  "architecture_template": "...",
  "env_vars": ["..."],
  "webhooks": ["..."],
  "data_flows": ["..."],
  "validation_status": "passed"
}
```
