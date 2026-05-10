# DATA FLOW - ONBOARDING CHECKLIST

## OVERVIEW
Tracks first-run progression from account creation to activated workspace.

## FLOW
- User signs in first time
- System creates onboarding progress record
- Checklist steps update as user completes setup actions
- Completion emits `onboarding.completed` analytics event

## CONSTRAINTS
- Progress must persist per user and tenant
- Skip and resume paths must be deterministic