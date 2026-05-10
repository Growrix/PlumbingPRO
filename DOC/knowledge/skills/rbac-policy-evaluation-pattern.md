# Skill: RBAC Policy Evaluation Pattern

**Used by:** permit-io, native RBAC tables

## Pattern

Permission checks MUST be evaluated at the start of every protected route/action, before any business logic runs.

### Permit.io implementation
\\\	s
import { permit } from '@/lib/permit'

// In a server action or route handler:
const allowed = await permit.check(userId, 'update', { type: 'document', id: documentId })
if (!allowed) return new Response('Forbidden', { status: 403 })
\\\

### Native RBAC (without Permit.io)
\\\	s
const membership = await db.membership.findFirst({
  where: { userId, organizationId }
})
if (!membership || !['admin','owner'].includes(membership.role)) {
  throw new Error('Forbidden')
}
\\\

### Rules
- Permission check MUST be server-side — never trust client-sent role claims.
- MUST enforce at the API boundary, not only in the UI.
- For multi-tenant apps, MUST scope the check to the organization.
