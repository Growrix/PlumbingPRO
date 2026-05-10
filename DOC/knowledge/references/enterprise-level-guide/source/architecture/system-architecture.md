# System Architecture

## Architecture Goal

Growrix OS should be built as a modular SaaS platform with strong security boundaries, reliable queue integrity, auditable business flows, and a clear separation between public marketing surfaces and restricted operational dashboards.

## Target Architecture

### Experience Layer

- Public website for marketing, demo requests, demo wall, shop, reviews, and Ask Growi.
- Client dashboard for project visibility, chat, uploads, downloads, approvals, and maintenance.
- Admin dashboard for internal control and oversight.
- Developer dashboard for execution and delivery.

### Application Layer

- Next.js application routes and server actions for UI orchestration.
- Backend API layer for REST endpoints, Stripe webhooks, AI endpoints, and internal admin workflows.
- Realtime messaging and event subscriptions through Supabase Realtime.
- Background or scheduled processes for review syncs, notification retries, and maintenance reminders.

### Data Layer

- Supabase Postgres as the transactional system of record.
- Supabase Storage for uploads, deliverables, thumbnails, and backups.
- Auth and JWT-based session handling through Supabase Auth.
- Optional vector storage for AI FAQ retrieval when needed.

### Integration Layer

- Stripe for payments and payment webhooks.
- Email provider such as Postmark or MailerSend.
- OpenAI-compatible provider for Ask Growi.
- Google Business Profile API for review synchronization.

## Logical Domain Boundaries

- Identity and Access
- Demo Intake and Queue
- Payments and Priority
- Delivery Workspaces
- Public Showcase and Shop
- Maintenance and Support
- AI Assistant
- Reviews and Notifications

Each domain must own its core rules, state machine, and source-of-truth tables. Cross-domain communication should happen through explicit service functions or events, not through ad hoc direct coupling.

## Deployment Model

- Frontend deployment on Vercel.
- Supabase cloud for database, storage, auth, and realtime.
- Environment tiers: local, staging, production.
- Secrets managed per environment, never embedded in client code.

## Security Boundaries

- Public routes serve anonymous and authenticated clients.
- Admin routes require `admin` role and must be enforced by middleware and backend authorization.
- Developer routes require `developer` role and must be enforced by middleware and backend authorization.
- Database RLS policies must align with the role model and protect every table.
- Hidden routes improve UX separation but never replace authorization.

## Cross-Cutting Concerns

### Queue Integrity

- Position calculations must be deterministic.
- Priority promotion must be idempotent.
- Status transitions must be auditable.
- Cancellation and completion should trigger queue recalculation safely.

### Traceability

- Every critical state change must produce an audit trail or timestamped event.
- Payment updates must capture Stripe identifiers.
- File uploads must be linked to an owning entity and actor.

### Realtime Reliability

- Realtime chat and notifications must degrade safely.
- The UI should support reconnect and message retry flows.
- Server persistence is authoritative even when the client is offline.

### Privacy and Least Privilege

- Clients can see only their own requests, projects, tickets, and notifications.
- Developers can see only assigned work.
- Admins can view all business data but must still follow scoped actions in UI and APIs.

## Recommended Codebase Shape

The implementation should evolve toward a structure similar to the following:

```text
app/
  (marketing)/
  (client)/dashboard/
  growrix-admin/
  growrix-team/
  api/
components/
features/
lib/
  auth/
  queue/
  payments/
  chat/
  notifications/
  ai/
  reviews/
supabase/
  migrations/
  policies/
DOC/
.github/
```

## Non-Functional Requirements

### Security

- RLS on all business tables.
- Signed URLs or secure access patterns for file delivery.
- Webhook signature validation.
- Strict server-side authorization for every admin and developer action.

### Performance

- Public gallery and shop must support pagination or infinite scroll.
- Images should be optimized and cached.
- Queue lookups and dashboard queries must avoid N+1 query patterns.

### Operability

- Every environment must be reproducible.
- Failed jobs, email sends, and webhook processing must be retryable.
- Production must have error logging and basic performance telemetry.

### Scalability

- Modules should remain decoupled enough to grow independently.
- The database should use indexed foreign keys and lifecycle fields.
- Notifications and reminders should support async processing rather than blocking user flows.

## Architectural Rules

- Business rules belong in server-side domain services, not only in UI code.
- Database constraints and RLS policies must backstop application logic.
- Status enums must be defined and reused consistently across the codebase.
- Public content exposure requires explicit approval flags.
- Payments, queue promotion, and assignment logic must be idempotent and testable.