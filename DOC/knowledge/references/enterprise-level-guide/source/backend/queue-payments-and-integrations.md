# Queue, Payments, and External Integrations

## Purpose

This document defines the most critical backend rules in Growrix OS: queue integrity, priority payments, and third-party integration safety.

## Queue Integrity Rules

- Batch capacity is enforced server-side.
- Queue position and ETA must be derived deterministically.
- Priority promotion must preserve auditability and avoid race conditions.
- Cancellation, assignment, and completion must trigger consistent recalculation rules.

## Priority Payment Rules

- Priority status is granted only after confirmed payment processing.
- Stripe webhook verification is mandatory.
- Payment processing must be idempotent against duplicate events.
- A failed payment must leave the demo request in the normal queue.

## Assignment Interaction Rules

- Priority does not imply auto-assignment to a developer without admin action unless a future spec explicitly changes that policy.
- Admin remains responsible for final assignment decisions.

## Integration Safety Pattern

For each external provider:

- validate incoming signatures or tokens
- normalize payloads into internal service calls
- persist authoritative records before non-critical follow-up actions
- log correlation identifiers
- implement retry or dead-letter behavior for failures where appropriate

## Stripe Handling Standards

- Create checkout sessions from validated internal records only.
- Store Stripe session and payment identifiers.
- Handle `checkout.session.completed` idempotently.
- Treat refunds and charge disputes as explicit reconciliation states.

## Email and Notification Integration Standards

- Notification send failures must not corrupt the underlying business state.
- User-visible status must not depend on email delivery success.

## Google and AI Integrations

- Google review sync should cache external records rather than depend on live reads for public pages.
- AI assistant calls must observe data access limits and avoid privileged action execution.