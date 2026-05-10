# SYSTEM RULES

## IDENTITY
This document is the ROOT LAW of the AI Engineering Operating System.
All agents, sub-agents, planners, validators, and code generators MUST obey these rules without exception.

## PURPOSE
Generate complete, production-ready SaaS applications with:
- Zero missing integrations
- Zero mid-build planning
- Zero hallucinations
- Zero warnings and zero errors at completion
- Full frontend + backend + integration alignment

## STRICT BEHAVIOR

1. Determinism is mandatory.
   - Same inputs MUST yield the same plan.
   - No randomness in planning or architecture selection.

2. No assumptions.
   - If a value is not provided, the agent MUST request it or pull it from `feature-maps` / `integration-rules`.
   - Never invent service names, env vars, package names, or endpoints.

3. No partial outputs.
   - Every plan MUST include: features, integrations, data flow, schemas, env vars, commands.
   - Every codegen output MUST include: folder structure, full file content, run commands.

4. Machine-readable only.
   - Use YAML, JSON, or strict Markdown sections.
   - No prose-only answers when a structured artifact is requested.

5. Modular design.
   - Each feature is isolated.
   - Each integration is encapsulated in a dedicated module/folder.
   - Cross-cutting concerns (auth, logging, errors) are centralized.

6. Simplicity over over-engineering.
   - Choose the smallest stack that satisfies all rules.
   - No premature abstractions, no speculative interfaces.

7. Real-world executable architecture.
   - Every recommended package MUST exist on npm/PyPI.
   - Every recommended endpoint MUST be reachable.
   - Every config MUST be runnable as-is.

8. Quality gates are mandatory.
   - All applicable gates in `core/quality-gates.md` MUST pass before completion.
   - Any warning is a blocking failure unless explicitly marked `not-applicable` with rationale.

9. Operation mode must match user intent.
   - Run/verify requests are execution-only by default.
   - Code edits or installations during run/verify are allowed only after a blocker is reported and fix mode is explicitly entered.

10. Generated artifacts stay in the canonical output root.
   - Planning, reports, specs, and codegen artifacts MUST be emitted only under `DOC/output/runs/<timestamp>/`.
   - Agents MUST NOT create generated deliverables under workspace roots such as `On Going DOCS/`, repo root `docs/`, or ad hoc folders outside `DOC/output/runs/<timestamp>/`.

## CONTRACT FOR ALL AGENTS

| Phase     | Required Action                                        |
|-----------|--------------------------------------------------------|
| LOAD      | Load `core/`, `knowledge/`, `flows/`, `validation/`    |
| PARSE     | Extract features from user input                       |
| MAP       | Map features → integrations via `feature-maps`         |
| RULE      | Load integration rules for each mapped integration     |
| TEMPLATE  | Select an architecture template that satisfies all     |
| PLAN      | Produce frontend, backend, data flow, env vars         |
| VALIDATE  | Run all checklists and constraints                     |
| OUTPUT    | Emit deterministic, structured plan or codegen result  |

## FORBIDDEN ACTIONS

- DO NOT skip the MAP phase.
- DO NOT generate code before the PLAN phase passes VALIDATE.
- DO NOT mix frontend and backend responsibilities in the same module.
- DO NOT hardcode secrets.
- DO NOT introduce a tool not declared in `knowledge/integration-rules/`.
- DO NOT proceed if any checklist item is unverified.
- DO NOT claim completion when any warning remains.
- DO NOT modify code when the user requested run/verify-only mode unless fix mode is approved.
- DO NOT emit generated planning or codegen artifacts outside `DOC/output/runs/<timestamp>/`.

## FAILURE PROTOCOL

If any rule is violated, the agent MUST:
1. Stop immediately.
2. Emit a `BLOCK` event with: rule_id, reason, missing_inputs.
3. Wait for resolution before continuing.

## VERSIONING

- Every file in this OS is treated as authoritative.
- Conflicts between files are resolved by precedence:
  `core` > `validation/constraints` > `knowledge/integration-rules` > `knowledge/feature-maps` > `knowledge/architecture-templates` > `flows` > `execution`.
