# TESTING RULES

## SCOPE
Apply to every test file, test configuration, and CI test stage in any plan produced by this OS.

## RULE T1 — TESTING IS NON-OPTIONAL
Every plan MUST include a testing strategy with:
- Unit tests for all service functions.
- Integration tests for all route handlers with signature verification (webhooks).
- End-to-end tests for the three most critical user flows (auth, payment, primary feature).
- A CI stage that blocks deploy on test failure.

## RULE T2 — TOOLCHAIN IS FIXED
Default testing toolchain:
- **Unit / Integration**: Vitest
- **E2E**: Playwright
- **API contract**: Vitest + MSW (Mock Service Worker) for integration mocking
- **Type checking**: `tsc --noEmit` (must pass before tests run)

No additional testing libraries may be introduced unless a known gap is declared.

## RULE T3 — TEST FILE LOCATION
- Unit tests: co-located with source at `src/**/__tests__/<name>.test.ts`
- Route handler integration tests: `src/app/api/**/__tests__/<route>.test.ts`
- E2E tests: `tests/e2e/<feature>.spec.ts`
- Test utilities and fixtures: `tests/utils/` and `tests/fixtures/`

## RULE T4 — SERVICE LAYER IS 100% UNIT TESTABLE
- Services MUST accept injected dependencies (DB client, integration clients) so they can be tested with mocks.
- No service function may read from environment variables directly; they receive config via dependency injection.
- Every service function MUST have at least one test for the happy path and one for each error branch.

## RULE T5 — WEBHOOKS MUST HAVE VERIFIED TESTS
Every webhook handler MUST have an integration test that:
1. Constructs a valid signed request (using the provider's test signature helper).
2. Verifies the handler returns `200` on valid payload.
3. Verifies the handler returns `400` on tampered/invalid signature.
4. Verifies idempotency (same event id sent twice → no duplicate side effects).

## RULE T6 — AUTH IS MOCKED IN TESTS
- Clerk auth is mocked at the test boundary using `@clerk/nextjs/testing` or a custom mock module.
- Tests MUST NOT make real Clerk API calls.
- Tests MUST cover both authenticated and unauthenticated request states.

## RULE T7 — DATABASE IS ISOLATED IN TESTS
- Unit tests: use in-memory mocks or a dedicated test schema, NEVER the production or staging DB.
- Integration tests: use a test database seeded with fixtures; tear down after each test run.
- E2E tests: use a dedicated Playwright test environment with a test database.
- Transactions MUST be rolled back after each test to maintain isolation.

## RULE T8 — E2E TESTS COVER CRITICAL PATHS ONLY
E2E tests are expensive; restrict to:
1. Sign-up → onboarding → dashboard.
2. Payment / subscription checkout.
3. Primary feature flow (e.g., post creation → publish → public view).
4. Sign-out and session expiry handling.

E2E tests MUST NOT duplicate what unit or integration tests already cover.

## RULE T9 — COVERAGE THRESHOLDS
Minimum coverage enforced in CI:
- Services: 80% line coverage.
- Repository layer: 70% line coverage.
- Utilities and helpers: 90% line coverage.
- Route handlers: covered by integration tests, not line coverage.

Coverage below threshold MUST fail the CI stage.

## RULE T10 — NO TESTS IN PRODUCTION BUILDS
- Test files, fixtures, and mocks MUST NOT be included in production bundles.
- `vitest.config.ts` MUST exclude test files from the build via `exclude` patterns.
- Test utilities MUST live under `tests/` or co-located `__tests__/`, never under `src/lib/`.

## RULE T11 — PERFORMANCE TESTS FOR CRITICAL ROUTES
Routes with SLO targets MUST have a performance regression test:
- Test tool: `k6` or Playwright load test.
- Threshold: p99 latency target declared in the plan.
- Performance tests run in CI against the staging environment only.

## RULE T12 — SMOKE TESTS POST-DEPLOY
After every production deploy, the following MUST be verified automatically:
- `GET /api/health` → 200.
- Sign-in page loads without JS errors.
- Primary authenticated route responds correctly with a test account.
- Smoke test failure MUST trigger automatic rollback.

## RULE T13 — ZERO-WARNING QUALITY GATE
- Lint, typecheck, and test stages MUST run with zero warnings allowed.
- Any warning in CI is a blocking failure for merge and deploy promotion.

## RULE T14 — CRITICAL FLOW COMPLETENESS
- Test plans MUST cover unit, integration, and E2E for each declared critical business flow.
- Missing a test layer for a critical flow is a blocking validation failure.

## CI STAGE ORDER
```
1. lint (eslint --max-warnings 0)
2. typecheck (tsc --noEmit)
3. unit-tests (vitest run --coverage)
4. integration-tests (vitest run --config vitest.integration.config.ts)
5. build (next build)
6. e2e-tests (playwright test)
7. smoke-tests (post-deploy, against preview URL)
```

Each stage blocks the next on failure.
