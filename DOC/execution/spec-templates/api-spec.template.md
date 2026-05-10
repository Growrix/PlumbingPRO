# SPEC TEMPLATE: API

## PURPOSE
Emit this spec to describe every public and internal API endpoint. Used by codegen agents to produce route handlers and by the reviewer to validate completeness. Can also be used as the source for OpenAPI generation.

---

## API OVERVIEW
```
base_url: https://[domain]
versioning: url_prefix (/api/v1) | none (internal only)
authentication: clerk_session | api_key | signature_only | none
response_format: { "data": <payload> } | { "error": { "code", "message" } }
rate_limiting: upstash_ratelimit (sliding_window)
```

---

## ENDPOINT: [METHOD] [/path]
*Repeat this block for each API endpoint.*

```
method: GET | POST | PUT | PATCH | DELETE
path: /api/[resource]/[action]
file: src/app/api/[resource]/route.ts
runtime: nodejs | edge
auth:
  type: clerk_session | api_key | webhook_signature | none
  scope: user | admin | public

input:
  body:
    schema: [ZodSchemaName] from src/lib/schemas/[domain].ts
    fields:
      - [field]: [type] — required | optional — [description]
  params:
    - [param]: [type] — [description]
  query:
    - [param]: [type] — optional — [description]
  max_body_size: 1mb | [other]

output:
  200:
    schema: { data: [TypeName] }
    example: { "data": { "id": "abc", ... } }
  201:
    schema: { data: [TypeName] }
  204: empty body
  400:
    schema: { error: { code: "VALIDATION_ERROR", message: string, fields?: Record<string, string[]> } }
  401:
    schema: { error: { code: "UNAUTHORIZED", message: "Authentication required" } }
  403:
    schema: { error: { code: "FORBIDDEN", message: "Insufficient permissions" } }
  404:
    schema: { error: { code: "NOT_FOUND", message: "Resource not found" } }
  409:
    schema: { error: { code: "CONFLICT", message: "Resource already exists" } }
  429:
    schema: { error: { code: "RATE_LIMITED", message: "Too many requests" } }
    headers:
      Retry-After: [seconds]
  500:
    schema: { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } }

rate_limit:
  enabled: true | false
  key: "api:[userId]" | "api_key:[keyId]" | [custom]
  window: 60 | [seconds]
  limit: [N]

service_call: services.[domain].[method]([input])
side_effects:
  - [e.g., emits Inngest event]
  - [e.g., sends email]
idempotent: true | false
idempotency_key_header: Idempotency-Key | none
```

---

## WEBHOOK ENDPOINTS

```
method: POST
path: /api/webhooks/[provider]
provider: stripe | clerk | resend | uploadthing
auth: signature_only
signature_header: [e.g., Stripe-Signature]
verification_method: [e.g., stripe.webhooks.constructEvent]
raw_body_required: true
events:
  - name: [event.type]
    description: [what it does]
idempotent: true
idempotency_field: [e.g., event.id]
```

---

## API ENDPOINT SUMMARY TABLE

| Method | Path | Auth | Rate Limited | Service |
|--------|------|------|-------------|---------|
| GET | /api/health | none | no | health.check |
| POST | /api/conversations | session | yes | conversations.create |
| GET | /api/conversations | session | yes | conversations.findMany |
| POST | /api/webhooks/stripe | signature | no | billing.handleWebhook |
| POST | /api/webhooks/clerk | signature | no | users.handleWebhook |
| POST | /api/inngest | signing_key | no | — (Inngest handler) |
| [add rows] | | | | |
