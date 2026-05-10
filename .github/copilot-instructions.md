# Copilot Workspace Instructions

Use only two selectable entrypoint agents under .github/agents in Copilot Chat.

## Source Of Truth
- Canonical planning framework lives in DOC/.
- .github/agents exposes only entrypoints for a low-chaos workflow.

## Operating Rules
- Start planning with master_planner.agent.md.
- Use execution_orchestrator.agent.md only after plan is LOCKED and validation passes.
- Do not invoke sub-agents manually unless debugging a specific stage.
- Do not invent integrations, routes, env vars, or schema fields that are absent from DOC knowledge files.

## Artifact Output
Write generated artifacts under DOC/output/runs/<timestamp>/ with subfolders:
- planning/
- specs/
- reports/
- codegen/
