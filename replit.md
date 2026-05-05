# ProFlow Plumbing — Frontend

A complete, production-ready frontend for a modern plumbing service platform.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS** — design system with custom color tokens
- **Framer Motion** — animations and transitions
- **Lucide React** — icon set

## Architecture

```
/app              — Next.js App Router pages
/components       — Reusable UI primitives + layout components
  /ui             — Button, Card, Section, Heading, Badge, StarRating
  /layout         — Navbar, Footer, StickyContact
/features         — Domain-specific feature modules
  /home           — HeroSection, StatsBar, ServicesPreview, TrustSection, TestimonialsSection, CtaBanner
  /services       — ServiceIcon
  /contact        — ContactForm
  /trust          — TrustIcon
/data             — All content data (no hardcoded text in components)
  site-config.ts  — Company info, phone numbers, etc.
  services.ts     — All 6 services with full detail
  testimonials.ts — 5 customer testimonials
  navigation.ts   — Nav links
  trust-badges.ts — Trust indicators + stats
/types            — TypeScript interfaces
/lib              — Utility functions (cn, phone helpers, etc.)
```

## Pages

- `/` — Home (Hero, Stats, Services Preview, Trust, Testimonials, CTA)
- `/services` — Services listing grid
- `/services/[slug]` — Dynamic service detail pages (6 services)
- `/contact` — Contact form + booking
- `/about` — About page with team values

## Running

```bash
npm install
npm run dev    # starts on port 5000
```

## Key Design Decisions

- All content driven from `/data` — no hardcoded text inside components
- Mobile-first, responsive at all breakpoints
- Sticky CTA (emergency + book) appears after scrolling
- Contact form is fully controlled with validation — ready for API connection
- Service detail pages are statically generated via `generateStaticParams`
