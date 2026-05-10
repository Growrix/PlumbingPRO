# Project Archetypes

The `project_archetype` field on a brief decides the shape of the site map, the surfaces required, and which downstream agents activate.

## Allowed values

| Archetype          | What it is                                                                 | Default surfaces                                  |
|--------------------|----------------------------------------------------------------------------|---------------------------------------------------|
| `marketing_site`   | Public marketing/brand site, no logged-in app                              | Marketing pages only                               |
| `saas_app`         | Public marketing + authenticated app + billing                             | Marketing + auth + dashboard + billing            |
| `ecommerce`        | Public marketing + product catalog + cart + checkout                       | Marketing + shop + cart + checkout + (account)    |
| `landing_page`     | Single-page or short-funnel campaign                                       | Single page + thank-you + minimal legal           |
| `content_site`     | Editorial / publication / docs                                             | Marketing + content + tag/category + (search)     |
| `marketplace`      | Two-sided platform (buyers + sellers/providers)                            | Marketing + listings + buyer dash + seller dash   |
| `dashboard_tool`   | Internal or B2B operational tool, public surface optional                  | (Optional marketing) + auth + dashboard           |
| `portfolio_site`   | Creator/agency portfolio with case studies                                 | Marketing + work + case study + about + contact   |

## Detection precedence
The intake strategist applies R1 (Project Archetype Detection) in `intake_strategist.agent.md`. The first match wins. If none match → `marketing_site` is the default and an assumption is recorded.

## Surfaces required per archetype

### marketing_site
Required: Home, At-least-one services or products surface, About, Contact, Privacy, Terms, 404.
Recommended: FAQ, Blog/Insights, Areas served (if local).

### saas_app
Required marketing: Home, Pricing, Features, About, Contact, Privacy, Terms.
Required app: sign-in, sign-up, onboarding, dashboard, settings, billing, sign-out.
Recommended: docs, customer stories, security page.

### ecommerce
Required: Home, Shop, Product detail, Cart, Checkout, Order confirmation, Shipping & returns, Privacy, Terms, 404.
Recommended: Account, Orders, Lookbook/Stories, FAQ, Search.

### landing_page
Required: Single page (or `/`), Thank-you (`/thanks`), Privacy, Terms.
Recommended: nothing else; landing pages succeed by removing distractions.

### content_site
Required: Home, Article index, Article detail, About, Contact, Privacy, Terms, 404.
Recommended: Tag/Category indexes, Search, Newsletter.

### marketplace
Required marketing: Home, How it works (buyer), How it works (seller), Pricing/fees, Trust & safety, Contact, Privacy, Terms.
Required app: sign-in, sign-up, onboarding, listings index, listing detail, buyer dashboard (orders, messages), seller dashboard (listings, sales, payouts).

### dashboard_tool
Optional marketing: Home + features + pricing.
Required app: sign-in, sign-up, onboarding, dashboard, settings, sign-out.

### portfolio_site
Required: Home, Work index, Case study detail, About, Contact, Privacy, Terms, 404.
Recommended: Services, Journal/Blog.

## Cross-archetype overlays
A site may overlay one archetype on another. The strategist must record the primary and any overlays.

Examples:
- `marketing_site + ecommerce overlay` → marketing site that sells a small set of products (e.g., agency selling templates).
- `saas_app + content_site overlay` → SaaS with a serious blog/docs.
- `marketing_site + portfolio overlay` → agency that wants the marketing posture plus rich case studies.

When an overlay is active, both archetypes' required surfaces apply, with the primary archetype owning the global navigation model.

## Required outputs per archetype (downstream agent activation)

| Archetype          | Activates                                                                                     |
|--------------------|-----------------------------------------------------------------------------------------------|
| `marketing_site`   | ux_director, design_system_planner, component_system_planner, motion_planner, content_planner, interaction_planner, page_planner |
| `saas_app`         | All of marketing_site + integration_planner (auth/payments/db) + backend_planner             |
| `ecommerce`        | All of marketing_site + integration_planner (payments) + backend_planner                     |
| `landing_page`     | ux_director, design_system_planner, component_system_planner, motion_planner, content_planner, interaction_planner, page_planner (light) |
| `content_site`     | All of marketing_site + integration_planner (CMS)                                            |
| `marketplace`      | All of saas_app + extra dashboards                                                           |
| `dashboard_tool`   | All of saas_app                                                                               |
| `portfolio_site`   | All of marketing_site + integration_planner (CMS)                                            |

## Conversion-path defaults

| Archetype          | Primary CTA default                              | Secondary CTA default          |
|--------------------|--------------------------------------------------|--------------------------------|
| `marketing_site`   | Industry-pack-defined (call / quote / book)      | Browse work / contact          |
| `saas_app`         | Sign up / Start free trial                       | Book a demo / Read docs        |
| `ecommerce`        | Add to cart / Buy now                            | Browse collection              |
| `landing_page`     | Single hero CTA repeated thrice                  | None (kill secondary)          |
| `content_site`     | Subscribe / Read more                            | Share                          |
| `marketplace`      | Search / List item                               | How it works                   |
| `dashboard_tool`   | Sign in / Get access                             | Talk to sales                  |
| `portfolio_site`   | Start a project                                  | View work                      |

## Notes
- These defaults are deterministic. Any deviation must be recorded as an `assumption` in `brief.json`.
- If a client request can plausibly fit two archetypes, the strategist picks the one with the smallest surface footprint and lists the alternative under `open_questions_for_human`.
