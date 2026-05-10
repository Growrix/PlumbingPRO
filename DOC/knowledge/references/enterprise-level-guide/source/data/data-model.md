# Data Model

## Purpose

This document defines the canonical entity model for Growrix OS. It should guide database migrations, Supabase policies, query design, and API contracts.

## Data Design Principles

- Use UUID primary keys for all business entities.
- Include `created_at` on all tables and `updated_at` on mutable tables.
- Prefer explicit enum-like status values with documented lifecycle transitions.
- Store actor references for ownership, assignment, and auditability.
- Avoid overloading one table with unrelated concerns. Keep domain boundaries visible.

## Core Tables

### users

Purpose: canonical application users.

Recommended fields:

- `id`
- `email`
- `name`
- `role` with values `admin`, `client`, `developer`
- `created_at`
- `updated_at`

Notes:

- Prefer Supabase Auth as the credential authority.
- Store app profile data here and keep auth credentials in the auth subsystem.

### batches

Purpose: control free demo capacity.

Recommended fields:

- `id`
- `batch_number`
- `max_slots`
- `current_slots`
- `start_date`
- `status` with values such as `active`, `closed`, `waiting`
- `created_at`

### demo_requests

Purpose: intake and queue records for free demo requests.

Recommended fields:

- `id`
- `user_id`
- `batch_id`
- `developer_id` nullable
- `name`
- `email`
- `business_name`
- `industry`
- `goals` as JSON array
- `style_preference`
- `color_preference`
- `logo_url`
- `notes`
- `priority` boolean
- `status`
- `queue_position`
- `est_start`
- `est_delivery`
- `created_at`
- `updated_at`

Recommended status lifecycle:

- `requested`
- `assigned`
- `in_progress`
- `delivered`
- `converted`
- `cancelled`

### projects

Purpose: active delivery records after assignment or conversion.

Recommended fields:

- `id`
- `demo_request_id` nullable
- `client_id`
- `developer_id`
- `title`
- `delivery_type` with values such as `demo`, `full_project`, `shop_customization`
- `status`
- `start_date`
- `end_date`
- `created_at`
- `updated_at`

Recommended status lifecycle:

- `assigned`
- `in_progress`
- `delivered`
- `maintenance`
- `closed`

### payments

Purpose: record all monetized flows.

Recommended fields:

- `id`
- `demo_request_id` nullable
- `shop_order_id` nullable
- `maintenance_contract_id` nullable
- `user_id`
- `amount`
- `currency`
- `payment_status` with values `pending`, `paid`, `failed`, `refunded`
- `payment_type` with values such as `priority`, `shop`, `maintenance`
- `stripe_session_id`
- `stripe_payment_intent`
- `created_at`
- `updated_at`

### messages

Purpose: project-scoped collaboration history.

Recommended fields:

- `id`
- `project_id`
- `sender_id`
- `message`
- `file_url` nullable
- `created_at`

### project_backups

Purpose: final archival backups and downloadable project bundles.

Recommended fields:

- `id`
- `project_id`
- `developer_id`
- `file_url`
- `uploaded_at`

### demo_gallery

Purpose: public and internal gallery entries.

Recommended fields:

- `id`
- `demo_request_id` nullable
- `title`
- `description`
- `thumbnail_url`
- `preview_url`
- `industry`
- `type` with values `website`, `app`
- `tags`
- `status` with values `inspiration`, `delivered`, `converted`, `sold`
- `is_public`
- `created_by`
- `created_at`

### shop_items

Purpose: public inventory of pre-built offerings.

Recommended fields:

- `id`
- `title`
- `description`
- `tags`
- `industry`
- `tech_stack`
- `preview_url`
- `price`
- `platform`
- `sold`
- `is_public`
- `created_at`
- `updated_at`

### shop_orders

Purpose: order records for shop purchases and customizations.

Recommended fields:

- `id`
- `shop_item_id`
- `client_id`
- `developer_id` nullable
- `customization_notes`
- `status`
- `price`
- `created_at`
- `updated_at`

### maintenance_contracts

Purpose: define maintenance coverage periods and plans.

Recommended fields:

- `id`
- `project_id`
- `client_id`
- `start_date`
- `end_date`
- `plan`
- `created_at`
- `updated_at`

### maintenance_requests

Purpose: ticket records for after-sale support.

Recommended fields:

- `id`
- `project_id`
- `client_id`
- `developer_id` nullable
- `description`
- `file_url` nullable
- `urgency`
- `status`
- `created_at`
- `updated_at`

### notifications

Purpose: in-app alerts and notification history.

Recommended fields:

- `id`
- `user_id`
- `type`
- `title`
- `message`
- `link`
- `is_read`
- `created_at`

### ai_chat_logs

Purpose: optional storage for AI interaction history.

### google_reviews

Purpose: cache of synchronized public review data.

## Relationship Summary

- One `user` can own many `demo_requests`, `projects`, `shop_orders`, `maintenance_requests`, and `notifications`.
- One `developer` can be assigned to many `demo_requests`, `projects`, `shop_orders`, and `maintenance_requests`.
- One `demo_request` belongs to one `batch` and may later produce one `project`.
- One `project` can have many `messages`, `project_backups`, and maintenance records.
- One `shop_item` can produce many `shop_orders`.

## Mandatory Database Behaviors

- Queue-related writes must be transactional.
- Payment reconciliation must be idempotent.
- Delivery completion should trigger related side effects through explicit workflows, not fragile client-only logic.
- Public visibility must always be backed by a stored boolean or status field.

## Access Model Summary

- Client rows are tenant-scoped to the authenticated client.
- Developer rows are assignment-scoped to the authenticated developer.
- Admin access is elevated but still governed through explicit role checks.
- Public reads are limited to explicitly approved content such as public gallery entries and visible reviews.

## Schema Evolution Rules

- No status field may be introduced without a documented lifecycle.
- No new table should be added without an owning module and access policy.
- Migration files should include rollback thinking, even if rollback is manual.
- Breaking changes to core entities require corresponding updates to API and documentation.