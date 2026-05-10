---
industry_pack: saas-b2b
class: b2b
verticals: [b2b_saas, dev_tools, api_products, internal_ops_tools, productivity_tools, analytics_products, infra_products]
default_visual_archetype: modern-saas
default_project_archetype: saas_app
---

# Industry Pack — B2B SaaS

Use for software products sold to businesses on a subscription or usage basis.

## Detection keywords
saas, subscription, multi-tenant, dev tool, developer platform, api product, dashboard product, productivity tool, analytics tool, infra, devops product, billing platform

## Default audience
- Primary: technical decision-maker (engineering manager, head of platform, CTO).
- Secondary: daily user (engineer, ops, analyst).

## Default user goals
- Understand what the product does and whether it fits their stack.
- Try it (free trial / sandbox / docs).
- Compare pricing and plans.
- Contact sales for enterprise needs.

## Default journeys
- Trial path: Home → Features → Pricing → Sign up → Onboarding → Dashboard.
- Docs-led path: Home → Docs → Try in sandbox → Sign up.
- Sales path: Home → Enterprise → Book demo → Contact.
- Existing user path: Sign in → Dashboard → Billing → Settings.

## Default site map (marketing surface)
- `/` Home (required)
- `/product` or per-feature pages (required)
- `/pricing` Pricing (required)
- `/customers` or `/case-studies` (recommended)
- `/docs` Docs entry (required if dev product)
- `/changelog` Changelog (recommended)
- `/blog` Blog (recommended)
- `/about` About (required)
- `/contact` Contact (required)
- `/privacy` Privacy (required)
- `/terms` Terms (required)
- `/security` Security / compliance (recommended)

## Default site map (app surface)
- `/sign-in` (required)
- `/sign-up` (required)
- `/onboarding` (required)
- `/dashboard` (required)
- `/dashboard/settings` (required)
- `/dashboard/billing` (required)
- `/dashboard/team` (required if multi-user)
- `/dashboard/api-keys` (if dev product)

## Default trust signals (required slots)
- Hero: customer logo strip OR usage metric.
- Pricing: explicit feature comparison + "Talk to sales" for enterprise.
- Below hero: featured testimonial with named customer + role.
- Footer: SOC 2 / GDPR badges where claim is true; security link to /security.

## Default conversion mechanics
- Primary: sign up free / start trial.
- Secondary: book a demo (sales-led plans).
- Tertiary: read docs (developer-led).

## Default features list
- `auth` (mandatory)
- `payments` / `subscriptions` (mandatory)
- `dashboard` (mandatory)
- `transactional_emails`
- `analytics`
- `error_tracking`
- `marketing_pages`
- `blog`
- `seo`
- optional: `documentation`, `api_keys`, `team_management`, `audit_log`, `feature_flags`

## Default integrations
- Auth: clerk.
- Payments: stripe.
- Emails: resend.
- Analytics: posthog.
- CMS: sanity (marketing, blog, customer stories).
- Database: postgres + prisma.
- Error tracking: sentry.

## Default content tone
- Voice: technical, precise.
- Tone: confident, benefit-led, calm.
- Forbidden words: "world-class", "revolutionary", "AI-powered" (without proof), "next-gen".

## Default compliance notes
- Privacy policy + DPA template surface.
- Security page covers data handling, encryption, compliance.
- If processing payments → PCI scope reduction via Stripe.

## Default SEO posture
- Per-feature pages indexable.
- Per-customer-story pages indexable.
- Schema.org/SoftwareApplication and Organization.

## Quality references

Describe what world-class output feels like for this industry and enforce these characteristics in planning and audit scoring.

- Product clarity in seconds: value proposition and product category understood before first scroll completes.
- Proof-backed claims: customer logos, metrics, and role-attributed testimonials close to CTA moments.
- Trustable operations posture: security/privacy/compliance visibility is explicit and linked to concrete docs.
- Frictionless trial path: sign-up/onboarding journey is obvious, short, and recoverable on failure.
- Dense-but-readable UI: app surfaces prioritize scanability, status legibility, and keyboard/focus quality.

## Notes for the strategist
- B2B SaaS is the densest pack: it forces auth, payments, dashboard, billing, and operations surfaces. Strategist must add corresponding integrations to the brief automatically.
- Free-trial vs talk-to-sales motion is a choice — strategist defaults to "free trial" for self-serve PLG and adds an assumption for the human to confirm.
