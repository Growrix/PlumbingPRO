# DATA FLOW — EMAIL SYSTEM

## OVERVIEW
End-to-end flow for Resend-powered transactional email delivery with React Email templates, async dispatch via Inngest, delivery tracking, and bounce handling.

## INTEGRATIONS INVOLVED
- `resend` (primary — delivery)
- `database` (email_logs table)
- `inngest` (async dispatch)
- `clerk` (user identity for welcome/auth emails)

## ENTITIES
- `email_logs` (DB: id, user_id, template, resend_id, status, sent_at, metadata)

## FLOW: TRANSACTIONAL EMAIL (ASYNC VIA INNGEST)

```
[Service Layer — e.g., services.users.mirrorFromClerk]
  after upsert into users table
  emits Inngest event: "user.created" { userId, email, fullName }
       ↓
[Inngest Function: send-welcome-email]
  step.run("send") → call services.email.send({
    to: email,
    template: "welcome",
    data: { firstName: fullName.split(" ")[0] }
  })
       ↓
[services.email.send]
  resolves template component: emails/welcome.tsx (React Email)
  renders to HTML via renderAsync()
  calls Resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS,
    to: [email],
    subject: "Welcome to <AppName>!",
    html: rendered
  })
       ↓
[Resend]
  queues email for delivery
  returns { id: resend_id }
       ↓
[services.email.send]
  call repositories.emailLogs.create({
    userId,
    template: "welcome",
    resendId,
    status: "sent",
    sentAt: new Date()
  })
       ↓
[Inngest Function]
  completes step, returns { resendId }
```

## FLOW: BILLING EMAIL (TRIGGERED BY STRIPE WEBHOOK)

```
[Stripe Webhook: invoice.paid]
  verified via stripe.webhooks.constructEvent()
       ↓
[Webhook Handler]
  emits Inngest event: "invoice.paid" { userId, invoiceId, amount, periodEnd }
       ↓
[Inngest Function: send-invoice-receipt]
  step.run("send-receipt") → services.email.send({
    to: user.email,
    template: "invoice-receipt",
    data: { invoiceId, amount, periodEnd }
  })
       ↓
[Resend]
  delivers invoice receipt email
```

## FLOW: RESEND WEBHOOK (DELIVERY STATUS UPDATE)

```
[Resend]
  POST /api/webhooks/resend
  header: Resend-Signature
       ↓
[Webhook Route Handler]
  verifies signature using Resend webhook secret
  parses event: email.delivered | email.bounced | email.complained
       ↓
[services.email.updateStatus]
  repositories.emailLogs.updateByResendId({
    resendId: event.data.email_id,
    status: event.type.split(".")[1]   // "delivered" | "bounced" | "complained"
  })
       ↓
  on "bounced" or "complained":
    services.users.flagEmailInvalid({ email })
    // suppress future emails to this address
       ↓
[Webhook Route]
  200 OK
```

## FLOW: BATCH / BROADCAST EMAIL (OPTIONAL)

```
[Admin Action or Inngest Cron]
  emits Inngest event: "email.broadcast" { templateId, audienceFilter }
       ↓
[Inngest Function: broadcast-email]
  step.run("fetch-audience") → query DB for matching users
  for each user (batched 50 at a time using step.run):
    step.run("send-<userId>") → services.email.send(...)
       ↓
[Resend]
  delivers each email individually (respects rate limits)
```

## ENV VARS INVOLVED
- `RESEND_API_KEY`
- `RESEND_FROM_ADDRESS`
- `RESEND_WEBHOOK_SECRET`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

## CONSTRAINTS
- All email sending MUST be async via Inngest; never block request threads.
- Templates live in `emails/<name>.tsx` as React Email components.
- email_logs table persists every sent email for audit.
- Bounced/complained addresses must be suppressed to protect sending reputation.
- PII must not appear in log metadata beyond user_id and template name.
