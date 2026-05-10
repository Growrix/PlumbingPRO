# TESTING CONSTRAINTS
Hard constraints for QA planning and validation.

## TC1 — Critical Journeys Have E2E Coverage
**Rule:** Every critical user journey must have at least one E2E test.
**Detection:** Cross-reference `testing.json -> e2e_paths[]` against `brief.json -> journeys[]` and `plan.json -> features[]` critical paths.
**Failure:** `BLOCK TC1: critical journey <name> missing E2E coverage`.

## TC2 — Service Layer Unit-Testability
**Rule:** All service-layer logic must be unit-testable without network side effects.
**Detection:** Verify backend plan declares service/repository split and test plan includes unit tests with mocked gateways for each service module.
**Failure:** `BLOCK TC2: service layer not unit-testable for <module>`.

## TC3 — CI Enforces Test and Coverage Gates
**Rule:** CI must fail on test failure or coverage regression below configured threshold.
**Detection:** Verify `testing.json` includes explicit coverage thresholds and CI gate policy that blocks merge on failure.
**Failure:** `BLOCK TC3: CI test/coverage gate missing or weak`.
