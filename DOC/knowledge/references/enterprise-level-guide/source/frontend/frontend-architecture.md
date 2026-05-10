# Frontend Architecture

## Purpose

This document defines the frontend architecture for Growrix OS. It exists to keep the public site, client dashboard, admin dashboard, and developer dashboard coherent while preventing privilege leakage, duplicated logic, and UI-driven business rules.

## Frontend Mission

The frontend must deliver clear role-specific experiences while treating the backend as the source of truth for identity, queue state, assignments, payments, maintenance coverage, and file access.

## Experience Surfaces

### Public Surface

- Marketing pages
- Demo request intake
- Priority upgrade handoff
- Demo wall
- Shop catalog
- Reviews
- Ask Growi public widget

### Client Surface

- Dashboard overview
- Queue status and project timeline
- Chat and file exchange
- Demo approvals and downloads
- Maintenance requests

### Admin Surface

- Queue and batch operations
- Assignment management
- Shop, gallery, maintenance, review, and notification oversight

### Developer Surface

- Assigned demos, projects, shop orders, and maintenance tasks
- Status updates
- Deliverable uploads
- Chat with assigned clients

## Architectural Rules

- Separate route groups by surface and role.
- Avoid shared page logic across privileged and non-privileged surfaces unless encapsulated behind controlled abstractions.
- Keep pages thin. Complex behavior belongs in feature modules, server actions, or API-backed services.
- Treat the UI as a consumer of documented contracts, not the owner of workflow rules.
- Centralize authentication guards and authorization-aware layout decisions.

## Recommended Structure

```text
app/
  (marketing)/
  (client)/dashboard/
  growrix-admin/
  growrix-team/
  api/
components/
features/
  demo-requests/
  queue/
  payments/
  projects/
  chat/
  shop/
  maintenance/
  reviews/
lib/
  auth/
  api/
  formatting/
  permissions/
```

## Rendering Strategy

- Prefer server-rendered data for auth-bound dashboards and SEO-relevant public pages.
- Use client components only for interactivity, realtime state, uploads, and local UI coordination.
- Keep sensitive decisions on the server even if the initial page render occurs client-side.

## Ownership Model

- `app/` owns routing and high-level composition.
- `features/` owns business-facing UI slices and workflow components.
- `components/` owns generic presentation primitives.
- `lib/` owns client-safe utilities and server-aware adapters.

## Data Boundaries

- Do not calculate authoritative queue order, ETA, maintenance eligibility, or payment success in client code.
- Do not infer authorization from route visibility or menu availability.
- Do not allow client-side mutation flows to bypass server validation.

## Frontend Definition of Done

- Surface-specific access boundaries are preserved.
- Loading, empty, error, and permission states are explicit.
- Realtime features degrade safely.
- Accessibility and responsive behavior are validated.
- Frontend contracts align with the documented API and data model.