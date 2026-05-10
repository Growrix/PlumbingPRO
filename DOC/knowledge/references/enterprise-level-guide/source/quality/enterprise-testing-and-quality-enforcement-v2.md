# Enterprise Testing and Quality Enforcement (v2)

## Purpose

This protocol defines the strict quality gate for implementation work:

Build -> Validate -> Test -> Verify -> Optimize -> Approve (only if all pass).

## Hard Rules

1. Never output untested code.
2. Never skip UI validation.
3. Never ignore mobile responsiveness.
4. Never ignore SEO or accessibility.
5. Never proceed with failing tests.
6. Never treat local-only success as completion.

## Completion Definition

A task is complete only when all checks pass:

- logic is correct
- UI is stable
- mobile behavior is correct
- SEO is validated
- accessibility baseline passes
- performance is acceptable
- security is validated
- required tests pass

## Mandatory Testing Pipeline

1. Static validation
2. Unit testing
3. Integration testing
4. UI component testing
5. Responsive and mobile testing
6. End-to-end testing
7. SEO validation
8. Accessibility validation
9. Performance validation
10. Security validation
11. Regression testing

## 1) Static Validation (Blocking)

- TypeScript strict passes.
- ESLint has zero errors.
- No unresolved unused imports or variables.
- No unsafe types in changed code.
- Clean production build passes (`next build`).

## 2) Unit Testing

- Business functions are covered.
- Edge cases are covered.
- Invalid input handling is covered.
- Async behavior is verified.

## 3) Integration Testing

- API behavior and contracts are verified.
- Data integrity is verified.
- Auth and permission flows are verified.
- Validation error paths are verified.

## 4) UI Testing (Component Level)

Verify all changed components for:

- correct render output
- props handling
- state transitions
- loading states
- error states
- empty states

## 5) Responsive and Mobile Testing (Critical)

Verify on:

- mobile
- tablet
- desktop

Validate:

- no layout breakage
- no overflow issues
- touch interactions work
- controls remain accessible
- navigation is usable
- text remains readable
- images are responsive

Include edge cases:

- long text
- dynamic content
- slow network

## 6) End-to-End Testing

Cover at minimum:

- signup and login
- dashboard usage
- CRUD paths for changed modules
- navigation paths
- logout

## 7) SEO Validation (Production Gate)

Verify:

- unique title and meta description
- valid heading hierarchy (H1-H6)
- canonical URLs where applicable
- sitemap availability
- robots configuration
- semantic HTML and non-duplicative content
- structured data (JSON-LD) where relevant
- crawlability and no broken links in changed surfaces

## 8) Accessibility Validation (WCAG Baseline)

Verify:

- correct ARIA usage
- keyboard navigation
- visible focus states
- acceptable contrast
- alt text coverage for meaningful images
- baseline screen-reader compatibility

## 9) Performance Validation

Verify:

- fast initial load for changed pages
- optimized images
- code splitting remains effective
- no avoidable re-renders
- efficient API usage

Target: Lighthouse around 90+ when applicable.

## 10) Security Validation

Verify:

- input validation at boundaries
- no XSS vectors in changed surfaces
- no injection risks in changed paths
- secure auth/session handling
- no secrets exposed in client or logs

## 11) Regression Testing

After any change:

- re-test impacted existing features
- confirm no behavior regressions

## Failure Protocol

If any check fails:

STOP -> DEBUG -> FIX -> RE-RUN FULL PIPELINE

## Edge Case Enforcement

Always test:

- empty inputs
- invalid data
- large datasets or payloads
- network failure
- slow responses
- unauthorized access

## UX Quality Check

Ensure:

- no confusing flow transitions
- clear and actionable errors
- smooth navigation
- no dead ends
- consistent interaction patterns

## Output Requirement

Before declaring completion, provide:

- all tests executed
- all required tests passed
- devices tested (mobile/tablet/desktop)
- SEO validated
- accessibility validated
- performance acceptable
- no known critical issues

## Final Gate

If any required check fails, task status is incomplete.

Execution principle:

Not tested across devices, users, and systems = not done.