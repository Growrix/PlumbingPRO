---
industry_pack: professional-services
class: professional_services
verticals: [agency, consulting, marketing_agency, design_studio, dev_agency, legal, accounting, financial_advisory, architecture_firm, engineering_consulting]
default_visual_archetype: editorial-premium
default_project_archetype: marketing_site
---

# Industry Pack — Professional Services

Use for high-trust, often custom-priced services delivered to other businesses.

## Detection keywords
agency, consulting, consultant, lawyer, attorney, law firm, accountant, accounting, financial advisor, advisory, architecture firm, engineering firm, design studio, web agency, marketing agency, dev agency, branding studio

## Default audience
- Primary: founder, COO, marketing/ops director — evaluating credibility and fit.
- Secondary: technical buyer or in-house specialist who will work with the firm.

## Default user goals
- Verify the firm is credible and the right fit.
- Understand the engagement model and pricing posture.
- See proof through case studies and outcomes.
- Take the next step: book a discovery call, request a proposal, or contact directly.

## Default journeys
- Credibility-led path: Home → Case study → Services → Book a call.
- Service-led path: Home → Services → Service detail → Book a call.
- Process-led path: Home → About / process → Pricing → Contact.
- Insight-led path: Home → Blog / insights → Case study → Book a call.

## Default site map
- `/` Home (required)
- `/services` Services overview (required)
- `/services/[slug]` Service detail (required)
- `/work` or `/portfolio` Case study index (required)
- `/work/[slug]` Case study detail (required)
- `/about` About / team (required)
- `/process` Process / approach (recommended)
- `/pricing` Pricing or engagement model (recommended)
- `/insights` or `/blog` Insights (recommended)
- `/insights/[slug]` Insight detail (recommended)
- `/contact` Contact (required)
- `/book` Book a discovery call (recommended)
- `/privacy` Privacy (required)
- `/terms` Terms (required)
- `/404` 404 (required)

## Default trust signals (required slots)
- Hero: client logo strip OR years-in-business + outcomes line.
- Below hero: featured case study with outcome metric.
- Mid-page: testimonial cluster with name + role + company.
- Footer: physical address (or registered address), company number / regulator number where applicable.

## Default conversion mechanics
- Primary: book a call (Calendly-class booking).
- Secondary: contact form with project brief fields.
- Tertiary: email / phone fallback.

## Default features list
- `marketing_pages`
- `forms` (contact + project brief)
- `booking` (discovery call)
- `analytics`
- `transactional_emails` (booking confirmations + brief receipt)
- `blog` / `insights`
- `seo`

## Default integrations
- CMS: sanity (services, case studies, insights, team).
- Forms backend: route handler + email via resend.
- Booking: provider TBD by client; default to a generic calendar embed slot.
- Analytics: posthog.

## Optional features (only if client confirms)
- `auth` (only for client portals).
- `payments` (only if firm sells productized fixed-price services online).

## Default content tone
- Voice: editorial, considered.
- Tone: precise, calm, confident.
- Forbidden words: "synergy", "best-in-class", "thought leader", "ninja", "rockstar", "guru", "10x" (without proof).

## Default compliance notes
- Disclose regulator (legal/accounting/finance) and license number where required.
- For finance/legal: add appropriate disclaimer footer.
- GDPR posture: privacy policy + cookie consent where applicable.

## Default SEO posture
- Case study pages indexable, with outcome metrics in titles where compliant.
- Schema.org/Organization + Person (team) + Article (insights).

## Quality references

Describe what world-class output feels like for this industry and enforce these characteristics in planning and audit scoring.

- Credibility in context: proof appears where decisions happen (hero, pricing posture, case outcomes), not in isolated badge rails only.
- Outcome specificity: case studies cite concrete results, role clarity, and scope boundaries.
- Editorial clarity: concise, high-signal copy with calm hierarchy and whitespace discipline.
- Decision support: service/pricing/process pages reduce ambiguity and route users to the right next action quickly.
- Trust continuity: legal/regulatory disclosures are present, readable, and non-disruptive.

## Notes for the strategist
- If user says "agency" or "consultancy" with no other detail, this pack locks the brief.
- If the agency offers productized templates or ready-made deliverables, also activate the `ecommerce` pack rules for the shop subset of the site.
