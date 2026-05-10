# Skill: Cache Invalidation on Write Pattern

**Used by:** upstash, sanity (revalidation), meilisearch (index sync)

## Pattern

Any cache or derived store (Redis cache, Next.js ISR pages, search index) MUST be invalidated/updated atomically with the write that produces the new state.

### Next.js ISR revalidation (Sanity)
\\\	s
// Webhook handler after Sanity document.publish:
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: Request) {
  // verify signature...
  const { _type, slug } = await req.json()
  revalidateTag(_type)  // e.g., 'blog-post'
  if (slug?.current) revalidatePath(\/blog/\\)
  return new Response('OK')
}
\\\

### Upstash Redis invalidation
\\\	s
// After writing to DB, invalidate the relevant cache key
await redis.del(\user:\:profile\)
\\\

### Rules
- Invalidation MUST happen inside the same transaction or event handler as the write.
- MUST NOT rely on TTL expiry as the only invalidation mechanism for content-critical data.
- Meilisearch index MUST be updated on create, update, AND delete of the indexed document.
