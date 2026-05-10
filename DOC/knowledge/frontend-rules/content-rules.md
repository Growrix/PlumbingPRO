# Content Rules

The content layer is the source of truth for every visible word in the UI. Components reference content keys; they do not hold strings. This rule set keeps the system i18n-ready and prevents hardcoded copy from sneaking back in.

## Content library

The content_planner emits `<output_root>/content-library.md` and a machine-readable `<output_root>/content.<locale>.json` per locale.

`<output_root>` MUST resolve to `DOC/output/runs/<timestamp>/planning/frontend`.

Minimum depth requirements for implementation-ready output:
- The locale JSON MUST include route-scoped key groups for every public route in scope.
- The locale JSON MUST include component-scoped key groups for shared interactive components.
- `content-library.md` MUST document key namespaces and ownership by route/component; summary bullet lists are invalid.
- If a route exists in planning but has no route-scoped content key group, planning MUST BLOCK.

### Naming convention

Keys are dot-notated, namespaced by surface and component:

```
home.hero.headline
home.hero.subheadline
home.hero.cta_primary
home.hero.cta_secondary
nav.utility.phone
nav.utility.hours
footer.legal.privacy
component.button.loading_label
component.toast.copy_success
billing.errors.payment_failed.title
billing.errors.payment_failed.body
```

Rules:
- Lowercase + dot + snake_case for leaves.
- Surface-first when copy is page-specific (`home.*`, `pricing.*`, `dashboard.*`).
- `component.*` prefix when copy belongs to a shared component.
- `errors.*` and `validation.*` for user-facing messages.

## Required keys per component class

Every component spec MUST declare which keys it consumes. The reviewer cross-checks that every declared key exists in the content library.

### Button
- `<surface>.<context>.cta_primary` (label)
- optional `<surface>.<context>.cta_secondary`
- `component.button.loading_label` (default "Working…")

### Form
- one key per field label
- one key per helper text
- one key per validation error per rule
- one key for the submit button label
- one key per success message

### Hero
- headline, subheadline, primary CTA, secondary CTA, eyebrow (if used)

### CTA section
- headline, body, primary CTA, secondary CTA, reassurance line

### Listing
- title, empty-state copy, filtered-empty copy, error copy, retry label

### Pricing
- per tier: name, price-suffix, description, feature bullets, cta label

### Footer
- legal links labels, "registered address" line, business hours line (if applicable)

### Toast
- per kind: success, info, warning, error — title and body

## Locale & i18n posture

- Default locale: `en-US` (or as declared in brief).
- If `i18n_required: true`, every key has a counterpart per supported locale.
- Locale switcher mounts in the footer (and header utility for marketplaces and consumer brands).
- Date, number, currency formatting use the platform's `Intl` APIs; never hand-format.
- RTL (Arabic, Hebrew, Urdu, Persian) requires logical CSS properties (`margin-inline-start` etc.) — codegen instructions reference this rule.

## Copy guardrails (forbidden words list)

Each industry pack supplies its own `forbidden_words` list. Defaults across all packs:

```
synergy
world-class
best-in-class
leverage
disruptive
revolutionary
next-gen
cutting-edge
game-changer
ninja
rockstar
guru
thought leader
unicorn
10x (without proof)
AI-powered (without proof)
```

The content_planner replaces forbidden words with concrete, evidence-backed alternatives. If no alternative is provided → emit an `open_question_for_human`.

## Tone and voice

The brief defines:
- `voice` (single word).
- `tone` (three adjectives).
- `forbidden_words[]`.

Every authored line must match the voice. The content_planner self-checks each headline/subhead/CTA against the voice and flags drift.

## Reading level

- Marketing copy: 6th–9th grade reading level (Flesch-Kincaid).
- Legal copy: as required, no obfuscation.
- Dashboard copy: terse, action-led; status labels under 3 words.

## Length budgets

| Surface                | Element              | Max characters |
|------------------------|----------------------|----------------|
| Hero                   | Headline             | 70             |
| Hero                   | Subheadline          | 140            |
| Hero                   | CTA label            | 24             |
| Section                | Eyebrow              | 32             |
| Section                | Heading              | 80             |
| Section                | Body paragraph       | 320            |
| Card                   | Title                | 60             |
| Card                   | Body                 | 180            |
| Toast                  | Title                | 60             |
| Toast                  | Body                 | 140            |
| Form helper            | Helper text          | 120            |
| Form error             | Error message        | 140            |
| Footer link            | Label                | 32             |

These are *budgets*, not goals. Shorter is better.

## CTA discipline

- Every CTA verb is action-led ("Book", "Buy", "Read", "Start", "Talk").
- Avoid weak CTAs ("Learn more", "Click here") unless contextually unavoidable.
- Repeating the same primary CTA across the page is encouraged.
- Two competing CTAs of equal weight are forbidden.

## Trust copy real estate

For trust-led archetypes (`local-business-trust`, `editorial-premium`, `marketplace`), the content library MUST include:
- A trust line (license, years, areas, customer count).
- A response-time line ("We answer in under <X>").
- A guarantee line (returns, refunds, satisfaction).
- A privacy line near every input ("We never share your data.").

## SEO-related copy

The content_planner emits per page:
- `meta.title` (≤60 chars).
- `meta.description` (≤155 chars).
- `og.title` and `og.description` (may equal meta or be different).
- structured-data fields (`schema.org`) where applicable per industry pack.

## Authoring workflow

- Content lives in CMS (Sanity by default) when the brief includes a CMS feature.
- For marketing-only sites without a CMS, content lives in `content.<locale>.json` files committed to the repo and consumed via a typed loader.
- Either way, components import the typed loader; never hardcode strings.

## Forbidden in component code

- Hardcoded English strings inside JSX/TSX (other than third-party labels we cannot translate, which require a documented exception).
- Concatenated strings ("`Hello, ${name}!`") instead of templated keys.
- Stringly-typed status values that double as user-facing copy.

## Content readiness gate

- Content output is considered `implementation-ready` only when route and component key maps are complete for all non-exempt public surfaces.
- Summary-only content output is considered `planning-incomplete` and MUST block codegen handoff.

The reviewer enforces via constraint **F5**.
