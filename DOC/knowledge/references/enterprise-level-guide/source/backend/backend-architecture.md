# Backend Architecture

## Purpose

This document defines the backend architecture for Growrix OS. It translates the platform model into server-side boundaries, integration strategy, and operational expectations.

## Backend Mission

The backend is the system of authority for authentication, authorization, queue integrity, assignment logic, payment reconciliation, maintenance coverage, file access, and notification fan-out.

## Backend Layers

### Interface Layer

- Next.js route handlers
- server actions where appropriate
- Stripe and third-party webhooks
- scheduled jobs and background handlers

### Domain Layer

- auth and permissions
- queue and batches
- demo requests
- projects and assignments
- payments
- chat and notifications
- shop and gallery
- maintenance
- AI assistant orchestration

### Persistence Layer

- Supabase Postgres
- Supabase Storage
- RLS-backed access model
- optional queue-safe SQL functions or transactional routines

### Integration Layer

- Stripe
- email provider
- Google Business Profile
- AI provider

## Architectural Rules

- Domain rules must not live only inside route handlers.
- Every critical state transition must be validated by the domain layer.
- Data access should follow module ownership, not convenience imports.
- External side effects should happen after durable state changes when possible.
- Retryable integrations must be idempotent.

## Service Boundaries

- `auth service` owns role-aware identity and access checks.
- `queue service` owns position, ETA, capacity, priority ordering, and cancellation effects.
- `assignment service` owns mapping work to developers and project creation.
- `payments service` owns Stripe session creation, verification, and reconciliation.
- `delivery service` owns deliverables, backups, delivery completion, and maintenance start.
- `notification service` owns email, in-app, and realtime fan-out.

## Data Authority Rules

- Queue position and ETA are server-owned.
- Payment status is server-owned and webhook-confirmed.
- Public visibility of demos, shop items, and reviews is explicitly persisted.
- File access decisions must be enforced server-side.

## Backend Definition of Done

- business rule logic exists in an owned service layer
- authorization is explicit and testable
- integration failures have recovery or retry paths
- side effects are observable
- docs align with the implemented contract