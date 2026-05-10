# Skill — Glob-Based Inventory Pattern

## Purpose
Verify that a folder contains the expected set of files by running glob queries and comparing actual counts against an authoritative manifest. Used by `system_architect AUDIT` Section A.

## When to use
- Before any wiring check, confirm files exist on disk.
- When a manifest declares a folder must contain ≥ N files.
- When detecting "drift" — files outside expected patterns.

## Inputs
- A manifest of `(path_pattern, min_count, file_role)` triples.
- The target directory.

## Procedure
1. For each manifest entry, run `Glob: <path_pattern>` against the target.
2. Capture the count of matches.
3. If count < min_count → flag as failure with the pattern + actual count.
4. After processing every manifest entry, run `Glob: <target>/**/*` and subtract the union of every matched manifest pattern. Files left over are DRIFT (recorded but non-blocking).
5. Capture evidence: `Glob:<pattern> → <count> files`.

## Anti-patterns (do not do)
- **Do not** infer file existence from prose ("the README mentions there are 87 integrations").
- **Do not** count files via `Read` and counting lines or cross-referencing manifests instead of globbing.
- **Do not** skip the drift scan; it catches accidentally-committed scratch files.

## Output schema
```yaml
inventory_results:
  - pattern: <glob-pattern>
    expected_min: <int>
    actual_count: <int>
    status: pass | fail
    evidence: "Glob:<pattern> → <count> files"
drift:
  - <unexpected file path>
```

## Example
```yaml
- pattern: "DOC/knowledge/integration-rules/**/*.yaml"
  expected_min: 80
  actual_count: 87
  status: pass
  evidence: "Glob:DOC/knowledge/integration-rules/**/*.yaml → 87 files"

- pattern: "DOC/knowledge/integration-presets/*.yaml"
  expected_min: 7
  actual_count: 7
  status: pass
  evidence: "Glob:DOC/knowledge/integration-presets/*.yaml → 7 files"

- pattern: "DOC/agents/_index.md"
  expected_min: 1
  actual_count: 0
  status: fail
  evidence: "Glob:DOC/agents/_index.md → 0 files"
```

## Failure modes
- `MISSING_FILE` — required path returned 0 matches.
- `LOW_COUNT` — pattern returned fewer than min_count.
- `DRIFT_DETECTED` — files exist outside the manifest patterns.
