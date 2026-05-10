# Skill: Per-Tenant Tokens Pattern

**Used by:** zapier integration, custom automation surface

## Pattern

When a SaaS exposes webhook integrations to its own customers (e.g., 'connect your Zapier'), each customer (tenant) MUST have their own signing secret so that one tenant's token cannot be used to spoof another.

### Token table
\\\sql
automation_tokens (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  token_hash      text UNIQUE NOT NULL,  -- bcrypt hash; never store plaintext
  label           text,
  created_by      uuid REFERENCES users(id),
  last_used_at    timestamptz,
  revoked_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
)
\\\

### Rules
- Token displayed ONCE at creation — never retrievable again.
- MUST hash the token before storing (bcrypt or HMAC-SHA256 with server key).
- Revocation MUST be instant (set revoked_at, check on every request).
- MUST scope token permissions (e.g., read-only vs. full-access).
