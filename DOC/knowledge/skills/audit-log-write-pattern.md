# Skill: Audit Log Write Pattern

**Used by:** workos-audit-logs, native audit_logs table

## Pattern

Every privileged action (admin writes, billing changes, permission grants, data exports) MUST be recorded in an append-only audit log.

### Table
\\\sql
audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid NOT NULL,  -- user performing the action
  actor_email text NOT NULL,
  action      text NOT NULL,  -- e.g., 'user.role.updated'
  target_type text,           -- e.g., 'user', 'subscription', 'organization'
  target_id   text,
  metadata    jsonb,
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
)
\\\

### Rules
- Table MUST be append-only (no UPDATE or DELETE in application code).
- MUST record actor identity even for service-account actions.
- Retention MUST be at least 1 year (3 years for SOC 2 / HIPAA).
- MUST be queryable per organization for enterprise clients who purchase audit log access.
