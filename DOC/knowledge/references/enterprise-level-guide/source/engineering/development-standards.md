# Development Standards

## Purpose

This document defines the engineering standards that should govern implementation across frontend, backend, database, and operations.

## General Standards

- Follow the docs in `DOC/` as the default source of truth.
- Keep module boundaries explicit.
- Prefer small, testable domain services over large route handlers.
- Never rely on hidden routes as a security mechanism.
- Write code for auditability and maintainability, not just happy-path speed.

## Frontend Standards

- Separate public, client, admin, and developer experiences clearly.
- Keep page components thin and move business logic to reusable services or server actions.
- Use shared UI primitives for consistency, but keep business logic inside feature modules.
- Handle loading, empty, error, and reconnect states explicitly.
- Treat queue status, ETA, and payment state as server-owned truth.
- Follow the design system first: reuse existing primitives, shared shells, tokens, spacing, and interaction patterns before introducing new UI patterns.
- Do not hardcode design values, layout exceptions, or one-off styling when the design system or shared components should own them.
- For mobile work, build with app-like behavior in mind: strong bottom-safe spacing, clear tap targets, sheet-like interactions where appropriate, stable fixed controls, and layouts that feel intentional on phones rather than compressed desktop views.

## Backend Standards

- Centralize business logic in domain-oriented server modules.
- Validate all inputs.
- Enforce allowed status transitions explicitly.
- Make payment and notification handlers idempotent.
- Use structured errors and logs for critical flows.

## Database Standards

- Every table must have an owner module and access policy.
- Foreign keys and indexes are required for primary relationship paths.
- Queue mutations should occur in transactions or strongly consistent database routines.
- RLS must be designed alongside schema creation, not bolted on later.

## Security Standards

- Principle of least privilege across app, API, and database layers.
- Never expose service-role credentials to the client.
- Validate upload size and type before accepting files.
- Verify Stripe webhooks cryptographically.
- Prefer signed access patterns for private storage assets.

## Testing Standards

- Unit-test business rules with high branching risk.
- Integration-test auth, queue, payments, assignments, and maintenance workflows.
- End-to-end test the critical revenue and delivery journeys.
- Include failure-path tests for duplicate payments, unauthorized access, and queue recalculation.

## Documentation Standards

- Update docs when a business rule, schema, endpoint, or module boundary changes.
- Do not leave key architecture decisions only in tickets or chats.
- Capture new state transitions and side effects in the relevant docs.

## CMS Studio Standards

- Treat Sanity Studio or any similar CMS studio as a standalone app surface even when it lives in the same repository.
- Keep CMS studio runtime, lockfile, install flow, CI workflow, and deployment separate from the public site.
- Default to one approved Node major across the repo unless project docs explicitly justify an exception.
- Never couple root `postinstall`, root build, or root deploy flows to the CMS studio by default.
- Prefer a separate CMS domain such as `cms.<primary-domain>` for hosted Studio access.

## Code Review Standards

Reviewers should verify:

- business rule alignment
- authorization correctness
- data ownership clarity
- failure handling
- observability implications
- documentation updates where needed

## Definition of Done

A change is not done until:

- implementation is complete
- tests cover critical paths
- authorization has been validated
- docs are updated if the behavior changed
- monitoring or logs exist for critical production-impacting flows
- zero-gate pass confirmed: no unresolved build, type, lint, or test failures relevant to the change

## Recommended Initial Repo Conventions

- `app/` for route structure
- `features/` for business slices
- `components/` for shared presentation
- `lib/` for domain services and integrations
- `supabase/` for migrations, policies, and seed data
- `DOC/` for authoritative specifications