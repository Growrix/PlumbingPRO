# SPEC TEMPLATE: BACKEND

## PURPOSE
Emit this spec to describe every backend module: route handlers, services, repositories, and webhook handlers. One section per domain. Codegen agents consume this spec to produce actual code.

---

## DOMAIN: [DOMAIN_NAME]
*Repeat this section for each feature domain (auth, billing, posts, files, etc.)*

### Route Handlers

#### `[METHOD] /api/[path]`
```
file: src/app/api/[path]/route.ts
runtime: nodejs | edge
auth: required | none | signature
input_schema:
  body:
    - [field]: [type] — [description]
  params:
    - [param]: [type]
  query:
    - [param]: [type]
output_schema:
  200: { data: [TypeName] }
  400: { error: { code: "VALIDATION_ERROR", message: string } }
  401: { error: { code: "UNAUTHORIZED" } }
  [other status codes as needed]
rate_limited: true | false
service_call: services.[domain].[method]
```

---

### Services

#### `services.[domain].[methodName]`
```
file: src/server/services/[domain].ts
input:
  - [param]: [type]
output: Promise<[ReturnType]>
dependencies:
  - repositories.[domain]
  - lib/[integration]
  - services/[other] (if applicable)
error_types:
  - NotFoundError (if resource lookup)
  - UnauthorizedError (if ownership check)
  - [other typed errors]
side_effects:
  - [e.g., emits Inngest event "entity.created"]
  - [e.g., sends email via services.email.send]
```

---

### Repositories

#### `repositories.[domain].[methodName]`
```
file: src/server/repositories/[domain].ts
input:
  - [param]: [type]
output: Promise<[PrismaType | DomainType]>
query:
  model: [PrismaModel]
  operation: findFirst | findMany | create | update | upsert | delete
  where: { [field]: [value], [tenant_scope]: [userId/orgId] }
  select: { [field]: true, ... }
  take: [N] (for list queries)
  orderBy: { [field]: "desc" }
```

---

### Webhook Handlers

#### `POST /api/webhooks/[provider]`
```
file: src/app/api/webhooks/[provider]/route.ts
signature_verification:
  method: [e.g., stripe.webhooks.constructEvent | Svix.verify]
  header: [e.g., Stripe-Signature | svix-signature]
  secret_env: [e.g., STRIPE_WEBHOOK_SECRET]
idempotency:
  key_field: [e.g., event.id]
  storage: upstash_redis | db_event_log
events_handled:
  - event_type: [e.g., checkout.session.completed]
    action: [what happens]
    service_call: services.[domain].[method]
  - event_type: [next event]
    action: [what happens]
response:
  success: 200 ""
  signature_failure: 400 "Invalid signature"
  duplicate: 200 "Already processed"
```

---

### Background Job Functions (Inngest)

#### `[function-slug]`
```
file: src/inngest/functions/[name].ts
trigger:
  type: event | cron
  event_name: "[domain].[action]" (if event)
  cron_schedule: "0 0 * * *" (if cron)
steps:
  - name: "[step-name]"
    operation: [what it does]
    retries: [N]
idempotent_by: [e.g., event.data.userId + event.data.orderId]
side_effects:
  - [e.g., sends email]
  - [e.g., updates DB record]
```

---

## INTEGRATION CLIENT MODULES

| Integration | File | Exported As |
|-------------|------|------------|
| database | src/server/db/client.ts | `prisma` |
| clerk | src/lib/clerk.ts | `clerkClient` |
| stripe | src/lib/stripe.ts | `stripe` |
| openai | src/lib/openai.ts | `openai` |
| [others] | src/lib/[name].ts | `[name]Client` |
