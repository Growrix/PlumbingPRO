# Skill: Subscription Webhook Mirror Pattern

**Used by:** stripe

## Pattern

Subscription state (plan, status, period end) MUST be derived exclusively from Stripe webhooks — never from client-side Stripe.js calls or polling the Stripe API on every request.

### Mirror table
\\\sql
subscriptions (
  id                    uuid,
  user_id               uuid REFERENCES users(id),
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id    text NOT NULL,
  status                text NOT NULL,  -- active | trialing | past_due | canceled
  price_id              text NOT NULL,
  current_period_end    timestamptz NOT NULL,
  cancel_at_period_end  boolean NOT NULL DEFAULT false,
  updated_at            timestamptz NOT NULL DEFAULT now()
)
\\\

### Events to handle
| Event | Action |
|---|---|
| \checkout.session.completed\ | Create subscription row |
| \customer.subscription.created\ | Upsert status |
| \customer.subscription.updated\ | Update status, period, cancel flag |
| \customer.subscription.deleted\ | Set status = canceled |
| \invoice.paid\ | Extend current_period_end |
| \invoice.payment_failed\ | Set status = past_due |

### Rules
- MUST use idempotency-key-pattern for every handler.
- MUST NOT read from Stripe API in hot paths — read from local mirror.
- Gate features behind \subscription.status === 'active'\ check on the mirror table.
