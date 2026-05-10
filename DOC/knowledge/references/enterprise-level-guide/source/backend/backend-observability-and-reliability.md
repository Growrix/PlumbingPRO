# Backend Observability and Reliability

## Purpose

This document defines backend reliability expectations, logging standards, and operational visibility requirements.

## Reliability Principles

- Critical workflows must be observable.
- Recovery paths must exist for external integration failures.
- Data correctness outranks silent success.

## What Must Be Logged

- demo request creation
- queue recalculation events
- assignment actions
- Stripe webhook processing results
- delivery completion side effects
- maintenance contract creation
- failed authorization attempts where security relevance exists

## Logging Standards

- Use structured logs.
- Include correlation identifiers where available.
- Avoid logging secrets, raw payment data, or private message content.
- Log business outcomes, not just technical exceptions.

## Monitoring Focus Areas

- webhook failure rate
- queue corruption symptoms
- failed uploads
- notification failure rate
- auth and RLS denial anomalies
- elevated error rates on core dashboard flows

## Reliability Patterns

- Use retries for transient integration failures.
- Use idempotency for external callbacks.
- Separate durable writes from best-effort fan-out.
- Prefer compensating actions over silent inconsistency.

## Operational Severity Guidance

Severity 1:

- cross-tenant data exposure
- payment state corruption
- queue ordering corruption in production

Severity 2:

- chat delays
- email failures with durable in-app fallback
- partial dashboard degradation

## Release Readiness Rule

No critical revenue, assignment, payment, or delivery workflow should ship without enough logs and metrics to diagnose failure in production.