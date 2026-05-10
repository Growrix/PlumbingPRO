# Skill: Feature Flag Evaluation Pattern

**Used by:** posthog (server-side flags), statsig, growthbook

## Pattern

Feature flags MUST be evaluated server-side using the PostHog Node SDK to prevent flash of disabled content and to keep flag logic out of the client bundle.

### Server-side evaluation (Next.js App Router)
\\\	s
import { PostHog } from 'posthog-node'

const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST!
})

// In a layout or page:
const isEnabled = await client.isFeatureEnabled('new-dashboard', userId)
\\\

### Rules
- MUST call \wait client.shutdown()\ in serverless contexts to flush events.
- MUST provide a default (false) if the flag evaluation fails — never throw.
- Flag names MUST be defined in PostHog dashboard before being referenced in code.
