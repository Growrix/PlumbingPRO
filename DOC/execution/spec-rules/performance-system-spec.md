# Spec Template — Performance System

Emitted by `performance_auditor` to `docs/perf/performance-system.md` (human) and `docs/perf/performance.json` (machine).

Defines caching, CDN, image, bundle, and database performance strategy. Codegen consumes the JSON to wire Upstash, edge cache headers, image rules, and bundle budgets.

## File frontmatter

```yaml
---
document_type: performance-system
project_name: <slug>
build_stage: 5-performance
depends_on:
  - brief.json
  - plan.json
  - frontend.spec
  - backend.spec
recommended_next_reads:
  - testing-system.md
  - devops-system.md
---
```

## Required sections

### 1. Cache Layer
```yaml
cache:
  provider: upstash_redis
  namespaces:
    - { name: "user",        ttl_seconds: 300 }
    - { name: "org",         ttl_seconds: 300 }
    - { name: "cms:post",    ttl_seconds: 600 }
    - { name: "rate_limit",  ttl_seconds: 60 }
  invalidation:
    - { on_event: "subscription.updated", invalidates: "user:<userId>" }
    - { on_event: "post.updated",         invalidates: "cms:post:<slug>" }
```

### 2. CDN / Edge Strategy
```yaml
cdn:
  provider: vercel_edge
  cacheable_routes:
    - { path: /,             revalidate_seconds: 60 }
    - { path: /pricing,      revalidate_seconds: 600 }
    - { path: /blog,         revalidate_seconds: 60 }
    - { path: /blog/[slug],  revalidate_seconds: 60 }
    - { path: /api/health,   cache: "no-store" }
```

### 3. Image Rules
```yaml
images:
  loader: next_image
  formats: [avif, webp]
  sizes_required: true
  lazy_by_default: true
  priority_above_fold: true
  remote_patterns:
    - { hostname: cdn.sanity.io }
    - { hostname: img.clerk.com }
```

### 4. Bundle Budgets
```yaml
bundle_budgets:
  global_kb_gz: 180
  per_route_kb_gz: 90
  warn_threshold_pct: 90
  per_route_overrides:
    - { route: /dashboard, kb_gz: 130, reason: "data table + chart libs" }
```

### 5. Web Vitals Targets
```yaml
web_vitals_targets:
  LCP_ms: 2500
  INP_ms: 200
  CLS:    0.1
  TTFB_ms: 800
  applies_to: [/, /pricing, /blog, /blog/[slug], /sign-in]
```

### 6. Database Performance
```yaml
db:
  indexes_confirmed:
    - { table: users,         column: clerk_user_id,         kind: unique }
    - { table: users,         column: email,                 kind: btree }
    - { table: subscriptions, column: user_id,               kind: btree }
    - { table: subscriptions, column: stripe_subscription_id,kind: unique }
    - { table: invoices,      column: user_id,               kind: btree }
    - { table: email_logs,    column: provider_message_id,   kind: btree }
  n_plus_one_review:
    - { service: dashboard, mitigation: "batched repositories.subscriptions.listByUserIds" }
    - { service: blog,      mitigation: "single GROQ projecting author + categories" }
  slow_query_budget_ms: 200
  slow_query_alert: "p95_query_ms > 200 over 5m"
```

### 7. Client-Component Discipline
```yaml
client_components:
  policy: "server by default; client only with declared reason"
  declared:
    - { component: ChatWidget,    reason: streaming + interactivity }
    - { component: PricingTable,  reason: monthly/annual toggle }
    - { component: FilterPanel,   reason: URL-synced filter state }
```

### 8. Streaming + Suspense
```yaml
streaming:
  use_for:
    - dashboard_summary_panels
    - long_lists_with_above_fold_critical_rows
  suspense_boundaries: per_panel
```

### 9. Asset Discipline
```yaml
assets:
  fonts:
    loader: next_font
    subset: latin
    display: swap
  third_party_scripts:
    policy: "next/script with strategy=lazyOnload by default"
    declared:
      - { name: posthog,  strategy: afterInteractive }
      - { name: stripe_js, strategy: lazyOnload }
```

### 10. Measurement & Alerts
```yaml
measurement:
  rum: vercel_speed_insights
  synthetic: lighthouse_ci
  alerts_route_to: docs/runbooks/alerts/lcp-regression.md
```

## performance.json (machine-readable)
A flat JSON mirroring the YAML. Codegen consumes it to:
- Configure Upstash client + cache helpers
- Set Vercel route revalidate headers
- Generate Next image `remotePatterns`
- Wire Lighthouse CI thresholds

## Reviewer checks
- Every cacheable route has a revalidate or "no-store" declared.
- Every WHERE / ORDER BY column has an index.
- Bundle budgets present per route.
- Web Vitals targets present and applied to declared pages.
- Every client component declares a reason.
- N+1 review done for every service that does multi-row reads.
