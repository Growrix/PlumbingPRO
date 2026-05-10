# API Design

## Purpose

This document defines the standards for Growrix OS APIs. It covers route design, auth, request and response shape, webhook handling, realtime contracts, and module-specific endpoint groups.

## API Style

- Use REST-style HTTP endpoints for primary application workflows.
- Keep route groups aligned with product modules and user roles.
- Place public, client, developer, and admin operations into clearly separated namespaces.
- Keep mutation endpoints server-authoritative. Do not rely on client-only state transitions.

## Authentication and Authorization

- Public endpoints may be anonymous where required.
- Client endpoints require an authenticated client session.
- Developer endpoints require authenticated `developer` role.
- Admin endpoints require authenticated `admin` role.
- Authorization must be enforced in the API layer and by underlying RLS policies.

## Response Conventions

### Success

Use predictable JSON envelopes for non-trivial endpoints:

```json
{
  "data": {},
  "meta": {}
}
```

### Error

Standardize errors around a stable shape:

```json
{
  "error": {
    "code": "QUEUE_BATCH_FULL",
    "message": "No active slots are available in the current batch.",
    "details": {}
  }
}
```

## API Rules

- Every mutation should validate input at the API boundary.
- Every role-restricted endpoint should fail closed.
- Use idempotency where duplicate external calls are possible.
- Pagination is required for list endpoints that can grow materially.
- Avoid leaking internal-only fields to public or client-facing responses.

## Recommended Endpoint Groups

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/admin-login`
- `POST /api/auth/dev-login`

### Demo Requests and Queue

- `POST /api/demo-request`
- `GET /api/batch-status`
- `GET /api/client/demo-requests`
- `GET /api/client/queue-status`
- `PATCH /api/admin/demo-requests/:id/assign`
- `PATCH /api/admin/demo-requests/:id/status`
- `GET /api/admin/batches`
- `POST /api/admin/batches`

### Payments

- `POST /api/payments/create-session`
- `POST /api/stripe/webhook`

### Projects and Assignments

- `GET /api/developer/projects`
- `GET /api/client/projects`
- `PATCH /api/developer/projects/:id/status`
- `PATCH /api/admin/projects/:id/status`

### Messages

- `GET /api/messages/:project_id`
- `POST /api/messages`

### Shop

- `GET /api/shop`
- `GET /api/shop/:id`
- `POST /api/shop/order`
- `PATCH /api/admin/shop/:id`
- `PATCH /api/admin/shop-orders/:id`

### Demo Gallery

- `GET /api/demo-gallery`
- `POST /api/admin/demo-gallery`
- `PATCH /api/admin/demo-gallery/:id`
- `DELETE /api/admin/demo-gallery/:id`

### Maintenance

- `GET /api/client/maintenance-contracts`
- `POST /api/client/maintenance-request`
- `GET /api/admin/maintenance-requests`
- `PATCH /api/admin/maintenance-requests/:id`
- `PATCH /api/developer/maintenance-requests/:id/status`

### Notifications

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

### AI Assistant

- `POST /api/ai/ask`
- `POST /api/ai/ask-dashboard`

### Reviews

- `GET /api/reviews`
- `POST /api/admin/reviews/feature`

## Webhook Rules

- Webhooks must verify provider signatures before any processing.
- Webhook handlers must be idempotent.
- Webhook side effects should write durable records before dispatching non-critical follow-up work.
- Stripe events must be correlated by `stripe_session_id` or `stripe_payment_intent`.

## Realtime Contracts

Primary realtime use cases:

- project-scoped chat messages
- queue updates for affected clients
- in-app notifications

Rules:

- Realtime topics must be scoped by entity ownership.
- The database remains the source of truth.
- The UI must support reconnect and refetch behavior.

## Recommended Validation Rules

- Form payloads should use schema validation.
- File upload metadata should be validated before issuing upload permissions.
- Enum-like fields should reject unknown values.
- Admin and developer assignment actions must validate target existence and allowed transition state.

## Versioning Guidance

- Start with a single internal version.
- Avoid premature versioning unless public API consumers emerge.
- If behavior changes in a breaking way, update the docs and add compatibility handling before rollout.