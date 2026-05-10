# DATA FLOW — SUBSCRIPTION MANAGEMENT

## OVERVIEW
End-to-end flow for Stripe-powered subscription lifecycle: checkout, trial, upgrade, downgrade, cancellation, and billing portal — with DB state kept in sync via webhooks.

## INTEGRATIONS INVOLVED
- `stripe` (primary)
- `database` (subscriptions table, mirror)
- `resend` (billing emails)
- `clerk` (user identity)
- `inngest` (async email dispatch)
- `posthog` (subscription events)

## ENTITIES
- `subscriptions` (DB: id, user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end, cancel_at_period_end, trial_end, created_at, updated_at)
- `invoices` (DB: id, user_id, stripe_invoice_id, amount_cents, status, paid_at)

## FLOW: INITIAL CHECKOUT (NEW SUBSCRIPTION)

```
[Browser]
  User clicks "Start Plan" on /pricing
       ↓
[Next.js Server Action: createCheckoutSession]
  authenticate via auth()
  call services.billing.createCheckoutSession({
    userId,
    priceId: STRIPE_PRICE_ID_PRO,
    successUrl: /dashboard/billing?success=true,
    cancelUrl: /pricing
  })
       ↓
[services.billing.createCheckoutSession]
  check if user has a Stripe customer ID in DB
  if not: create stripe.customers.create({ email, metadata: { userId } })
          persist customerId to users table
  call stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url,
    cancel_url,
    subscription_data: { trial_period_days: 14 }
  })
  return session.url
       ↓
[Server Action]
  redirect(session.url)
       ↓
[Browser → Stripe Hosted Checkout]
  user enters payment details
       ↓
[Stripe]
  fires checkout.session.completed webhook
```

## FLOW: WEBHOOK — checkout.session.completed

```
[Stripe]
  POST /api/webhooks/stripe
  header: Stripe-Signature
       ↓
[Webhook Handler]
  stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)
  switch(event.type):
    case "checkout.session.completed":
      const session = event.data.object
      const subscription = await stripe.subscriptions.retrieve(session.subscription)
      services.billing.upsertSubscription({
        userId: session.metadata.userId,   // or look up by customerId
        stripeCustomerId: session.customer,
        stripeSubscriptionId: subscription.id,
        plan: subscription.items.data[0].price.lookup_key,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
      })
       ↓
[repositories.subscriptions.upsert]
  inserts/updates subscriptions row
       ↓
[services.billing.upsertSubscription]
  emits Inngest event "subscription.started" → async welcome email
  posthog.capture({ event: "subscription_started", properties: { plan } })
       ↓
[Webhook Handler]
  200 OK
```

## FLOW: WEBHOOK — customer.subscription.updated

```
[Stripe fires on upgrade / downgrade / renewal / trial end]
  POST /api/webhooks/stripe → Webhook Handler
  services.billing.upsertSubscription(updated fields)
  if plan changed: emit Inngest "subscription.changed" → notify user
```

## FLOW: WEBHOOK — customer.subscription.deleted

```
[Stripe fires on cancellation]
  POST /api/webhooks/stripe → Webhook Handler
  services.billing.cancelSubscription({ stripeSubscriptionId })
       ↓
[repositories.subscriptions.update]
  status = "canceled", cancel_at_period_end = false
       ↓
  emit Inngest "subscription.cancelled" → churn email
  posthog.capture("subscription_cancelled", { plan })
```

## FLOW: BILLING PORTAL (MANAGE SUBSCRIPTION)

```
[Browser]
  User clicks "Manage Billing" in /dashboard/billing
       ↓
[Server Action: createBillingPortalSession]
  services.billing.createPortalSession({ userId })
       ↓
[services.billing]
  stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: /dashboard/billing
  })
  return session.url
       ↓
[Server Action]
  redirect(session.url)
       ↓
[Stripe Customer Portal]
  user updates/cancels subscription → Stripe fires webhook → flow above
```

## ENV VARS INVOLVED
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

## CONSTRAINTS
- Billing state is owned by Stripe; DB is a mirror updated only via webhooks.
- Never trust client-supplied subscription status; always read from DB (mirrored from Stripe).
- Webhook handler must be idempotent by event ID.
- Stripe customer ID must be stored in the users table after first checkout.
- Portal session URL expires; never cache it.
