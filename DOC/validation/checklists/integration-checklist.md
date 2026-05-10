# INTEGRATION CHECKLIST

## PURPOSE
Run this checklist for every integration declared in the plan. Each integration MUST have all items confirmed before codegen begins for that integration.

## FOR EACH INTEGRATION — UNIVERSAL CHECKS
- [ ] Integration rule file exists at `knowledge/integration-rules/<name>.yaml`.
- [ ] All `env_vars` from the rule are in `plan.env_vars`.
- [ ] All `required_components` from the rule are represented in the plan.
- [ ] All `setup_steps` from the rule are in `plan.setup_steps`.
- [ ] All `webhooks.endpoint` values are in `plan.routes`.
- [ ] Client module declared at `src/lib/<integration>.ts`.
- [ ] Service module declared at `src/server/services/<integration>.ts`.

---

## AUTH — CLERK
- [ ] Clerk application created (dev + production instances separate).
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` available.
- [ ] `CLERK_WEBHOOK_SIGNING_SECRET` available.
- [ ] `clerkMiddleware()` added to `middleware.ts`.
- [ ] `<ClerkProvider>` wraps root layout.
- [ ] `/api/webhooks/clerk` route handler declared with signature verification.
- [ ] `users` table declared in DB schema with `clerk_id` foreign reference.
- [ ] Webhook handler creates/updates/deletes user mirror on Clerk events.
- [ ] Redirect URLs configured (`NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`, `AFTER_SIGN_UP_URL`).

## PAYMENTS — STRIPE
- [ ] Stripe account and product/price created.
- [ ] Test mode keys used in development and preview; live keys in production only.
- [ ] `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` available.
- [ ] `/api/webhooks/stripe` route handler declared with `constructEvent` verification.
- [ ] `subscriptions` table declared in DB schema.
- [ ] Webhook handler handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`.
- [ ] Customer portal session creation service declared.
- [ ] Checkout session creation service declared.
- [ ] Webhook handler is idempotent by Stripe event ID.

## CMS — SANITY
- [ ] Sanity project created with correct dataset name.
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` available.
- [ ] Sanity client singleton declared.
- [ ] Every content type has a schema in `studio/schemas/<type>.ts`.
- [ ] Every content type with a public route has a `slug` field.
- [ ] GROQ queries declared for every content type.
- [ ] On-demand revalidation webhook (`/api/webhooks/sanity`) declared.
- [ ] Draft mode route (`/api/draft`) declared.

## EMAILS — RESEND
- [ ] Resend account and sending domain verified.
- [ ] `RESEND_API_KEY` and `RESEND_FROM_ADDRESS` available.
- [ ] Resend client singleton declared.
- [ ] React Email templates declared in `emails/<name>.tsx`.
- [ ] `email_logs` table declared in DB schema.
- [ ] All email sends go through a service function, not called directly from route handlers.
- [ ] All email dispatches are async (via Inngest or similar).

## ANALYTICS — POSTHOG
- [ ] PostHog project created.
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` available.
- [ ] `<PostHogProvider>` wraps root layout.
- [ ] `posthog.identify()` called after sign-in.
- [ ] `posthog.reset()` called after sign-out.
- [ ] Core product events defined and captured at correct trigger points.
- [ ] Server-side PostHog client declared for server-component events.

## ERROR TRACKING — SENTRY
- [ ] Sentry project created.
- [ ] `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` available.
- [ ] `sentry.client.config.ts` and `sentry.server.config.ts` declared.
- [ ] `withSentryConfig` wraps `next.config.ts`.
- [ ] Source maps uploaded in CI (not committed to VCS).
- [ ] Tunnel route configured (if ad-blocker bypass required).
- [ ] Sample rates set per environment.

## BACKGROUND JOBS — INNGEST
- [ ] Inngest app created.
- [ ] `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` available.
- [ ] Inngest client singleton declared at `src/inngest/client.ts`.
- [ ] `/api/inngest` route handler declared and serving all functions.
- [ ] All functions co-located under `src/inngest/functions/`.
- [ ] Inngest app registered in Inngest Cloud pointing to deployed URL (not local tunnel).
- [ ] All long operations use `step.run()` for durability.

## CACHE AND RATE LIMIT — UPSTASH
- [ ] Upstash Redis database provisioned.
- [ ] `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` available.
- [ ] Redis client singleton declared.
- [ ] Cache namespaces and TTL policies declared per aggregate.
- [ ] Rate limit helpers declared per scope (AI, uploads, etc.).

## FILE UPLOADS — UPLOADTHING
- [ ] UploadThing app created.
- [ ] `UPLOADTHING_TOKEN`, `UPLOADTHING_SECRET` available.
- [ ] File router declared with all required routes.
- [ ] Per-route auth middleware uses Clerk to validate user.
- [ ] `files` table declared in DB schema.
- [ ] `onUploadComplete` callback persists file metadata to DB.
- [ ] File keys persisted (required for future deletion).

## SEARCH — MEILISEARCH
- [ ] Meilisearch instance provisioned (cloud or self-hosted).
- [ ] `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY`, `MEILISEARCH_ADMIN_KEY` available.
- [ ] Meilisearch client singleton declared.
- [ ] Index settings declared (searchable attributes, filterable attributes, ranking rules).
- [ ] Indexing service consuming DB change events via Inngest declared.
- [ ] Search proxy route or minted token strategy implemented (admin key never client-exposed).

## LOGGING — AXIOM
- [ ] Axiom account and dataset created.
- [ ] `AXIOM_TOKEN`, `AXIOM_DATASET` available.
- [ ] Logger module declared using Pino + Axiom transport.
- [ ] Request ID middleware declared.
- [ ] All route handlers and services use the logger module, not `console.log`.

## AI / LLM — OPENAI
- [ ] OpenAI account and project API key created.
- [ ] `OPENAI_API_KEY` available (server-side only).
- [ ] OpenAI client singleton declared.
- [ ] Per-user rate limit via Upstash declared on all AI routes.
- [ ] `ai_usage` table declared in DB schema.
- [ ] Every completion logs token counts and cost to `ai_usage` table.
- [ ] Long completions dispatched via Inngest, not blocking request thread.

## OUTPUT
All items confirmed for each integration → integration checklist PASSED.
Any item failing → BLOCK with integration name and missing item.
