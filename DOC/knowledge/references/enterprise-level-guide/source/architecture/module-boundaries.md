# Module Boundaries

## Purpose

This document defines the main product modules, their responsibilities, owned entities, external dependencies, and implementation notes. It exists to prevent uncontrolled coupling as the platform grows.

## Module Inventory

### 1. Authentication and Roles

- Owns: identity, sessions, role model, dashboard access restrictions.
- Key entities: `users`.
- Depends on: Supabase Auth, middleware, RLS.
- Rules: no public admin or developer signup, server-side role enforcement, role-aware redirects.

### 2. Free Demo Request Intake

- Owns: demo request form, validation, uploads, batch placement, ETA calculation.
- Key entities: `batches`, `demo_requests`.
- Depends on: storage, queue rules, notifications.
- Rules: enforce required fields, file limits, duplicate prevention, controlled capacity.

### 3. Queue Management

- Owns: batch lifecycle, queue ordering, assignment flow, dynamic ETA changes.
- Key entities: `batches`, `demo_requests`, `projects`.
- Depends on: admin actions, developer assignments, payment-driven priority changes.
- Rules: deterministic ordering, safe queue recalculation, priority requests elevated without losing auditability.

### 4. Priority Payments

- Owns: Stripe checkout, payment records, priority promotion.
- Key entities: `payments`, `demo_requests`.
- Depends on: Stripe, webhook handling, notifications.
- Rules: webhook is source of truth, duplicate event protection, no priority without confirmed payment.

### 5. Live Demo Wall

- Owns: public portfolio gallery and inspirational references.
- Key entities: `demo_gallery`.
- Depends on: delivery status changes, admin approval, storage/CDN.
- Rules: delivered work is private by default, admin approval required for publication.

### 6. Shop

- Owns: pre-built inventory, orders, customization intake, revenue tracking.
- Key entities: `shop_items`, `shop_orders`, `payments`.
- Depends on: Stripe, assignments, file delivery.
- Rules: external marketplace items are credibility signals, not downloadable third-party assets.

### 7. Admin Dashboard

- Owns: platform-wide control plane.
- Key entities: all operational entities in a managed context.
- Depends on: analytics, assignment services, approval workflows.
- Rules: admin is authoritative for assignments, approvals, and oversight.

### 8. Client Dashboard

- Owns: client visibility, chat, uploads, approvals, downloads, maintenance intake.
- Key entities: `demo_requests`, `projects`, `messages`, `maintenance_requests`, `notifications`.
- Depends on: auth, realtime, storage.
- Rules: strict tenant isolation, persistent collaboration trail.

### 9. Developer Dashboard

- Owns: assigned work execution, deliverable uploads, backups, developer-side status changes.
- Key entities: `projects`, `demo_requests`, `messages`, `project_backups`, `shop_orders`.
- Depends on: admin assignments, realtime, storage.
- Rules: developers see only their own assignments and cannot self-assign.

### 10. Maintenance and Support

- Owns: maintenance coverage, ticket lifecycle, plan changes after expiry.
- Key entities: `maintenance_contracts`, `maintenance_requests`.
- Depends on: delivery completion, notifications, optional billing.
- Rules: coverage begins automatically at delivery time and expires deterministically.

### 11. Ask Growi

- Owns: AI guidance for visitors and clients.
- Key entities: `ai_chat_logs`.
- Depends on: AI provider, FAQs, optional retrieval, dashboard read-only APIs.
- Rules: read-only over operational data, no hidden admin actions, graceful fallback to humans.

### 12. Google Reviews

- Owns: public review display and featured review selection.
- Key entities: `google_reviews`.
- Depends on: Google API, scheduled sync, homepage and reviews UI.
- Rules: Google remains the origin of review truth, local cache is for display and resilience.

### 13. Notifications

- Owns: transactional emails, in-app alerts, and realtime signals.
- Key entities: `notifications`, optional `email_logs`.
- Depends on: most domain events.
- Rules: event-driven, role-scoped, retryable, and observable.

## Boundary Rules

- No module should directly mutate another module's state without going through an explicit service boundary.
- Shared tables such as `projects`, `payments`, and `notifications` must have clear ownership for write operations.
- UI modules may aggregate data from multiple domains, but business rules must remain in the owning domain services.
- Realtime subscriptions should be scoped by role and entity ownership.

## High-Risk Coupling Areas

- Queue logic and priority payments.
- Assignment flow between admin, developer, and client visibility.
- Delivery completion, demo wall publication, backups, and maintenance contract creation.
- Shop orders that behave like projects after purchase.
- AI assistant access to dashboard data.

## Implementation Guideline

When in doubt, prefer a domain-service approach:

- `queue service` owns ordering and ETA logic.
- `payments service` owns Stripe sessions and webhook reconciliation.
- `assignment service` owns project creation and developer linkage.
- `delivery service` owns finalization side effects such as backups, gallery entries, and maintenance contracts.
- `notification service` owns fan-out to email, in-app, and realtime channels.