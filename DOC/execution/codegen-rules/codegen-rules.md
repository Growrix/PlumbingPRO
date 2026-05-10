# CODE GENERATION RULES

## SCOPE
Apply to every file emitted by an executing agent.

## CG1 — LOCKED BUNDLE-DRIVEN ONLY
- Codegen consumes the locked run bundle, not `plan.json` in isolation.
- Minimum required inputs: `plan.json`, `decisions.json`, `validation_report.json`, and every run-scoped artifact referenced by `plan.json` for the active scope.
- For frontend scope, codegen MUST read the full frontend bundle before generating routes or components:
	- `planning/frontend/README.md`
	- `planning/frontend/master-ui-architecture.md`
	- `planning/frontend/design-system.md`
	- `planning/frontend/design-system.tokens.json`
	- `planning/frontend/component-system.md`
	- `planning/frontend/motion-system.md`
	- `planning/frontend/content-library.md`
	- `planning/frontend/interaction-matrix.md`
	- `planning/frontend/pages/*.md`
- If a referenced artifact is missing, unread, or too shallow to resolve a build decision, BLOCK with `EXECUTION_DRIFT`.
- No new product decisions are made during codegen.

## CG2 — FULL FILE CONTENT
- Every emitted file MUST contain complete, runnable content.
- No placeholders: `// TODO`, `/* implement */`, `add later`, `...` stubs.
- No partial functions.

## CG3 — DETERMINISTIC NAMING
- File paths come directly from the architecture template `folder_structure`.
- Function and component names come from the plan.
- No ad-hoc renaming.

## CG4 — TYPED EVERYWHERE
- TypeScript strict mode.
- Zod schemas at every boundary (route inputs, service inputs, env vars).
- No `any`. Use `unknown` and narrow.

## CG5 — INTEGRATION CLIENT SINGLETONS
- Exactly one client per integration in `src/lib/<integration>.ts`.
- Singletons MUST NOT be re-instantiated elsewhere.
- Edge runtimes use the appropriate SDK variant when required.

## CG6 — SERVICE LAYER OWNS ORCHESTRATION
- Services live in `src/server/services/`.
- Services compose repositories and integration clients.
- Services emit typed errors, never raw exceptions.

## CG7 — REPOSITORY LAYER OWNS DATA
- Repositories live in `src/server/repositories/`.
- One file per aggregate.
- Repositories return domain objects.

## CG8 — ROUTE HANDLERS ARE THIN
- Validate input with zod.
- Resolve user via auth integration server helper.
- Call exactly one service function.
- Map errors via the central error-to-response helper.

## CG9 — WEBHOOK HANDLERS
- Read raw body via `request.text()`.
- Verify signature with the provider library.
- Switch on event type.
- Persist event id to ensure idempotency.
- Return `2xx` quickly.

## CG10 — ENV BOOT
- `src/env.ts` exports a frozen, validated object.
- Imports throughout the app use `env` from this module.
- No `process.env.X` access outside `src/env.ts`.

## CG11 — REACT EMAIL TEMPLATES
- Each transactional email is a `*.tsx` under `emails/`.
- Templates accept typed props.
- The email service maps template name → component + props.

## CG12 — SANITY STUDIO
- Studio config lives under `studio/`.
- Schemas under `studio/schemas/`.
- Each schema exports a default object with `name`, `type`, `title`, `fields`.

## CG13 — DATABASE SCHEMA
- One `prisma/schema.prisma` per project.
- Models match the integration rules' `database` blocks.
- Indexes declared explicitly.

## CG14 — METADATA AND SEO
- Every public page exports `generateMetadata`.
- Metadata pulls from CMS or page-level constants.
- No raw `<head>` writes.

## CG15 — STATES
- Every dynamic route ships `loading.tsx`, `error.tsx`, `not-found.tsx` per F13.

## CG16 — STYLING
- Tailwind + shadcn/ui.
- No CSS-in-JS runtime libraries.

## CG17 — NO HARDCODED VALUES
- Stripe price ids, Clerk URLs, Sanity project ids, domain strings → all via env.

## CG18 — IDEMPOTENT WRITES
- Webhook-driven writes use upsert semantics keyed on provider id.

## CG19 — LOGGING
- Single logger module.
- Required fields: `level`, `message`, `request_id`, `user_id`, `route`, `latency_ms`.

## CG20 — SELF-AUDIT BEFORE EMIT
For each generated file:
- Confirm path matches plan.
- Confirm imports exist.
- Confirm no invented identifiers.
- Confirm no placeholders.
If any check fails, regenerate the file.

For each generated route or shared UI surface:
- Confirm the relevant per-page spec, component spec, and design token guidance were read first.
- Confirm visual composition matches the locked frontend bundle rather than a generic fallback scaffold.
- Confirm trust-critical surfaces preserve required proof, trust, and conversion blocks from the planning artifacts.

## CG21 — ZERO-WARNING QUALITY ENFORCEMENT
- Generated scripts and configs MUST support lint/typecheck/test with zero warnings.
- Lint configuration MUST fail on warnings.

## CG22 — OPERATION MODE SAFETY
- Execution-only requests MUST NOT trigger code edits or package installs unless a blocker is reported and fix mode is entered.

## CG23 — DEV STARTUP READINESS
- Generated projects MUST include scripts so `npm run dev` starts the app from project root after setup.

## CG24 — CONTENT-KEY ENFORCEMENT
- User-facing copy MUST resolve through the planned content library keys when frontend constraints require key-based content.
- Hardcoded UI copy in JSX/TSX is forbidden unless marked as documented third-party exception.
- If content keys are missing, codegen MUST BLOCK with `EXECUTION_DRIFT` rather than fallback to inline copy.

## CG25 — FRONTEND DEPTH MINIMUMS
- For non-exempt public pages, generated composition MUST satisfy required section-depth posture from frontend constraints.
- List-only implementations for trust-critical pages (services, reviews, proof) are forbidden when richer planned sections exist.
- Placeholder visual shells (for example empty media boxes) are forbidden for planned real-content surfaces.

## CG26 — SEMANTIC PARITY ENFORCEMENT
- If plan/spec declares an interactive behavior, codegen MUST emit real implementation wiring for that behavior.
- If plan/spec declares CMS-backed data, codegen MUST emit data fetch/query bindings and not static-only placeholder arrays.
- Any semantic mismatch MUST fail generation with `PLAN_SPEC_CODE_MISMATCH`.

## CG27 — DELIVERY CLASSIFICATION OUTPUT
- Codegen execution summary MUST include `delivery_class`.
- `delivery_class=production_candidate` is allowed only when all execution acceptance gates pass.
- Any blocker gate failure MUST force `delivery_class=blocked` and overall execution `status=failed`.

## CG28 — FRONTEND BLOCKER ENFORCEMENT
- If generated frontend config or content marks placeholder business identity or trust facts as active (for example `placeholderBusinessFacts: true`), execution MUST NOT classify the run as `production_candidate`.
- If a page planned as `cms` or `mixed` resolves through hardcoded arrays or `mock-data` for its primary public rendering path, execution MUST fail semantic parity with `PLAN_SPEC_CODE_MISMATCH` unless the run is explicitly classified as a mock-only baseline prototype.
- For local-business trust and similar real-media archetypes, generated public media MUST NOT ship with `images.unsplash.com` URLs in production-classified output.
- Missing `execution_summary.json` or `environment_setup_report.json` is a blocker failure.

## CG29 — VISUAL QA GATE
- Frontend scope runs MUST emit screenshot-based visual QA for the key desktop and mobile routes.
- Minimum visual QA targets:
	- home page
	- primary conversion route
	- primary proof/reviews route
- Visual QA MUST validate:
	- screenshot parity against the locked visual contract
	- no collapsed or hidden primary content
	- no unreadable foreground/background combinations
	- no overflow at required mobile and desktop widths
- Visual QA evidence MUST be written under `DOC/output/runs/<timestamp>/reports/visual-qa/`.
- If visual QA fails, execution MUST fail with `VISUAL_QA_FAILED`.
