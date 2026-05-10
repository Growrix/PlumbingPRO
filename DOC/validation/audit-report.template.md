# Audit Report Template — Agentic OS

This is the structured shape every `system_architect AUDIT` run MUST emit. No freeform reports. Every PASS/FAIL must cite evidence.

---

## Run header

```yaml
audit_run:
  timestamp: <ISO 8601>
  target_dir: <absolute path>
  mode: AUDIT | SMOKE | DETERMINISM
  fixture: <fixture-id or null>
  meta_agent_version: <version of system_architect that produced this>
  template_version: 1
```

---

## Executive summary

```yaml
summary:
  production_ready_pct: <0-100>
  verdict: READY | READY_WITH_ADVISORIES | NOT_READY
  verdict_one_liner: "<single sentence describing the gate state>"
  blocker_count: <int>
  advisory_count: <int>
  drift_count: <int>
  sections_passed: <int> / 10
  total_checks_run: <int>
  checks_passed: <int>
  checks_failed: <int>
  checks_not_applicable: <int>
```

---

## Section results

For each of A, B, C, D, E, F, G, H, I, J, render this block:

```yaml
section_<letter>:
  name: <Inventory | Reference integrity | ...>
  status: passed | failed
  blockers: <int>
  advisories: <int>
  checks:
    - id: <A.1 | B.3 | etc>
      name: <human-readable>
      status: pass | fail | not-applicable
      severity: blocker | advisory | drift | n/a
      evidence: "<tool>:<command-or-glob> → <result-summary>"
      details: |
        <free-form details only when fail; cite paths and line numbers>
```

Example check output:
```yaml
- id: B.3
  name: Integration `required_skills` resolve to skill files
  status: fail
  severity: blocker
  evidence: "Glob: DOC/knowledge/skills/foo-bar-pattern.md → 0 files"
  details: |
    Integration `permit-io` (DOC/knowledge/integration-rules/enterprise/permit-io.yaml)
    declares required_skills: ["rbac-policy-evaluation-pattern", "foo-bar-pattern"].
    "foo-bar-pattern" has no .md file in DOC/knowledge/skills/.
```

---

## Orphans block

```yaml
orphans:
  skills_unreferenced:
    - <path>
  integrations_unreferenced:
    - <path>
  presets_unselectable:
    - <preset>
  constraints_unloaded:
    - <path>
  spec_rules_unreferenced:
    - <path>
```

---

## Broken references block

```yaml
broken_references:
  - source: <path or agent name>
    expected_target: <path or pattern>
    actual: <not_found | wrong_type | empty_glob>
    section_check: <which check id flagged this>
```

---

## Inconsistencies block

```yaml
inconsistencies:
  - kind: <schema_mismatch | event_orphan | tier_mismatch | alternatives_drift | other>
    location: <path>
    description: "<what is inconsistent>"
    severity: blocker | advisory
```

---

## Top 10 fixes (ordered by impact)

For each fix, render:

```yaml
fixes:
  - rank: 1
    target_file: <absolute path>
    change_type: edit | create | delete | move
    exact_change: |
      <description of the precise edit, with old_string and new_string when an edit>
    blast_radius: <files affected if applied>
    closes_check_ids: [<check ids this fix closes>]
    risk: low | medium | high
```

Stop at 10 even if there are more. The remaining are listed in a `deferred_fixes` block at the bottom.

---

## Determinism block (when mode=DETERMINISM)

```yaml
determinism:
  fixture: <fixture-id>
  run_1_hash: <sha256>
  run_2_hash: <sha256>
  match: true | false
  drifting_fields:
    - field: <json path>
      run_1_value: <value>
      run_2_value: <value>
      reason: <suspected non-determinism source>
```

---

## Smoke block (when mode=SMOKE)

```yaml
smoke:
  fixture: <fixture-id>
  expected_outcome: <pass | block-at-stage>
  actual_outcome: <pass | block-at-stage | drift>
  chain_walk:
    - stage: intake_strategist
      input_ok: true
      output_ok: true
      block_raised: false
    - stage: integration_planner
      input_ok: true
      output_ok: true
      block_raised: false
    # ...
  contract_mismatches: []
  artifact_producers:
    - artifact: brief.json
      producer: intake_strategist
      ok: true
    - artifact: integrations.json
      producer: integration_planner
      ok: true
    # ...
```

---

## Verdict

```yaml
verdict:
  state: READY | READY_WITH_ADVISORIES | NOT_READY
  reason: |
    <single short paragraph naming the binding constraint>
  next_action: |
    <single recommendation: "apply Top 10 fix #1 then re-audit" | "ready to task" | etc.>
```

---

## JSON output

Every audit run also emits the same content as `<target>/reports/audit-report.<timestamp>.json` with this shape:

```json
{
  "audit_run": { ... },
  "summary": { ... },
  "sections": {
    "A": { "name": "...", "status": "...", "checks": [ ... ] },
    "B": { ... },
    "C": { ... },
    "D": { ... },
    "E": { ... },
    "F": { ... },
    "G": { ... },
    "H": { ... },
    "I": { ... },
    "J": { ... }
  },
  "orphans": { ... },
  "broken_references": [ ... ],
  "inconsistencies": [ ... ],
  "fixes": [ ... ],
  "determinism": { ... },
  "smoke": { ... },
  "verdict": { ... }
}
```

The JSON is the machine-consumable contract; the Markdown is the human-readable surface. Both MUST be emitted.

---

## Forbidden in audit reports

- `pass` without `evidence` populated.
- `pass` with `evidence: "verified by reading the file"` (non-specific).
- Aggregate sections without per-check breakdowns.
- "Mostly passing" or "85% complete" without listing the failing checks.
- Verdict `READY` when any check has `severity: blocker`.
- Skipping a check without `not-applicable` + reason.
