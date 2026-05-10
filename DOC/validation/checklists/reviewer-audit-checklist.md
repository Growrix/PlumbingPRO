# REVIEWER AUDIT CHECKLIST

## PURPOSE
Ready-to-run reviewer checklist that produces:
- Human-readable audit log
- Machine-readable validation report

## OUTPUT CONTRACT
Reviewer run must emit both artifacts under the active run folder:
- `DOC/output/runs/<timestamp>/reports/reviewer_audit.md`
- `DOC/output/runs/<timestamp>/reports/validation_report.json`

If any required section is missing, reviewer must return `BLOCK`.

## RUN INPUTS
- `DOC/output/runs/<timestamp>/planning/plan.json`
- `DOC/output/runs/<timestamp>/planning/decisions.json`
- `DOC/output/runs/<timestamp>/planning/validation_report.json` (previous-stage status)

## SECTION A — PRE-CHECKS
- [ ] `plan.json` exists and parses.
- [ ] `decisions.json` exists and parses.
- [ ] `plan.lock_status == "LOCKED"`.
- [ ] Required knowledge files loaded successfully.

## SECTION B — CORE CHECKLISTS
- [ ] Pre-planning checklist completed.
- [ ] Pre-build checklist completed.
- [ ] Security checklist completed.
- [ ] Integration checklist completed.

## SECTION C — CONSTRAINTS C1..C29
- [ ] C1
- [ ] C2
- [ ] C3
- [ ] C4
- [ ] C5
- [ ] C6
- [ ] C7
- [ ] C8
- [ ] C9
- [ ] C10
- [ ] C11
- [ ] C12
- [ ] C13
- [ ] C14
- [ ] C15
- [ ] C16
- [ ] C17
- [ ] C18
- [ ] C19
- [ ] C20
- [ ] C21
- [ ] C22
- [ ] C23
- [ ] C24
- [ ] C25
- [ ] C26
- [ ] C27
- [ ] C28
- [ ] C29

## SECTION D — FRONTEND CONSTRAINTS F1..F12
- [ ] F1
- [ ] F2
- [ ] F3
- [ ] F4
- [ ] F5
- [ ] F6
- [ ] F7
- [ ] F8
- [ ] F9
- [ ] F10
- [ ] F11
- [ ] F12

## SECTION E — DOMAIN CONSTRAINTS
- [ ] Security constraints SC1..SC12
- [ ] Performance constraints PC1..PC12
- [ ] Data constraints DC1..DC11

## SECTION F — QUALITY GATES
- [ ] Zero-warning gate confirmed.
- [ ] Runtime readiness gate confirmed.
- [ ] Environment readiness gate confirmed.
- [ ] Operation-mode compliance confirmed.

## SECTION G — SWEEPS
- [ ] Anti-hallucination sweep completed.
- [ ] Ownership sweep completed.
- [ ] Drift sweep completed.

## SECTION H — EVIDENCE RULE
For every failed check, reviewer must record:
- Failing id
- Reason
- Evidence path/key
- Blocking impact

## FINAL DECISION
- PASS only if every applicable check is pass.
- Otherwise BLOCK with `VALIDATION_FAILURE`.

## HUMAN-READABLE REPORT SHAPE
`reviewer_audit.md` must contain:
1. Input summary
2. Checklist status summary
3. Failures ordered by severity
4. Evidence references
5. Final gate decision

## MACHINE-READABLE REPORT SHAPE
`validation_report.json` must contain:
- `pre_planning`
- `pre_build`
- `constraints` (C-series)
- `frontend` (F-series)
- `security_constraints`
- `performance_constraints`
- `data_constraints`
- `anti_hallucination`
- `ownership`
- `drift`
- `status`
