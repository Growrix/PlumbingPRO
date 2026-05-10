# Security and Operations

## Purpose

This document establishes the operational and security baseline for Growrix OS. The platform handles user identities, payment events, private files, internal-only workflows, and customer communications, so operational discipline must exist from the first release.

## Environment Strategy

- Local for developer iteration.
- Staging for integrated testing and release verification.
- Production for live traffic.

Rules:

- Each environment must use separate Supabase projects and Stripe configuration where practical.
- Secrets must be isolated per environment.
- Staging should mirror production architecture closely enough to validate auth, webhooks, storage, and realtime behavior.

## Identity and Access Controls

- Clients authenticate through standard public login flows.
- Admins and developers are provisioned intentionally, not self-registered.
- Role checks must run in middleware, APIs, and database policies.
- All admin and developer actions should be attributable to a specific user identity.

## Row Level Security Baseline

- `users`: users can read and update only their own profile unless admin.
- `demo_requests`: clients see their own, developers see assigned, admins see all.
- `projects`: clients see own projects, developers see assigned projects, admins see all.
- `messages`: only project participants and admins can access.
- `project_backups`: restricted to owning client, assigned developer, and admins.
- `maintenance_requests`: restricted to owning client, assigned developer, and admins.
- `notifications`: each user reads only their own notifications.

## File Storage Controls

- Separate buckets or prefixes by asset class: logos, uploads, previews, final deliverables, backups.
- Enforce type and size validation before upload.
- Use signed URLs or secured delivery patterns for private assets.
- Do not expose raw internal storage paths when avoidable.

## Payment Operations

- Stripe webhook signature verification is mandatory.
- Payment side effects must be idempotent.
- Refund and failure paths must preserve a coherent request state.
- Payment logs should support reconciliation and debugging.

## Notification Operations

- Email delivery failures should be retried or surfaced for operational review.
- In-app notifications must not leak cross-tenant information.
- Realtime alerts should complement, not replace, durable notification records.

## Observability Baseline

- Error logging for server actions, APIs, webhook handlers, and scheduled jobs.
- Structured logs for queue updates, assignments, payments, and delivery completion.
- Alerting for repeated webhook failures, email failures, or queue corruption symptoms.

## Backup and Recovery

- Final project backups are stored as first-class records.
- Production database backup and recovery settings must be verified in Supabase.
- Restoration procedures for customer assets and project backups should be documented before scale.

## Incident Priorities

Severity 1:

- authorization breach
- payment corruption
- cross-tenant data exposure
- production outage on critical customer flows

Severity 2:

- delayed notifications
- degraded chat or realtime features
- upload failures affecting delivery work

## Operational Rules

- No production-only fixes without documenting the underlying cause.
- No schema changes without migration artifacts.
- No access control change without explicit RLS review.
- No feature release without testing the failure paths of its critical integrations.