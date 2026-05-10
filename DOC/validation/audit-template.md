# Audit Template — Agentic OS Deterministic Test Harness

This is the canonical, command-driven audit harness for the agentic OS. It is consumed by `system_architect.agent.md` in `AUDIT` mode and by any future AI auditing this or any other agentic system.

The template is **runnable**, not narrative. Every check has an exact command, an expected result shape, a pass criterion, and an evidence format. **An audit run that does not execute commands and cite their output is invalid.**

---

## Top-level rules

1. **Evidence-first.** Every PASS in a report MUST cite the command/glob that produced the evidence and the line/path it landed on. PASS without evidence is a forbidden hallucination.
2. **Binary verdict per check.** No partial states. `pass | fail | not-applicable`. `not-applicable` requires a reason.
3. **Failure classes:**
   - `BLOCKER` — system cannot be tasked until fixed.
   - `ADVISORY` — quality issue; system can still be tasked.
   - `DRIFT` — unexpected file or content change vs the manifest; recorded for review.
4. **Section pass/fail policy:**
   - Failure in **B** (reference integrity), **D** (wiring coverage), or **G** (constraint evaluability) → BLOCKER.
   - Failure in **A** (inventory), **C** (schema compliance), or **E** (orphans) → ADVISORY unless it cascades into a B/D/G failure.
   - Failure in **F** (determinism) or **H** (smoke) → BLOCKER if it breaks determinism guarantees.
   - Failure in **I** (frontend quality bar + creative latitude) or **J** (developer completeness contract) → BLOCKER.
5. **Evidence cite format:** `<tool>:<command-or-glob> → <result-summary>`. Examples:
   - `Glob:DOC/knowledge/integration-rules/**/*.yaml → 87 files`
   - `Grep:"agent: integration_planner" in DOC/agents/*.agent.md → 1 match at integration_planner.agent.md:2`
   - `Read:DOC/knowledge/integration-rules/payments/stripe.yaml#emits_outbound_events → ["subscription.created", "payment.succeeded"]`

---

## Target manifest (what should exist)

The audit runs against the agentic OS at `f:\PROJECTS\Agent\DOC\`. Adjust paths if auditing a different system.

```
DOC/
├── core/                                 (≥ 6 files: system-rules, anti-hallucination, planning-principles, security-principles, devops-principles, testing-principles, quality-gates)
├── agents/                               (≥ 22 agent files + _index.md)
├── knowledge/
│   ├── integration-rules/
│   │   ├── _index.md                     (required)
│   │   ├── _schema.md                    (required)
│   │   ├── _meta/role-matrix.json        (required)
│   │   └── <category>/<name>.yaml        (≥ 80 files across category subfolders)
│   ├── integration-presets/*.yaml        (≥ 7 presets)
│   ├── feature-maps/feature-integration-map.json
│   ├── architecture-templates/*.yaml     (≥ 5)
│   ├── frontend-rules/                   (rules + visual-archetypes/)
│   ├── industries/                       (≥ 5 packs)
│   ├── automation-rules/                 (3 files: rules, taxonomy, signing)
│   ├── skills/                           (_index.md + skill files)
│   ├── support-tools/                    (_index.md + categorised yamls)
│   ├── backend-rules/, devops-rules/, security-rules/, testing-rules/, performance-rules/, api-rules/, database-rules/, deployment-rules/
│   └── references/                       (read-only library)
├── flows/{data-flows,system-flows}/
├── validation/
│   ├── checklists/                       (pre-planning, pre-build, pre-deployment, post-deploy, reviewer-audit, security, integration)
│   ├── constraints/                      (constraints, frontend, accessibility, security, performance, data, testing, integration)
│   ├── audit-template.md                 (this file)
│   ├── audit-report.template.md
│   └── audit-fixtures/                   (briefs + expected-outputs/)
└── execution/
    ├── codegen-rules/
    └── spec-rules/                       (≥ 19 spec files)
```

---

## SECTION A — Inventory

### A.1 Folder presence
**Command:** `Glob: DOC/<each-required-folder>/`
**Expected:** every required folder exists.
**Pass if:** glob returns ≥ 1 entry per folder.
**Evidence:** folder path + entry count.
**Failure:** ADVISORY (`A.1 missing folder <path>`).

### A.2 File counts per folder
**Command:** for each folder in the manifest, `Glob: <folder>/**/*` then count.
**Expected:** counts match manifest minimums.
**Pass if:** count ≥ manifest minimum.
**Evidence:** `<folder> → <count> (min <expected>)`.
**Failure:** ADVISORY unless folder is missing → BLOCKER.

### A.3 Required named files
**Command:** `Read` (or `Glob` for unique match) on each of:
- `DOC/core/system-rules.md`
- `DOC/core/anti-hallucination-rules.md`
- `DOC/core/planning-principles.md`
- `DOC/agents/master_planner.agent.md`
- `DOC/agents/intake_strategist.agent.md`
- `DOC/agents/integration_planner.agent.md`
- `DOC/agents/reviewer.agent.md`
- `DOC/agents/_index.md`
- `DOC/knowledge/integration-rules/_index.md`
- `DOC/knowledge/integration-rules/_schema.md`
- `DOC/knowledge/integration-rules/_meta/role-matrix.json`
- `DOC/knowledge/feature-maps/feature-integration-map.json`
- `DOC/knowledge/automation-rules/automation-rules.md`
- `DOC/knowledge/automation-rules/outbound-event-taxonomy.md`
- `DOC/knowledge/automation-rules/outbound-webhook-signing.md`
- `DOC/knowledge/skills/_index.md`
- `DOC/knowledge/support-tools/_index.md`
- `DOC/validation/audit-template.md`
- `DOC/validation/audit-report.template.md`
- `DOC/validation/constraints/constraints.md`
- `DOC/validation/constraints/integration-constraints.md`
**Expected:** all readable.
**Pass if:** Read succeeds on every entry.
**Evidence:** path + file size or first 1 line.
**Failure:** BLOCKER per missing canonical file.

### A.4 Drift scan
**Command:** `Glob: DOC/**/*` then diff against the manifest patterns.
**Expected:** no files outside known patterns.
**Pass if:** every result matches a manifest pattern.
**Evidence:** list of unexpected files (DRIFT).
**Failure:** DRIFT (recorded, not blocking).

### A.5 Audit runner covers template
**Command:** extract every check id from this file (`### <id>`) and confirm the audit runner implements them (or that the generated audit report includes them).
**Expected:** no template check is silently skipped by the runner.
**Pass if:** template id set minus runner id set is empty.
**Evidence:** `Read:audit-template ids → <count>; runner ids → <count>; missing → <list>`.
**Failure:** BLOCKER. Any missing id invalidates a `READY` verdict.

---

## SECTION B — Reference integrity (the highest-yield section)

### B.1 Agent `loads:` resolves
**Command:** for each `DOC/agents/*.agent.md`:
1. `Read` frontmatter.
2. Parse `loads:` list.
3. For each entry, run `Glob:<entry>` (handle `**/*` and exact paths).
**Expected:** every entry resolves to ≥ 1 file.
**Pass if:** resolution count ≥ 1 for every entry.
**Evidence:** `<agent>:<load-pattern> → <n> files`.
**Failure:** BLOCKER. Report agent + the unresolved pattern.

### B.2 Preset `integrations:` resolve to YAMLs
**Command:** for each `DOC/knowledge/integration-presets/*.yaml`:
1. `Read` and parse `integrations:` block.
2. For each value, `Glob: DOC/knowledge/integration-rules/**/<value>.yaml`.
**Expected:** every value has exactly one YAML.
**Pass if:** resolution count == 1 per value.
**Evidence:** `<preset>:<role>=<integration> → <yaml-path>`.
**Failure:** BLOCKER. Report preset + role + missing integration name.

### B.3 Integration `required_skills` resolve to skill files
**Command:** for each `DOC/knowledge/integration-rules/**/*.yaml`:
1. `Read` and parse `required_skills:` list.
2. For each skill, `Glob: DOC/knowledge/skills/<skill>.md`.
**Expected:** every skill has a `.md` file.
**Pass if:** glob returns exactly 1 file per skill.
**Evidence:** `<integration>:<skill> → <path>`.
**Failure:** BLOCKER. Report integration + missing skill name.

### B.4 `emits_outbound_events` resolve to taxonomy
**Command:**
1. `Read DOC/knowledge/automation-rules/outbound-event-taxonomy.md` → extract event ids (use Grep for headings or list entries).
2. For each `DOC/knowledge/integration-rules/**/*.yaml`, parse `emits_outbound_events:` list.
3. Confirm every event id is in the taxonomy set.
**Expected:** every emitted event appears in taxonomy.
**Pass if:** set difference is empty.
**Evidence:** `<integration>:<event> → <found-in-taxonomy: true/false>`.
**Failure:** BLOCKER per orphan event.

### B.5 Reviewer constraint references resolve
**Command:**
1. `Read DOC/agents/reviewer.agent.md` → extract every constraint id mentioned in WORKFLOW (e.g., `C1..C24`, `F1..F12`, `SC1..SC12`, `PC1..PC12`, `DC1..DC11`, `TC1..TCn`, `AC1..AC12`, `I1..I6`).
2. For each id family, `Read` the corresponding constraint file in `DOC/validation/constraints/`.
3. `Grep` the file for the id pattern.
**Expected:** every id has a definition.
**Pass if:** grep returns ≥ 1 match per id.
**Evidence:** `<id> → <constraint-file>:<line>`.
**Failure:** BLOCKER per undefined id.

### B.6 Checklist references resolve
**Command:** for each agent in `DOC/agents/*.agent.md`:
1. Grep for `validation/checklists/<name>.md` references.
2. Confirm each file exists.
**Expected:** every referenced checklist exists.
**Pass if:** Read succeeds on every cited path.
**Evidence:** `<agent> → <checklist-path> → <exists: yes>`.
**Failure:** BLOCKER per missing checklist.

### B.7 feature-integration-map → integration YAML
**Command:** `Read DOC/knowledge/feature-maps/feature-integration-map.json`. For every `primary` and every entry in `alternatives`:
1. `Glob: DOC/knowledge/integration-rules/**/<value>.yaml`.
**Expected:** every value resolves to exactly one YAML, OR is documented as a virtual/platform value (e.g., `database` when database YAML lives elsewhere).
**Pass if:** resolution count == 1 per value, with explicit allowlist for documented exceptions.
**Evidence:** `<feature>:primary=<value> → <yaml-path>`.
**Failure:** BLOCKER per unresolved value.

### B.8 master_planner → all referenced agents exist
**Command:** `Read DOC/agents/master_planner.agent.md`. Grep WORKFLOW for `<agent_name>` mentions. For each, `Glob: DOC/agents/<agent_name>.agent.md`.
**Expected:** every agent named is a real file.
**Pass if:** Glob returns 1 file per name.
**Evidence:** `master_planner→<agent> → <path>`.
**Failure:** BLOCKER per missing agent.

---

## SECTION C — Schema compliance

### C.1 Integration YAML required fields
**Command:** for each `DOC/knowledge/integration-rules/**/*.yaml` (excluding `_*.md` and `_meta/*`):
1. `Read` file.
2. Verify presence of: `integration`, `category`, `role`, `tier`, `default_for_archetypes`, `alternatives`, `cost_band`, `compliance_tags`, `boundary`, `required_skills`, `runbook`, `setup_steps`, `constraints`, `common_failures`, `env_vars`.
3. If `status: stub` is present, only `integration`, `category`, `role`, `tier`, `status` are required.
**Pass if:** every required field present per the file's status.
**Evidence:** `<yaml-path> → status=<full|stub>, missing=[<fields>]`.
**Failure:** ADVISORY per non-stub missing field; BLOCKER if a stub appears as `primary` in any preset (cross-checked in C.4).

### C.2 Preset YAML required keys
**Command:** for each `DOC/knowledge/integration-presets/*.yaml`:
1. `Read` and parse.
2. Verify presence of: `preset`, `applies_to.archetype`, `applies_to.tier_band`, `integrations`, `forbidden`, `optional`, `automation_surface`.
**Pass if:** all keys present.
**Evidence:** `<preset> → missing=[<keys>]`.
**Failure:** BLOCKER per missing key.

### C.3 Agent frontmatter schema
**Command:** for each `DOC/agents/*.agent.md`:
1. `Read` frontmatter.
2. Verify: `agent` (string), `version` (int), `loads` (list).
3. Verify section headings present in body: `ROLE`, `RESPONSIBILITIES`, `STRICT RULES`, `INPUT FORMAT`, `WORKFLOW`, `OUTPUT FORMAT`, `VALIDATION STEPS`, `FAILURE MODES`.
**Pass if:** all keys + headings present.
**Evidence:** `<agent-path> → frontmatter_ok=<true>, missing_sections=[<sections>]`.
**Failure:** ADVISORY per missing field/section.

### C.4 Stub-as-primary forbidden
**Command:** combine C.1 (stubs) with B.2 (preset integrations).
**Expected:** no preset's `integrations:` value is a YAML with `status: stub`.
**Pass if:** intersection empty.
**Evidence:** list of (preset, role, stub-yaml) violations.
**Failure:** BLOCKER per violation.

### C.5 Spec-rule files structured as templates
**Command:** for each `DOC/execution/spec-rules/*.md`:
1. `Read` first 50 lines.
2. Verify presence of frontmatter or top-level `# Spec Template` heading and required sections (per spec-rule's own purpose).
**Pass if:** template structure detectable.
**Evidence:** `<spec-rule> → has_frontmatter=<bool>, top_heading=<string>`.
**Failure:** ADVISORY per malformed template.

---

## SECTION D — Wiring coverage

### D.1 master_planner workflow agents
Combined with B.8.

### D.2 runs_before / runs_after consistency
**Command:** for each agent file, parse `runs_before:` / `runs_after:` if present. For each named agent, confirm that agent file exists.
**Pass if:** all references resolve.
**Evidence:** `<agent>:runs_before=<list> → all_resolve=<bool>`.
**Failure:** BLOCKER per missing reference.

### D.3 reviewer loads vs constraints referenced
**Command:** combine B.5 with reviewer's `loads:` list. Every constraint set referenced in WORKFLOW MUST also appear in `loads:`.
**Pass if:** set difference is empty.
**Evidence:** missing-from-loads list.
**Failure:** BLOCKER per missing load.

### D.4 plan.json artifacts produced by sub-planners
**Command:**
1. `Read DOC/agents/master_planner.agent.md` → extract `plan.json` schema (Read OUTPUT FORMAT).
2. For each top-level key (`frontend`, `backend`, `devops`, `testing`, `security`, `performance`, `integrations`, `automation`, `support_stack`, `data_flows`, `env_vars`, `webhooks`), confirm a sub-planner emits it.
3. Cross-reference sub-planner OUTPUT FORMAT sections.
**Pass if:** every plan.json key has a producing sub-planner.
**Evidence:** `<plan-key> → produced_by=<sub-planner>`.
**Failure:** BLOCKER per orphaned plan key.

### D.5 Frontend planning output root contract
**Command:**
1. `Read` the frontend planning chain artifacts that declare output locations: `core/system-rules.md`, `output/README.md`, `agents/master_planner.agent.md`, `agents/frontend_planner.agent.md`, frontend sub-planner agents, frontend spec rules, frontend rules, and `validation/checklists/execution-acceptance-checklist.md`.
2. Confirm they reference `DOC/output/runs/<timestamp>/planning/frontend` (or `<output_root>` explicitly bound to that root) and do not direct generated frontend planning artifacts to any legacy bare frontend folder or any workspace root outside `DOC/output/runs/<timestamp>/`.
**Pass if:** all audited files enforce the canonical run-scoped frontend planning root and none retain a legacy bare frontend output destination.
**Evidence:** `<artifact> → output_root_contract=<pass|fail>`.
**Failure:** BLOCKER if any contract source points frontend planning output outside `DOC/output/runs/<timestamp>/planning/frontend`.

---

## SECTION E — Orphans

### E.1 Skills not referenced
**Command:** intersect skills declared in `skills/_index.md` with the union of every integration's `required_skills`.
**Pass if:** every skill in index is referenced ≥ 1 time.
**Evidence:** unreferenced skill list.
**Failure:** ADVISORY per unreferenced skill.

### E.2 Integrations not referenced
**Command:** for each `integration-rules/**/*.yaml`, check whether the integration name appears in any preset, feature-map, or support-tools index.
**Pass if:** every YAML is referenced somewhere.
**Evidence:** unreferenced integration list.
**Failure:** ADVISORY per unreferenced YAML (could be intentional alternative; must be in `_index.md` alternatives list at minimum).

### E.3 Presets not selectable
**Command:** combine each preset's `applies_to` with `intake_strategist.agent.md` R13 logic.
**Pass if:** every preset is reachable for some (archetype, tier_band) pair.
**Evidence:** unreachable preset list.
**Failure:** ADVISORY.

### E.4 Constraint sets not loaded
**Command:** glob `validation/constraints/*.md` and intersect with reviewer's `loads:` list.
**Pass if:** every constraint file is in reviewer's loads.
**Evidence:** unloaded constraint files.
**Failure:** BLOCKER (reviewer cannot evaluate unloaded constraints).

### E.5 Spec-rule files not referenced
**Command:** for each `execution/spec-rules/*.md`, grep all agents for the file path.
**Pass if:** every spec-rule is referenced by ≥ 1 agent.
**Evidence:** unreferenced spec-rule list.
**Failure:** ADVISORY.

---

## SECTION F — Determinism tests

### F.1 Fixture-driven plan walk
**Command:** for each fixture in `audit-fixtures/`:
1. `Read` fixture JSON.
2. Walk the documented agent chain: `intake_strategist` → tier preset selection → `integration_planner` → `frontend_planner` → `backend_planner` → `devops_planner` → `qa_planner` → `security_auditor` → `performance_auditor` → `reviewer`.
3. For each step, verify the input/output schema match.
4. Compute the expected `plan.json` shape.
5. Compare against `audit-fixtures/expected-outputs/<fixture>.expected.json`.
**Pass if:** structural match (key presence; values may be enumerated values from rules, not freeform).
**Evidence:** `<fixture> → match=<bool>, drift=[<keys>]`.
**Failure:** BLOCKER per drift on a non-malformed fixture.

### F.2 Negative fixtures
**Command:** for `brief-malformed.json` and `brief-unknown-feature.json`:
1. Walk the chain.
2. Confirm BLOCK is raised at the expected stage with the expected reason code.
**Pass if:** correct BLOCK fires.
**Evidence:** `<fixture> → blocked_at=<stage>, reason=<code>`.
**Failure:** BLOCKER if BLOCK doesn't fire or fires at the wrong stage.

### F.3 Two-run hash match (when actual execution is possible)
**Command:** when the audit is run by an executor agent capable of invoking sub-planners, run the same fixture twice and hash the JSON outputs (after stripping timestamps).
**Pass if:** hashes match.
**Evidence:** `<fixture> → hash_run1=<sha>, hash_run2=<sha>, match=<bool>`.
**Failure:** BLOCKER per mismatch with the drifting field reported.
**Note:** if the auditor cannot execute sub-planners, mark this check `not-applicable: reason=executor-not-available`.

### F.4 Marketing quality fixture parity
**Command:** run `brief-marketing-quality-depth.json` through the same chain used in F.1 and compare to `expected-outputs/brief-marketing-quality-depth.expected.json`.
**Pass if:** expected frontend quality signals are present (depth/content-key/schema completeness expectations).
**Evidence:** `<fixture> → quality_keys_present=<list>, drift=[<keys>]`.
**Failure:** BLOCKER when quality fixture expectations are absent or drift.

---

## SECTION G — Constraint evaluability

### G.1 Detection methods point at real data
**Command:** for each constraint id in `DOC/validation/constraints/*.md`:
1. `Read` the constraint's `Detection:` line.
2. Verify it points at a field/file the system actually emits (via cross-ref to plan.json schema or file paths).
**Pass if:** every constraint's detection is grounded in real data.
**Evidence:** `<id> → detection=<text>, grounded=<bool>`.
**Failure:** BLOCKER per ungrounded constraint.

### G.2 Constraint id uniqueness
**Command:** grep all `validation/constraints/*.md` for id patterns. Verify no duplicates across files.
**Pass if:** every id appears in exactly one file.
**Evidence:** duplicate-id list.
**Failure:** BLOCKER per duplicate.

---

## SECTION H — End-to-end smoke

### H.1 Per-fixture chain walk
For each non-negative fixture in `audit-fixtures/`, execute F.1 and additionally:
1. Confirm the responsible agent for each step exists (cross-ref D.1).
2. Confirm each agent's input contract matches the prior agent's output contract (Read INPUT FORMAT and OUTPUT FORMAT).
3. Confirm `reviewer` would emit `passed` for the expected output.
**Pass if:** all three confirmations succeed.
**Evidence:** `<fixture> → chain_walk=<pass|fail>, contract_mismatches=[<step>]`.
**Failure:** BLOCKER per mismatch.

### H.2 Negative fixture chain walk
For `brief-malformed.json` and `brief-unknown-feature.json`, confirm BLOCK fires at the documented stage with the documented code.
Reuses F.2.

### H.3 Output artifact list complete
For each fixture, confirm every artifact in `expected-outputs/<fixture>.expected.json.artifacts[]` would be produced by the chain (per agent OUTPUT FORMAT).
**Pass if:** every expected artifact has a producer.
**Evidence:** `<fixture>:<artifact> → producer=<agent>`.
**Failure:** BLOCKER per missing producer.

### H.4 Delivery classification consistency
**Command:** inspect `DOC/agents/execution_orchestrator.agent.md`, `DOC/core/quality-gates.md`, and `DOC/validation/checklists/execution-acceptance-checklist.md`.
**Pass if:** all three enforce equivalent delivery classification semantics (`production_candidate|baseline_prototype|blocked`, blocker->blocked, blocked->failed status).
**Evidence:** `<path>#<line> → <matched policy summary>`.
**Failure:** BLOCKER if any source is missing or contradictory.

---

## SECTION I — Frontend quality bar + creative latitude

### I.1 Q1 visual differentiation map evaluability
**Command:**
1. `Read DOC/execution/spec-rules/visual-differentiation-map-spec.md`.
2. `Read DOC/validation/constraints/frontend-constraints.md` and locate Q1.
3. `Read DOC/agents/frontend_planner.agent.md` and confirm workflow emits `visual-differentiation-map.md` before per-page briefs.
**Pass if:** all three agree on artifact shape + enforcement.
**Evidence:** `<path>#<line> → q1_contract=<pass|fail>`.
**Failure:** BLOCKER (`I.1 Q1 contract missing or inconsistent`).

### I.2 Q2 quality bar scoring evaluability
**Command:**
1. `Read DOC/knowledge/frontend-rules/quality-bar-scoring.md`.
2. `Read DOC/execution/spec-rules/per-page-spec.md` and confirm `quality_bar` targets are required.
3. `Read DOC/validation/constraints/frontend-constraints.md` and locate Q2.
4. `Read DOC/agents/frontend_planner.agent.md` and `DOC/agents/frontend_developer.agent.md` for quality scoring workflow references.
**Pass if:** scorer rubric, per-page targets, constraint gate, and planner/developer workflow wiring all exist.
**Evidence:** `<path>#<line> → q2_contract=<pass|fail>`.
**Failure:** BLOCKER (`I.2 Q2 wiring incomplete`).

### I.3 Q3 creative latitude utilisation evaluability
**Command:**
1. `Read DOC/execution/spec-rules/per-page-spec.md` and confirm `creative_latitude` requirements.
2. `Read DOC/validation/constraints/frontend-constraints.md` and locate Q3.
3. `Read DOC/agents/frontend_planner.agent.md` and confirm HIGH/MEDIUM/LOW latitude workflow.
4. `Read DOC/agents/frontend_developer.agent.md` and confirm implementation guidance differs by latitude.
**Pass if:** creative latitude is declared, enforced, and implemented across spec + constraints + agent workflows.
**Evidence:** `<path>#<line> → q3_contract=<pass|fail>`.
**Failure:** BLOCKER (`I.3 creative latitude gate missing`).

---

## SECTION J — Frontend developer completeness contract

### J.1 CC constraints are defined
**Command:**
1. `Read DOC/validation/constraints/frontend-constraints.md`.
2. Verify `CC1..CC6` are present with rule + detection + failure blocks.
**Pass if:** all six constraints exist and are evaluable.
**Evidence:** `<path>#<line> → cc_constraints_present=<pass|fail>`.
**Failure:** BLOCKER (`J.1 developer completeness constraints missing`).

### J.2 Developer self-audit enforces CC1..CC6
**Command:**
1. `Read DOC/agents/frontend_developer.agent.md`.
2. Verify Phase 10 includes CC1..CC6 checks with blocking behavior.
3. Verify failure modes include explicit completeness block codes.
**Pass if:** self-audit contract includes full CC coverage and blocking semantics.
**Evidence:** `<path>#<line> → cc_audit_wired=<pass|fail>`.
**Failure:** BLOCKER (`J.2 developer self-audit completeness wiring missing`).

### J.3 Folder taxonomy contract enforced
**Command:**
1. `Read DOC/agents/frontend_developer.agent.md`.
2. Verify mandatory `web/src/components/` taxonomy includes `primitives`, `ui`, `cards`, `sections`, `shell`, `providers`.
**Pass if:** all required folders are declared as mandatory.
**Evidence:** `<path>#<line> → folder_taxonomy=<pass|fail>`.
**Failure:** BLOCKER (`J.3 component taxonomy contract missing`).

### J.4 Planner-to-developer content-slot handoff integrity
**Command:**
1. `Read DOC/agents/frontend_planner.agent.md`.
2. Verify required content slots include category tags and archetype category mapping.
3. `Read DOC/agents/frontend_developer.agent.md` and verify CC2 consumes those slots.
**Pass if:** planner outputs category-tagged slots and developer enforces implementation coverage.
**Evidence:** `<planner-path>#<line>, <developer-path>#<line> → slot_handoff=<pass|fail>`.
**Failure:** BLOCKER (`J.4 required content slot handoff incomplete`).

### J.5 Footer attribution contract integrity
**Command:**
1. `Read DOC/agents/intake_strategist.agent.md` and verify default `brand.footer_attribution` contract.
2. `Read DOC/agents/frontend_planner.agent.md` and verify footer attribution content keys are emitted.
3. `Read DOC/agents/frontend_developer.agent.md` and verify CC6 enforces output fidelity.
**Pass if:** intake default + planner propagation + developer enforcement all exist.
**Evidence:** `<path>#<line> → footer_chain=<pass|fail>`.
**Failure:** BLOCKER (`J.5 footer attribution chain incomplete`).

## How to use this template

`system_architect.agent.md` consumes this template in `AUDIT` mode. Any other AI auditing the system or a derivative agentic project MUST:

1. Read this file first.
2. For each section A–J, run every check.
3. Produce evidence for every PASS and every FAIL.
4. Emit the result via `audit-report.template.md`.
5. Refuse to declare `READY` if any BLOCKER fired.

There is no "lite" mode. There is no "trust the prose" mode. If you cannot run a check, mark it `not-applicable` with a reason; do not skip silently.
