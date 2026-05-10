---
document_type: cms-content-template
content_type: case-study
status: active
last_updated: 2026-05-02
---

# Case Study Content Template

## Purpose
- Use this template to prepare complete `caseStudy` entries for portfolio slug pages.
- Keep the content proof-driven, specific, and commercially useful.

## Writing Rules
- Project name should match how the brand is known publicly.
- Summary should explain the new site/product that was delivered and why it mattered.
- Metric is optional. Add it when you have a clear and defensible proof point.
- Do not include image fields in automation payloads. Image uploads are manual in Sanity Studio.
- Keep strategy concise and focus strongly on build, integrations, scope clarity, and measurable outcomes.
- Delivery story and process should read like a short execution narrative, not a long essay.
- Avoid "relaunch" or "rebuilt" language. Describe what was delivered and how it performs.

## Copy Template

```yaml
contentType: "caseStudy"
name: "Three Circles"
slug: "three-circles"
livePreviewUrl: "https://threecircles.com"
embeddedPreviewUrl: "https://demo.threecircles.com"
industry: "Interior Design"
serviceSlug: "websites"
summary: "A premium company website for an interior design brand focused on elegant presentation, stronger trust, and easier inquiry conversion."
metric: "+37% more qualified inquiries in the first 60 days"
accent: "from-stone-500 to-amber-700"
published: true
featuredRank: 12
client: "Three Circles"
year: "2026"
duration: "4 weeks"
team: "Strategy, Design, Frontend, CMS"
deliveryStory: "We replaced the old marketing site with a conversion-first architecture, modern CMS workflow, and launch-quality engineering gates."
process:
  - "Discovery, KPI alignment, and content model planning"
  - "UX and visual system design with reusable components"
  - "Production build, integrations, QA, and release hardening"
strategy:
  - "Redesigned the content hierarchy around trust, service clarity, and featured work."
  - "Built a more premium visual system with stronger spacing, typography, and CTA rhythm."
  - "Prepared the content structure for easier CMS updates."
integrations:
  - "Sanity CMS for content operations"
  - "Resend for transactional contact acknowledgements"
  - "Analytics events for CTA and inquiry tracking"
seo:
  - "Metadata hierarchy per page and social preview readiness"
  - "Semantic heading and internal-linking structure"
  - "Performance-aware media sizing and alt-text coverage"
standards:
  - "Responsive QA across mobile, tablet, and desktop breakpoints"
  - "Accessibility checks for contrast, labels, and keyboard flow"
  - "Core Web Vitals-friendly image and layout practices"
build:
  - label: "Platform"
    value: "Next.js + Sanity"
    hint: "Fast editing and modern frontend stack"
  - label: "Scope"
    value: "Marketing website"
    hint: "Service pages, proof blocks, lead capture"
results:
  - label: "Qualified inquiries"
    value: "+37%"
    hint: "First 60 days"
  - label: "Time on site"
    value: "+22%"
    hint: "After delivery"
  - label: "Bounce rate"
    value: "-18%"
    hint: "Homepage improvement"
```

## Field Intent Guide
- `name`: Public project title.
- `slug`: Public portfolio URL key.
- `livePreviewUrl`: Real public site URL.
- `embeddedPreviewUrl`: Optional iframe-safe preview URL for embedded demos.
- `industry`: Visible industry label.
- `serviceSlug`: Connects the case study to a service route.
- `summary`: Short overview used in cards and detail page intro.
- `metric`: Optional headline proof point.
- `accent`: Gradient styling pair.
- `client`, `year`, `duration`, `team`: Quick project context.
- `deliveryStory`: One short paragraph about how the build was delivered.
- `process`: 3-5 concise steps from discovery to launch.
- `strategy`: What decisions or changes were made.
- `integrations`: External systems used in delivery.
- `seo`: Search visibility work included in scope.
- `standards`: Quality and engineering standards followed.
- `build`: Key implementation facts.
- `results`: Measurable outcome entries.

## AI Prompt Hint
```text
Create a complete Growrix OS case study using the project template in DOC/PROJECT PLAN/case-study-content-template.md. Make it specific, realistic, commercially credible, and focused on measurable business outcomes.
```

## Import Automation (Optional)
- Save the YAML payload in a markdown file and run:

```bash
npm --prefix web run cms:import -- --type caseStudy --file ./path/to/case-study.md
```

- Use `--dry-run` first to verify mapping before writing data to Sanity.
