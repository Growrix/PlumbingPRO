# PERFORMANCE RULES

## SCOPE
Apply to every frontend page, backend route handler, database query, and external integration call in any plan produced by this OS.

## RULE P1 — SLO TARGETS ARE DECLARED
Every plan MUST declare explicit SLO targets:
- `web_vitals.lcp_ms`: ≤ 2500ms (Core Web Vitals Good threshold)
- `web_vitals.fid_ms`: ≤ 100ms
- `web_vitals.cls`: ≤ 0.1
- `api.p99_latency_ms`: ≤ 500ms for standard routes
- `api.p99_latency_ms_ai`: ≤ 10000ms for AI/streaming routes
- `db.query_p99_ms`: ≤ 100ms
- `uptime_percent`: ≥ 99.9%

Routes that violate SLO targets in CI MUST block deploy.

## RULE P2 — SERVER COMPONENTS BY DEFAULT
- Pages MUST use React Server Components unless client interactivity is required.
- Client components MUST be leaf nodes in the component tree (push `"use client"` as deep as possible).
- Every client component MUST be wrapped in `<Suspense>` with a skeleton fallback.
- Dynamic data imports (`next/dynamic`) MUST use `{ ssr: false }` only when no SSR alternative exists.

## RULE P3 — IMAGES ARE OPTIMIZED
- All images MUST use `next/image` with explicit `width` and `height`.
- Hero images MUST include `priority` prop.
- Remote image domains MUST be allowlisted in `next.config.ts`.
- CMS images MUST use the provider's image CDN URL transformer.
- WebP format is the default output format.

## RULE P4 — FONTS ARE SELF-HOSTED
- Fonts MUST be loaded via `next/font/google` or `next/font/local` (self-hosted subset).
- External `<link rel="stylesheet">` font imports are FORBIDDEN (causes render-blocking).
- Font display strategy: `swap`.

## RULE P5 — DATABASE QUERIES ARE INDEXED
Every query that is used in a route MUST:
- Have the WHERE clause fields covered by an index.
- Have pagination (LIMIT + cursor or OFFSET) when returning multiple rows.
- Use `select` to fetch only required columns (no `SELECT *`).
- Use connection pooling (PgBouncer or Prisma Accelerate) in production.

Unindexed queries on tables > 10k rows MUST BLOCK the plan.

## RULE P6 — CACHING IS EXPLICIT
- `fetch` calls MUST declare an explicit `cache` or `next.revalidate` option.
- Default `force-cache` is FORBIDDEN for user-specific data.
- Hot-read aggregates (e.g., post counts, user stats) MUST be cached in Upstash Redis with a declared TTL.
- Cache keys MUST include the user or org scope when data is user-specific.

## RULE P7 — RATE LIMITING PROTECTS EXPENSIVE ROUTES
- AI/LLM routes MUST enforce per-user token budgets.
- File upload routes MUST enforce per-user size quotas.
- Search routes MUST be cached or rate-limited to prevent search engine abuse.
- Rate limit rejection: HTTP 429 with `Retry-After` header.

## RULE P8 — LONG OPERATIONS ARE ASYNC
- Operations taking > 500ms MUST NOT block the HTTP request thread.
- Long operations MUST be dispatched to a background job queue (Inngest).
- AI completions > 1 second MUST use streaming responses or be offloaded.
- Email sending MUST be async (dispatched via Inngest or a queue).

## RULE P9 — BUNDLE SIZE IS AUDITED
- `@next/bundle-analyzer` MUST run in CI to produce a bundle report on every build.
- Initial JS bundle for public pages MUST NOT exceed 200 KB gzipped.
- Large dependencies (e.g., date libraries, chart libs) MUST use tree-shaken imports.
- Server-only packages MUST be guarded with `server-only` import or in server files.

## RULE P10 — EDGE RUNTIME FOR LATENCY-SENSITIVE MIDDLEWARE
- Next.js Middleware (auth checks, redirect logic) MUST run on the Edge runtime.
- Edge functions MUST NOT import Node.js built-ins.
- Long-running computations MUST NOT run on Edge (use Node.js runtime route handlers instead).

## RULE P11 — CDN CACHING FOR STATIC ASSETS
- Static assets (`/public/**`) MUST have `Cache-Control: public, max-age=31536000, immutable`.
- Next.js `/_next/static/**` is handled automatically; do not override.
- User-uploaded files MUST be served from the storage provider's CDN, never from the app origin.

## RULE P12 — PERFORMANCE MONITORING
- Core Web Vitals MUST be reported to analytics (PostHog `web_vitals` event or Vercel Speed Insights).
- API route latency MUST be logged per route with the structured logger.
- Slow queries (> 200ms) MUST be captured and alerted on.
- Sentry performance traces MUST be enabled with environment-specific sample rates.

## SLO SUMMARY TABLE

| Metric | Target | Enforcement |
|--------|--------|-------------|
| LCP | ≤ 2500ms | Playwright perf test |
| API p99 | ≤ 500ms | k6 load test |
| DB query p99 | ≤ 100ms | Query logging alert |
| Uptime | ≥ 99.9% | Uptime monitor |
| Bundle size (initial) | ≤ 200 KB gz | Bundle analyzer CI |
