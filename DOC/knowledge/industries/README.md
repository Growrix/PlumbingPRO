# Industry Packs

Each file in this folder describes a generic industry vertical and supplies the deterministic defaults the `intake_strategist` uses to fill gaps in client briefs.

## Format
Every industry pack file must include this frontmatter:

```yaml
---
industry_pack: <slug>
class: <high-level class>
verticals: [<list of specific verticals>]
default_visual_archetype: <one of knowledge/frontend-rules/visual-archetypes/*>
default_project_archetype: <marketing_site|saas_app|ecommerce|landing_page|content_site|marketplace|dashboard_tool|portfolio_site>
---
```

And these required sections:

- Detection keywords
- Default audience
- Default user goals
- Default journeys
- Default site map
- Default trust signals
- Default conversion mechanics
- Default features list
- Default integrations
- Default content tone
- Default compliance notes
- Default SEO posture
- Notes for the strategist

## Currently shipped packs
- `local-services.md` — home services and local trades (plumbing, electrical, HVAC, cleaning, etc.)
- `professional-services.md` — agencies, consultancies, legal, accounting, financial advisory
- `saas-b2b.md` — B2B SaaS, dev tools, API products
- `ecommerce-dtc.md` — direct-to-consumer brands and consumer ecommerce
- `creator-portfolio.md` — designers, developers, photographers, freelancers, studios

## Adding a new pack
1. Copy an existing file as a starting point.
2. Fill every required section.
3. Add the pack's `verticals` and detection keywords.
4. The strategist auto-discovers new packs via glob.

## Class taxonomy (use one of these in the `class:` frontmatter)
- `local_services`
- `professional_services`
- `b2b`
- `consumer_brand`
- `creator_or_portfolio`
- `publication`
- `marketplace`
- `ai_first`
- `internal_ops`
- `regulated_finance`
- `regulated_health`
- `regulated_legal`
- `non_profit`
- `generic`

If a request matches no pack, the strategist falls back to `generic` and emits an `open_question_for_human` asking which pack to apply.
