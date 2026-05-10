# Skill: Notification Preferences Pattern

**Used by:** knock, novu, onesignal, twilio

## Pattern
Per-user channel preference model for opt-in/opt-out and digest behavior.

## Rules
- Store channel preferences with source and updated_at metadata
- Enforce preferences before dispatching notifications
- Provide fail-safe defaults for compliance-critical channels