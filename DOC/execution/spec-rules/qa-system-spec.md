# Spec Template — QA / Testing System

Emitted by `qa_planner` to `docs/qa/testing-system.md` (human) and `docs/qa/testing.json` (machine).

Defines the deterministic shape of the test plan. Codegen scaffolds Vitest, Playwright, fixtures, and CI test workflows from this output.

## File frontmatter

```yaml
---
document_type: qa-system
project_name: <slug>
build_stage: 5-quality
depends_on:
  - brief.json
  - plan.json
  - backend.spec
  - frontend.spec
recommended_next_reads:
  - devops-system.md
  - security-system.md
---
```

## Required sections

### 1. Frameworks
```yaml
frameworks:
  unit:        vitest
  integration: vitest + "@testcontainers/postgresql"
  e2e:         playwright
  visual:      playwright_screenshots
  a11y:        "@axe-core/playwright"
```

### 2. Test Pyramid
```yaml
pyramid:
  expected_distribution: { unit: 70, integration: 25, e2e: 5 }
```

### 3. CI Gates
Which checks block merge to main vs preview deploy.

```yaml
ci_gates:
  pull_request:    [typecheck, lint, unit, integration, a11y_smoke]
  preview_deploy:  [e2e, visual_regression]
  main_merge_block:[typecheck, lint, unit, integration]
  pre_production:  [e2e, smoke, performance_budget]
zero_warnings_policy: true
```

### 4. Coverage Thresholds
```yaml
coverage_thresholds:
  statements: 80
  branches:   70
  functions:  80
  lines:      80
  apply_to:
    - src/server/services/**
    - src/server/repositories/**
```

### 5. Fixtures
```yaml
fixtures:
  dir: tests/fixtures
  naming: "<aggregate>.<scenario>.json"
  no_production_data: true
  fixed_clock: "2026-01-01T00:00:00Z"
  fixed_seed: 42
```

### 6. Unit Tests Per Service
For every service in `backend.spec.services[]`:
```yaml
unit_tests:
  - target: src/server/services/<name>.ts
    cases:
      - <function>_<scenario>
      - <function>_<scenario>
```

### 7. Integration Tests Per Route
For every route in `backend.spec.routes[]`:
```yaml
integration_tests:
  - route: POST /api/...
    cases:
      - happy_path_<context>
      - 401_when_anon
      - 403_when_other_user_resource
      - 429_after_rate_limit
      - validation_error_<field>
```

### 8. Webhook Tests
Every webhook MUST have these three cases:
```yaml
webhook_tests:
  - route: POST /api/webhooks/<provider>
    cases:
      - valid_signature_persists_state
      - invalid_signature_returns_400
      - duplicate_event_id_is_idempotent
```

### 9. E2E Critical Paths
```yaml
e2e_critical_paths:
  - sign_up_lands_on_dashboard
  - sign_in_lands_on_dashboard
  - pricing_page_starts_checkout
  - dashboard_billing_opens_portal
  - sign_out_redirects_home
  # Plus per-feature happy paths derived from journeys
```

### 10. Negative Tests
Every protected route MUST have an unauth test.
```yaml
negative_tests:
  - { route: GET /dashboard,           expect: redirect_to_sign_in_when_anon }
  - { route: GET /dashboard/billing,   expect: 403_when_other_user_resource }
  - { route: POST /api/billing/portal, expect: 401_when_anon }
```

### 11. Visual Regression
```yaml
visual_regression:
  pages: [/, /pricing, /sign-in, /dashboard]
  themes: [light, dark]
  viewports: [mobile, tablet, desktop]
  reduced_motion_snapshot: true
  compare_mode: strict_layout_and_visibility
  required_reports:
    - reports/visual-qa/summary.json
    - reports/visual-qa/<route>/<viewport>.png
  assertions:
    - no_hidden_primary_content
    - no_horizontal_overflow
    - no_critical_contrast_failures_on_primary_surfaces
```

### 12. Accessibility Tests
```yaml
accessibility_tests:
  axe_per_page: [/, /pricing, /sign-in, /dashboard]
  serious_or_critical_violations_allowed: 0
  manual_keyboard_walk: required_pre_launch
  screen_reader_smoke:
    - sign_in
    - sign_up
    - primary_conversion_path
    - billing
```

### 13. Smoke Tests (Post-Deploy)
```yaml
smoke:
  after_deploy: true
  rollback_on_failure: true
  urls: ["/", "/sign-in", "/sign-up", "/api/health"]
  expected_statuses: { "/": 200, "/sign-in": 200, "/sign-up": 200, "/api/health": 200 }
```

### 14. Performance Tests (Optional Where Required)
```yaml
performance_tests:
  lighthouse_budget:
    performance: 90
    accessibility: 95
    best_practices: 95
    seo: 95
  k6_load_tests:
    - target: /api/billing/checkout
      vus: 50
      duration: 60s
```

## testing.json (machine-readable)
A flat JSON mirroring the YAML above. Codegen scaffolds:
- `vitest.config.ts` with coverage thresholds
- `playwright.config.ts` with project list
- `tests/unit/**`, `tests/integration/**`, `tests/e2e/**` skeleton folders
- `.github/workflows/ci.yml` test stages
- `tests/fixtures/<aggregate>.<scenario>.json` empty stubs

## Reviewer checks
- Every service has unit tests.
- Every route has integration tests.
- Every webhook has the three required cases.
- Every protected route has a negative test.
- Every E2E critical path has a single test.
- Coverage thresholds set on services + repositories folders.
- Smoke + a11y plans present.
- Visual QA plan includes screenshot routes, viewports, and output report locations.
