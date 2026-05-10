# TESTING PRINCIPLES

## OBJECTIVE
Make every SaaS plan testable from the first commit. Test pyramid is mandatory; tests gate every merge.

## HIERARCHY OF TESTS

1. Static checks (typecheck, lint, format)
2. Unit tests (pure logic, no IO)
3. Integration tests (services + repositories against a real DB; mocked external integrations)
4. End-to-end tests (browser against a deployed preview)
5. Smoke tests (post-deploy, against production)

A lower level MUST pass before a higher level runs.

## PRINCIPLES

### T1 — Test Pyramid
- Many unit tests, fewer integration tests, very few E2E tests.
- Default mix: 70% unit, 25% integration, 5% E2E.

### T2 — Real DB for Integration
- Integration tests run against a real Postgres (Testcontainers or a disposable schema).
- No mocked DB.

### T3 — Mock External Integrations Only at the Boundary
- Stripe, Clerk, Resend, Sanity, Sentry mocked via fixture servers (e.g., MSW, stripe-mock).
- Service code under test runs unmodified.

### T4 — E2E Hits Real Browser
- Playwright against a preview deployment.
- Critical paths only: sign-up, sign-in, checkout, dashboard load, sign-out.

### T5 — Tests Are Deterministic
- Fixed clock, fixed random seed, fixed test data.
- Each test sets up and tears down its own state.

### T6 — Coverage Floors
- Unit: ≥ 80% statements on `src/server/services/**` and `src/server/repositories/**`.
- Integration: every service public function executed at least once.
- E2E: every "critical path" route executed at least once.

### T7 — CI Gates
- A merge to main is blocked unless: typecheck, lint, unit, integration all pass.
- E2E runs on the preview deployment of every PR.

### T8 — Fixtures Are Versioned
- Test fixtures live in `tests/fixtures/` and are checked into git.
- No production data in fixtures.

### T9 — Webhook Tests
- Every webhook handler has at least one integration test that exercises:
  - valid signature → 2xx, side effect persisted
  - invalid signature → 4xx, no side effect
  - duplicate event id → 2xx, side effect not duplicated

### T10 — Negative Tests
- For every authentication-requiring route, a test confirms unauthenticated requests fail.
- For every authorization-requiring route, a test confirms cross-user access fails.

### T11 — Test Naming
- Test names describe behavior in plain English: `does_X_when_Y`.
- No `should` prefix, no Hungarian notation.

### T12 — Smoke Tests After Deploy
- After deploy, a smoke job hits the canonical URLs and checks 200/expected redirects.
- Failure rolls back automatically.

## DECISION RECORD

Every plan MUST emit `testing.json`:
```json
{
  "frameworks": { "unit": "vitest", "integration": "vitest+testcontainers", "e2e": "playwright" },
  "coverage_thresholds": { "statements": 80, "branches": 70, "functions": 80, "lines": 80 },
  "fixtures_dir": "tests/fixtures",
  "ci_gates": ["typecheck","lint","unit","integration","e2e_on_preview"],
  "smoke": { "after_deploy": true, "rollback_on_failure": true, "urls": ["/","/sign-in","/api/health"] }
}
```
