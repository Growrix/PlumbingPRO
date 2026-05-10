# Skill: Reviews Aggregation Pattern

**Used by:** posthog, google-business-profile, product analytics surfaces

## Pattern

Aggregate user reviews and ratings from multiple sources into a normalized `reviews` table, with deduplication by `source_id` and `source` pair.

### Schema
```sql
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source      TEXT NOT NULL,         -- 'google', 'app_store', 'g2', 'internal'
  source_id   TEXT NOT NULL,
  product_id  UUID REFERENCES products(id),
  author_name TEXT,
  rating      SMALLINT CHECK (rating BETWEEN 1 AND 5),
  body        TEXT,
  published_at TIMESTAMPTZ,
  imported_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (source, source_id)
);
```

### Ingestion pattern
```ts
// Upsert to avoid duplicates on re-import
await db.reviews.upsert({
  where: { source_source_id: { source, source_id: externalId } },
  create: { source, source_id: externalId, rating, body, published_at },
  update: { rating, body, published_at },
})
```

### Aggregation query
```ts
const stats = await db.reviews.aggregate({
  where: { product_id: productId },
  _avg: { rating: true },
  _count: { id: true },
})
// { _avg: { rating: 4.3 }, _count: { id: 128 } }
```

### Rules
- Source + source_id MUST be unique — use upsert, never blind insert.
- Rating MUST be validated as integer 1–5 before storage.
- PII in `author_name` MUST be handled per GDPR data retention policy.
- Aggregated rating displayed in UI MUST be computed server-side, not in client.
