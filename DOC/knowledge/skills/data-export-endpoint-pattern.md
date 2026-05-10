# Skill: Data Export Endpoint Pattern

**Used by:** GDPR compliance (privacy/dsar role)

## Pattern

Every app handling EU user data MUST implement \GET /api/account/export\ to fulfil GDPR Article 20 (data portability) requests.

### Implementation
\\\	s
// /api/account/export — authenticated, returns JSON of all user data
export async function GET(req: Request) {
  const { userId } = await auth()  // Clerk
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const [user, subscriptions, orders, bookings] = await Promise.all([
    db.user.findUnique({ where: { clerkUserId: userId } }),
    db.subscription.findMany({ where: { userId } }),
    db.order.findMany({ where: { userId } }),
    db.booking.findMany({ where: { userId } }),
  ])

  return Response.json({ user, subscriptions, orders, bookings })
}
\\\

### Rules
- MUST be authenticated — only the account owner may export their data.
- MUST be rate-limited (1 export per 24 hours per user).
- MUST include ALL data tables that hold user PII.
- Response MUST be machine-readable (JSON preferred; CSV optional).
