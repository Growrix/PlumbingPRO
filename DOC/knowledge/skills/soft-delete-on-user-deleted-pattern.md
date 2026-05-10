# Skill: Soft Delete on User Deleted Pattern

**Used by:** clerk (user.deleted webhook)

## Pattern

When a user account is deleted in Clerk, the app MUST soft-delete (not hard-delete) the user's data to allow GDPR erasure requests, audit log retention, and billing reconciliation.

### Implementation

\\\	s
// In Clerk webhook handler for user.deleted:
case 'user.deleted': {
  const { id: clerkUserId } = evt.data
  await db.user.update({
    where: { clerkUserId },
    data: {
      deletedAt: new Date(),
      email: '[deleted]',  // pseudonymize PII
      fullName: '[deleted]',
    }
  })
  // Cascade: cancel active subscriptions, revoke sessions, etc.
  break
}
\\\

### Rules
- MUST pseudonymize PII fields (email, name) immediately on deletion.
- MUST retain non-PII data (IDs, timestamps, subscription history) for billing reconciliation.
- MUST trigger GDPR data-delete-endpoint-pattern if a full erasure request is also received.
- Hard delete only after retention period (default: 90 days).
