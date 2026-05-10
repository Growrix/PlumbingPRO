# Skill: Embedded Integration Marketplace Pattern

**Used by:** paragon, nango, pipedream-connect

## Pattern

When the SaaS sells 'integrate with your tools' as a feature, the integration marketplace surface is embedded inside the app's settings. Users authenticate third-party services (Slack, HubSpot, Salesforce) without leaving the app.

### Paragon flow
\\\
User navigates to Settings → Integrations
App renders Paragon Connect Portal (iframe or React SDK)
User selects 'Connect HubSpot'
Paragon handles OAuth with HubSpot
App receives a paragon.getUser(userId).integrations.hubspot token
App uses token to call HubSpot APIs via Paragon proxy
\\\

### Rules
- The embedded marketplace token MUST be generated server-side (never expose Paragon project token to client).
- Each user's connected integrations MUST be stored server-side by Paragon — app only holds the userId reference.
- Revoking an integration MUST call the Paragon/Nango API AND remove local references.
- MUST display clear 'Connected'/'Disconnected' status per integration in the UI.
