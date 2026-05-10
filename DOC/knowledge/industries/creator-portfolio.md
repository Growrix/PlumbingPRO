---
industry_pack: creator-portfolio
class: creator_or_portfolio
verticals: [designer_portfolio, developer_portfolio, photographer, videographer, illustrator, writer, musician, freelancer, studio_portfolio]
default_visual_archetype: portfolio-craft
default_project_archetype: portfolio_site
---

# Industry Pack — Creator / Portfolio

Use for individual or small-studio portfolios where the work is the product.

## Detection keywords
portfolio, personal site, designer, developer portfolio, photographer, videographer, illustrator, writer, freelance, freelancer, studio site, indie

## Default audience
- Primary: prospective client or collaborator evaluating quality and fit.
- Secondary: peer / press / recruiter scanning credibility.

## Default user goals
- See the strongest work quickly.
- Understand who the creator is and what they do.
- Reach out to start a conversation.

## Default journeys
- Work-led: Home → Featured work → Case study → Contact.
- About-led: Home → About → Work → Contact.
- Quick-contact: Home → Contact.

## Default site map
- `/` Home (required)
- `/work` or `/projects` Work index (required)
- `/work/[slug]` Case study detail (required)
- `/about` About (required)
- `/contact` Contact (required)
- `/services` Services or capabilities (recommended)
- `/journal` or `/blog` (optional)
- `/journal/[slug]` (optional)
- `/privacy` Privacy (required)
- `/terms` Terms (required)
- `/404` 404 (required)

## Default trust signals (required slots)
- Hero: oversized statement + featured project tile.
- Below hero: short capability strip and 2–4 featured cases.
- About: real photo + short bio + clients list.
- Footer: contact line, social, newsletter optional.

## Default conversion mechanics
- Primary: contact form / start a project.
- Secondary: book a call (optional).
- Tertiary: email / DM links.

## Default features list
- `marketing_pages`
- `case_studies`
- `forms` (contact)
- `analytics`
- optional: `blog` / `journal`
- optional: `newsletter`

## Default integrations
- CMS: sanity (case studies, journal, services).
- Forms backend: route handler + email via resend.
- Analytics: posthog or vercel analytics.

## Forbidden defaults
- `auth` (none required).
- `payments` (only if creator sells productized goods — then enable a small shop subset).

## Default content tone
- Voice: confident, work-led, low ego.
- Tone: precise, calm, occasionally playful (per creator brand).
- Forbidden words: "passionate" (cliché), "rockstar", "ninja", "guru", "thought leader".

## Default SEO posture
- Case study pages indexable with Schema.org/CreativeWork.
- About page with Person schema for the creator.

## Quality references

Describe what world-class output feels like for this industry and enforce these characteristics in planning and audit scoring.

- Work-led first impression: strongest project evidence appears immediately with minimal chrome.
- Distinct case-study signatures: each project surface has unique composition, rhythm, and motion identity.
- Narrative craft: context, role, process, and outcome are concise and concrete.
- Credibility without ego: voice is confident, specific, and free of empty self-praise.
- Contact readiness: collaboration path is easy to find and low-friction from any major surface.

## Notes for the strategist
- If the client says "portfolio" or "personal site", this pack locks the brief.
- Encourage the client to provide 3–6 strongest pieces, not their entire archive — strategist surfaces this as an open question.
- If the creator wants a small shop (prints, courses, digital products), strategist adds a minimal `ecommerce-dtc` overlay rather than switching archetypes.
