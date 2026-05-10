# Multi-Tenant UX Rules

## Purpose
Safe and clear tenant/workspace interactions.

## Rules
- Org/workspace switcher must always display active context
- Member management UI must expose role assignment audit trail
- Tenant-specific billing and usage views must be scoped by active org
- Cross-tenant navigation must require explicit user intent

## Security constraints
- Never render data from inactive tenant context
- Tenant id must be visible in diagnostics and support exports