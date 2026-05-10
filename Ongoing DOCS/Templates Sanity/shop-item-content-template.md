---
document_type: cms-content-template
content_type: shop-item
status: active
last_updated: 2026-05-06
---

# Shop Item Content Template

## Purpose
- Use this template to prepare a complete `shopItem` entry before filling Sanity CMS.
- Keep output human-readable and AI-friendly.
- Every field below maps to the current Studio schema and product slug page.

## Writing Rules
- Keep names specific and commercially clear.
- Keep slugs lowercase and hyphen-separated.
- Use real preview links when available.
- Do not include image fields in automation payloads. Upload `mainImage` and optional `gallery` screenshots manually in Sanity Studio.
- Highlights should be short key-value proof points.
- Treat `features` as the primary Envato-style detail area: aim for 8-14 concrete bullets spanning UI sections, conversion flow, CMS editing, responsiveness, performance, SEO baseline, and operational readiness.
- Explain what is included and out of scope so buyers understand the exact template boundary.
- Add a short scaling/enhancement roadmap with a CTA to contact for custom expansion.
- Keep sections non-duplicative: `features` should describe capability and outcomes, while `includes` should list concrete deliverables/files.

## Copy Template

```yaml
contentType: "shopItem"
name: "Three Circles - Interior Designer company website"
slug: "three-circles-interior-designer-company-website"
price: "$999"
livePreviewUrl: "https://three-circles-demo.vercel.app"
embeddedPreviewUrl: "https://three-circles-demo.vercel.app"
categoryLabel: "Interior Designer Company"
categorySlug: "interior-designer-company"
type: "SaaS"
typeSlug: "saas"
industry: "Service"
industrySlug: "service"
tag: "New"
published: true
featuredRank: 10
rating: 4.9
reviewCount: "128"
salesCount: "34"
teaser: "A premium website template for interior design businesses that want a modern, elegant, trust-building online presence."
summary: "Built for interior design studios, boutique agencies, and premium service businesses that need a polished website with strong visual storytelling, service sections, portfolio-ready blocks, and conversion-focused contact flows."
audience: "Interior design studios, boutique agencies, premium home styling brands"
features:
  - "Conversion-focused hero with trust signals and clear CTA flow"
  - "Modular service and portfolio sections for quick content updates"
  - "Mobile-first layout tuned for premium visual storytelling"
  - "Sticky conversion CTA patterns across service and proof sections"
  - "Structured service blocks built for fast CMS editing"
  - "SEO-ready heading hierarchy and metadata-friendly content flow"
  - "Performance-safe media placement and layout stability defaults"
  - "Reusable testimonial and social-proof modules"
  - "Contact flow tuned for high-intent visitor completion"
previewVariant: "marketing"
includes:
  - "Homepage design"
  - "About page"
  - "Services page"
  - "Portfolio/gallery blocks"
  - "Contact and lead form"
  - "CMS setup guidance"
inScope:
  - "Deploying the purchased template with current built-in pages"
  - "Baseline CMS wiring and launch-ready configuration"
  - "Minor copy/content entry updates during setup"
outOfScope:
  - "Adding net-new feature modules outside current template scope"
  - "Large-scale redesign and additional custom page systems"
  - "Complex automation or third-party workflow engineering"
enhancementPlan:
  - "Lead-routing automation with CRM and notification workflows"
  - "A/B testing roadmap for hero and CTA conversion lifts"
  - "Custom growth pages and scale-ready content architecture"
stack:
  - "Next.js"
  - "TypeScript"
  - "Tailwind CSS"
  - "Sanity CMS"
  - "Vercel"
highlights:
  - label: "Pages"
    value: "12"
  - label: "Setup time"
    value: "2 hrs"
  - label: "Best for"
    value: "Luxury brands"
```

## Field Intent Guide
- `name`: Full public product title.
- `slug`: Public URL key.
- `price`: Visible selling price.
- `livePreviewUrl`: Real external demo URL opened from the product page.
- `embeddedPreviewUrl`: Optional iframe-safe demo URL. Use only when the site allows embedding.
- `categoryLabel`: Human-readable category text.
- `categorySlug`: Filter-safe category key.
- `type`: Product type shown beside category.
- `typeSlug`: Filter-safe type key.
- `industry`: Human-readable industry label.
- `industrySlug`: Filter-safe industry key.
- `tag`: Optional badge like `New`, `Best Seller`, `Bundle`.
- `published`: Whether the product is visible publicly.
- `featuredRank`: Smaller number means higher prominence.
- `teaser`: First short explanation on slug page.
- `summary`: Broader product overview.
- `audience`: Used in the `Ideal for` panel.
- `features`: Primary buyer-facing details list (Envato-style depth). Cover what users get in real usage, not just design adjectives.
- `previewVariant`: Fallback mock preview only when no real image exists.
- `mainImage` / `gallery`: Manual-only image uploads in Studio for slug-page screenshot previews. Keep them out of import payloads.
- `includes`: Actual deliverables.
- `inScope`: Explicitly included within template price.
- `outOfScope`: Explicitly excluded from template price.
- `enhancementPlan`: What can be added in a custom scaling phase.
- `stack`: Tech/platform list.
- `highlights`: Small facts shown in the `At a glance` section.

## AI Prompt Hint
Use this instruction when asking an AI to generate a new shop item:

```text
Create a complete Growrix OS shop item entry using the project template in DOC/PROJECT PLAN/shop-item-content-template.md. Output all fields with realistic commercial copy, clean slugs, 3 highlights, 5-7 includes, 4-6 stack items, a live preview URL, and an embedded preview URL only if the preview domain is iframe-safe.

For the `features` field, produce 8-14 concrete, non-duplicative bullets in an Envato-like detail style that cover structure, conversion behavior, CMS editing experience, responsive behavior, SEO/performance baseline, and launch readiness.
```

## Import Automation (Optional)
- Save the YAML payload in a markdown file and run:

```bash
npm --prefix web run cms:import -- --type shopItem --file ./path/to/shop-item.md
```

- Use `--dry-run` first to verify parsed output before writing to Sanity.
