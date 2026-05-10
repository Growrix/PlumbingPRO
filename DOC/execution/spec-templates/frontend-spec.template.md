# SPEC TEMPLATE: FRONTEND

## PURPOSE
Emit this spec to describe every frontend page, layout, and component. Codegen agents consume this to produce page files, component files, and metadata declarations.

---

## ROUTE: [/path]
*Repeat this section for each route in the plan.*

### Page
```
file: src/app/[path]/page.tsx
component_type: server_component | client_component
layout: [which layout wraps this page]
auth_required: true | false
title: "[Page Title]"
description: "[SEO description]"
og_image: [cms_field | /og/default.png | null]
canonical: [url pattern | null]
```

### Data Fetching
```
data_source: cms | database | integration | static
query_function: [e.g., getPostBySlug | getUserSubscriptions | null]
cache_strategy: force-cache | no-store | revalidate:<seconds>
params: [e.g., slug from generateStaticParams]
error_handling:
  - notFound(): on null result
  - error.tsx: on service errors
loading_ui: loading.tsx (skeleton defined)
```

### CMS Schema (if CMS-backed)
```
schema_file: studio/schemas/[type].ts
document_type: [type name]
slug_field: slug (source: title)
fields:
  - [field]: [type] — [required|optional]
  - title: string — required
  - slug: slug — required
  - [others]
```

### Component Tree
```
<[PageName]Page>                          # server component
  <[HeroComponent] />                     # server component
  <Suspense fallback={<Skeleton />}>
    <[DataComponent] data={...} />        # server component
  </Suspense>
  <[InteractiveComponent] />              # "use client"
```

### States
```
loading: [loading.tsx skeleton description]
error: [error.tsx fallback description]
empty: [empty state UI when no data]
success: [main render]
```

---

## LAYOUT: [/path/layout.tsx]
```
file: src/app/[path]/layout.tsx
providers:
  - [e.g., ClerkProvider]
  - [e.g., PostHogProvider]
nav: [which nav component]
footer: [which footer component | none]
auth_guard: true | false
```

---

## COMPONENTS

### `[ComponentName]`
```
file: src/components/[category]/[name].tsx
type: server_component | client_component
props:
  - [prop]: [type] — [description]
data_source: [prop-passed | server-fetch | none]
uses_hooks: [list hooks if "use client"]
```

---

## FORMS

### `[FormName]`
```
file: src/components/forms/[name].tsx
type: client_component
schema: src/lib/schemas/[domain].ts → [SchemaName]
fields:
  - [field]: [input type] — [validation rules]
submission:
  type: server_action | api_route
  target: [server action name | /api/path]
  success_behavior: [redirect | toast | state update]
  error_behavior: [field errors | toast]
```

---

## METADATA SUMMARY

| Route | Title Source | OG Image | Canonical |
|-------|-------------|----------|-----------|
| / | static constant | /og/default.png | https://app.com/ |
| /blog/[slug] | post.title (CMS) | post.ogImage (CMS) | /blog/[slug] |
| /dashboard | static constant | none | none (no-index) |
| [add rows] | | | |

---

## PROTECTED ROUTES SUMMARY

| Route | Auth Check | Redirect on Failure |
|-------|-----------|-------------------|
| /dashboard | required | /sign-in |
| /dashboard/billing | required | /sign-in |
| /api/[...] | required | 401 |
| [add rows] | | |
