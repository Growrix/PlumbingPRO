# Agent Registry

This is the canonical index of every agent in the OS. It is consulted by `system_architect` (AUDIT mode) for dependency-graph validation and by humans for navigation.

Update this file whenever an agent is added, removed, renamed, or its `runs_before` / `runs_after` changes.

---

## Workflow shape (5 named entry points)

The OS exposes **5 user-facing agents**, mirrored at `.github/agents/` for VS Code Copilot. Two for planning, two for execution, one out-of-band meta-agent.

```
intake_strategist              ← brief intake (gap-filler; one prompt)
       ↓
       ├─► frontend_planner    ← Phase 1A: full frontend plan (architect + designer in one)
       └─► backend_planner     ← Phase 1B: backend + integrations + devops + security + qa + performance
                ↓
                ├─► frontend_developer  ← Phase 2A: frontend code under web/
                └─► backend_developer   ← Phase 2B: backend + integrations + CI/CD + ship (closes production)

system_architect               ← Out-of-band: AUDIT, DESIGN, FIX, SMOKE, DETERMINISM, DOCUMENT
```

Two prompts in planning. Two prompts in execution. One meta-agent.

---

## Public registry (mirrored to `.github/agents/`)

| Agent | Version | Phase | Inputs | Outputs |
|---|---|---|---|---|
| `intake_strategist` | 1 | Intake | user request + optional client_brief | `brief.json`, `brief.md` |
| `frontend_planner` | 3 | Planning (frontend) | brief | `frontend.json` + `master-ui-architecture.md` + `design-system.md` + `design-system.tokens.json` + `component-system.md` + `components/<name>.md` + `motion-system.md` + `content-library.md` + `content.<locale>.json` + `interaction-matrix.md` + `pages/<route-slug>.md` + `visual-reference-pack.md` + `ai-context.yaml` + `README.md` |
| `backend_planner` | 2 | Planning (backend + ops) | brief + frontend.json | `backend.json` + `backend-plan.json` + `routes/<route-slug>.md` + `integrations.json` + `automation.json` + `integrations/<name>.md` + `devops.json` + `security.json` + `security_report.json` + `testing.json` + `performance.json` |
| `frontend_developer` | 1 | Execution (frontend) | frontend planning bundle | `web/` directory tree (Next.js App Router code, components, pages, tokens, content, motion, tests scaffold, SEO assets, RUN.md, ENV.example, self-audit) |
| `backend_developer` | 1 | Execution (backend + ship) | backend planning bundle | `src/server/`, `src/inngest/`, `src/lib/`, `src/app/api/`, `prisma/`, `studio/`, `emails/`, `terraform/`, `.github/workflows/`, `docs/runbooks/`, `RUN.md`, `DEPLOY.md`, `ENV.example`, deployed application, smoke green |
| `system_architect` | 1 | Meta (out-of-band) | mode + target + options | `audit-report.md/.json`, `system-design.md`, `build-plan.md`, `smoke-report.md`, `determinism-report.md`, `fix-report.md`, `document-report.md` |

---

## Internal references (live in `DOC/agents/` only; absorbed by the public agents)

These were standalone agents in earlier OS versions. They now serve as internal rule + workflow references that the consolidated public agents load and execute. You do **not** invoke them directly.

| Reference agent | Absorbed by | Purpose |
|---|---|---|
| `ux_director` | `frontend_planner` | Site map + journeys + nav models |
| `design_system_planner` | `frontend_planner` | Tokens + theme |
| `component_system_planner` | `frontend_planner` | Atoms / molecules / organisms with state matrices |
| `motion_planner` | `frontend_planner` | Macro + micro motion catalog |
| `content_planner` | `frontend_planner` | Content library + i18n + SEO copy |
| `interaction_planner` | `frontend_planner` | Interaction matrix per surface |
| `page_planner` | `frontend_planner` | Per-page specs |
| `integration_planner` | `backend_planner` | Tier preset selection + automation surface |
| `devops_planner` | `backend_planner` | Environments + CI/CD + monitoring + alerts + backups + DR + on-call + cost |
| `security_auditor` | `backend_planner` | CSP / CORS / rate limits / audit log / OWASP / compliance |
| `qa_planner` | `backend_planner` | Pyramid + frameworks + CI gates + coverage + test cases + smoke + a11y |
| `performance_auditor` | `backend_planner` | Cache + CDN + bundle + Web Vitals + DB indexes + N+1 |
| `master_planner` | (deprecated) | Replaced by `frontend_planner` + `backend_planner` |
| `execution_orchestrator` | (deprecated) | Replaced by `frontend_developer` + `backend_developer` |
| `spec_writer` | invoked by `backend_developer` | Per-feature / per-page / per-route / per-component / per-integration spec docs |
| `diagram_writer` | invoked by `backend_developer` | Mermaid ER + sequence diagrams |
| `openapi_writer` | invoked by `backend_developer` | OpenAPI 3.1 spec |
| `adr_writer` | invoked by `backend_developer` | ADRs |
| `runbook_writer` | invoked by `backend_developer` | Per-integration + per-alert + per-failure-mode runbooks |

---

## Output artifact map (for audit Section D.4)

Every top-level key in `plan.json` (when master_planner is used) or in the aggregated handoff between the public agents must have a producer. This table is the source of truth.

| `plan.json` key | Producer |
|---|---|
| `features` | `intake_strategist` |
| `brand` | `intake_strategist` |
| `audience` | `intake_strategist` |
| `journeys` | `intake_strategist` |
| `site_map` | `intake_strategist` (initial) → `frontend_planner` (refined) |
| `tier_band` | `intake_strategist` |
| `frontend` | `frontend_planner` |
| `backend` | `backend_planner` |
| `integrations` | `backend_planner` (Phase 2 inside `backend_planner`) |
| `automation` | `backend_planner` (when `automation_surface.outbound: enabled`) |
| `devops` | `backend_planner` (Phase 3 inside `backend_planner`) |
| `security` | `backend_planner` (Phase 4 inside `backend_planner`) |
| `testing` | `backend_planner` (Phase 5 inside `backend_planner`) |
| `performance` | `backend_planner` (Phase 6 inside `backend_planner`) |
| `support_stack` | `backend_planner` (Phase 7 inside `backend_planner`) |
| `data_flows` | `frontend_planner` + `backend_planner` (link existing flow files) |
| `env_vars` | `backend_planner` (aggregate from Phase 1 + chosen integrations) |
| `webhooks` | `backend_planner` |
| `dashboards` | `backend_planner` |
| `dns` | `backend_planner` |
| `lock_status` | aggregate verdict |

If any row is missing or its producer doesn't exist, audit Section D.4 fails.

---

## Mirror discipline

Five files live at both `DOC/agents/<name>.agent.md` and `.github/agents/<name>.agent.md`:

- `frontend_planner`
- `backend_planner`
- `frontend_developer`
- `backend_developer`
- `system_architect`

When `DOC/agents/<name>.agent.md` is updated, the mirror at `.github/agents/<name>.agent.md` MUST be updated to byte-identical content. The audit detects mirror drift in Section A.4.

`system_architect DOCUMENT` mode keeps mirrors in sync.

---

## Maintenance rules

1. **Adding a new agent:** create the `.agent.md` in `DOC/agents/`, register here, decide whether it's a public entry (mirror to `.github/agents/`) or an internal reference. Update the workflow diagram if it changes phasing.
2. **Removing an agent:** remove from this index FIRST, then delete the file (and any mirror). Run `system_architect AUDIT` to confirm no orphan references remain.
3. **Renaming:** update file name + every reference in `runs_before` / `runs_after` across all agents + this index + mirrors.
4. **Version bumps:** bump `version` in frontmatter and update the table here.

---

## Discoverability for foreign AIs

Future AI sessions opening this OS for the first time should read in this order:

1. `DOC/README.md` — top-level orientation.
2. `DOC/agents/_index.md` — this file.
3. `.github/agents/README.md` — the user-facing 5-agent workflow.
4. `DOC/agents/system_architect.agent.md` — the meta-agent that can run AUDIT, DESIGN, FIX, SMOKE, DETERMINISM, DOCUMENT.
5. `DOC/validation/audit-template.md` — what "passing" means.
6. The specific agent file relevant to the user's request.
