# Growrix OS Documentation Index

This directory is the authoritative handbook for designing, implementing, operating, and evolving Growrix OS. The repository now also includes a runnable MVP implementation that follows these docs.

## Runnable MVP

The current codebase includes a local, self-contained Next.js MVP that implements the core Growrix OS flows without external credentials.

Use these commands from the repo root:

- `npm install`
- `npm run dev`
- `npm run verify`
- `npm run test:e2e`

Seeded accounts for local validation:

- Client: `client@example.com`
- Admin: `admin@growrixos.com`
- Developer: `maya@growrixos.com`

## AI First-Stop File

If an AI agent or prompt needs one starting reference, use [ai/ai-context.yaml](ai/ai-context.yaml) first.

Why this file exists:

- It is the compact, machine-readable index for the system.
- It summarizes core invariants, module ownership, status models, frontend and backend rules, and recommended read paths.
- It is the preferred file to reference in prompts when the model should find the right docs quickly instead of scanning the whole handbook.

Prompt guidance:

- Always start with `DOC/Universal/Enterprise Level Guide/ai/ai-context.yaml`.
- Then follow the relevant `read_paths` entry in that file before changing code or docs.

## Core Specs

- [product/product-requirements.md](product/product-requirements.md)
- [architecture/system-architecture.md](architecture/system-architecture.md)
- [architecture/contract-first-delivery.md](architecture/contract-first-delivery.md)
- [architecture/module-boundaries.md](architecture/module-boundaries.md)
- [data/data-model.md](data/data-model.md)
- [api/api-design.md](api/api-design.md)

## Frontend Handbook

- [frontend/frontend-rules-and-design-system.md](frontend/frontend-rules-and-design-system.md)
- [frontend/frontend-architecture.md](frontend/frontend-architecture.md)
- [frontend/ui-ux-standards.md](frontend/ui-ux-standards.md)
- [frontend/component-and-styling-standards.md](frontend/component-and-styling-standards.md)
- [frontend/data-fetching-and-state.md](frontend/data-fetching-and-state.md)
- [frontend/realtime-chat-and-client-resilience.md](frontend/realtime-chat-and-client-resilience.md)
- [frontend/accessibility-and-localization.md](frontend/accessibility-and-localization.md)
- [frontend/frontend-performance-and-analytics.md](frontend/frontend-performance-and-analytics.md)

## Machine-Readable AI Context

- [ai/ai-context.yaml](ai/ai-context.yaml): Canonical machine-readable summary for AI prompts, doc routing, module ownership, status models, and decision rules.

## Backend Handbook

- [backend/backend-architecture.md](backend/backend-architecture.md)
- [backend/service-design-and-domain-rules.md](backend/service-design-and-domain-rules.md)
- [backend/auth-authorization-and-rls.md](backend/auth-authorization-and-rls.md)
- [backend/queue-payments-and-integrations.md](backend/queue-payments-and-integrations.md)
- [backend/file-delivery-and-storage.md](backend/file-delivery-and-storage.md)
- [backend/backend-observability-and-reliability.md](backend/backend-observability-and-reliability.md)

## Engineering, Quality, and Operations

- [engineering/delivery-roadmap.md](engineering/delivery-roadmap.md)
- [engineering/development-standards.md](engineering/development-standards.md)
- [quality/testing-strategy.md](quality/testing-strategy.md)
- [quality/qa-and-release-gates.md](quality/qa-and-release-gates.md)
- [quality/enterprise-testing-and-quality-enforcement-v2.md](quality/enterprise-testing-and-quality-enforcement-v2.md)
- [operations/security-and-operations.md](operations/security-and-operations.md)
- [operations/platform-governance-and-controls.md](operations/platform-governance-and-controls.md)

## Process and Governance

- [process/contribution-guide.md](process/contribution-guide.md)
- [process/change-management.md](process/change-management.md)
- [process/deployment-and-environments.md](process/deployment-and-environments.md)
- [process/incident-response.md](process/incident-response.md)
- [process/privacy-retention-and-compliance.md](process/privacy-retention-and-compliance.md)
- [process/onboarding-playbook.md](process/onboarding-playbook.md)

## AI Collaboration

- [ai/ai-context.yaml](ai/ai-context.yaml)
- [ai/ai-collaboration-playbook.md](ai/ai-collaboration-playbook.md)

## Suggested Reading Paths

### For Product and Architecture Decisions

1. ai-context.yaml
2. product requirements
3. contract-first delivery
3. system architecture
4. module boundaries
5. data model and API design

### For Cross-Team Or AI Build Alignment

1. ai-context.yaml
2. contract-first delivery
3. product requirements
4. data model and API design
5. frontend and backend handbooks for the affected slice

### For AI Prompts

1. reference `DOC/Universal/Enterprise Level Guide/ai/ai-context.yaml`
2. choose the relevant `read_paths` entry from that file
3. include module, roles, business rule, and testing expectation in the prompt

### For Local Implementation Validation

1. ai-context.yaml
2. product requirements and API design
3. run `npm run verify`
4. run `npm run test:e2e`
5. compare behavior against the business rules in the relevant frontend and backend docs

### For Frontend Work

1. ai-context.yaml
2. frontend rules and design system
3. frontend architecture
4. UI and UX standards
5. components, state, realtime, accessibility, and performance docs

### For Backend Work

1. ai-context.yaml
2. backend architecture
3. service design
4. auth and RLS
5. queue, API, data, storage, and reliability docs
6. platform governance and controls when billing, flags, quotas, or abuse protection are involved

### For Release and Operations Work

1. ai-context.yaml
2. development standards
3. testing strategy
4. QA and release gates
5. enterprise testing and quality enforcement protocol
6. deployment, security, incident response, and platform governance docs