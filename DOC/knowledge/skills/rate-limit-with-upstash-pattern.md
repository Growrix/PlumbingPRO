# Skill: Rate Limit with Upstash Pattern

**Used by:** upstash, openai API routes, any public API route

## Pattern

Apply per-IP or per-user rate limiting using \@upstash/ratelimit\ before the request reaches business logic.

### Implementation

\\\	s
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

export async function POST(req: Request) {
  const identifier = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, limit, remaining } = await ratelimit.limit(identifier)

  if (!success) {
    return new Response('Too many requests', {
      status: 429,
      headers: { 'Retry-After': '10', 'X-RateLimit-Limit': String(limit), 'X-RateLimit-Remaining': String(remaining) }
    })
  }
  // proceed...
}
\\\

### Rules
- Identifier MUST be validated and bounded (never use raw user input as a rate limit key).
- MUST return Retry-After header on 429.
- AI routes MUST use per-user ID (not IP) to prevent shared-IP false positives.
- Auth routes MUST use per-IP to prevent credential stuffing.
