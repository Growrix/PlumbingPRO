# Integration YAML Schema

Every file under `DOC/knowledge/integration-rules/<category>/<name>.yaml` MUST include the following fields. The `reviewer` enforces I1 which checks that every integration in a plan has a YAML rule file; the `integration_planner` reads all fields to produce `integrations.json`.

---

## Required fields

```yaml
integration: <slug>           # Unique name, lowercase-hyphenated. Must match file name.
category: <category>          # Folder category (auth, payments, cms, email, etc.)
role: <role>                  # Functional role slot (from _index.md role matrix)
tier: basic | standard | advanced | automation | support
default_for_archetypes:       # List of project archetypes where this is the default pick
  - saas_app
alternatives:                 # Same-role alternatives (slugs only)
  - other-integration
cost_band: free | low | mid | high
compliance_tags:              # Array of compliance labels this integration supports
  - gdpr-ready
  - pci-scope-reduction
  - soc2-friendly
  - hipaa-eligible
boundary: app | support | both
```

## Package fields (include if the integration has a codebase footprint)

```yaml
package_name: <npm-package>
client_packages: []           # Installed in app, used client-side
server_packages: []           # Installed in app, used server-side only
dev_packages: []              # devDependencies
```

## Component requirements

```yaml
required_components:
  frontend: []
  backend: []
  database: []
  devops: []
  cms_studio: []
```

## Runtime requirements

```yaml
env_vars: []                  # List of env var names (no values)

webhooks:                     # Omit or leave empty if integration has no inbound webhooks
  endpoint: /api/webhooks/<name>
  events: []

emits_outbound_events: []     # App-side events this integration triggers (for n8n taxonomy)
ingests_inbound_events: []    # Webhook event names this integration sends to the app
```

## Setup + constraints

```yaml
setup_steps: []               # Ordered, human-readable steps

constraints: []               # Hard rules that MUST be followed

required_skills: []           # Slugs matching files in knowledge/skills/

common_failures: []           # Known pitfalls with deterministic fixes

runbook: docs/runbooks/integrations/<name>.md   # Optional; link to emitted runbook
```

---

## Stub file (metadata-only)

For integrations not yet deeply specified, use this minimal stub. Stubs are valid catalog entries but cannot be the `primary` pick in a plan (only `alternatives`).

```yaml
integration: <slug>
category: <category>
role: <role>
tier: <tier>
default_for_archetypes: []
alternatives: []
cost_band: <band>
compliance_tags: []
boundary: app
status: stub   # indicates this file is metadata-only; not yet deeply specified
```

The `integration_planner` MUST emit a `MISSING_KNOWLEDGE` BLOCK if a stub is the primary pick for a feature.
