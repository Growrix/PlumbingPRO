# Skill — Synthetic Fixture Smoke-Test Pattern

## Purpose
Walk a deterministic input fixture through the documented agent chain to confirm wiring, contracts, and output artifacts without actually running sub-planner code. Used by `system_architect SMOKE` mode and AUDIT Section H.

## When to use
- After any structural change to the agentic OS (new agent, removed file, schema change).
- Before declaring a system READY for tasking.
- When integrating with a new client brief, to confirm the chain handles the input shape.

## Inputs
- A fixture file: `DOC/validation/audit-fixtures/<fixture-id>.json`.
- A sibling expected-output file: `DOC/validation/audit-fixtures/expected-outputs/<fixture-id>.expected.json`.
- The agent chain order (canonical: `intake_strategist` → `integration_planner` → `frontend_planner` → `backend_planner` → `devops_planner` → `qa_planner` → `security_auditor` → `performance_auditor` → `reviewer`).

## Procedure
1. `Read` the fixture and its `expected_outcome` (`pass` | `block`).
2. `Read` the expected-output file. Note `expected_artifacts[]`, `expected_brief_shape`, `expected_block_response`, `expected_validation_report`.
3. For each step in the agent chain:
   1. `Read` the agent file's INPUT FORMAT and confirm it can accept the prior agent's OUTPUT FORMAT (or the fixture for stage 1).
   2. Confirm the agent file exists (cross-ref D.1).
   3. Confirm the OUTPUT FORMAT lists every artifact the next stage requires.
   4. If the fixture expects a BLOCK at this stage, confirm the agent's FAILURE MODES section lists the expected block reason.
4. After walking the chain, compare the synthesised output shape against `expected_artifacts[]` and `expected_brief_shape` (key-presence comparison; values may be enumerated values from rules but not freeform).
5. For negative fixtures, confirm BLOCK fires at the documented stage with the documented reason code.

## Anti-patterns (do not do)
- **Do not** invent values not in the rules; only enumerated values from knowledge files are valid.
- **Do not** skip a stage because "it doesn't apply"; every stage must be visited and either traversed or declared `not-applicable` with reason.
- **Do not** treat an actual run of agent code as required; this skill is a *contract walk*, not a live execution.

## Output schema
```yaml
smoke_walk:
  fixture: <fixture-id>
  expected_outcome: pass | block
  actual_outcome: pass | block | drift
  chain:
    - stage: <agent-name>
      input_contract_ok: true | false
      output_contract_ok: true | false
      block_raised: true | false
      block_reason: <code | null>
      notes: <free-form>
  artifacts_check:
    - artifact: <name>
      expected: true | false
      produced_by: <agent-name | null>
      ok: true | false
  contract_mismatches: [<step>]
  result: pass | fail
  evidence: "Read:<files-walked>"
```

## Examples

### Example 1 — happy-path fixture
```yaml
smoke_walk:
  fixture: brief-marketing-site-plumber
  expected_outcome: pass
  actual_outcome: pass
  chain:
    - stage: intake_strategist
      input_contract_ok: true
      output_contract_ok: true
      block_raised: false
    - stage: integration_planner
      input_contract_ok: true
      output_contract_ok: true
      block_raised: false
    # ...
  artifacts_check:
    - artifact: brief.json
      expected: true
      produced_by: intake_strategist
      ok: true
    - artifact: integrations.json
      expected: true
      produced_by: integration_planner
      ok: true
    - artifact: validation_report.json
      expected: true
      produced_by: reviewer
      ok: true
  result: pass
```

### Example 2 — negative fixture (must BLOCK)
```yaml
smoke_walk:
  fixture: brief-malformed
  expected_outcome: block
  actual_outcome: block
  chain:
    - stage: intake_strategist
      input_contract_ok: true
      output_contract_ok: n/a
      block_raised: true
      block_reason: EMPTY_REQUEST
  artifacts_check:
    - artifact: plan.json
      expected: false
      produced_by: null
      ok: true
  result: pass
```

## Failure modes
- `CHAIN_BREAK` — a stage's input contract does not accept the prior stage's output.
- `MISSING_PRODUCER` — an expected artifact has no producing agent.
- `WRONG_BLOCK_STAGE` — block raised at the wrong stage or with the wrong reason code.
- `EXTRA_BLOCK` — block raised on a fixture that should have passed.
- `EXTRA_ARTIFACT` — agent emits an artifact not declared in expected outputs (drift).
