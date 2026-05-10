# SPEC TEMPLATE: DATABASE

## PURPOSE
Emit this spec to describe the complete database schema. This is the authoritative pre-codegen description of every table, column, index, and relationship. Codegen agents use this to produce `prisma/schema.prisma`.

---

## DATABASE CONFIG
```
provider: postgresql
connection_pooling: prisma_accelerate | pgbouncer
migration_tool: prisma_migrate
orm: prisma
```

---

## ENUMS
```yaml
enums:
  - name: UserRole
    values: [ADMIN, MEMBER, VIEWER]
  - name: SubscriptionStatus
    values: [active, trialing, past_due, canceled, unpaid]
  - name: [EnumName]
    values: [VALUE1, VALUE2]
```

---

## TABLES

*Repeat this block for each table.*

### `[table_name]`
```
purpose: [one-line description]
owner: [which integration/domain owns this]
soft_delete: true | false

columns:
  - id: String @id @default(cuid()) — primary key
  - user_id: String — FK → users.id
  - [field]: [PrismaType] — [description] [@unique|@default|?]
  - created_at: DateTime @default(now())
  - updated_at: DateTime @updatedAt
  - deleted_at: DateTime? — (soft delete, if applicable)

indexes:
  - [table_name]_user_id_idx on (user_id)
  - [table_name]_[field]_key UNIQUE on ([field])
  - [composite_index_name] on ([field1], [field2])

relations:
  - user: User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  - [other relations]

notes: [any constraints or special behavior]
```

---

## REQUIRED TABLES PER INTEGRATION

| Integration | Tables |
|-------------|--------|
| clerk (auth) | users |
| stripe (payments) | subscriptions, invoices |
| resend (emails) | email_logs |
| uploadthing (files) | files |
| openai (ai) | conversations, messages, ai_usage |
| inngest (jobs) | (no required tables; jobs_log optional) |
| meilisearch (search) | (no required tables; index is external) |
| posthog (analytics) | (no required tables; PostHog is system of record) |
| sentry (errors) | (no required tables) |
| axiom (logs) | (no required tables) |

---

## MIGRATION PLAN

| Migration | Type | Breaking | Phased |
|-----------|------|----------|--------|
| 001_init | initial | no | no |
| 002_add_subscriptions | additive | no | no |
| [migration] | [additive|rename|drop] | [yes|no] | [yes|no] |

For any `breaking: yes` migration, the phasing plan MUST be described:
```
phase_1: [add new column, deploy]
phase_2: [backfill data via script]
phase_3: [add constraint / drop old column, deploy]
```

---

## SEED DATA

| Model | Records | Idempotent Method |
|-------|---------|------------------|
| [Model] | [description of seed records] | upsert on [unique field] |

---

## INDEX SUMMARY

| Table | Index | Columns | Type |
|-------|-------|---------|------|
| users | users_clerk_id_key | clerk_id | UNIQUE |
| posts | posts_user_id_idx | user_id | BTREE |
| [table] | [index_name] | [columns] | [BTREE|HASH|GIN] |
