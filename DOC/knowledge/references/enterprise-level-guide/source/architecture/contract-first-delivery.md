# Contract-First Delivery

## Purpose

This document defines how an enterprise SaaS system should be planned and built so frontend, backend, data, integrations, and operations stay aligned.

The primary goal is to prevent delivery drift when AI or humans build the system incrementally.

## Why This Exists

- Frontend-first implementation is safe only for static or contract-stable flows.
- Backend-first implementation is safe only when product and UX expectations are already explicit.
- Enterprise delivery requires a shared contract layer before either side starts inventing fields, states, permissions, or integrations.

## Canonical Source Of Truth Order

1. `DOC/Universal/Enterprise Level Guide/ai/ai-context.yaml`
2. product requirements
3. this contract-first delivery document
4. system architecture and module boundaries
5. data model and API design
6. frontend and backend handbooks
7. quality, operations, and deployment guides

If any lower-level document conflicts with a higher-level source, treat the higher-level source as authoritative until the inconsistency is resolved.

## Required Contracts Before Build

Before implementation begins for any non-trivial feature, define these contracts explicitly:

- surface contract: which surface owns the feature and which roles can access it
- route contract: canonical routes, entry points, and deep-link rules
- domain contract: entities, ownership, lifecycle states, and allowed transitions
- API contract: request, response, error model, auth expectation, pagination, idempotency
- data contract: storage model, keys, relations, retention, migration impact
- integration contract: external providers, webhook/event model, retries, reconciliation
- state contract: loading, empty, success, error, reconnect, permission-denied behavior
- observability contract: logs, metrics, alerts, correlation identifiers, auditability
- testing contract: unit, integration, contract, and end-to-end expectations

## Build Order Rules

1. Lock core invariants, role model, and surface boundaries.
2. Lock domain states, API contracts, and integration boundaries.
3. Define data ownership, authorization, and failure behavior.
4. Build the smallest coherent vertical slice.
5. Expand adjacent flows only after contract compatibility is verified.

Avoid building disconnected frontend shells and disconnected backend services in separate planning tracks.

## Frontend-First Policy

Frontend-first work is allowed when one of these conditions is true:

- the surface is static or mostly content-driven
- the underlying domain contract is already documented
- temporary mocks are derived from documented contracts instead of invented shapes

Frontend-first work is not allowed to:

- invent new lifecycle states
- invent hidden role permissions
- invent undocumented payload fields
- assume payment, auth, storage, or queue side effects

If backend planning is incomplete, the frontend plan must produce an explicit assumptions ledger and dependency list instead of silently hardcoding behavior.

## Backend-First Policy

Backend-first work is allowed when domain rules are already clear and the user experience will consume a stable contract.

Backend-first work is not allowed to:

- publish APIs without role, error, and status modeling
- ship undocumented webhook or provider coupling
- create schema changes without migration and rollback thinking

## Shared Change Protocol

When a contract changes:

1. update the contract docs first or in the same change set
2. update affected API, schema, and state references
3. update frontend and backend plans that consume the contract
4. update tests for changed behavior
5. note migration, rollout, and rollback implications

## Anti-Drift Rules

- One canonical name per entity, state, and route.
- One documented owner per workflow.
- One documented source of truth per business state.
- No duplicate status models with different semantics.
- No integration side effect should exist only in UI text or only in backend code comments.

## AI Collaboration Rules

- Start from `DOC/Universal/Enterprise Level Guide/ai/ai-context.yaml` and follow the correct `read_paths` entry.
- If a required contract is missing, generate the missing contract doc before generating implementation details.
- When requirements are incomplete, record assumptions in a dedicated assumptions section.
- Prefer vertical slices with complete contracts over wide but shallow planning.

## Exit Condition

This contract layer is considered sufficient when a frontend planner, backend planner, QA planner, and ops planner can all read the same source set and derive compatible implementation decisions.