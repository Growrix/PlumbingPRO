# References

This folder is a **read-only library** of supplementary materials. It is NOT authoritative — the rules in `DOC/core/`, `DOC/knowledge/`, and `DOC/validation/` always win.

Agents may consult references to:
- Find rationale for a rule.
- Look up industry-standard patterns for prose.
- Cite a source in a runbook or ADR.

Agents MUST NOT:
- Derive new rules from references.
- Override the deterministic OS rules with reference content.

## Available references

### Enterprise Level Guide
**Source path on this machine:** `On Going DOCS/DOC/Universal/Enterprise Level Guide/`

Subjects covered:
- Architecture (`architecture/`)
- API design (`api/`)
- Backend reliability and observability (`backend/`)
- Data modeling (`data/`)
- Frontend (`frontend/`) — particularly `ui-ux-standards.md`, `frontend-architecture.md`, `frontend-rules-and-design-system.md`, `accessibility-and-localization.md`, `data-fetching-and-state.md`, `realtime-chat-and-client-resilience.md`, `frontend-performance-and-analytics.md`
- Operations (`operations/`)
- Process (`process/`)
- Quality (`quality/`)
- Product requirements (`product/`)
- Engineering roadmap (`engineering/`)

When the OS produces an ADR or runbook that cites enterprise reasoning, prefer to reference these files by relative path with a quote excerpt rather than copying the prose.

## Adding a new reference
1. Create a subfolder named after the reference set.
2. Add a `README.md` describing what the reference covers and how to cite it.
3. Add a `provenance.md` block listing source URLs/paths and license.
4. Update this index.

## Citation conventions
When a rule file pulls a concept from a reference:

```yaml
references:
  - source: "On Going DOCS/DOC/Universal/Enterprise Level Guide/frontend/ui-ux-standards.md"
    cite:   "Status communication standards"
```

Citations are informational. The rule remains authoritative regardless of whether the reference is present.
