# Skill — Determinism Diff Pattern

## Purpose
Detect non-deterministic agent output by running the same fixture twice and comparing the produced artifacts. Any field that differs between runs (after stripping known-volatile fields like timestamps and request ids) is a determinism violation. Used by `system_architect DETERMINISM` mode.

## When to use
- After any change to a planner agent's WORKFLOW or DECISION RULES.
- Before tasking the system on a real client brief.
- As a regression gate — a stable system MUST be deterministic.

## Inputs
- A fixture file.
- Two artifact bundles produced by running the system on the same fixture twice.
- A stripping rule list (fields to ignore: `timestamp`, `audit_run.timestamp`, request ids, generated UUIDs).

## Procedure
1. Run (or simulate) the chain on the fixture → artifact bundle 1.
2. Run again → artifact bundle 2.
3. For each artifact in both bundles:
   1. Strip volatile fields per the rule list.
   2. Compute SHA-256 hash of the canonicalised JSON.
4. Compare hashes pairwise.
5. For any mismatch:
   1. Diff the JSON.
   2. Identify the first differing field.
   3. Trace it back to the responsible agent.
   4. Identify the source of non-determinism (random pick, time-dependent default, set ordering, hash map iteration).

## Anti-patterns (do not do)
- **Do not** skip canonicalisation; key ordering differences are spurious failures.
- **Do not** ignore "small" differences — a minor field drift today is a major drift tomorrow.
- **Do not** declare a determinism pass without two actual runs (this skill cannot be satisfied by reading prose).

## Volatile fields to strip (default rule list)
```yaml
strip_fields:
  - $..timestamp
  - $..created_at
  - $..updated_at
  - $..occurred_at
  - $..audit_run.timestamp
  - $..run_id
  - $..request_id
  - $..correlation_id
  - $..trace_id
```

## Output schema
```yaml
determinism_diff:
  fixture: <fixture-id>
  artifacts_compared:
    - name: <artifact-name>
      hash_run_1: <sha256>
      hash_run_2: <sha256>
      match: true | false
      drift:
        - field: <json-pointer>
          run_1_value: <any>
          run_2_value: <any>
          suspected_source: <agent + workflow step>
  overall_match: true | false
  result: pass | fail
```

## Example
```yaml
determinism_diff:
  fixture: brief-saas-standard
  artifacts_compared:
    - name: brief.json
      hash_run_1: a1b2c3...
      hash_run_2: a1b2c3...
      match: true
      drift: []
    - name: integrations.json
      hash_run_1: 4f5e6d...
      hash_run_2: 9a8b7c...
      match: false
      drift:
        - field: $.integrations.search
          run_1_value: meilisearch
          run_2_value: algolia
          suspected_source: integration_planner.WORKFLOW step 3 (alternative pick when preset default unavailable)
  overall_match: false
  result: fail
```

## Common non-determinism sources

| Source | Symptom | Fix |
|---|---|---|
| Set/dict iteration order | Same elements, different order | Sort outputs by canonical key |
| Random alternative pick | Different integration chosen across runs | Tie-break alphabetically per planning-principles |
| Time-dependent defaults | Default changes by date or seed | Pin the default in the rule file |
| Floating-point arithmetic | Subtle numeric drift | Use rationals or fixed-precision |
| Concurrent agent fan-out | Outputs in non-deterministic order | Serialise post-process; sort by agent id |

## Failure modes
- `NON_DETERMINISTIC_OUTPUT` — at least one field differs between runs.
- `MISSING_RUN` — fewer than two runs available; cannot compare.
- `HASH_DRIFT_UNATTRIBUTED` — output hashes differ but no field-level drift was identified (canonicalisation bug; investigate the diff tool).
