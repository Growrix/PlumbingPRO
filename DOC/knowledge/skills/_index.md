# Skills Library — Index

Reusable implementation patterns used by codegen. Each skill file describes a single pattern in deterministic, codegen-ready form.

Integration YAMLs declare `required_skills[]` naming the skills they need. The codegen phase reads those skills and applies them. This is the reuse mechanism: 80+ integrations share ~22 patterns instead of needing 80 separate prompts.

## Skill list

| Slug | Used by |
|---|---|
| webhook-signature-verification | clerk, stripe, inngest, sanity, twilio, knock, calcom, documenso |
| idempotency-key-pattern | stripe, inngest, neon-postgres |
| subscription-webhook-mirror-pattern | stripe |
| outbound-webhook-signing-pattern | n8n, automation surface |
| streaming-llm-response-pattern | openai, anthropic, vercel-ai-sdk |
| direct-browser-upload-pattern | uploadthing, r2, s3 |
| rate-limit-with-upstash-pattern | upstash, openai, any api route |
| form-spam-guard-pattern | cloudflare-turnstile, hcaptcha |
| booking-availability-sync-pattern | calcom |
| reviews-aggregation-pattern | google-business-profile |
| sso-saml-handshake-pattern | workos |
| audit-log-write-pattern | workos-audit-logs, native table |
| data-export-endpoint-pattern | gdpr compliance |
| data-delete-endpoint-pattern | gdpr compliance, clerk user.deleted |
| rbac-policy-evaluation-pattern | permit-io |
| feature-flag-evaluation-pattern | posthog |
| ai-cost-tracking-pattern | helicone, openai, anthropic |
| ai-moderation-precheck-pattern | openai |
| retrieval-augmented-generation-pattern | turbopuffer, pinecone |
| embedded-integration-marketplace-pattern | paragon, nango |
| per-tenant-tokens-pattern | zapier integration, custom automation |
| cache-invalidation-on-write-pattern | upstash, sanity, meilisearch |
| soft-delete-on-user-deleted-pattern | clerk |
| optimistic-ui-pattern | pusher, supabase-realtime, liveblocks |
| websocket-reconnect-pattern | pusher, supabase-realtime, liveblocks |
| presence-tracking-pattern | liveblocks, collaborative views |
| subscription-fanout-pattern | pusher, supabase-realtime, notification streams |
| glob-based-inventory-pattern | system_architect audit section A |
| cross-reference-validation-pattern | system_architect audit section B |
| frontmatter-schema-validation-pattern | system_architect audit section C |
| synthetic-fixture-smoke-test-pattern | system_architect smoke section H |
| determinism-diff-pattern | system_architect determinism section F |
| onboarding-checklist-pattern | userflow, appcues, onboarding flows |
| feature-tour-pattern | userflow, appcues |
| empty-state-pattern | first-run app surfaces |
| notification-preferences-pattern | knock, novu, onesignal |
| activity-feed-pattern | activity timeline surfaces |
| ai-citation-pattern | openai, rag answers |
| ai-regenerate-feedback-pattern | openai chat UX |
| ai-streaming-with-tool-use-pattern | openai tool-calling UX |
| ai-cost-meter-pattern | openai usage UI, helicone |
| comments-mentions-pattern | liveblocks collaboration |

## Usage in codegen

When `integration_planner` emits `integrations.json`, it collects all `required_skills` from the chosen integration YAMLs and includes a deduplicated `skills_required[]` array. The codegen agent reads each skill file listed there before generating implementation code for that integration.
