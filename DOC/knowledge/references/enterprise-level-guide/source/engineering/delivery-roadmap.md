# Delivery Roadmap

## Purpose

This document defines a practical implementation sequence for Growrix OS so the team builds a stable core before adding broad feature surface area.

## Delivery Strategy

Build the system from the inside out:

1. Establish identity, data, and security controls.
2. Implement the revenue-critical demo intake and queue workflows.
3. Build internal operations surfaces for admins and developers.
4. Build the client collaboration surface.
5. Add trust, conversion, and automation layers.

## Phase 0: Foundation

Deliverables:

- Repository structure
- Environment strategy
- Supabase project setup
- Base auth integration
- Shared UI shell and route groups
- Documentation and AI rules

Exit criteria:

- Team can run the project locally.
- Core docs are accepted as source of truth.
- Environment secrets and role model are defined.

## Phase 1: Core Business Engine

Deliverables:

- Client signup and login
- Hidden admin and developer login
- Demo request form
- Batch and queue logic
- Queue status visibility
- Stripe priority upgrade flow
- Base notifications

Exit criteria:

- A new request can enter the queue.
- An admin can assign work.
- A successful Stripe payment can promote a request safely.

## Phase 2: Internal Control Plane

Deliverables:

- Admin dashboard overview
- Demo request management
- Batch management
- Developer assignment workflows
- Developer dashboard with assigned work lists and status updates

Exit criteria:

- Admin can run the core operation without manual database work.
- Developers can complete demo delivery through the dashboard.

## Phase 3: Client Collaboration Plane

Deliverables:

- Client dashboard overview
- Project timelines and ETA visibility
- Realtime chat
- File uploads and downloads
- Demo approvals and delivery handling
- Backup archival

Exit criteria:

- Client and developer can collaborate entirely within the platform.
- Final files and backups are accessible under controlled permissions.

## Phase 4: Retention and Monetization Expansion

Deliverables:

- Maintenance contracts and ticketing
- Shop item catalog and order flow
- Demo wall publishing workflow
- Reviews integration

Exit criteria:

- Delivered work can feed public proof and recurring revenue systems.
- Maintenance requests are operationally manageable.

## Phase 5: Automation and Scale

Deliverables:

- Ask Growi public assistant
- Ask Growi dashboard assistant
- advanced notifications and reminders
- analytics and reporting
- mobile planning or execution

Exit criteria:

- Core workflows are measurable, supportable, and partially automated.

## Workstream Breakdown

### Workstream A: Platform and Infra

- Next.js app setup
- Supabase config and migrations
- Environment setup
- deployment pipelines

### Workstream B: Domain Services

- queue service
- payment reconciliation service
- assignment service
- notification service
- maintenance service

### Workstream C: Experience Surfaces

- marketing site
- client dashboard
- admin dashboard
- developer dashboard

### Workstream D: Quality and Operations

- test coverage
- logging and tracing
- monitoring
- data access review

## Release Gates

No phase should be marked complete without:

- documented acceptance criteria
- happy-path and failure-path testing
- authorization validation
- updated docs for any design changes
- basic operational observability for new critical flows

## Recommended Team Rhythm

- Use small vertical slices rather than isolated frontends or database-only work.
- Pair each feature with API, data, UI, and access control validation.
- Keep backlog items tied to one owning module and one measurable outcome.