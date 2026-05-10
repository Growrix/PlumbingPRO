# Skill: SSO/SAML Handshake Pattern

**Used by:** workos

## Pattern

WorkOS handles the SAML/OIDC handshake. The app exchanges a WorkOS authorization code for a session and syncs the provisioned user to the local database (JIT provisioning).

### Flow
\\\
User clicks 'Sign in with SSO'
App redirects → WorkOS /authorize?connection=<org-connection-id>
WorkOS handles IdP (Okta/Azure AD/Google Workspace)
WorkOS redirects → /api/auth/callback?code=<code>
App calls WorkOS /sso/token to get profile
App upserts user in local DB (JIT provisioning)
App creates local session (Clerk or custom)
\\\

### Rules
- Connection ID MUST be stored per organization, not hardcoded.
- JIT provisioning MUST check if user already exists (upsert, not insert).
- Group-to-role mapping MUST be configurable per organization (not hardcoded).
- WorkOS secret MUST be server-only env var.
