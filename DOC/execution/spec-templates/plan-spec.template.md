# SPEC TEMPLATE: PLAN

## PURPOSE
Use this template to emit the master `plan.json` in human-readable Markdown form. Agents fill each section from their plan artifacts. This file is the single source of truth for a planned SaaS project.

---

## PLAN METADATA
```
plan_id: <uuid>
created_at: <ISO timestamp>
status: LOCKED | DRAFT
agent: master_planner v<version>
architecture_template: <template_name>
```

---

## FEATURES
List all features extracted from the user request (names from `feature-integration-map.json`):
```
- auth
- payments
- [add more features here]
```

---

## INTEGRATIONS

| Feature | Primary Integration | Secondary Integrations |
|---------|-------------------|----------------------|
| auth | clerk | — |
| payments | stripe | resend, database |
| [feature] | [primary] | [secondaries] |

---

## ARCHITECTURE TEMPLATE
```
template: <name>
justification: <why this template was selected>
extras_added: [<integration>, ...]   # integrations beyond template defaults
extras_justification: <reason>
```

---

## ROUTES

### Frontend Routes
| Route | Page | Data Source | Auth Required | Cache Strategy |
|-------|------|------------|---------------|----------------|
| / | HomePage | static | no | force-cache |
| /dashboard | DashboardPage | database | yes | no-store |
| [add rows] | | | | |

### API Routes
| Route | Method | Auth | Service Called | Rate Limited |
|-------|--------|------|---------------|-------------|
| /api/webhooks/stripe | POST | signature | billing.handleWebhook | no |
| /api/health | GET | none | health.check | no |
| [add rows] | | | | |

---

## DATABASE SCHEMA

### Tables
For each table:
```
table: <name>
columns:
  - id: cuid2 (PK)
  - user_id: string FK → users.id
  - [columns...]
  - created_at: DateTime
  - updated_at: DateTime
indexes:
  - [table]_user_id_idx on (user_id)
  - [others]
```

---

## ENV VARS

| Variable | Scope | Integration | Description |
|----------|-------|------------|-------------|
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | client | clerk | Clerk publishable key |
| CLERK_SECRET_KEY | server | clerk | Clerk secret key |
| [add rows] | | | |

---

## DATA FLOWS

| Feature | Flow File |
|---------|----------|
| auth | flows/data-flows/auth-flow.md |
| payments | flows/data-flows/payment-flow.md |
| [feature] | flows/data-flows/<feature>-flow.md |

---

## SETUP STEPS
Ordered steps to provision and configure all integrations:
```
1. Provision database (managed Postgres)
2. Create Clerk application (dev + prod instances)
3. Create Stripe account and products
4. [add steps in execution order]
```

---

## PACKAGES
Union of all integration packages:
```
dependencies:
  - @clerk/nextjs
  - stripe
  - [add packages]
devDependencies:
  - @types/node
  - [add packages]
```

---

## DEVOPS
```
environments: [local, preview, staging, production]
secrets_vault: vercel
ci_cd_file: .github/workflows/ci.yml
health_endpoint: /api/health
rollback_strategy: vercel_instant_rollback
rto_minutes: 60
rpo_minutes: 15
backup_retention_days: 30
```

---

## SLO TARGETS
```
web_vitals_lcp_ms: 2500
api_p99_ms: 500
db_query_p99_ms: 100
uptime_percent: 99.9
```
