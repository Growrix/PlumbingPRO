# DATA FLOW — ANALYTICS SYSTEM

## OVERVIEW
End-to-end flow for PostHog-powered product analytics covering client-side event capture, server-side identify, feature flag evaluation, and funnel reporting.

## INTEGRATIONS INVOLVED
- `posthog` (primary)
- `clerk` (identity source)
- `inngest` (optional — async identify on user creation)

## ENTITIES
- No DB tables required (PostHog is the system of record for analytics).
- Optionally: `posthog_feature_flag_cache` in Upstash Redis if server-side evaluation is needed at scale.

## FLOW: CLIENT-SIDE EVENT CAPTURE

```
[Browser]
  PostHog JS SDK initialized in PostHogProvider at root layout
  NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST loaded from env
       ↓
[User Action — e.g., clicks "Upgrade" button]
  posthog.capture("upgrade_button_clicked", {
    plan: "pro",
    source: "pricing_page"
  })
       ↓
[PostHog JS SDK]
  batches event
  POST https://<POSTHOG_HOST>/e/ with event payload
       ↓
[PostHog]
  stores event against distinct_id
  updates person properties
```

## FLOW: IDENTIFY USER ON SIGN-IN

```
[Next.js Server Component — /dashboard layout]
  const { userId } = auth()
  const user = await currentUser()
       ↓
[PostHogServerClient — using posthog-node]
  client.identify({
    distinctId: userId,
    properties: {
      email: user.emailAddresses[0].emailAddress,
      name: user.fullName,
      plan: subscription.plan,
      created_at: user.createdAt
    }
  })
       ↓
  client.capture({
    distinctId: userId,
    event: "user_identified",
    properties: { source: "server_component" }
  })
       ↓
[PostHog]
  merges server-side identify with client-side distinct_id
```

## FLOW: BROWSER ↔ SERVER IDENTIFY MERGE

```
[Browser]
  <PostHogIdentifier userId={userId} /> client component
  useEffect → posthog.identify(userId, { email, name })
       ↓
[PostHog]
  aliases anonymous id → userId
  merges pre-auth events into identified person
```

## FLOW: FEATURE FLAG EVALUATION (SERVER-SIDE)

```
[Next.js Server Component or Route Handler]
  const flagEnabled = await posthog.isFeatureEnabled(
    "new-dashboard",
    userId
  )
       ↓
  if (flagEnabled) render <NewDashboard />
  else render <LegacyDashboard />
       ↓
[posthog.capture — track exposure]
  client.capture({
    distinctId: userId,
    event: "$feature_flag_called",
    properties: { $feature_flag: "new-dashboard", $feature_flag_response: flagEnabled }
  })
```

## FLOW: RESET ON SIGN-OUT

```
[Sign-out action]
  posthog.reset()   // clears distinct_id and queued events
  redirect to /sign-in
```

## KEY EVENTS TO CAPTURE

| Event | When |
|-------|------|
| `sign_up_completed` | After Clerk user.created webhook mirror |
| `sign_in` | On /dashboard load with authenticated session |
| `subscription_started` | On Stripe checkout.session.completed |
| `subscription_cancelled` | On Stripe customer.subscription.deleted |
| `primary_feature_used` | On first meaningful action per feature |
| `upgrade_button_clicked` | On pricing CTA click |
| `file_uploaded` | On UploadThing upload complete |
| `ai_message_sent` | On AI chat message dispatch |

## ENV VARS INVOLVED
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

## CONSTRAINTS
- posthog.reset() MUST be called on sign-out to prevent session bleeding.
- Server-side PostHog client must call posthog.shutdown() in background to flush events.
- Feature flag server-side evaluation MUST be cached in Upstash if called > 10 times per request path.
- PII must never be sent as custom event properties beyond what PostHog explicitly needs for identify.
