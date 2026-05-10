# DATA FLOW — AUTH SYSTEM

## OVERVIEW
End-to-end flow for Clerk-powered authentication with route protection, server-side identity, and DB user mirror.

## INTEGRATIONS INVOLVED
- `clerk` (primary)
- `database` (mirror table)
- `resend` (welcome email)
- `posthog` (identify on sign-in)

## ENTITIES
- `users` (DB; mirror of Clerk user)
- `organizations` (DB; optional)
- `memberships` (DB; optional)

## FLOW: SIGN-UP

```
[Browser]
   GET /sign-up
        ↓
[Next.js Page]
   renders <SignUp /> from @clerk/nextjs
        ↓
[Clerk Hosted UI]
   user submits email + password (or OAuth)
        ↓
[Clerk]
   creates user
   issues session cookie
   fires user.created webhook
        ↓
[Browser]
   redirected to NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL (e.g., /dashboard)

In parallel:

[Clerk]
   POST /api/webhooks/clerk
   header: svix signature
        ↓
[Next.js Webhook Route]
   verifies signature with CLERK_WEBHOOK_SIGNING_SECRET
   on user.created:
     services.users.mirrorFromClerk({ clerkUserId, email, fullName, avatarUrl })
        ↓
[Repositories.users.upsert]
   inserts row into users
        ↓
[services.email.send('welcome', { user })]
        ↓
[Resend]
   delivers welcome email
        ↓
[Webhook Route]
   200 OK
```

## FLOW: SIGN-IN

```
[Browser]
   GET /sign-in
        ↓
[Next.js Page]
   renders <SignIn />
        ↓
[Clerk Hosted UI]
   user submits credentials
        ↓
[Clerk]
   issues session cookie
        ↓
[Browser]
   redirected to NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL (e.g., /dashboard)
        ↓
[Next.js Server Component for /dashboard]
   middleware allows authenticated request
   const { userId } = auth()
   loads user via repositories.users.getByClerkId(userId)
        ↓
[Browser]
   PostHog client calls posthog.identify(userId, { email })
```

## FLOW: PROTECTED ROUTE ACCESS

```
[Browser]
   GET /dashboard/billing
        ↓
[Clerk Middleware]
   route is not in publicRoutes
   if no session cookie → redirect to /sign-in
   else → continue
        ↓
[Next.js Server Component]
   const { userId, orgId } = auth()
   load resources scoped to userId
        ↓
[Browser]
   receives streamed HTML
```

## FLOW: SIGN-OUT

```
[Browser]
   click <UserButton />
   choose Sign Out
        ↓
[Clerk]
   destroys session cookie
        ↓
[Browser]
   redirected to /
   PostHog client calls posthog.reset()
```

## FLOW: USER DELETED

```
[Admin in Clerk Dashboard]
   deletes a user
        ↓
[Clerk]
   fires user.deleted webhook
        ↓
[Next.js Webhook Route]
   verifies signature
   services.users.handleDeleted(clerkUserId)
        ↓
[Repositories.users]
   either soft-delete or hard-delete + cascade per data policy
        ↓
[Webhook Route]
   200 OK
```

## DATA SHAPES

### users (DB)
```sql
id              uuid pk
clerk_user_id   text unique not null
email           text not null
full_name       text
avatar_url      text
created_at      timestamptz
updated_at      timestamptz
```

## ENV VARS REQUIRED
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- CLERK_WEBHOOK_SIGNING_SECRET
- NEXT_PUBLIC_CLERK_SIGN_IN_URL
- NEXT_PUBLIC_CLERK_SIGN_UP_URL
- NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
- NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL

## ROUTES INVOLVED
- `/sign-in`
- `/sign-up`
- `/dashboard/*` (protected)
- `/api/webhooks/clerk`

## VALIDATION CHECKLIST
- [ ] Middleware declares all public routes explicitly.
- [ ] Webhook signature verified before parsing.
- [ ] Local users table mirrors Clerk on user.created.
- [ ] User deletion cascades or soft-deletes per policy.
- [ ] Authorization happens server-side, never on client-supplied user id.
- [ ] PostHog identify/reset called at sign-in/sign-out.
