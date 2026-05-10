---
industry_pack: local-services
class: local_services
verticals: [plumbing, electrical, hvac, cleaning, landscaping, roofing, pest_control, locksmith, garage_door, appliance_repair, automotive_repair, carpet_cleaning, handyman]
default_visual_archetype: local-business-trust
default_project_archetype: marketing_site
---

# Industry Pack — Local Services

Use for any local trade / home-service business where trust, locality, and speed-to-contact drive conversion.

## Detection keywords
plumber, plumbing, electrician, electrical, hvac, heating, cooling, ac, cleaning, cleaner, maid, landscaping, lawn, roofing, roofer, pest, locksmith, garage door, appliance, repair, handyman, mechanic, auto repair, carpet cleaning, junk removal, painter, painting

## Default audience
- Primary: homeowner, age 30–65, urgent or planned service need, decides quickly when trust signals are clear.
- Secondary: property manager / small landlord with recurring service needs.

## Default user goals
- Find a local, reachable provider fast.
- Confirm credibility (license, insurance, reviews).
- Get a quote or book quickly via phone, form, or online booking.
- Confirm coverage of their area / postcode.

## Default journeys
- Emergency call path: Hero → Click-to-call sticky → Call connected.
- Quote request path: Hero → Service detail → Quote form → Confirmation.
- Service research path: Hero → Service detail → Pricing transparency → Book.
- Area check path: Footer or "Areas" page → Postcode/zip lookup → Confirm coverage → Contact.
- Review proof path: Hero → Reviews → Service detail → Contact.

## Default site map
- `/` Home (required)
- `/services` Services overview (required)
- `/services/[slug]` Service detail (required, dynamic)
- `/areas` Areas served (required)
- `/areas/[slug]` Area landing (recommended, SEO-driven)
- `/reviews` Reviews / testimonials (required)
- `/about` About / team (required)
- `/contact` Contact (required)
- `/book` Online booking (recommended)
- `/quote` Quote request (recommended)
- `/faq` FAQ (recommended)
- `/blog` Blog (optional, SEO-driven)
- `/privacy` Privacy (required)
- `/terms` Terms (required)
- `/404` 404 (required)

## Default trust signals (required slots)
- Header utility: phone + business hours.
- Hero: licensed/insured badges, years in business, areas served list.
- Below hero: review aggregate (rating + count + source).
- Service detail: same-day availability badge, response-time promise.
- Footer: license numbers, full address, business hours, areas served.

## Default conversion mechanics
- Click-to-call: persistent sticky button on mobile, header utility on desktop.
- Quote form: short (name, phone, service, postcode, brief) — preserves answers on validation error.
- Online booking: optional but recommended; calendar slot picker.
- WhatsApp / SMS: optional, on hero and contact.
- Email: optional, lower priority than phone.

## Default features list
- `marketing_pages` (CMS for service and area pages)
- `forms` (quote + contact)
- `booking` (optional, calendar integration)
- `reviews` (aggregate + display)
- `analytics`
- `transactional_emails` (quote follow-up)
- `seo` (mandatory for service+area landing pages)

## Default integrations
- CMS: sanity (services, areas, reviews, blog).
- Forms backend: route handler + email via resend.
- Booking: dependent on chosen provider — leave open in brief.
- Analytics: posthog or vercel analytics.
- Reviews source: native CMS + optional Google Business reviews surface (requires explicit integration plan).

## Forbidden defaults
- `auth` (most local-services sites do not need user accounts).
- `payments` (services usually quoted off-platform; only enable when client explicitly takes online deposits).
- `dashboard` (no logged-in surface required).

## Default content tone
- Voice: trustworthy.
- Tone: clear, friendly, locally rooted, urgency-aware.
- Forbidden words: "synergy", "world-class", "best-in-class", "leverage", "disruptive", "innovative" (without proof).

## Default compliance notes
- Display license number where regulator requires.
- Display physical service address (or "service area only" if mobile-only).
- Display business hours.
- If taking deposits → PCI handled via Stripe; never store PAN.

## Default SEO posture
- Service-area landing pages mandatory: `/areas/[slug]` and `/services/[slug]/[area-slug]` cross-cuts.
- Schema.org/LocalBusiness JSON-LD on every page.
- Google Business Profile linked from footer.

## Default response-time expectations
Surface explicitly on hero and service detail:
- "We answer in under <X> minutes."
- "Same-day appointments available."
- "<n>+ years serving <area>."

## Quality references

Describe what world-class output feels like for this industry and enforce these characteristics in planning and audit scoring.

- Urgent-contact clarity: phone/booking path visible in first viewport on mobile and desktop.
- Local proof density: named areas served, review aggregate, and license/insurance surfaced before mid-page.
- Trust-first readability: plain language, large readable body copy, and zero jargon-heavy filler.
- Conversion confidence: quote/booking friction minimized; recovery paths obvious on errors.
- Authenticity signal: real team/worksite imagery and locality cues; no generic stock-led hero.

## Notes for the strategist
- If user request is "build a <trade> website" with no other detail, this pack supplies enough to lock a brief.
- The vertical-specific terminology (drains, panels, ducts, etc.) belongs in the content library and is filled by the content_planner using the vertical hint, not by this pack.
