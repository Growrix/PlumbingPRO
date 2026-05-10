# Testing Strategy

## Purpose

This document defines the end-to-end testing approach for Growrix OS. The platform includes sensitive workflows around roles, payments, queue ordering, delivery, files, and maintenance, so testing must protect business rules instead of only UI behavior.

For the strict quality gate sequence used by AI and delivery workflows, also follow:

- [enterprise-testing-and-quality-enforcement-v2.md](enterprise-testing-and-quality-enforcement-v2.md)

## Testing Principles

- Test business-critical flows before convenience features.
- Test both happy paths and failure paths.
- Prefer deterministic tests around queue and payment logic.
- Keep module ownership visible in the test suite.

## Required Test Layers

### Unit Tests

Required for:

- queue ordering and ETA calculation
- status transition guards
- payment reconciliation helpers
- maintenance eligibility checks
- authorization decision helpers

### Integration Tests

Required for:

- auth and role-restricted APIs
- RLS-sensitive data access paths
- assignment workflows
- Stripe webhook handling
- file upload authorization
- maintenance ticket creation and updates

### End-to-End Tests

Required for:

- visitor submits a demo request
- visitor upgrades to priority and payment success updates the system
- admin assigns work to a developer
- developer delivers preview or final work
- client reviews, downloads, and raises maintenance requests

### Contract Tests

Required where external integrations or API contracts have high blast radius:

- Stripe webhook payload handling
- email event fan-out boundaries
- AI endpoint request and response envelope behavior

## Test Data Standards

- Use seeded fixtures for admins, clients, developers, demo requests, and projects.
- Keep priority and non-priority cases separate.
- Include edge-case fixtures for full batches, cancelled requests, expired maintenance, and missing permissions.

## High-Risk Test Scenarios

- duplicate Stripe webhook events
- unauthorized access to hidden dashboards
- developer attempts to access non-assigned project data
- queue recalculation after cancellation or delivery
- file delivery links accessed by non-owners
- maintenance request after coverage expiry

## Coverage Expectations

- Critical domain services require direct unit or integration coverage.
- Every production incident in a critical workflow should result in a regression test.
- New statuses, roles, or side effects are not complete without updated tests.

## AI and Testing Rule

AI-generated features must include tests for critical logic, not only code scaffolding.