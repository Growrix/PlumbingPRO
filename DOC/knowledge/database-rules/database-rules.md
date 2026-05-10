# DATABASE RULES

## SCOPE
Apply to every schema definition, migration, query, repository function, and connection management pattern in any plan produced by this OS.

## RULE DB1 — ORM IS MANDATORY
- All database access MUST go through the ORM (Prisma by default).
- Raw SQL (`$queryRaw`, `$executeRaw`) is FORBIDDEN except in reviewed, version-controlled migrations.
- No feature may access the database via a different ORM or raw driver simultaneously.
- The ORM client is initialized once in `src/server/db/client.ts` and imported everywhere.

## RULE DB2 — SCHEMA IS SINGLE SOURCE OF TRUTH
- The ORM schema file (`prisma/schema.prisma`) is the authoritative source for all DB structure.
- TypeScript interfaces MUST be generated from the schema, never hand-written.
- Duplicate model definitions (e.g., a TypeScript interface that mirrors a Prisma model) are FORBIDDEN.

## RULE DB3 — EVERY TABLE HAS REQUIRED BASE COLUMNS
Every table MUST include:
- `id`: UUID primary key (CUID2 or UUID v4).
- `created_at`: `DateTime @default(now())`.
- `updated_at`: `DateTime @updatedAt`.

Exception: pure join tables with composite PKs may omit `id`.

## RULE DB4 — MIGRATIONS ARE CONTROLLED
- Schema changes MUST be captured in migration files (`prisma migrate dev`).
- Migrations MUST be committed to VCS and reviewed in PRs.
- Production migrations run via `prisma migrate deploy` in CI, never from developer machines.
- Breaking migrations (column drops, renames) MUST be phased: add → migrate data → drop (two separate deploys).

## RULE DB5 — INDEXES ARE DECLARED EXPLICITLY
Every field used in a `WHERE` clause of a production query MUST have an index declared in the schema.
Required indexes:
- `user_id` on all user-owned tables.
- `org_id` on all org-scoped tables.
- `slug` on content tables (UNIQUE).
- `status` fields used for queue/state queries.
- `created_at` on tables queried by time range.
- Composite indexes for multi-column WHERE conditions.

Queries on un-indexed columns in tables > 10k rows BLOCK the plan.

## RULE DB6 — SOFT DELETES FOR AUDITABLE DATA
Tables containing financially or legally relevant data MUST use soft deletes:
- Add `deleted_at DateTime?` column.
- Repositories MUST filter `WHERE deleted_at IS NULL` in all read queries by default.
- Hard deletes require explicit method (`hardDelete`) that is gated by admin role.

Affected tables: `users`, `subscriptions`, `invoices`, `orders`, `audit_logs`.

## RULE DB7 — MULTI-TENANCY IS SCOPED
- In multi-tenant apps, every table owned by a tenant MUST have a `org_id` or `user_id` foreign key.
- Every read query MUST include the tenant scope in the WHERE clause.
- Cross-tenant queries are forbidden outside of admin-only services with explicit scope override.
- The repository layer enforces scope via a `ScopedRepository` base class or context parameter.

## RULE DB8 — ATOMIC WRITES USE TRANSACTIONS
Any operation that writes to two or more tables and must be consistent MUST use a transaction:
```typescript
await prisma.$transaction([...operations])
```
Transactions MUST NOT span external API calls (no network calls inside a DB transaction).

## RULE DB9 — CONNECTION POOLING IN PRODUCTION
- Prisma in serverless environments (Vercel) MUST use connection pooling (Prisma Accelerate or PgBouncer).
- The pool size MUST be declared and bounded (`connection_limit` in the DATABASE_URL or via Accelerate config).
- Unbounded connection pools in serverless are FORBIDDEN (exhaust the database connection limit).

## RULE DB10 — SENSITIVE DATA IS PROTECTED
- Passwords are NEVER stored (auth is delegated to Clerk).
- Payment card data is NEVER stored (delegated to Stripe).
- PII fields (phone, address) MUST be encrypted at rest if stored (via Prisma extension or DB column encryption).
- The `users` table stores only: `id`, `clerk_id`, `email`, `name`, `avatar_url`, `role`, `created_at`, `updated_at`.

## RULE DB11 — BACKUPS AND RECOVERY
- Database backups MUST be enabled on the managed provider (Neon, Supabase, Railway, etc.).
- Point-in-time recovery MUST be available for production.
- Backup retention: minimum 30 days.
- A restore procedure MUST be documented in the deployment runbook.

## RULE DB12 — SEED AND FIXTURE DATA
- `prisma/seed.ts` MUST exist and create all necessary reference data.
- Seeds are idempotent (run multiple times without errors).
- Production seed MUST NOT create test users or demo data.
- Test seeds are in `tests/fixtures/` and loaded only in test environments.

## NAMING CONVENTIONS

| Object | Convention | Example |
|--------|-----------|---------|
| Table | snake_case plural | `blog_posts` |
| Column | snake_case | `published_at` |
| FK | `<table_singular>_id` | `user_id` |
| Index | `<table>_<cols>_idx` | `posts_user_id_idx` |
| Unique | `<table>_<cols>_key` | `posts_slug_key` |
| Enum | PascalCase | `UserRole` |
