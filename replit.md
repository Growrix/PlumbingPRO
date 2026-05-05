# ProFlow Plumbing — Frontend

A complete, production-ready frontend for a modern plumbing service platform.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS** — design system with custom color tokens + dark mode
- **Framer Motion** — animations, transitions, floating tool effects
- **Lucide React** — icon set

## Architecture

```
/app              — Next.js App Router pages
/components       — Reusable UI primitives + layout components
  /ui             — Button, Card, Section, Heading, Badge, StarRating
  /layout         — Navbar, Footer, StickyContact
  /theme          — ThemeProvider (context), ThemeToggle (sun/moon button)
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
- **Dark/light theme** — persisted to localStorage, respects OS preference, toggled via sun/moon button in navbar
- Dark mode uses Tailwind `darkMode: "class"` — `dark` class on `<html>`, all components have `dark:` variants
- Hero section: **2-column layout** — left: text + CTAs, right: live stats card with animated bars + rating/response mini-cards
- Hero: 7 floating plumbing tool SVGs (wrench, drop, gear, pipe, bolt) with staggered CSS float animations
- Sticky CTA (emergency + book) appears after scrolling
- Contact form is fully controlled with validation — ready for API connection
- Service detail pages are statically generated via `generateStaticParams`
