# DATA FLOW — PAYMENT SYSTEM

## OVERVIEW
End-to-end flow for Stripe-powered subscriptions with checkout, customer portal, webhooks, and email receipts.

## INTEGRATIONS INVOLVED
- `stripe` (primary)
- `clerk` (user identity)
- `resend` (transactional emails)
- `database` (persisted state)

## ENTITIES
- `users` (DB)
- `customers` (DB; maps user_id ↔ stripe_customer_id)
- `subscriptions` (DB)
- `invoices` (DB)
- `email_logs` (DB)

## FLOW: USER STARTS A SUBSCRIPTION

```
[Browser]
   click "Subscribe" on /pricing
   POST /api/billing/checkout { priceId }
        ↓
[Next.js Route Handler /api/billing/checkout]
   reads user via Clerk auth()
   loads or creates stripe_customer_id via repositories.users.upsertStripeCustomer
   calls services.billing.createCheckoutSession({ user, priceId })
        ↓
[Stripe SDK]
   stripe.checkout.sessions.create({
     mode: 'subscription',
     customer: stripe_customer_id,
     line_items: [{ price: priceId, quantity: 1 }],
     success_url, cancel_url,
     metadata: { internal_user_id: user.id }
   })
        ↓
[Stripe]
   returns session.url
        ↓
[Browser]
   redirects to Stripe Checkout
   user completes payment
        ↓
[Stripe]
   redirects to success_url
   asynchronously fires checkout.session.completed
```

## FLOW: WEBHOOK SYNCS BILLING STATE

```
[Stripe]
   POST /api/webhooks/stripe
   header: Stripe-Signature
   body: raw event
        ↓
[Next.js Webhook Route]
   read raw body
   stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
   on signature failure → 400
        ↓
[Idempotency Check]
   if event.id already processed → 200
        ↓
[Event Switch]
   checkout.session.completed       → ensure customer + subscription rows
   customer.subscription.created    → upsert subscription row
   customer.subscription.updated    → update status, period_end, cancel flag
   customer.subscription.deleted    → mark canceled
   invoice.paid                     → upsert invoice + send receipt
   invoice.payment_failed           → upsert invoice + send failure email
        ↓
[services.billing.handleEvent]
   uses repositories.subscriptions.upsert
   uses repositories.invoices.upsert
   on invoice.paid → services.email.send('payment-receipt', { user, invoice })
   on invoice.payment_failed → services.email.send('payment-failed', { user, invoice })
        ↓
[Database]
   atomic write
        ↓
[Resend]
   accepts transactional email
        ↓
[Webhook Route]
   200 OK
```

## FLOW: SELF-SERVE BILLING PORTAL

```
[Browser]
   click "Manage billing" on /dashboard/billing
   POST /api/billing/portal
        ↓
[Next.js Route Handler]
   reads user via Clerk auth()
   loads stripe_customer_id via repositories.users
   stripe.billingPortal.sessions.create({ customer, return_url })
        ↓
[Browser]
   redirected to Stripe Billing Portal
   updates payment method or cancels
        ↓
[Stripe]
   triggers customer.subscription.updated webhook
        ↓ (see webhook flow above)
```

## DATA SHAPES

### subscriptions (DB)
```sql
id                       uuid pk
user_id                  uuid fk → users.id
stripe_subscription_id   text unique
status                   text  -- active | past_due | canceled | incomplete
price_id                 text
current_period_end       timestamptz
cancel_at_period_end     boolean
created_at               timestamptz
updated_at               timestamptz
```

## ENV VARS REQUIRED
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_ID_STARTER
- STRIPE_PRICE_ID_PRO
- RESEND_API_KEY
- RESEND_FROM_ADDRESS

## ROUTES INVOLVED
- `/pricing`                       — list of plans
- `/dashboard/billing`             — current plan + portal link
- `/api/billing/checkout`          — create checkout session
- `/api/billing/portal`            — create portal session
- `/api/webhooks/stripe`           — single source of truth for state

## VALIDATION CHECKLIST
- [ ] Webhook signature verified before parsing body.
- [ ] Subscription state mutated only via webhook handler.
- [ ] Internal user id propagated via Stripe metadata.
- [ ] Email receipts sent only after invoice.paid persisted.
- [ ] Idempotency enforced by event.id.
- [ ] Test and live mode keys/webhooks separated.
