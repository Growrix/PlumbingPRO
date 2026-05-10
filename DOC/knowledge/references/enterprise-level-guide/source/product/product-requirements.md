# Product Requirements

## Purpose

This document converts the original Growrix OS blueprint into a normalized product requirements baseline. It defines the product scope, business rules, user roles, critical workflows, and delivery phases that should govern all implementation work.

## Product Vision

Growrix OS is a trust-first services platform that reduces the perceived risk of buying software delivery. The product leads with a free customized demo, shows queue transparency, offers a paid priority path, and then carries the client through delivery, support, and future upsells.

## Primary Personas

### Visitor

- Lands on the public site.
- Explores services, delivered demos, and shop items.
- Requests a free demo or purchases a priority upgrade.
- Interacts with Ask Growi for guidance.

### Client

- Submits a demo request.
- Tracks queue position, ETA, and project status.
- Uploads content and requirements.
- Chats with the assigned developer.
- Reviews deliverables and requests maintenance.

### Admin

- Operates the platform from the hidden admin portal.
- Reviews requests, manages batches, assigns developers, and monitors delivery.
- Manages shop inventory, demo wall publishing, maintenance tickets, and reviews.

### Developer

- Works from the hidden team portal.
- Receives assignments from admins only.
- Delivers demos, projects, shop customizations, and maintenance tasks.
- Uploads deliverables, backups, and status updates.

## Product Pillars

- Trust through transparency.
- Fast validation through demos.
- Clear monetization via priority, full projects, shop sales, and maintenance plans.
- Controlled operations through role-specific dashboards.
- Global delivery with scalable backend workflows.

## Non-Negotiable Business Rules

- Admin and developer access must never be discoverable through public navigation.
- Hidden routes are allowed for usability, but authorization must be enforced server-side and in the database.
- Free demo requests are constrained by batches with explicit capacity.
- Priority requests always outrank free queue requests after successful payment validation.
- Assignment is admin-driven. Developers do not self-assign work.
- Client and developer chat is scoped to an assigned project or request context.
- Every delivered project automatically enters a one-year included maintenance period.
- Public portfolio exposure requires explicit approval. Delivered work is private by default.

## Core Product Capabilities

### 1. Identity and Access

- Public signup and login for clients.
- Admin-only login from `/growrix-admin`.
- Developer-only login from `/growrix-team`.
- Role-aware routing, middleware, and backend authorization.

### 2. Demo Request Intake

- A structured intake form collects business context, goals, design preferences, and assets.
- Request processing assigns each submission to a batch or waitlist state.
- ETA is computed from queue position and batch schedule.

### 3. Queue and Batch Transparency

- Clients can see queue position, ETA, and status progression.
- Admins can create, close, and manage batches.
- Priority upgrades must recalculate ordering safely and consistently.

### 4. Priority Upgrade

- Stripe checkout upgrades a request into priority mode.
- Payment success is confirmed only through secure webhook processing.
- Duplicate or stale webhook events must not corrupt ordering.

### 5. Delivery Workspaces

- Admin dashboard is the control plane.
- Developer dashboard is the execution plane.
- Client dashboard is the collaboration and visibility plane.

### 6. Demo Wall and Shop

- Public social proof is delivered through approved demo gallery items.
- Shop items support both direct purchase and customization-led sales flows.

### 7. Maintenance and Support

- Maintenance begins at delivery time.
- Clients can raise tickets during the covered period.
- Paid plans are offered when included maintenance expires.

### 8. AI and Notification Layers

- Ask Growi supports discovery, guidance, and dashboard assistance.
- Notifications span email, realtime alerts, and optional push channels.

## Phase Scope

### Phase 1: MVP

- Authentication and role model
- Demo request intake and queue management
- Priority payments
- Basic admin dashboard
- Basic developer dashboard
- Live demo wall
- Basic shop
- Transactional email notifications

### Phase 2: Relationship Layer

- Full client dashboard
- Realtime chat and uploads
- Final file delivery and backups
- Maintenance workflows
- Basic Ask Growi integration
- Google reviews integration
- Advanced notifications

### Phase 3: Scale Layer

- Mobile app
- Advanced analytics
- Push notifications
- Multi-language AI
- Team scaling workflows

## Success Metrics

- Visitor to demo-request conversion rate
- Demo-request to paid-priority conversion rate
- Demo-to-project conversion rate
- Average time to first assignment
- Priority SLA adherence
- Client response time and chat resolution time
- Maintenance renewal rate after year one
- Demo wall to request conversion rate

## Acceptance Criteria for the Platform

- A visitor can submit a valid demo request and receive a queue position and ETA.
- An admin can assign work and the assigned developer sees it immediately.
- A client can track work status, exchange files, and review deliverables.
- A delivered project creates backup records and maintenance coverage automatically.
- A paid priority request is safely promoted without bypassing auditability.
- Public portfolio and reviews display only approved content.

## Product Governance

- The docs in `DOC/` are the operational source of truth.
- Any future scope change must update the relevant doc before or alongside implementation.
- If implementation diverges from the docs, the mismatch must be treated as a defect in either code or documentation and resolved explicitly.