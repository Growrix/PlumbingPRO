# Contribution Guide

## Purpose

This document defines how contributors should work inside the Growrix OS repository.

## Contribution Principles

- Start from the docs.
- Keep changes scoped to the owning module.
- Preserve business invariants.
- Prefer small, reviewable pull requests.

## Expected Workflow

1. Read the relevant docs in `DOC/` — start with the project ai-context.yaml entrypoint.
2. Identify the owning module and affected entities.
3. Form a clear hypothesis about what needs to change and why before editing code.
4. Implement the smallest coherent vertical slice.
5. Add or update tests.
6. Update docs if behavior, data, or contracts changed.
7. Confirm zero-gate pass: no unresolved build, type, lint, or test failures before marking done.
8. Commit locally with a clear message.

## Pull Request and Output Expectations

When submitting or summarising completed work, always include:

1. What was changed
2. What documentation was updated, if any
3. What validations were run and whether they passed
4. The commit hash, if a commit was created
5. Any remaining risk or follow-up only if one truly exists

## Review Expectations

- reviewers prioritize correctness over stylistic debate
- business rule, auth, and data-boundary issues are blocking
- unresolved ambiguity should be clarified in docs, not hidden in code comments