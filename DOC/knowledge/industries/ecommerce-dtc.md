---
industry_pack: ecommerce-dtc
class: consumer_brand
verticals: [dtc_brand, fashion, beauty, lifestyle, food_and_beverage, home_goods, premium_consumer_products, accessories]
default_visual_archetype: bold-consumer
default_project_archetype: ecommerce
---

# Industry Pack — Ecommerce / DTC

Use for direct-to-consumer brands selling physical or premium digital goods online.

## Detection keywords
shop, store, ecommerce, dtc, brand, fashion, beauty, skincare, food, beverage, home goods, lifestyle, accessories, jewelry, candle, apparel, premium product, sell online, products, cart, checkout

## Default audience
- Primary: consumer matching brand voice (lifestyle/age-based).
- Secondary: gift buyer.

## Default user goals
- Discover the brand and its lookbook / story.
- Browse products by category, collection, or filter.
- Evaluate via reviews, sizing, materials.
- Purchase confidently (clear shipping/returns).

## Default journeys
- Browse → product → add to cart → checkout.
- Lookbook → shop the look → product → checkout.
- Search → product → checkout.
- Account → past order → reorder.

## Default site map
- `/` Home (required)
- `/shop` Shop overview (required)
- `/shop/[collection]` Collection page (recommended)
- `/products/[slug]` Product detail (required)
- `/cart` Cart (required)
- `/checkout` Checkout (required)
- `/account` Account (required if accounts enabled)
- `/account/orders` Orders (required if accounts enabled)
- `/lookbook` or `/stories` Editorial (recommended)
- `/about` About / story (required)
- `/contact` Contact (required)
- `/shipping-returns` Shipping & returns (required)
- `/faq` FAQ (recommended)
- `/blog` or `/journal` (optional)
- `/privacy` Privacy (required)
- `/terms` Terms (required)
- `/404` 404 (required)

## Default trust signals (required slots)
- Top-of-page: free-shipping/returns banner where applicable.
- Hero: brand statement + featured product.
- Mid-page: press / awards strip if available.
- PDP: review aggregate + size guide + materials + shipping ETA.
- Footer: secure-checkout badges, return policy summary.

## Default conversion mechanics
- Primary: Add to Cart, Buy Now (Shop Pay or Apple Pay accelerated where supported).
- Secondary: Save for later, wishlist.
- Tertiary: Email / SMS subscribe with first-purchase incentive.

## Default features list
- `marketing_pages`
- `product_catalog`
- `cart_and_checkout`
- `payments`
- `transactional_emails` (order confirmation, shipping, returns)
- `analytics`
- `seo`
- optional: `auth` (guest checkout default; account optional)
- optional: `reviews`
- optional: `notifications` (order status SMS)

## Default integrations
- CMS: sanity (marketing, lookbook, journal); product catalog can live in CMS or in dedicated commerce platform.
- Payments: stripe.
- Emails: resend.
- Analytics: posthog.
- Search/filter: native at first; meilisearch when catalog grows.
- Reviews: native or third-party widget — leave open in brief.

## Default content tone
- Voice: brand-led; defined per client.
- Tone: confident, image-driven, short.
- Forbidden words: client-defined; default forbids cliché ("game-changer", "must-have", "best ever").

## Default compliance notes
- PCI scope reduction via Stripe; never store PAN.
- GDPR: cookie consent, marketing-opt-in disclosure on checkout.
- Region-specific tax/VAT messaging on PDP and checkout.
- Returns policy must be on a dedicated page and linked from cart and checkout.

## Default SEO posture
- Product pages indexable with Schema.org/Product (price, availability, rating).
- Collection pages indexable.
- Image-first sitemap.

## Quality references

Describe what world-class output feels like for this industry and enforce these characteristics in planning and audit scoring.

- Product-first storytelling: imagery and PDP structure make fit/material/benefit clear without hunting.
- Purchase confidence: shipping, returns, ETA, and pricing transparency visible before checkout commitment.
- Conversion cadence: add-to-cart and checkout paths are fast, clear, and resilient on mobile.
- Brand consistency: visual tone, typography, and micro-interactions remain coherent across campaign and catalog surfaces.
- Merchandising quality: collections/filter/sort help users narrow quickly without reload confusion.

## Notes for the strategist
- If the client says "online store" with no other detail, this pack locks the brief.
- Image quality is non-negotiable in `bold-consumer` archetype; strategist surfaces a `media_requirements` open question to the human.
