# Skill: AI Streaming With Tool Use Pattern

**Used by:** tool-calling assistants

## Pattern
Interleave token stream with structured tool-call steps.

## Rules
- Tool invocation steps must be rendered with status transitions
- Tool outputs must be versioned and attributed to tool call id
- Final answer must reference tool results used