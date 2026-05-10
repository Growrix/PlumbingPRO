# DATA FLOW — BLOG SYSTEM

## OVERVIEW
End-to-end data flow for a blog backed by Sanity CMS, served by Next.js, with revalidation and draft mode.

## INTEGRATIONS INVOLVED
- `sanity` (primary)
- `clerk` (only for draft mode access control)

## ENTITIES
- `post` (Sanity)
- `author` (Sanity)
- `category` (Sanity)
- `seo` (Sanity object)

## FLOW: PUBLIC POST PAGE READ

```
[Browser]
   GET /blog/<slug>
        ↓
[Next.js Server Component]
   resolves <slug> param
   calls sanity.client.getPostBySlug(slug)
        ↓
[Sanity Client (CDN)]
   GROQ query against api.sanity.io CDN endpoint
   uses NEXT_PUBLIC_SANITY_PROJECT_ID + DATASET + API_VERSION
        ↓
[Sanity Content Lake]
   returns post document with portable text body
        ↓
[Next.js Server Component]
   renders portable text via PortableText component
   builds metadata from seo field
        ↓
[Browser]
   receives streamed HTML
```

Cache strategy: `revalidate: 60` on the page; ISR fallback at the edge.

## FLOW: AUTHOR PUBLISHES POST → SITE UPDATES

```
[Editor]
   publishes post in Sanity Studio
        ↓
[Sanity]
   document.updated event
        ↓
[Sanity Webhook]
   POST https://<app>/api/webhooks/sanity
   header: signature
   body: { _type, _id, slug }
        ↓
[Next.js Webhook Route]
   verifies signature using SANITY_REVALIDATE_SECRET
   reads _type and slug
   calls revalidateTag('post:' + slug) and revalidatePath('/blog')
        ↓
[Next.js Cache]
   tags invalidated; next request rebuilds the page
        ↓
[Browser]
   sees updated content on next visit
```

## FLOW: DRAFT MODE PREVIEW

```
[Editor in Studio]
   clicks "Preview"
        ↓
[Browser]
   GET /api/draft?secret=<SANITY_REVALIDATE_SECRET>&slug=<slug>
        ↓
[Next.js Draft Route]
   validates secret
   validates user is authenticated via Clerk auth()
   draftMode().enable()
   redirects to /blog/<slug>
        ↓
[Next.js Server Component]
   detects draftMode() enabled
   uses sanity.client with read token (SANITY_API_READ_TOKEN)
   queries with perspective: 'previewDrafts'
        ↓
[Sanity API (non-CDN)]
   returns latest draft including unpublished changes
        ↓
[Browser]
   sees preview banner + draft content
```

## DATA SHAPES

### post (Sanity → app)
```ts
type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  coverImage?: { asset: { _ref: string }, alt?: string }
  body: PortableTextBlock[]
  author: { _ref: string }
  categories?: Array<{ _ref: string }>
  publishedAt: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: { asset: { _ref: string } }
  }
}
```

## ENV VARS REQUIRED
- NEXT_PUBLIC_SANITY_PROJECT_ID
- NEXT_PUBLIC_SANITY_DATASET
- NEXT_PUBLIC_SANITY_API_VERSION
- SANITY_API_READ_TOKEN
- SANITY_REVALIDATE_SECRET

## ROUTES INVOLVED
- `/blog`               — list view (server component)
- `/blog/[slug]`        — detail view (server component)
- `/api/webhooks/sanity` — revalidation handler
- `/api/draft`          — draft mode entry

## VALIDATION CHECKLIST
- [ ] Every post has a unique slug.
- [ ] Webhook secret matches between Sanity dashboard and env.
- [ ] Draft mode requires both secret and Clerk auth.
- [ ] Public reads use the CDN endpoint.
- [ ] Read token is never exposed to the client.
