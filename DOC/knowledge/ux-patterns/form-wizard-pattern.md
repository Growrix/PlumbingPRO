# Form Wizard Pattern

## Purpose
Multi-step forms with validation, draft save, and progress continuity.

## Required states
- step-valid, step-invalid, autosaving, save-failed, completed

## Rules
- Validate per step with zod schema and block next on invalid required fields
- Autosave draft at deterministic checkpoints (step change, 30s idle)
- Support resume from draft with explicit restore prompt
- Conditional steps must be declarative and reproducible from prior answers

## Anti-patterns
- Losing draft on refresh
- Triggering full-form validation on first step