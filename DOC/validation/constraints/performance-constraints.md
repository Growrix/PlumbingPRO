# PERFORMANCE CONSTRAINTS

## PURPOSE
Hard performance rules that enforce SLO compliance at the plan level. Applied by the reviewer agent to catch plans that would produce slow or resource-exhausting applications.

---

## PC1 — SLO TARGETS ARE DECLARED
**Rule:** Every plan MUST declare explicit SLO targets:
- `web_vitals.lcp_ms` (required)
- `api.p99_latency_ms` (required)
- `db.query_p99_ms` (required)
- `uptime_percent` (required)

**Detection:** Check `plan.slo_targets` keys.
**Failure:** `BLOCK PC1: plan missing SLO declaration for <metric>`.

## PC2 — NO UNINDEXED QUERIES ON LARGE TABLES
**Rule:** Every production query on a table with > 10k expected rows MUST have an index covering its WHERE clause fields.
**Detection:** Cross-reference plan.db_schema.indexes against service query definitions.
**Failure:** `BLOCK PC2: query on <table>.<column> lacks index`.

## PC3 — LONG OPERATIONS MUST BE ASYNC
**Rule:** Any operation expected to take > 500ms MUST be dispatched to Inngest, not executed inline in a route handler.
**Detection:** Flag: direct `openai.completions.create` calls in route handlers without streaming, synchronous resend calls, synchronous search reindex calls.
**Failure:** `BLOCK PC3: long operation <operation> is synchronous in route handler <route>`.

## PC4 — AI ROUTES MUST USE STREAMING OR INNGEST
**Rule:** AI completion routes that may take > 2s MUST either use streaming responses (Vercel AI SDK) or dispatch to Inngest for async processing. Blocking completions in route handlers are FORBIDDEN.
**Detection:** Review AI route handlers for `await openai.chat.completions.create(...)` without streaming or Inngest dispatch.
**Failure:** `BLOCK PC4: AI route <route> blocks request thread on long completion`.

## PC5 — IMAGES MUST USE NEXT/IMAGE
**Rule:** Every `<img>` tag in the plan's component definitions MUST use `next/image`. Plain `<img>` tags are FORBIDDEN for content images.
**Detection:** Review all page and component definitions for `<img>` usage.
**Failure:** `BLOCK PC5: plain <img> tag in <component> — use next/image`.

## PC6 — CACHE STRATEGY DECLARED PER DATA SOURCE
**Rule:** Every server component or data-fetching function MUST declare an explicit `cache` or `next.revalidate` option.
**Detection:** Review page definitions for data-fetching calls without cache declarations.
**Failure:** `BLOCK PC6: page <route> has data fetch without declared cache strategy`.

## PC7 — HOT READS CACHED IN UPSTASH
**Rule:** Aggregates read on > 20% of requests (e.g., user subscription status, post counts, feature flags) MUST be cached in Upstash Redis with a declared TTL.
**Detection:** Review services for hot-read patterns without caching.
**Failure:** `BLOCK PC7: hot aggregate <read> in <service> not cached`.

## PC8 — NO SELECT STAR IN PRODUCTION QUERIES
**Rule:** All ORM queries MUST use `select` to fetch only required columns. `findMany` or `findFirst` without a `select` clause on tables with > 10 columns is FORBIDDEN.
**Detection:** Review repository method definitions.
**Failure:** `BLOCK PC8: repository method <method> uses implicit SELECT * on <table>`.

## PC9 — BUNDLE SIZE CHECKED IN CI
**Rule:** `@next/bundle-analyzer` MUST be configured and its output reviewed in CI. The initial JS bundle for public pages MUST NOT exceed 200 KB gzipped.
**Detection:** Review CI pipeline for bundle analysis step; review next.config.ts for bundle analyzer.
**Failure:** `BLOCK PC9: bundle analyzer not configured in CI`.

## PC10 — FONTS ARE SELF-HOSTED
**Rule:** No external `<link rel="stylesheet">` font import may appear in the app. All fonts MUST be loaded via `next/font/google` or `next/font/local`.
**Detection:** Review root layout for font loading strategy.
**Failure:** `BLOCK PC10: external font link in <file> causes render-blocking`.

## PC11 — PAGINATION ON ALL LIST ENDPOINTS
**Rule:** Every API endpoint or server component that returns a list of items MUST implement pagination (cursor or offset). Unbounded list queries are FORBIDDEN.
**Detection:** Review all `findMany` queries without `take`/`skip` or cursor.
**Failure:** `BLOCK PC11: unbounded list query in <repository_method>`.

## PC12 — MIDDLEWARE RUNS ON EDGE RUNTIME
**Rule:** `middleware.ts` MUST declare `export const config = { runtime: "experimental-edge" }` or use Clerk's `clerkMiddleware` which runs on Edge by default. Middleware MUST NOT import heavy Node.js modules.
**Detection:** Review middleware.ts for runtime declaration and imports.
**Failure:** `BLOCK PC12: middleware not configured for Edge runtime`.

## ENFORCEMENT
Performance constraints PC1–PC12 are evaluated by the reviewer agent after security constraints.
Failures are included in `validation_report.json` under the `performance_constraints` key.
Any PC failure blocks the pipeline with the same severity as a core constraint failure.
