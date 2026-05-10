# Outbound Event Taxonomy

Canonical list of outbound events the app may emit to automation runners (n8n, Zapier) or direct webhook subscribers.

Agents MUST use these exact event type strings. New event types require a PR to this file.

---

## User lifecycle

| Event type | Trigger | Payload fields |
|---|---|---|
| `user.created` | New user signs up | userId, email, name, plan, createdAt |
| `user.deleted` | User account deleted/pseudonymized | userId, deletedAt |
| `user.updated` | User profile updated | userId, changedFields[] |

## Subscription & billing

| Event type | Trigger | Payload fields |
|---|---|---|
| `lead.created` | Lead capture form submitted | email, name, source, createdAt |
| `subscription.created` | Subscription activated | userId, plan, priceId, periodEnd, createdAt |
| `subscription.updated` | Plan changed or seat count changed | userId, previousPlan, newPlan, changedAt |
| `subscription.canceled` | Subscription canceled (at period end) | userId, plan, cancelAt |
| `subscription.expired` | Subscription period ended without renewal | userId, plan, expiredAt |
| `trial.started` | Trial period started | userId, plan, trialEndsAt |
| `trial.expired` | Trial ended without conversion | userId, plan, expiredAt |
| `invoice.paid` | Invoice paid | userId, amount, currency, invoiceId |
| `invoice.payment_failed` | Payment attempt failed | userId, amount, nextRetryAt |

## Orders & commerce

| Event type | Trigger | Payload fields |
|---|---|---|
| `order.paid` | Order payment completed | userId, orderId, amount, currency, items[] |
| `order.refunded` | Order refunded | userId, orderId, amount, refundReason |
| `order.shipped` | Order fulfilled/shipped | userId, orderId, trackingNumber, carrier |

## Appointments & bookings

| Event type | Trigger | Payload fields |
|---|---|---|
| `appointment.booked` | Booking confirmed | userId, bookingId, startTime, endTime, attendeeEmail |
| `appointment.rescheduled` | Booking rescheduled | userId, bookingId, oldStartTime, newStartTime |
| `appointment.canceled` | Booking canceled | userId, bookingId, canceledAt |

## AI & usage

| Event type | Trigger | Payload fields |
|---|---|---|
| `ai.usage.limit_reached` | User hits monthly AI token cap | userId, plan, limitType, usageThisMonth |
| `ai.content.flagged` | Moderation check flagged content | userId, routeId, flaggedAt |

## Documents & files

| Event type | Trigger | Payload fields |
|---|---|---|
| `document.signed` | Document e-signed | userId, documentId, signedAt, signerEmail |
| `file.uploaded` | File upload completed | userId, fileId, fileName, fileUrl, mimeType |

## Notifications & messaging

| Event type | Trigger | Payload fields |
|---|---|---|
| `notification.sent` | Notification dispatched | userId, channel, templateId, sentAt |
| `notification.failed` | Notification delivery failed | userId, channel, templateId, failedAt, reason |

## Realtime & collaboration

| Event type | Trigger | Payload fields |
|---|---|---|
| `dashboard.metric.updated` | Real-time metric value changes | tenantId, metricKey, value, changedAt |
| `notification.created` | In-app notification record created | tenantId, userId, notificationId, createdAt |
| `entity.status.changed` | Domain entity transitions status | tenantId, entityType, entityId, fromStatus, toStatus, changedAt |
| `row.inserted` | New DB row emitted through realtime layer | tenantId, table, rowId, insertedAt |
| `row.updated` | Existing DB row emitted through realtime layer | tenantId, table, rowId, changedFields[], updatedAt |
| `row.deleted` | DB row deletion emitted through realtime layer | tenantId, table, rowId, deletedAt |
| `room.joined` | User joins collaborative room | tenantId, roomId, userId, joinedAt |
| `room.left` | User leaves collaborative room | tenantId, roomId, userId, leftAt |
| `comment.created` | Collaborative comment created | tenantId, roomId, commentId, authorUserId, createdAt |

---

## Envelope schema (all events)

Every outbound event MUST be wrapped in this envelope:

\`\`\`json
{
  "type": "subscription.created",
  "version": "1",
  "id": "evt_01J...",
  "timestamp": "2024-01-01T12:00:00Z",
  "environment": "production",
  "data": { /* event-specific fields */ }
}
\`\`\`

- `id`: unique per-delivery ID (UUID v7 or ULID recommended)
- `version`: event schema version string; increment on breaking changes
- `environment`: `production` | `staging` | `preview`
