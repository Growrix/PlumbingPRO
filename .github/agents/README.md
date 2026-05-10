# Agent Entry Points (Copilot / VS Code)

This folder is the **public agent surface** for VS Code Copilot and any AI session opening the repo. Pick one of the 5 named agents below per phase.

The canonical agent files live at `DOC/agents/<name>.agent.md`. Files here are byte-identical mirrors maintained by `system_architect DOCUMENT` mode.

---

## Workflow at a glance

```
                         ┌──────────────────────────────────┐
                         │   intake_strategist (DOC only)   │
                         │   one-line brief → brief.json    │
                         └─────────────┬────────────────────┘
                                       │
       ┌───────────────────────────────┴───────────────────────────────┐
       │                                                                │
       ▼                                                                ▼
┌──────────────────────┐                                  ┌─────────────────────────────┐
│  frontend_planner    │  produces frontend.json +        │  backend_planner            │
│  (architect+designer)│  full planning artifact bundle   │  (backend + integrations    │
│                      │                                  │   + devops + security       │
│                      │                                  │   + qa + performance lead)  │
└──────────┬───────────┘                                  └──────────────┬──────────────┘
           │                                                             │
           ▼                                                             ▼
┌──────────────────────┐                                  ┌─────────────────────────────┐
│  frontend_developer  │  emits everything under web/     │  backend_developer          │
│  (frontend only,     │  + tests scaffold + audit        │  closes production:         │
│   no backend code)   │                                  │  api/, server/, prisma/,    │
│                      │                                  │  studio/, emails/, inngest/,│
│                      │                                  │  CI/CD, IaC, monitoring,    │
│                      │                                  │  backups, runbooks, deploy  │
└──────────────────────┘                                  └─────────────────────────────┘

           ╭──────────────────── system_architect ────────────────────╮
           │   out-of-band meta-agent: AUDIT / DESIGN / FIX / SMOKE / │
           │   DETERMINISM / DOCUMENT against any agentic system      │
           ╰──────────────────────────────────────────────────────────╯
```

**Two prompts for the planning phase. Two prompts for the execution phase. One meta-agent that audits the lot.**

---

## The five agents

### 1. `frontend_planner`
**Use when:** starting a new project, after the brief is locked.
**Role:** pro-level frontend architect + visual/interaction designer in one. Produces the entire frontend planning bundle: site map, journeys, design tokens, component system, motion catalog, content library, per-page specs, per-component specs, visual reference pack, ai-context.yaml, README.
**Output root:** `DOC/output/runs/<timestamp>/planning/frontend/`
**Quality bar:** Stripe / Linear / Vercel / Notion-class.
**Does not produce:** any backend or integration plan; that's `backend_planner`.

### 2. `backend_planner`
**Use when:** the frontend planning bundle is complete and `frontend.json.status: passed`.
**Role:** lead planner for everything non-frontend. Backend architecture, database, APIs, integrations, third-party services, automation outbound surface, devops + CI/CD, security, qa, performance, post-launch support stack.
**Output root:** `DOC/output/runs/<timestamp>/planning/backend/`
**Inputs:** brief + frontend.json.
**Does not produce:** frontend artifacts; that's `frontend_planner`.

### 3. `frontend_developer`
**Use when:** the frontend planning bundle is locked.
**Role:** implements the frontend in `web/`. Materializes design tokens, generates every shared component with full state coverage, generates every page with full section composition, wires the content library, implements motion + reduced-motion, generates SEO assets, scaffolds tests (bodies as TODO).
**Output root:** `web/`
**Strict boundary:** no files outside `web/`. No backend code, no CMS schemas, no deployment configs.

### 4. `backend_developer`
**Use when:** the backend planning bundle is locked and the frontend code is in flight (or already shipped).
**Role:** implements backend + every integration end-to-end + CI/CD + IaC + monitoring + alerts + backups + DR + runbooks. Closes production by deploying, running smoke tests, and verifying rollback.
**Output root:** project root, EXCLUDING `web/`. Specifically: `src/server/`, `src/inngest/`, `src/lib/`, `src/app/api/`, `prisma/`, `studio/`, `emails/`, `terraform/`, `.github/workflows/`, `docs/`, root config files.
**Strict boundary:** read-only against `web/`.

### 5. `system_architect`
**Use when:** auditing the OS itself, designing a new agentic workflow, fixing audit findings, smoke-testing a fixture, verifying determinism.
**Role:** out-of-band meta-agent. Six modes: `DESIGN`, `AUDIT`, `FIX`, `SMOKE`, `DETERMINISM`, `DOCUMENT`.
**Output root:** `DOC/output/runs/<timestamp>/reports/` (or `<target>/reports/` when auditing a different system).

---

## Recommended invocation order

1. **Brief intake** — run `intake_strategist` from `DOC/agents/` (no Copilot mirror; it's a one-step gap-filler).
2. **Plan frontend** — invoke `frontend_planner` (this folder).
3. **Plan backend + everything else** — invoke `backend_planner` (this folder).
4. **Build frontend** — invoke `frontend_developer` (this folder). Can run in parallel with step 5.
5. **Build backend + ship** — invoke `backend_developer` (this folder). Can run in parallel with step 4.
6. **Audit the agentic OS itself** — at any time, invoke `system_architect` in `AUDIT` mode.

---

## What changed from the prior workflow

- Removed `master_planner.agent.md` from this folder. Its orchestration logic is split between `frontend_planner` (frontend planning lead) and `backend_planner` (everything else lead).
- Removed `execution_orchestrator.agent.md` from this folder. Its job is now done in parallel by `frontend_developer` (frontend code) and `backend_developer` (backend + integrations + devops + ship).
- Added `frontend_planner`, `backend_planner`, `frontend_developer`, `backend_developer` as the four named workflow entries.
- `system_architect` remains the meta-agent for system-level concerns.

---

## Sub-agents (internal references; not mirrored here)

These agents continue to live at `DOC/agents/` as internal skill references that the consolidated agents above absorb into their workflows:

- `ux_director`, `design_system_planner`, `component_system_planner`, `motion_planner`, `content_planner`, `interaction_planner`, `page_planner` — absorbed by `frontend_planner`
- `integration_planner`, `devops_planner`, `qa_planner`, `security_auditor`, `performance_auditor` — absorbed by `backend_planner`
- `spec_writer`, `diagram_writer`, `openapi_writer`, `adr_writer`, `runbook_writer` — invoked by `backend_developer` during execution

You don't invoke these directly. You invoke one of the five entry points above; the consolidated agent runs the relevant sub-workflow.

---

## Maintenance

`system_architect DOCUMENT` mode keeps these mirrors byte-identical with `DOC/agents/`. After any structural change in `DOC/agents/`, run `system_architect DOCUMENT` to refresh this folder + the registry at `DOC/agents/_index.md`.
