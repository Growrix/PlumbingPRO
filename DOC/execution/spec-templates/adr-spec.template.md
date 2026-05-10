# SPEC TEMPLATE: ARCHITECTURE DECISION RECORD (ADR)

## PURPOSE
Use this template to document every architectural decision made during planning. ADRs are immutable once accepted. Codegen agents and reviewers reference ADRs to justify choices and prevent decision drift.

---

## ADR-[NNN]: [Short Decision Title]

**Date:** [YYYY-MM-DD]
**Status:** PROPOSED | ACCEPTED | DEPRECATED | SUPERSEDED BY ADR-[NNN]
**Agents Involved:** master_planner | [other agents]
**Authored By:** [agent or human]

---

### CONTEXT
*Describe the situation that forced this decision. What problem exists? What forces are at play?*

```
[2-5 sentences describing the context, constraints, and forces that led to this decision]
```

---

### DECISION
*State the decision clearly and unambiguously.*

```
We will use [tool/pattern/approach] for [purpose/feature].
```

Specific:
- Primary choice: `[technology/pattern]`
- Justification: `[1-2 sentence rationale]`
- Alternatives considered: `[list]`

---

### ALTERNATIVES CONSIDERED

| Option | Pros | Cons | Rejected Reason |
|--------|------|------|----------------|
| [Option A] | [pros] | [cons] | [why rejected] |
| [Option B] | [pros] | [cons] | [why rejected] |
| [Chosen option] | [pros] | [cons] | **CHOSEN** |

---

### CONSEQUENCES

**Positive:**
- [Expected benefit 1]
- [Expected benefit 2]

**Negative / Trade-offs:**
- [Known downside or limitation]
- [What becomes harder as a result]

**Neutral:**
- [Side effects that are neither good nor bad]

---

### COMPLIANCE
This decision is consistent with:
- [ ] `core/system-rules.md` — Rule [cite rule]
- [ ] `knowledge/integration-rules/[integration].yaml`
- [ ] `validation/constraints/constraints.md` — Constraint [cite constraint]

---

### REVIEW
| Reviewer | Status | Notes |
|----------|--------|-------|
| reviewer.agent | APPROVED | — |
| [human] | PENDING | — |

---

*ADR index is maintained in `decisions.json`. New ADRs increment the counter. Accepted ADRs are never modified — create a new ADR to supersede.*
