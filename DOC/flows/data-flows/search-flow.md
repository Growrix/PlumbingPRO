# DATA FLOW — SEARCH SYSTEM

## OVERVIEW
End-to-end flow for Meilisearch-powered full-text search with faceting, user-scoped results, and async indexing via Inngest.

## INTEGRATIONS INVOLVED
- `meilisearch` (primary)
- `database` (source of truth)
- `inngest` (async indexing)
- `upstash` (search result caching)
- `clerk` (user scoping)

## ENTITIES
- `posts` / `products` / content documents (indexed)
- `search_index_events` (optional audit table for indexing operations)

## FLOW: SEARCH QUERY

```
[Browser]
  User types query in SearchBox
       ↓
[Client Component]
  debounce 300ms
  calls GET /api/search?q=<query>&filter=<facets>
       ↓
[Next.js Route Handler /api/search]
  authenticate via auth()
  validate q and filter params (zod)
  call services.search.query({ q, filter, userId })
       ↓
[services.search.query]
  check Upstash cache: key = "search:<userId>:<q_hash>:<filter_hash>"
  HIT → return cached results (TTL 60s)
  MISS →
       ↓
[MeilisearchClient.index('posts').search(q, { filter: `user_id = ${userId}` })]
  returns ranked hits with highlights
       ↓
[services.search.query]
  write results to Upstash cache (TTL 60s)
  return typed SearchResults
       ↓
[Route Handler]
  200 { data: SearchResults }
       ↓
[Client Component]
  renders results with highlight markup
```

## FLOW: DOCUMENT INDEXING (ON CREATE / UPDATE)

```
[services.<entity>.create or update]
  persists to DB
  emits Inngest event: "entity.updated" { entityId, entityType }
       ↓
[Inngest Function: index-entity]
  step.run("fetch-entity") → load entity from DB
  step.run("transform") → map entity fields to search document
  step.run("index") → MeilisearchClient.index('<type>').addOrUpdateDocuments([doc])
       ↓
[Meilisearch]
  updates index asynchronously
  returns taskUid
       ↓
[Inngest Function]
  optionally polls task status for large batches
  logs result
```

## FLOW: DOCUMENT DELETION

```
[services.<entity>.delete]
  soft-deletes or hard-deletes in DB
  emits Inngest event: "entity.deleted" { entityId, entityType }
       ↓
[Inngest Function: unindex-entity]
  MeilisearchClient.index('<type>').deleteDocument(entityId)
       ↓
[Meilisearch]
  removes document from index
```

## FLOW: FULL REINDEX (RECOVERY CRON)

```
[Inngest Cron: reindex-all — weekly or on-demand]
  step.run("fetch-all-ids") → query DB for all entity IDs
  step.run("batch-index") → chunk into 500-doc batches
  for each batch:
    step.run("index-batch-<n>") → addOrUpdateDocuments(batch)
       ↓
[Meilisearch]
  processes batches
       ↓
[Inngest]
  logs completion, emits "reindex.completed" event
```

## ENV VARS INVOLVED
- `MEILISEARCH_HOST`
- `MEILISEARCH_API_KEY`
- `MEILISEARCH_ADMIN_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

## CONSTRAINTS
- Admin key server-side only; public search uses minted short-lived token or proxy route.
- Filterable attributes must be declared in index settings before querying with filters.
- Cache keys must include user scope to prevent cross-user result leakage.
- Indexing must be async (via Inngest); never block request threads.
