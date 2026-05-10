# Integration Constraints

Hard rules for any plan produced by this OS. Each constraint has an id, rule, detection method, and failure code. The `reviewer` evaluates I1..I6 in order; any failure halts the pipeline.

These constraints ensure the integration catalog is coherent, traceable, and safe before codegen proceeds.

---

## I1 — Every integration resolves to a YAML rule file
**Rule:** Every integration named in `plan.json → integrations` MUST have a corresponding YAML file under `DOC/knowledge/integration-rules/<category>/<name>.yaml`. Stub files (metadata-only) are acceptable only when the integration is listed as an alternative, not as the primary pick.
**Detection:** For each value in `plan.json.integrations`, resolve the name to a file path under `integration-rules/`. If the file is absent → fail.
**Failure:** `BLOCK I1: integration <name> has no rule file at integration-rules/<category>/<name>.yaml`.

---

## I2 — Required skills resolve to skill files
**Rule:** Every `required_skills[]` entry in each chosen integration's YAML MUST resolve to a file in `DOC/knowledge/skills/<skill-name>.md`. If a skill file is missing, the planner cannot emit correct codegen instructions for that pattern.
**Detection:** Collect all `required_skills` values from every integration YAML in the plan. Verify each resolves to an existing skill file.
**Failure:** `BLOCK I2: skill <skill-name> required by <integration> has no skill file at knowledge/skills/<skill-name>.md`.

---

## I3 — Outbound events declared in the taxonomy
**Rule:** Every event in `plan.json → automation → outbound_events[]` MUST appear in `DOC/knowledge/automation-rules/outbound-event-taxonomy.md`. Undocumented events may not be emitted by the app.
**Detection:** Cross-reference `outbound_events[]` against the taxonomy file's event list.
**Failure:** `BLOCK I3: outbound event <event-name> not declared in outbound-event-taxonomy.md`.

---

## I4 — Support-tier tools resolve to support-tools files
**Rule:** Every tool in `plan.json → support_stack[]` (emitted by `devops_planner`) MUST have a corresponding YAML under `DOC/knowledge/support-tools/<category>/<name>.yaml`.
**Detection:** For each entry in `support_stack[]`, resolve the tool name to a file. If absent → fail.
**Failure:** `BLOCK I4: support tool <name> has no file at knowledge/support-tools/<category>/<name>.yaml`.

---

## I5 — Preset overrides are recorded in assumptions
**Rule:** Whenever a tier preset default was overridden by the brief (client override, compliance regime, or fallback selection), the override MUST appear in `decisions.json → assumptions[]` with the field `type: integration_override`, naming the preset default that was replaced and the reason.
**Detection:** Compare `plan.json.integrations` against the preset file for the matched `tier_band + archetype`. Any deviation not in `assumptions[]` → fail.
**Failure:** `BLOCK I5: integration <role> deviates from preset <preset> without recorded assumption`.

---

## I6 — Compliance regime not violated by chosen integrations
**Rule:** For each integration in the plan, check `compliance_tags[]` in its YAML. If the brief declares a compliance regime (HIPAA, SOC2, PCI-DSS, GDPR) that requires a specific tag, and the chosen integration lacks that tag, the plan must either (a) replace with a compliant alternative or (b) record a `compliance_risk` assumption stating the known gap and mitigation.
**Detection:** Cross-reference `brief.json → compliance` with each integration YAML's `compliance_tags`.
**Failure:** `BLOCK I6: integration <name> missing compliance tag <tag> required by <regime> — replace or document risk`.
