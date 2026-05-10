# Remaining Tasks from 2026-04-23 E2E Progress Audit

This list is extracted from the audit report and includes only the remaining (not done) tasks as of the audit date.

## Priority P0 (Must Do Before Full Production Release)
- Extend the new persistent backend domain/store beyond the current file-backed baseline into production-grade storage and fulfillment assets
- Complete calendar synchronization and operational confirmation around the new booking APIs and scheduling flow
- Complete production Stripe go-live configuration and replace the temporary manual delivery artifact in the payment/order flow
- Extend auth/session/RBAC beyond the new seeded-admin JWT flow into subscriber/customer ownership and richer protected reads
- Harden the new public API abuse controls beyond the current in-memory rate limiting baseline

## Priority P1 (Strongly Recommended for MVP Stability)
- Expand observability from file-backed audit/analytics events into production error, latency, and integration monitoring
- Expand analytics instrumentation from backend conversion events into dashboards and broader funnel coverage
- Add browser e2e coverage on top of the new integration tests for contact, booking, checkout, and concierge

## Priority P2 (Quality and Scale)
- Add full regression test matrix and performance/accessibility gates
- Add production runbooks with rollback criteria and on-call playbook

## Sequential Phase Checklist (Remaining Only)

### Phase P2 Frontend Surface
- [x] Booking integrated flow
- [x] Live chat dedicated route
- [x] Admin interface routes

### Phase P3 Backend and API
- [x] Public read API contract surface (v1 services/portfolio/shop routes)
- [x] Conversion APIs (appointments/chat start/full contract parity)
- [~] Commerce APIs (orders, payment webhooks, fulfillment)
- [~] Subscriber and admin APIs with auth enforcement

### Phase P4 Security
- [~] Auth/session/RBAC implementation
- [~] Request validation and audit logs framework
- [~] Runtime env validation policy
- [x] Rate limit and abuse controls

### Phase P5 DevOps and Reliability
- [~] Production observability stack
- [x] Full infrastructure/runtime hardening

### Phase P6 QA and Release Gates
- [x] Unit tests
- [x] Integration/API tests
- [x] E2E tests
- [x] Accessibility/performance/security automation
- [x] Full release gate execution evidence

### Integration Checklist (Explicit)
- [~] Stripe
- [x] Sanity (blog CMS adapter integration with static fallback)
- [x] Supabase (auth + database adapter integration)
- [x] AI Growrix OS concierge (session persistence, rate limiting, analytics)
- [~] WhatsApp (full API integration if required)
- [~] Calendar booking integration
- [~] Analytics stack implementation
