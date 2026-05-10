---
document_type: cms-content-template
content_type: blog-post
status: active
last_updated: 2026-04-30
---

# Blog Post Content Template

## Purpose
- Use this template to prepare complete `blogPost` entries for Sanity CMS.
- Keep content editorial, specific, and publish-ready.

## Writing Rules
- Title should be outcome-focused, not vague.
- Excerpt should be 20-240 characters.
- Tags should be specific and useful.
- Body should have clear `h2` and `h3` sections.
- SEO text should be written separately, not copied blindly from title/excerpt.

## Copy Template

```yaml
contentType: "blogPost"
title: "How We Built a Premium Interior Design Website That Converts Better"
slug: "how-we-built-a-premium-interior-design-website-that-converts-better"
excerpt: "A breakdown of how structure, proof, visual hierarchy, and CTA placement helped an interior design website feel premium and convert more qualified leads."
scheduledPublishAt: null
publishedAt: "2026-04-30T10:00:00Z"
readMinutes: 7
categoryRefOrLabel: "Design"
tags:
  - "web design"
  - "conversion"
  - "premium websites"
  - "interior design"
accent: "from-teal-500 to-emerald-500"
author:
  name: "Growrix OS"
  role: "Editorial Team"
  bio: "We document practical lessons from shipping premium websites, SaaS products, and operational systems."
  initials: "GO"
bodyOutline:
  - type: "h2"
    text: "The problem with most interior design websites"
  - type: "p"
    text: "Most sites in this category look elegant at first glance but fail to create trust, clarity, or urgency."
  - type: "h2"
    text: "What we changed"
  - type: "h3"
    text: "1. Stronger visual hierarchy"
  - type: "p"
    text: "We simplified the hero, improved spacing, and clarified the primary action."
  - type: "h3"
    text: "2. Better proof placement"
  - type: "p"
    text: "We moved trust signals and project evidence closer to decision points."
  - type: "h2"
    text: "The result"
  - type: "p"
    text: "The finished structure made the business feel more premium, easier to trust, and easier to contact."
seo:
  metaTitle: "Premium Interior Design Website Case Notes | Growrix OS"
  metaDescription: "See how we structured a premium interior design website to improve trust, clarity, and lead conversion."
  canonicalUrl: "https://www.growrixos.com/blog/how-we-built-a-premium-interior-design-website-that-converts-better"
  noIndex: false
mainImageAlt: "Interior design team reviewing premium web layouts on desktop"
comments:
  - id: "c1"
    author: "Editorial Review"
    initials: "ER"
    postedAt: "2026-04-30"
    body: "Optional starter comment or editorial note."
```

## Field Intent Guide
- `title`: Public article title.
- `slug`: Public URL key.
- `excerpt`: Listing summary.
- `publishedAt`: Main publish datetime.
- `readMinutes`: Approximate reading time.
- `categoryRefOrLabel`: Category document or fallback label.
- `tags`: Search and related-post signals.
- `accent`: Gradient class pair used for visual styling.
- `author`: Visible author identity.
- `bodyOutline`: Planning version of the article body before entering Portable Text.
- `seo`: Search metadata.
- `comments`: Optional starter/manual comments.

## AI Prompt Hint
```text
Create a complete Growrix OS blog post using the project template in DOC/PROJECT PLAN/blog-post-content-template.md. Make it specific, premium, and practical. Include a clear excerpt, 4-6 tags, body outline sections, and SEO copy.
```

## Import Automation (Optional)
- Save the YAML payload in a markdown file and run:

```bash
npm --prefix web run cms:import -- --type blogPost --file ./path/to/blog-post.md
```

- Use `--dry-run` first to validate mapping without writing to Sanity.
