# Page Archetype Rules — Outcomes (NOT Section Templates)

Defines the **outcomes** every page archetype must satisfy and the **constraints** it must honour. The `frontend_planner` uses this as an outcome checklist — never as a fill-in template.

---

## HOW TO READ THIS FILE

For each page archetype below, the planner finds:
- **User intent** — what the visitor wants to do.
- **Required outcomes** — the truths that must hold by the time the visitor leaves.
- **Required content slots** — what content must be on the page (NOT in what order).
- **Forbidden patterns** — what the page MUST NOT do.
- **Standard latitude** — default `creative_latitude` band for this archetype (the project may override).
- **Quality dimensions to weight** — which scoring dimensions matter most for this archetype.

The planner translates these into a per-page design brief at `<output_root>/pages/<route-slug>.md`. The developer composes the page from primitives within this envelope.

**There are NO section templates in this file.** A section list constrains composition; we want outcomes that constrain truth without constraining composition.

---

## Universal cross-archetype rules

Every page MUST satisfy:
- **Required content slots:** declared up-front, exhaustively (no surprise labels emerge during build).
- **Differentiation:** the page's hero composition + primary section rhythm + motion temperament MUST differ from every other route on the same site, per `visual-differentiation-map.md`.
- **Sections (count, not order):** ≥ 7 distinct content surfaces on every public page (or `min_sections_exempt: true` with reason: 404, legal, narrow utility).
- **Auth-gated routes:** redirect-or-block pattern declared explicitly.
- **States:** loading + empty + error + not-found + success per the situations the page can encounter.
- **Conversion path:** primary + secondary + exit-point declared.
- **Quality bar score:** ≥ project target on every dimension.
- **Reduced motion fallback:** every animation has one.

These are non-negotiable. Archetype-specific rules layer on top.

---

## Home (any project archetype)

- **User intent:** understand what the offer is, decide whether it's relevant, take a next step.
- **Required outcomes:**
  - Visitor reaches a primary CTA in ≤ 3 scrolls on desktop, ≤ 2 viewports on mobile.
  - Trust evidence appears above the fold for first-time visitors.
  - The offer's value proposition is parseable in ≤ 5 seconds without scrolling on desktop.
  - Mobile experience offers a sticky / persistent contact path for the chosen industry's primary conversion mechanic.
- **Required content slots:**
  - Offer headline + subhead + primary CTA.
  - Trust evidence (one of: logos, metric, testimonial, review aggregate, badges).
  - Value demonstration (one of: feature grid, capability rail, story block, product preview).
  - Process or proof (one of: case study teaser, process steps, story).
  - Conversion repetition (CTA appears ≥ 2× on the page).
  - Footer (legal + nav + utility).
- **Forbidden patterns:**
  - Hero composition identical to `services` or `pricing` on the same site.
  - Generic stock photography unless industry-pack-allowed.
  - Hidden phone / contact path on local-services / professional-services projects.
- **Standard latitude:** HIGH (this is a signature surface — every project's home should look distinct).
- **Quality dimensions to weight:** hero_composition (3), narrative_density (3), trust_signal_placement (3), motion_temperament (3), micro_detail_quality (3), content_punch (3).

---

## Services overview (marketing_site / professional_services / saas_app marketing)

- **User intent:** understand the full capability map and self-select the right engagement.
- **Required outcomes:**
  - Visitor can identify the right service for their situation in ≤ 30 seconds.
  - Each service has a clear differentiator visible without clicking through.
  - A path to the service detail surface is reachable from each service summary.
- **Required content slots:**
  - Capability map (every service represented).
  - Per-service one-line value differentiator.
  - Per-service "see more" affordance.
  - Optional: comparison rail / decision aid.
  - Conversion CTA.
- **Forbidden patterns:**
  - Identical service tiles (same composition for every service).
  - Hidden pricing posture for services that have transparent pricing.
- **Standard latitude:** MEDIUM.
- **Quality dimensions to weight:** narrative_density (3), trust_signal_placement (2), micro_detail_quality (2), content_punch (3).

---

## Service detail (marketing_site)

- **User intent:** evaluate this specific service deeply enough to decide whether to engage.
- **Required outcomes:**
  - Visitor understands what is included, how it works, what it costs (range or starts-at), and how to start.
  - Trust + proof for THIS service is present (not just generic).
  - A path back to the services overview is visible.
- **Required content slots:**
  - Service hero (specific to this service).
  - What's included.
  - How it works / process.
  - Pricing posture (range, starts-at, or "contact for quote").
  - Proof (case study, testimonial, metric).
  - FAQ / objection handling.
  - Conversion CTA.
- **Forbidden patterns:**
  - Service hero composition identical to `home` hero.
  - Generic process diagrams; process must be specific to the service.
- **Standard latitude:** MEDIUM (composition follows recommended outline; visual signature differs per service).
- **Quality dimensions to weight:** narrative_density (3), trust_signal_placement (3), content_punch (3).

---

## Product overview (ecommerce)

- **User intent:** browse, filter, narrow.
- **Required outcomes:**
  - Visitor can filter by category / collection / attribute and see results without page reload.
  - Hero or featured collection sets brand mood; not interchangeable with home hero.
  - Sort + pagination / infinite scroll behaviour declared.
- **Required content slots:**
  - Hero / collection feature.
  - Filter + sort surface.
  - Product grid.
  - Trust / quality strip (returns, shipping, materials).
  - Footer.
- **Forbidden patterns:**
  - Filter changes triggering page reload.
  - Hidden price on product tile (industry-pack-dependent).
- **Standard latitude:** MEDIUM.

---

## Product detail (ecommerce)

- **User intent:** evaluate this specific product and decide to buy.
- **Required outcomes:**
  - Variants (size / colour / option) selectable without scroll.
  - Trust signals (reviews, returns, shipping ETA) visible above the fold on desktop.
  - Add-to-cart action confirms with feedback that does not require page navigation.
- **Required content slots:** gallery, title + price + variants + CTA, description tabs (description / materials / shipping / returns), reviews, recommendations, footer.
- **Forbidden patterns:** stock-photo gallery, gallery without alt text.
- **Standard latitude:** MEDIUM.

---

## Cart / Checkout (ecommerce / marketplace)

- **User intent:** complete purchase with confidence.
- **Required outcomes:**
  - No surprise charges; tax / shipping shown before payment step.
  - Returns + refund policy linked from the page.
  - Order summary editable from any step.
- **Required content slots:** order summary, address form, payment (Stripe handoff), trust strip (secure checkout, returns), minimal footer.
- **Forbidden patterns:** required account for guest checkout (industry-pack default), hidden total.
- **Standard latitude:** LOW (use standard composition; conversion-critical).

---

## Pricing (saas_app / marketing_site)

- **User intent:** compare options and pick the right plan.
- **Required outcomes:**
  - Plan tiers parseable in ≤ 5 seconds.
  - Feature differentiation between tiers is unambiguous.
  - Enterprise / custom path is visible.
  - Monthly / annual toggle (if both offered) updates without reload.
- **Required content slots:** positioning hero, tier cards, feature comparison, FAQ / billing FAQ, final CTA, footer.
- **Forbidden patterns:** identical content across tiers, hidden pricing for declared self-serve tiers.
- **Standard latitude:** MEDIUM.

---

## About (any)

- **User intent:** evaluate whether the company / agency / individual is credible and a good fit.
- **Required outcomes:**
  - Visitor leaves with a sense of mission, voice, team, and operating principles.
  - Trust signals (clients, regulator, certifications) visible.
- **Required content slots:** mission / origin, story / approach, team, values, proof, conversion CTA.
- **Forbidden patterns:** stock-photo team, generic "we are passionate" copy.
- **Standard latitude:** HIGH (about pages are signature surfaces).

---

## Contact (any)

- **User intent:** reach the team via the most appropriate channel.
- **Required outcomes:**
  - Multiple contact channels visible (form + at least one of: phone, email, WhatsApp, chat).
  - For local / regulated industries: physical address + business hours.
  - For B2B: book-a-call CTA.
- **Required content slots:** clear "how to reach us" intro, multi-channel contact surface, optional map / address block, footer.
- **Forbidden patterns:** form-only contact path for local-services / professional-services without alternate channel.
- **Standard latitude:** LOW.

---

## FAQ (any)

- **User intent:** resolve the question that's blocking action.
- **Required outcomes:**
  - Questions categorised; visitor finds the relevant one in ≤ 15 seconds.
  - Each answer offers a next action (book / chat / contact / read more).
- **Required content slots:** hero, categorised accordion, "still have questions?" CTA, footer.
- **Forbidden patterns:** dead-end answers (no next action), accordion that closes other items on open without user choice.
- **Standard latitude:** LOW.

---

## Blog index (content_site / saas_app / marketing_site)

- **User intent:** find an article worth reading.
- **Required outcomes:**
  - Latest / featured surfaces immediately.
  - Categorisation or tag filtering visible.
  - Article preview gives enough signal to decide whether to click.
- **Required content slots:** hero (latest or featured), filter / category strip, article grid, newsletter or final CTA, footer.
- **Forbidden patterns:** dateless articles, lorem-ipsum previews.
- **Standard latitude:** MEDIUM.

---

## Blog detail

- **User intent:** read this article comfortably.
- **Required outcomes:**
  - Article body has comfortable reading width and rhythm.
  - Author + date + reading time visible.
  - Related articles offer a continuation path.
- **Required content slots:** article hero (title, date, author), body, author bio, related articles, newsletter or CTA, footer.
- **Forbidden patterns:** body width > 800px, missing author byline.
- **Standard latitude:** MEDIUM.

---

## Sign-in / Sign-up (saas_app / dashboard_tool / ecommerce-with-account)

- **User intent:** authenticate quickly and predictably.
- **Required outcomes:**
  - Form completes within the first viewport on mobile.
  - Alternate path (sign-up ↔ sign-in) visible.
  - Trust strip (compliance, security) visible.
- **Required content slots:** minimal header (logo only), auth form, alternate path, trust strip, minimal footer.
- **Forbidden patterns:** distractive footer, marketing nav.
- **Standard latitude:** LOW.

---

## Onboarding (saas_app / dashboard_tool)

- **User intent:** get to first value quickly.
- **Required outcomes:**
  - Each step has one task; the user always knows what step they're on.
  - Skip path available for non-blocking steps.
  - Progress indicator persistent.
- **Required content slots:** step indicator, one-task content per step, skip / next / back controls.
- **Forbidden patterns:** marketing copy mid-onboarding, dead-ends without skip.
- **Standard latitude:** HIGH (onboarding is a signature surface in modern SaaS).

---

## Dashboard (saas_app / dashboard_tool / marketplace)

- **User intent:** see status; decide next action.
- **Required outcomes:**
  - Summary state visible without scrolling on desktop.
  - Critical actions reachable in 1 click.
  - Notifications + activity feed accessible.
- **Required content slots:** app shell (top bar + side rail), summary header (greeting + key metrics), primary panel (per surface), secondary panel (recent activity / shortcuts), states (empty / loading / error per panel).
- **Forbidden patterns:** dense data tables on mobile, hidden destructive actions.
- **Standard latitude:** MEDIUM.

---

## Listing index (marketplace / ecommerce)

- **User intent:** browse + narrow.
- **Required outcomes:**
  - Filter changes update results without reload.
  - Trust badges per listing (verified, top-rated) visible.
- **Required content slots:** hero or category strip, filter panel, listing section, trust strip, footer.
- **Forbidden patterns:** unverified seller without disclosure, hidden listing fees.
- **Standard latitude:** MEDIUM.

---

## Listing detail (marketplace)

- **User intent:** evaluate this listing + transact.
- **Required outcomes:**
  - Verification + reviews + price visible above the fold.
  - Contact / book / buy action obvious.
- **Required content slots:** gallery, title + price + seller (verified badge), description / specs, reviews, related listings, footer.
- **Forbidden patterns:** hidden seller info, missing review aggregate.
- **Standard latitude:** MEDIUM.

---

## Case study (portfolio_site / professional_services)

- **User intent:** evaluate craft, depth, outcome.
- **Required outcomes:**
  - Project quality is parseable in the hero (image + role + year).
  - Outcome is concrete (metric or named result).
  - Continuation path to next project is visible.
- **Required content slots:** project hero, context, problem, approach, solution media, outcome, next-project navigator, footer.
- **Forbidden patterns:** generic outcome ("client was happy"), missing role / year, stock visuals.
- **Standard latitude:** HIGH (each case study should look different — work-led, not template-led).

---

## Landing page (landing_page archetype)

- **User intent:** complete the campaign action without distraction.
- **Required outcomes:**
  - One offer; one CTA; CTA repeated ≥ 3× on the page.
  - No competing nav / footer distractions.
- **Required content slots:** hero with single CTA, social proof strip, value (3 bullets max), demo or mid-page proof, repeated CTA, FAQ (max 6), final CTA, minimal footer.
- **Forbidden patterns:** secondary offer that competes with primary, marketing footer with nav.
- **Standard latitude:** MEDIUM (composition is constrained but visual signature varies).

---

## 404

- **User intent:** recover.
- **Required outcomes:** offer ≥ 3 useful next destinations + (optional) search.
- **Required content slots:** minimal header, "page not found" message, quick links, footer.
- **Forbidden patterns:** dead-end ("404"), broken nav.
- **Standard latitude:** LOW.
- **Sections-exempt:** allowed (`min_sections_exempt: true`).

---

## Privacy / Terms / Legal

- **User intent:** read the legal text.
- **Required outcomes:** content present, last-updated date visible, contact path visible.
- **Required content slots:** minimal header, title + last-updated, long-form body (CMS-backed), contact line, footer.
- **Forbidden patterns:** generic templates without business-specific addendum.
- **Standard latitude:** LOW.
- **Sections-exempt:** allowed.

---

## Mandatory utility surfaces (independent of archetype)

Every site MUST plan:
- Utility ribbon (optional but reserved slot for trust / promo).
- Sticky mobile CTA where the archetype demands it (e.g., `local-business-trust`).
- Cookie consent banner (where compliance requires).
- Skip-link as the first focusable element on every page.

---

## Output

The frontend_planner consumes these outcomes and emits one design brief per route under `<output_root>/pages/<route-slug>.md` per `per-page-spec.md`. Each brief carries the archetype's outcomes, content slots, forbidden patterns, latitude, and quality dimensions — translated into project-specific values from the brief.
