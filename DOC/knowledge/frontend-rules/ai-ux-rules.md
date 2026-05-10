# AI UX Rules

## Purpose
Deterministic UX requirements for AI-native product surfaces.

## Rules
- Streaming responses must expose token progress and cancel action
- Source citations must be renderable and inspectable
- Regenerate and feedback actions must bind to message id and prompt id
- Tool-use steps must be visible when models call external tools
- Usage meter must show plan limits and remaining quota

## Safety constraints
- AI outputs must be visually distinct from verified system data
- High-risk actions must require confirmation before execution