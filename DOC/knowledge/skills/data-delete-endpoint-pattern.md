# Skill: Data Delete Endpoint Pattern

**Used by:** GDPR compliance, clerk (user.deleted webhook)

## Pattern

Every app handling EU user data MUST implement \DELETE /api/account\ to fulfil GDPR Article 17 (right to erasure) requests.

### Implementation
\\\	s
// /api/account — DELETE, authenticated
export async function DELETE(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  await db.([
    // Pseudonymize PII immediately
    db.user.update({
      where: { clerkUserId: userId },
      data: { email: '[deleted]', fullName: '[deleted]', deletedAt: new Date() }
    }),
    // Soft-delete related data
    db.booking.updateMany({ where: { userId }, data: { deletedAt: new Date() } }),
  ])

  // Delete from Clerk (triggers user.deleted webhook for final cleanup)
  await clerkClient.users.deleteUser(userId)

  return new Response(null, { status: 204 })
}
\\\

### Rules
- MUST pseudonymize — hard delete risks breaking FK constraints and audit logs.
- MUST delete from the identity provider (Clerk) AFTER local pseudonymization.
- MUST retain billing records for the statutory period (varies by jurisdiction).
- MUST send a confirmation email before deletion (allow 7-day cancellation window).
