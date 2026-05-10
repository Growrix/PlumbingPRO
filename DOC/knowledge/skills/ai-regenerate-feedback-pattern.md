# Skill: AI Regenerate and Feedback Pattern

**Used by:** chat assistants with quality feedback loops

## Pattern
Enable regenerate, like/dislike, and guided retry per assistant message.

## Rules
- Actions must bind to message id and prompt id
- Regenerate attempts must preserve provenance of prior attempts
- Feedback should include reason taxonomy for evaluability