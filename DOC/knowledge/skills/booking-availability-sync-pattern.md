# Skill: Booking Availability Sync Pattern

**Used by:** calcom

## Pattern

When Cal.com is used for booking, the app MUST sync booking events to a local database via webhooks for display in the app's own UI (e.g., 'confirmed appointments' list).

### Webhook events to handle
| Event | Action |
|---|---|
| \ooking_created\ | Insert booking record |
| \ooking_rescheduled\ | Update booking record |
| \ooking_cancelled\ | Mark booking as cancelled |
| \ooking_paid\ | Update payment status |

### Mirror table
\\\sql
bookings (
  id              uuid PRIMARY KEY,
  cal_booking_id  text UNIQUE NOT NULL,
  user_id         uuid REFERENCES users(id),
  start_time      timestamptz NOT NULL,
  end_time        timestamptz NOT NULL,
  status          text NOT NULL,  -- confirmed | cancelled | rescheduled
  attendee_email  text NOT NULL,
  attendee_name   text NOT NULL,
  metadata        jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
)
\\\

### Rules
- Webhook MUST be verified using x-cal-signature-256 header.
- MUST use idempotency-key-pattern to prevent duplicate bookings on retry.
- App availability display MUST read from mirror table, not Cal.com API in real time.
