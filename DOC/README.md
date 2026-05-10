# AI ENGINEERING OPERATING SYSTEM
A deterministic, machine-readable framework for planning and generating production-ready SaaS apps end-to-end with multiple AI agents. All files in this repository are AI agent instructions and machine-readable knowledge — no runnable code.

---

## STRUCTURE

```
DOC/
├── core/                                   # Highest-precedence system rules
│   ├── system-rules.md                     # Global invariants and agent behavior
│   ├── anti-hallucination-rules.md         # Forbidden fabrications
│   ├── planning-principles.md              # Planniing decision logic
│   ├── security-principles.md              # Security-first design mandates
│   ├── devops-principles.md                # DevOps best practices
│   └── testing-principles.md              # Testing strategy mandates
│
├── agents/                                 # One file per AI agent role
│   ├── master_planner.agent.md            # Orchestrates all sub-planners
│   ├── spec_writer.agent.md               # Emits structured plan.json specs
│   ├── frontend_planner.agent.md          # Frontend route + component planning
│   ├── backend_planner.agent.md           # API route + service layer planning
│   ├── integration_planner.agent.md       # Integration wiring per feature
│   ├── qa_planner.agent.md                # Test plan generation
│   ├── devops_planner.agent.md            # CI/CD + infrastructure planning
│   ├── security_auditor.agent.md          # Security review and scoring
│   ├── performance_auditor.agent.md       # Performance review against SLOs
│   ├── reviewer.agent.md                  # Validation gatekeeper (PASS/BLOCK)
│   ├── execution_orchestrator.agent.md     # Post-plan execution coordinator
│   ├── diagram_writer.agent.md            # Architecture diagram generation
│   ├── openapi_writer.agent.md            # OpenAPI spec generation
│   ├── adr_writer.agent.md                # Architecture Decision Record generation
│   └── runbook_writer.agent.md            # Operational runbook generation
│
├── knowledge/                              # Domain rules and integration specs
│   ├── integration-rules/                 # Per-integration YAML rule files
│   │   ├── clerk.yaml                     # Auth (Clerk)
│   │   ├── stripe.yaml                    # Payments (Stripe)
│   │   ├── sanity.yaml                    # CMS (Sanity)
│   │   ├── resend.yaml                    # Email (Resend)
│   │   ├── posthog.yaml                   # Analytics (PostHog)
│   │   ├── database.yaml                  # Database (Prisma + Postgres)
│   │   ├── sentry.yaml                    # Error tracking (Sentry)
│   │   ├── uploadthing.yaml               # File uploads (UploadThing)
│   │   ├── inngest.yaml                   # Background jobs (Inngest)
│   │   ├── meilisearch.yaml               # Search (Meilisearch)
│   │   ├── upstash.yaml                   # Cache + rate limit (Upstash Redis)
│   │   ├── axiom.yaml                     # Logging (Axiom)
│   │   └── openai.yaml                    # AI/LLM (OpenAI)
│   │
│   ├── feature-maps/
│   │   └── feature-integration-map.json   # Feature → required integration(s)
│   │
│   ├── architecture-templates/            # Full-stack architecture presets
│   │   ├── standard_saas.yaml             # CRUD SaaS with auth + payments
│   │   ├── content_saas.yaml              # Content/blog SaaS with CMS
│   │   ├── marketplace_saas.yaml          # Two-sided marketplace
│   │   ├── ai_saas.yaml                   # AI-first SaaS with LLM features
│   │   └── api_saas.yaml                  # API product with developer portal
│   │
│   ├── frontend-rules/
│   │   └── frontend-rules.md              # Next.js App Router, Tailwind, shadcn/ui rules
│   ├── backend-rules/
│   │   └── backend-rules.md               # Route handler + service layer rules
│   ├── api-rules/
│   │   └── api-rules.md                   # REST API shape, status codes, pagination
│   ├── database-rules/
│   │   └── database-rules.md              # Prisma schema, migrations, indexing
│   ├── devops-rules/
│   │   └── devops-rules.md                # Environments, secrets, CI/CD, rollback
│   ├── security-rules/
│   │   └── security-rules.md              # OWASP Top 10, auth, webhooks, CSP
│   ├── testing-rules/
│   │   └── testing-rules.md               # Vitest, Playwright, coverage thresholds
│   ├── performance-rules/
│   │   └── performance-rules.md           # SLOs, caching, bundle size, Edge
│   └── deployment-rules/
│       └── deployment-rules.md            # Vercel, branch→env mapping, DNS, smoke tests
│
├── flows/                                  # Step-by-step data and system flows
│   ├── data-flows/
│   │   ├── auth-flow.md                   # Clerk sign-up/sign-in/session
│   │   ├── payment-flow.md                # Stripe checkout + subscription webhook mirror
│   │   ├── blog-flow.md                   # Sanity CMS → Next.js page render
│   │   ├── search-flow.md                 # Meilisearch query + async indexing
│   │   ├── upload-flow.md                 # UploadThing direct browser-to-storage
│   │   ├── email-flow.md                  # Resend + React Email via Inngest
│   │   ├── analytics-flow.md              # PostHog client + server identify
│   │   ├── subscription-flow.md           # Stripe subscription lifecycle
│   │   └── ai-chat-flow.md                # OpenAI streaming chat + cost tracking
│   └── system-flows/
│       ├── planning-flow.md               # Master planner orchestration steps
│       ├── execution-flow.md              # Codegen execution pipeline
│       ├── validation-flow.md             # 9-stage validation pipeline
│       └── codegen-flow.md                # 8-stage code generation pipeline
│
├── validation/                             # Gates that block invalid plans/builds
│   ├── checklists/
│   │   ├── pre-planning-checklist.md      # Requirements gate before planning
│   │   ├── pre-build-checklist.md         # Plan completeness gate before codegen
│   │   ├── post-deploy-checklist.md       # Post-deployment smoke test gate
│   │   ├── security-checklist.md          # Security review gate (SC1–SC12)
│   │   └── integration-checklist.md       # Per-integration configuration gate
│   └── constraints/
│       ├── constraints.md                 # C1–C20 core planning constraints
│       ├── security-constraints.md        # SC1–SC12 security hard rules
│       ├── performance-constraints.md     # PC1–PC12 performance hard rules
│       └── data-constraints.md            # DC1–DC11 data integrity hard rules
│
└── execution/                              # Codegen and output rules
    ├── codegen-rules/
    │   ├── codegen-rules.md               # How codegen agents produce code
    │   ├── output-format-rules.md         # File/directory output conventions
    │   └── cli-command-rules.md           # Terminal command restrictions
    └── spec-templates/                    # Fill-in-the-blank spec templates
        ├── plan-spec.template.md          # Master plan spec
        ├── backend-spec.template.md       # Route handlers, services, repositories
        ├── frontend-spec.template.md      # Pages, layouts, components, forms
        ├── database-spec.template.md      # DB config, enums, tables, migrations
        ├── api-spec.template.md           # REST endpoints + webhooks
        ├── integration-spec.template.md   # Per-integration wiring spec
        ├── adr-spec.template.md           # Architecture Decision Record
        ├── runbook-spec.template.md       # Operational runbook
        ├── security-report-spec.template.md  # Security assessment report
        └── openapi-spec.template.yaml     # OpenAPI 3.1.0 spec template
```

---

## TECH STACK

All architecture templates and rules target this default stack:

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Clerk |
| Database | PostgreSQL + Prisma ORM |
| Payments | Stripe |
| CMS | Sanity |
| Email | Resend + React Email |
| Analytics | PostHog |
| Error Tracking | Sentry |
| Logging | Axiom |
| Background Jobs | Inngest |
| Cache / Rate Limit | Upstash Redis |
| File Uploads | UploadThing |
| Search | Meilisearch |
| AI / LLM | OpenAI |
| Deployment | Vercel |

---

## HOW TO USE WITH AN AI AGENT

### Planning a new SaaS app

1. Load `DOC/` into the agent's context.
2. Run `agents/master_planner.agent.md` with the user's free-text SaaS description.
3. Master planner invokes sub-agents: `integration_planner`, `frontend_planner`, `backend_planner`, `devops_planner`, `qa_planner`.
4. All sub-agents emit structured output into `plan.json`.
5. `reviewer.agent.md` validates the aggregated plan against all constraints (C1–C20, SC1–SC12, PC1–PC12, DC1–DC11).
6. On `validation_report.status == "passed"` → plan is LOCKED.

### Auditing the agentic system itself

1. Invoke `agents/system_architect.agent.md` (or `.github/agents/system_architect.agent.md`) with `mode: "AUDIT"`.
2. The agent executes deterministic checks from `validation/audit-template.md` and emits a structured report using `validation/audit-report.template.md`.
3. Run fixture-based chain checks from `validation/audit-fixtures/` using `mode: "SMOKE"`.
4. Run two-pass drift checks using `mode: "DETERMINISM"`.
5. Treat any report with blockers as `NOT_READY` until fixed and re-audited.

### Generating code

7. `execution_orchestrator.agent.md` consumes LOCKED planning artifacts and runs spec emission + codegen flows.
8. Codegen agents follow `execution/codegen-rules/` and use `execution/spec-templates/` to emit structured specs before writing files.
9. Post-deploy: run `validation/checklists/post-deploy-checklist.md`.

### Adding a new feature or integration

- New integration → add `knowledge/integration-rules/<name>.yaml`.
- New feature → add entry in `knowledge/feature-maps/feature-integration-map.json`.
- New architecture pattern → add `knowledge/architecture-templates/<name>.yaml`.

Any plan that names an unknown feature or integration triggers `MISSING_KNOWLEDGE` → BLOCKED.

---

## AGENT ROSTER

| Agent | Role |
|-------|------|
| `master_planner` | Orchestrates planning; owns final `plan.json` |
| `spec_writer` | Converts plan.json into typed spec files |
| `frontend_planner` | Page routes, component tree, data fetching strategy |
| `backend_planner` | API handlers, service layer, repositories |
| `integration_planner` | Per-integration wiring, env vars, webhooks |
| `qa_planner` | Test plan, coverage targets, E2E critical paths |
| `devops_planner` | CI/CD pipeline, secrets, environments, alerts |
| `security_auditor` | OWASP review, constraint scoring, security report |
| `performance_auditor` | SLO gap analysis, caching, bundle review |
| `reviewer` | Validation gatekeeper — PASS or BLOCK |
| `execution_orchestrator` | Runs spec emission and deterministic codegen after plan LOCK |
| `diagram_writer` | Mermaid architecture and flow diagrams |
| `openapi_writer` | OpenAPI 3.1.0 spec from plan |
| `adr_writer` | Architecture Decision Records |
| `runbook_writer` | Incident runbooks per feature/service |

---

## PRECEDENCE ORDER

`core` > `validation/constraints` > `knowledge/integration-rules` > `knowledge/feature-maps` > `knowledge/architecture-templates` > `flows` > `execution`

When rules conflict, higher-precedence rules win. Agents must not override core rules.

---

## OUTPUT LOCATION

Canonical output root:

`DOC/output/`

Recommended per-run structure:

- `DOC/output/runs/<timestamp>/planning/plan.json`
- `DOC/output/runs/<timestamp>/planning/decisions.json`
- `DOC/output/runs/<timestamp>/planning/validation_report.json`
- `DOC/output/runs/<timestamp>/planning/frontend/*`
- `DOC/output/runs/<timestamp>/specs/*`
- `DOC/output/runs/<timestamp>/reports/*`
- `DOC/output/runs/<timestamp>/codegen/*`

See `DOC/output/README.md` for the full contract.

