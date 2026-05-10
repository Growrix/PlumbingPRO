# Skill: Onboarding Checklist Pattern

**Used by:** userflow, appcues, first-run product activation

## Pattern
Represent onboarding as deterministic checklist steps with persisted completion.

## Rules
- Steps must have stable ids and completion predicates
- Completion emits analytics event for each step
- Checklist must support skip and resume