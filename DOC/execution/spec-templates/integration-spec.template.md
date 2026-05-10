# SPEC TEMPLATE: INTEGRATION

## PURPOSE
Emit this spec for every integration declared in the plan. It documents how the integration is wired into the app: client setup, service functions, webhooks, env vars, and dashboard configuration. Codegen agents use this to produce all integration-related files.

---

## INTEGRATION: [INTEGRATION_NAME]

**Rule File:** `knowledge/integration-rules/[name].yaml`
**Category:** auth | payments | cms | emails | analytics | ai_llm | background_jobs | cache_and_rate_limit | file_storage | search | error_tracking | logging
**Package(s):** `[npm package name(s)]`

---

### ENV VARS

| Variable | Scope | Value Source | Description |
|----------|-------|-------------|-------------|
| [VAR_NAME] | server | Vercel env | [description] |
| NEXT_PUBLIC_[VAR_NAME] | client | Vercel env | [description] |

---

### CLIENT MODULE

```
file: src/lib/[integration].ts
exported_as: [clientName]
singleton: true
initialization:
  - [e.g., new Stripe(process.env.STRIPE_SECRET_KEY)]
  - [dependencies: env.STRIPE_SECRET_KEY from src/env.ts]
```

---

### SERVICE MODULE

```
file: src/server/services/[integration].ts
functions:
  - [functionName]({ [params] }): Promise<[ReturnType]>
    description: [what it does]
    calls: [integration].client.[method]
    side_effects: [list or none]

  - [functionName]({ [params] }): Promise<[ReturnType]>
    description: [what it does]
```

---

### WEBHOOK HANDLER (if applicable)

```
route_file: src/app/api/webhooks/[provider]/route.ts
endpoint: /api/webhooks/[provider]
signature_verification:
  header: [header name]
  method: [library method]
  secret_env: [ENV_VAR_NAME]
events:
  - [event.type]: [what the handler does]
  - [event.type]: [what the handler does]
idempotency_key: [field path in event object]
```

---

### REQUIRED DB TABLES (if applicable)

```
tables:
  - name: [table_name]
    purpose: [why this integration needs this table]
    key_columns: [list key columns]
```

---

### REACT COMPONENTS (frontend, if applicable)

```
components:
  - name: [ComponentName]
    file: src/components/[path].tsx
    type: client_component | server_component
    description: [what it renders]
```

---

### SETUP STEPS (ordered)

1. [Step from integration rule setup_steps]
2. [Step 2]
3. ...

---

### DASHBOARD CONFIGURATION

Actions required in the external provider dashboard:
- [ ] [e.g., "Create webhook endpoint in Stripe dashboard pointing to /api/webhooks/stripe"]
- [ ] [e.g., "Verify sending domain in Resend dashboard"]
- [ ] [e.g., "Configure Clerk redirect URLs"]

---

### CONSTRAINTS APPLIED

From `knowledge/integration-rules/[name].yaml` constraints:
- [ ] [constraint 1]
- [ ] [constraint 2]

---

### BEST PRACTICES APPLIED

From `knowledge/integration-rules/[name].yaml` best_practices:
- [ ] [best practice 1]
- [ ] [best practice 2]

---

### KNOWN FAILURE MODES

From `knowledge/integration-rules/[name].yaml` common_failures:
- [failure_mode]: [mitigation applied in this plan]
