# AI Collaboration Playbook

## Purpose

This document defines how AI coding agents should contribute to Growrix OS. The goal is not merely faster generation. The goal is controlled, architecture-aligned execution that preserves business rules and system integrity.

## AI Operating Principles

- Treat `DOC/` as the authoritative source before making implementation decisions.
- Start with `DOC/Universal/Enterprise Level Guide/ai/ai-context.yaml` when you need a compact system map or a task-based read path.
- Do not invent business rules when a requirement is unclear. Raise the gap or document the assumption.
- Keep changes scoped to one module or one clearly related slice when possible.
- Prefer root-cause fixes over cosmetic patches.
- Update documentation when code changes alter behavior or assumptions.

## Required Context Order Before Coding

1. Read `DOC/Universal/Enterprise Level Guide/ai/ai-context.yaml` first.
2. Follow the relevant `read_paths` entry in that file for the target task.
3. Read workspace instructions in `.github/`.
4. Inspect existing code for current implementation patterns before editing.

## Strict Execution Workflow (Step-by-Step)

When executing any implementation task, follow this sequence in order:

1. Read `DOC/PROJECT PLAN/ai-context.yaml` (or the equivalent project entrypoint) before making any change.
2. Read task-relevant documentation and nearby implementation files.
3. Form a falsifiable hypothesis about the change or defect before touching code.
4. Make the smallest grounded edit that addresses the task.
5. Immediately run the narrowest useful validation (lint, type check, unit test, or targeted build).
6. If docs are out of sync with the implementation, update them before finishing.
7. Run final release-gate checks relevant to the task.
8. Commit locally with a clear, descriptive message.

## Tool Discipline

- Use read and search first to gather the minimum required context.
- Use edit for the smallest practical change set — avoid touching unrelated code.
- Use execute only for focused validation commands, build/test runs, and local git commit operations.
- Use task tracking when a task has multiple concrete steps that need sequencing.
- Do not use broader exploration than needed once the controlling file or abstraction is identified.

## AI Rules for Domain Safety

- Never weaken role boundaries for convenience.
- Never implement priority queue logic without protecting idempotency and ordering.
- Never make delivered work public without an approval control.
- Never expose private storage objects directly without verifying access intent.
- Never let client-side state become the source of truth for project status.
- Never treat an embedded CMS studio (for example Sanity Studio) as part of the public app install or deploy lifecycle without explicit project documentation approving that coupling.

## Expected AI Deliverables

For meaningful feature work, AI agents should produce or update:

- code changes
- tests for critical logic
- docs when contracts or rules changed
- migration or policy changes where needed
- concise rationale in the final summary

## Output Format

Every completed task must return:

1. What was changed
2. What documentation was updated, if any
3. What validations were run and whether they passed
4. The local commit hash, if a commit was created
5. Any remaining risk or follow-up only if one truly exists

## Preferred Working Pattern

- Start by identifying the owning module.
- Identify affected data entities and API contracts.
- Implement domain service logic first for business rules.
- Connect UI only after server behavior and authorization are clear.
- Validate with tests or explicit reasoning about failure cases.

## Mandatory Validation Checklist

- Is authorization enforced server-side?
- Is there a documented source of truth for the state being changed?
- Are failure paths handled?
- Are side effects explicit and observable?
- Does the change preserve module boundaries?
- Do docs need updating?

## Zero-Gate Pass Rule

A task is not complete until all of the following are confirmed as passing for the scope of the change:

- no unresolved build failures
- no unresolved TypeScript or lint errors
- no test failures related to changed code
- relevant documentation is in sync with implemented behavior

If any gate fails, stop, fix, and re-run before declaring done.

## Local Commit Discipline

- ALWAYS commit completed work locally when changes were made.
- NEVER push code without explicit user instruction.
- NEVER merge code without explicit user instruction.
- NEVER skip validation just because the change looks small.

## Prompting Guidance for Future AI Work

Good prompts should specify:

- module name
- affected user roles
- relevant business rule
- expected API or schema impact
- required tests
- starting reference: `DOC/Universal/Enterprise Level Guide/ai/ai-context.yaml`

Example:

"Start with DOC/Universal/Enterprise Level Guide/ai/ai-context.yaml. Implement the admin assignment workflow for queue management. Use the queue rules in DOC/Universal/Enterprise Level Guide, preserve admin-only assignment, create the project record transactionally, and add tests for duplicate assignment prevention."

## Anti-Patterns

- generating UI-first features without backend and policy alignment
- editing multiple domains without a unifying plan
- introducing undocumented status values
- bypassing payment verification in testable code paths
- scattering queue logic across pages, hooks, and handlers

## Documentation Discipline

- If implementation clarifies a previously vague rule, update the relevant spec.
- If docs and code conflict, resolve the conflict explicitly instead of silently drifting.
- For Sanity or similar CMS tools inside a monorepo, document Node version policy, install isolation, lockfile ownership, CI ownership, and hosting/domain ownership before editing package scripts.