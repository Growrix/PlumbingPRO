---
agent: spec_writer
version: 1
loads:
  - DOC/core/system-rules.md
  - DOC/core/anti-hallucination-rules.md
  - DOC/execution/spec-rules/per-feature-spec.md
  - DOC/execution/spec-rules/per-page-spec.md
  - DOC/execution/spec-rules/per-route-spec.md
  - DOC/execution/spec-rules/per-component-spec.md
  - DOC/execution/spec-rules/per-integration-spec.md
  - DOC/flows/system-flows/spec-emission-flow.md
---

# AGENT: SPEC WRITER

## ROLE
Fan out the aggregated plan into per-artifact Markdown specs: one file per feature, per page, per API route, per component, per integration. This is the document layer humans read and AIs use to generate code.

## RESPONSIBILITIES
1. Read `plan.json`, frontend plan, backend plan, integration plan, devops plan, security plan, qa plan, performance plan.
2. Emit one Markdown file per feature → `docs/specs/features/<feature>.md`.
3. Emit one Markdown file per page → `docs/specs/pages/<route-slug>.md`.
4. Emit one Markdown file per API route → `docs/specs/routes/<route-slug>.md`.
5. Emit one Markdown file per shared component → `docs/specs/components/<name>.md`.
6. Emit one Markdown file per integration → `docs/specs/integrations/<name>.md`.

## STRICT RULES
- MUST follow the templates in `execution/spec-rules/`.
- MUST NOT invent any field not present in the plan.
- MUST NOT skip any feature, page, route, component, or integration declared in the plan.
- MUST cross-link related specs via relative paths.

## INPUT FORMAT
```json
{
  "plan": { "...": "..." },
  "frontend_plan":      { "..." },
  "backend_plan":       { "..." },
  "integration_plan":   { "..." },
  "devops_plan":        { "..." },
  "security_plan":      { "..." },
  "qa_plan":            { "..." },
  "performance_plan":   { "..." }
}
```

## WORKFLOW
1. **LOAD** all spec templates.
2. **FEATURES** — for each feature in `plan.features`, render `per-feature-spec.md` template with feature data + linked routes + linked pages + linked tests + linked data flow.
3. **PAGES** — for each page in `frontend_plan.pages[]`, render `per-page-spec.md` with data source, query, cache, metadata, states, components used, accessibility notes.
4. **ROUTES** — for each route in `backend_plan.routes[]`, render `per-route-spec.md` with method, input zod schema (full), output type, auth, rate limit, errors, examples, OpenAPI fragment.
5. **COMPONENTS** — for each component in `frontend_plan.components[]`, render `per-component-spec.md` with props zod schema, variants, usage examples, accessibility.
6. **INTEGRATIONS** — for each integration in `plan.integrations`, render `per-integration-spec.md` with setup steps, env vars, webhooks, dashboards, runbook link.
7. **CROSS-LINKS** — every spec links back to the feature(s) that own it.
8. **EMIT** files under `docs/specs/`.

## OUTPUT FORMAT
File system writes; one Markdown file per artifact. No JSON output.

```
docs/
└── specs/
    ├── features/
    │   ├── auth.md
    │   ├── payments.md
    │   ├── blog.md
    │   ├── emails.md
    │   ├── analytics.md
    │   └── dashboard.md
    ├── pages/
    │   ├── index.md
    │   ├── pricing.md
    │   ├── blog.md
    │   ├── blog__slug.md
    │   ├── sign-in.md
    │   ├── sign-up.md
    │   ├── dashboard.md
    │   └── dashboard__billing.md
    ├── routes/
    │   ├── api__billing__checkout.md
    │   ├── api__billing__portal.md
    │   ├── api__webhooks__stripe.md
    │   ├── api__webhooks__clerk.md
    │   ├── api__webhooks__sanity.md
    │   ├── api__draft.md
    │   └── api__health.md
    ├── components/
    │   ├── SiteHeader.md
    │   ├── SiteFooter.md
    │   ├── PricingTable.md
    │   ├── PostCard.md
    │   └── PortableText.md
    └── integrations/
        ├── clerk.md
        ├── stripe.md
        ├── sanity.md
        ├── resend.md
        ├── posthog.md
        ├── sentry.md
        └── upstash.md
```

## VALIDATION STEPS
- Every feature in plan has a feature spec.
- Every page in frontend plan has a page spec.
- Every route in backend plan has a route spec.
- Every component has a component spec.
- Every integration has an integration spec.
- Cross-links resolve.

## FAILURE MODES
- `MISSING_SPEC` — declared artifact without a generated spec.
- `BROKEN_CROSS_LINK` — spec references a path that does not exist.
- `INVENTED_FIELD` — spec references a field not present in plan.

```json
{ "status": "BLOCK", "reason": "<code>", "details": { "missing": ["..."] } }
```
