# DATA FLOW - IN-APP NOTIFICATION CENTER

## OVERVIEW
Durable in-app inbox with read state, deep links, and channel preferences.

## FLOW
- Domain action emits notification event
- Notification service stores inbox record and optional channel fan-out
- Client inbox subscribes to updates and hydrates unread counts
- User action marks single or bulk notifications as read

## CONSTRAINTS
- Notification records must be tenant-scoped
- Deep links must resolve to authorized destinations only