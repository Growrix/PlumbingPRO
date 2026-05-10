# DATA FLOW - AI STREAMING WITH CITATIONS

## OVERVIEW
Stream model output while attaching source citations and tool-use steps.

## FLOW
- Client submits prompt with conversation context
- API route performs moderation and retrieval
- Model streams tokens and emits citation metadata chunks
- Client renders partial text, citations, and tool-call status timeline
- Completion stores final message, citations, usage, and feedback hooks

## CONSTRAINTS
- Citation references must map to retrievable source ids
- Tool call steps must be visible and attributable to message id
- Usage counters must update per response