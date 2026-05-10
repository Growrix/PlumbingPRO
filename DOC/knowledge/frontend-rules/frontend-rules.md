# FRONTEND RULES

## SCOPE
Apply to every UI surface, every page, every component in any plan produced by this OS.

## RULE F1 — DATA SOURCE IS REQUIRED
Every page that renders dynamic data MUST declare:
- the data source (`cms` | `database` | `integration` | `static`)
- the exact query function (e.g., `getPostBySlug`, `getUserSubscriptions`)
- the cache strategy (`force-cache` | `no-store` | `revalidate: <seconds>`)

A page with dynamic data but no declared source is INVALID.

## RULE F2 — CMS IS REQUIRED FOR CONTENT
If ANY of the following is present, a CMS MUST be declared:
- blog posts
- marketing pages with editor-controlled copy
- documentation
- changelog
- testimonials, case studies, team pages

The CMS MUST come from `knowledge/integration-rules/cms/sanity.yaml` unless another CMS rule exists.

## RULE F3 — SCHEMA IS MANDATORY
Every CMS-backed content type MUST have:
- a schema file in `studio/schemas/<name>.ts`
- field definitions matching `knowledge/integration-rules/cms/sanity.yaml`
- explicit field types and `required` flags
- references resolved (no orphan reference fields)

## RULE F4 — SLUG SYSTEM
Every CMS document type that has a public route MUST have:
- a `slug` field of type `slug`
- the source field declared (usually `title` or `name`)
- a unique slug constraint
- a corresponding dynamic route `[slug]` or `[[...slug]]`

## RULE F5 — SEO HANDLING
Every public page MUST emit metadata via Next.js `generateMetadata` using:
- title from CMS or page-level constant
- description from CMS or page-level constant
- OG image from CMS or default fallback
- canonical URL when applicable

Pages MUST NOT emit `<head>` tags directly; metadata is the only allowed source.

## RULE F6 — STATE MANAGEMENT
- Server state: React Server Components + `fetch` with revalidation.
- Client state: `zustand` for global ephemeral state, `useState` for local.
- Form state: `react-hook-form` + `zod` schemas only.
- URL state: `searchParams` and `useSearchParams`, never duplicated to local state.

Forbidden: Redux, MobX, Recoil, custom global stores beyond zustand.

## RULE F7 — DATA FETCHING BOUNDARIES
- Server components: fetch directly from services/repositories/CMS clients.
- Client components: never call DB or integration SDKs directly.
- Client→server communication: typed Server Actions or route handlers under `/api/`.

## RULE F8 — STYLING
- Tailwind CSS for utilities.
- shadcn/ui for primitives.
- No CSS-in-JS runtime libraries.
- Theme tokens declared in `tailwind.config.ts`.

## RULE F14 — MOBILE-FIRST APP EXPERIENCE
- Every page and flow MUST be designed mobile-first.
- Mobile UI MUST feel app-like: touch-first interactions, compact spacing, clear thumb-zone actions, and strong visual hierarchy.
- Desktop may diverge in layout/components, but mobile parity for core outcomes is mandatory.

## RULE F15 — SECTION + CONTENT PLANNING
- Every public page MUST declare section-level structure (hero, proof, feature/service blocks, FAQ, CTA, footer CTA).
- Every section MUST include content intent (goal), primary message, and CTA target.
- Pages with weak or placeholder content are invalid.

## RULE F16 — MOTION + INTERACTION QUALITY
- Plans MUST include purposeful motion for key transitions (page load, section reveal, feedback states).
- Motion MUST support comprehension and conversion, not decorative noise.
- Respect reduced-motion preferences.

## RULE F17 — HOME NAVIGATION GUARANTEE
- Primary navigation MUST include a visible Home path (explicit Home item or brand link behavior documented in the plan).
- Users must be able to return to home from every primary page in one interaction.

## RULE F9 — ACCESSIBILITY
- All interactive elements MUST be keyboard accessible.
- All form inputs MUST have associated labels.
- All images MUST have `alt`.
- Color contrast MUST meet WCAG AA.

## RULE F10 — PERFORMANCE
- Images via `next/image` only.
- Fonts via `next/font` only.
- No client components above 50KB gzipped without justification.
- Long lists must paginate or virtualize.

## RULE F11 — AUTH-AWARE ROUTING
- Public routes are listed in `middleware.ts` as `publicRoutes`.
- All other routes are protected by default.
- Protected routes MUST redirect unauthenticated users to `/sign-in`.
- Server components MUST resolve user via the auth integration server helper.

## RULE F12 — INTEGRATION CLIENTS
- Each integration has exactly one client singleton in `src/lib/<integration>.ts`.
- Components and pages MUST import from `src/lib/*`, never construct clients inline.

## RULE F13 — ERROR AND LOADING STATES
Every dynamic route MUST have:
- `loading.tsx`
- `error.tsx`
- `not-found.tsx` when the route can 404

## OUTPUT CONTRACT
Every frontend plan MUST emit:
```yaml
pages:
  - path: /blog/[slug]
    data_source: cms
    query: getPostBySlug
    cache: { revalidate: 60 }
    metadata: from_cms
    states: [loading, error, not-found]
components:
  - name: PostCard
    location: src/components/blog/post-card.tsx
    props_schema: zod
```
