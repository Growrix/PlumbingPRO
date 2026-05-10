# DATA CONSTRAINTS

## PURPOSE
Hard rules governing data ownership, schema design, migration safety, and cross-integration data consistency. Applied by the reviewer agent.

---

## DC1 — SINGLE SOURCE OF TRUTH PER ENTITY
**Rule:** Every data entity has exactly one authoritative source.

| Entity | Owner | Mirror Location |
|--------|-------|----------------|
| User identity | Clerk | `users` table (clerk_id FK) |
| Billing / subscription state | Stripe | `subscriptions` table (via webhook only) |
| CMS content | Sanity | Not duplicated in DB |
| Uploaded file bytes | UploadThing CDN | `files` table (key + url only) |
| Analytics events | PostHog | Not stored in app DB |
| Error events | Sentry | Not stored in app DB |

**Detection:** Review plan's DB schema for entities that duplicate the owner's data beyond the allowed mirror fields.
**Failure:** `BLOCK DC1: entity <name> duplicated outside its owner system`.

## DC2 — MIRROR TABLES UPDATED VIA WEBHOOKS ONLY
**Rule:** Mirror tables (`users`, `subscriptions`) MUST only be written to from webhook handlers, never from direct API calls or form submissions.

Specifically:
- `users` is written by the Clerk `user.created` / `user.updated` / `user.deleted` webhook handler only.
- `subscriptions` is written by the Stripe `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid` webhook handlers only.

**Detection:** Review service layer for any direct write to `users` or `subscriptions` outside webhook handlers.
**Failure:** `BLOCK DC2: direct write to mirror table <table> outside webhook handler in <service>`.

## DC3 — BASE COLUMNS REQUIRED ON ALL TABLES
**Rule:** Every DB table MUST include: `id` (UUID/CUID primary key), `created_at` (timestamp), `updated_at` (auto-updated timestamp). Exceptions: pure join tables with composite PKs.
**Detection:** Review `prisma/schema.prisma` for missing base columns.
**Failure:** `BLOCK DC3: table <name> missing required base columns`.

## DC4 — SOFT DELETES ON FINANCIAL DATA
**Rule:** Tables containing financially or legally relevant data (`subscriptions`, `invoices`, `orders`, `payments`) MUST use soft deletes (`deleted_at DateTime?`).
**Detection:** Review plan's DB schema for presence of `deleted_at` on financial tables.
**Failure:** `BLOCK DC4: financial table <name> missing soft delete column`.

## DC5 — FOREIGN KEYS DECLARED
**Rule:** Every column referencing another table's primary key MUST have a declared foreign key constraint in the schema.
**Detection:** Review `prisma/schema.prisma` for implicit FK fields without `@relation`.
**Failure:** `BLOCK DC5: column <table>.<column> references <other_table> without FK constraint`.

## DC6 — MIGRATIONS ARE BACKWARD COMPATIBLE
**Rule:** No migration may perform a destructive or non-backward-compatible change in a single deploy. Allowed phased approaches:
- Add column (nullable) → deploy → backfill → add constraint → deploy → drop old.
- Rename column → add new column → migrate data → drop old (two deploys minimum).

**Detection:** Review migration files for `DROP COLUMN`, `ALTER COLUMN` (type change), `RENAME COLUMN` without phasing.
**Failure:** `BLOCK DC6: migration <name> contains breaking change without phasing plan`.

## DC7 — SEED IS IDEMPOTENT
**Rule:** `prisma/seed.ts` MUST be safe to run multiple times without creating duplicate records or errors. Use `upsert` instead of `create` for reference data.
**Detection:** Review seed file for `prisma.<model>.create` on records with unique constraints.
**Failure:** `BLOCK DC7: seed.ts uses create() for uniquely constrained record <model>`.

## DC8 — PAGINATION PREVENTS DATA DUMPS
**Rule:** No API endpoint may return an unbounded list of rows. All list queries MUST have a `take` limit (max 100) and support cursor or offset pagination.
**Detection:** Review all repository `findMany` calls for absence of `take`.
**Failure:** `BLOCK DC8: unbounded findMany in <repository_method>`.

## DC9 — PII FIELDS DECLARED
**Rule:** If PII beyond `email` and `name` is stored (phone, address, SSN, DOB), those fields MUST be:
- Declared explicitly in the plan's data dictionary.
- Flagged in the schema with a comment: `// PII: <category>`.
- Included in the data retention and deletion policy.

**Detection:** Review plan's DB schema for undeclared PII fields.
**Failure:** `BLOCK DC9: PII field <field> in <table> not declared in plan data policy`.

## DC10 — NO DUPLICATED SCHEMA BETWEEN ORM AND APP CODE
**Rule:** TypeScript types for DB models MUST be generated from the Prisma schema. Hand-written TypeScript interfaces that duplicate Prisma models are FORBIDDEN.
**Detection:** Review `src/types/` or `src/models/` for manually declared DB entity types.
**Failure:** `BLOCK DC10: manually declared type <type> duplicates Prisma model <model>`.

## DC11 — BACKUP STRATEGY DECLARED
**Rule:** Every plan MUST declare:
- Backup frequency (minimum: daily).
- Backup retention period (minimum: 30 days).
- Restore procedure reference (runbook link).
- RTO and RPO targets.

**Detection:** Check `plan.devops.backup` section.
**Failure:** `BLOCK DC11: plan missing backup strategy declaration`.

## ENFORCEMENT
Data constraints DC1–DC11 are evaluated by the reviewer agent after performance constraints.
Failures are included in `validation_report.json` under the `data_constraints` key.
Any DC failure blocks the pipeline.
