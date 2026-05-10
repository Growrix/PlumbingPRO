# Integration Rules — Index

This is the master role + tier matrix for the agentic SaaS build OS integration catalog.
The `integration_planner` loads this file to resolve which YAML to use for each role.

## How the catalog is organized

```
integration-rules/
  _index.md             ← this file (role matrix + tier mapping)
  _schema.md            ← required YAML fields for every integration file
  _meta/
    role-matrix.json    ← machine-readable version of the table below
  <category>/
    <name>.yaml         ← one file per integration
```

A **role** is the functional slot (e.g., `auth`, `payments`, `cms`).  
A **tier** is the minimum complexity band where this role is activated.  
The **default** is the deterministic pick; the **alternatives** are fallbacks.

---

## Role Matrix

| Role | Category | Tier | Default | Alternatives |
|---|---|---|---|---|
| hosting | infra | basic | vercel | netlify, cloudflare-pages |
| dns | infra | basic | cloudflare-dns | route53 |
| email_transactional | email | basic | resend | postmark, sendgrid |
| analytics | analytics | basic | posthog | plausible, vercel-analytics |
| error_tracking | observability | basic | sentry | bugsnag, rollbar |
| logging | observability | basic | axiom | betterstack-logs, datadog-logs |
| cms | cms | basic | sanity | contentful, payload |
| spam_guard | security | basic | cloudflare-turnstile | hcaptcha |
| cookie_consent | compliance | basic | cookiebot | osano |
| auth | auth | standard | clerk | workos, supabase-auth |
| database | database | standard | neon-postgres | supabase, vercel-postgres |
| orm | database | standard | prisma | drizzle |
| payments | payments | standard | stripe | paddle, lemonsqueezy |
| tax | payments | standard | stripe-tax | taxjar |
| file_storage | storage | standard | uploadthing | r2, s3 |
| background_jobs | jobs | standard | inngest | trigger-dev |
| cache_and_rate_limit | cache | standard | upstash | redis-cloud |
| search | search | standard | meilisearch | algolia, typesense |
| email_marketing | email | standard | loops | convertkit, customerio |
| notifications | notifications | standard | knock | novu |
| sms | communications | standard | twilio | vonage |
| whatsapp | communications | standard | twilio-whatsapp | 360dialog |
| booking | booking | standard | calcom | calendly |
| maps | maps | standard | mapbox | google-maps |
| geocoding | maps | standard | mapbox-search | google-places |
| ai_llm | ai | standard | openai | anthropic, gemini |
| status_page | observability | standard | betterstack-status | instatus, statuspage |
| uptime_monitoring | observability | standard | betterstack-uptime | uptimerobot |
| sso_saml | auth | advanced | workos | okta, workos-sso |
| audit_logs | auth | advanced | workos-audit-logs | native-audit-table |
| compliance_automation | compliance | advanced | vanta | drata, secureframe |
| rbac_service | auth | advanced | permit-io | casbin |
| feature_flags | analytics | advanced | posthog | statsig, growthbook |
| session_replay | analytics | advanced | posthog | fullstory |
| cdp | analytics | advanced | segment | rudderstack, mixpanel |
| crm_marketing | crm | advanced | customerio | braze |
| crm_sales | crm | advanced | hubspot | attio, pipedrive |
| knowledge_base | support | advanced | mintlify | helpscout, zendesk, intercom, plain |
| voc_roadmap | feedback | advanced | canny | productboard, featurebase |
| onboarding_tours | onboarding | advanced | userflow | appcues |
| surveys_nps | feedback | advanced | sprig | delighted |
| ai_llm_advanced | ai | advanced | openai+anthropic | gemini, vercel-ai-sdk |
| vector_db | ai | advanced | turbopuffer | pinecone, pgvector |
| llm_observability | ai | advanced | langfuse | helicone, langsmith |
| ai_cost_tracking | ai | advanced | helicone | custom-table |
| i18n_cms | cms | advanced | lokalise | crowdin |
| fraud_protection | security | advanced | stripe-radar | hcaptcha-enterprise |
| synthetic_monitoring | observability | advanced | checkly | datadog-synthetics |
| apm_traces | observability | advanced | datadog-apm | sentry-performance |
| push_notifications | notifications | advanced | onesignal | knock |
| document_signing | signing | advanced | documenso | dropbox-sign, docusign |
| video | video | advanced | livekit | mux-video, daily |
| realtime_events | realtime | standard | pusher | supabase-realtime, liveblocks |
| collaboration_presence | realtime | advanced | liveblocks | pusher, supabase-realtime |
| internal_automation | automation | automation | n8n | make |
| consumer_automation | automation | automation | zapier | pipedream-connect |
| embedded_integrations | automation | automation | paragon | nango, pipedream-connect |

---

## Activation rule

An integration is **active** only when its role appears in `feature-integration-map.json` AND the feature is present in `brief.json → features[]`.

Adding a YAML stub to this catalog does **not** activate the integration in any plan. The gate is the feature map.

---

## Cross-references

- Machine-readable matrix: `_meta/role-matrix.json`
- YAML schema: `_schema.md`
- Tier presets: `DOC/knowledge/integration-presets/`
- Feature → integration map: `DOC/knowledge/feature-maps/feature-integration-map.json`
