# Support Tools Catalog

This folder contains YAML specifications for agency-side tooling installed **after launch** on every client site. These are **NOT** app dependencies — the client site's codebase does not import them. They live in the agency's ops layer.

The `devops_planner` reads these files to produce `support_stack[]` in `devops.json`.

## Folder structure

```
support-tools/
  _index.md                  ← this file
  uptime/                    ← health + uptime monitors
  status/                    ← public status pages
  backups/                   ← database + CMS backup tools
  security-ongoing/          ← dependency scanning, secret scanning, WAF
  seo/                       ← crawl, GSC, audits
  ops/                       ← issue tracking, runbooks, on-call
  customer-comms/            ← live chat, knowledge base (client-facing)
  agency-finance/            ← retainer billing, entity tools
```

## Selection rules for devops_planner

| Client tier | Uptime | Status | Backups | Security | SEO | On-call | Chat |
|---|---|---|---|---|---|---|---|
| basic | betterstack-uptime | — | simplebackups | snyk | google-search-console | — | — |
| standard | betterstack-uptime | betterstack-status | simplebackups | snyk + gitguardian | google-search-console + screaming-frog | better-stack-oncall | crisp |
| advanced | betterstack-uptime + checkly | betterstack-status | simplebackups + snaplet | snyk + socket + gitguardian + cloudflare-waf | ahrefs + google-search-console + screaming-frog | pagerduty | crisp + helpjuice |

## Boundary

Every YAML in this folder has `boundary: support` — meaning it must NOT appear in `integrations.json` (app-side). It belongs only in `support_stack[]` (ops-side).
