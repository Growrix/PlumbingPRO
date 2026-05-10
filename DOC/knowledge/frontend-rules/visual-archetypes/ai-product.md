---
archetype: ai-product
positioning: AI-first product UI; conversation, suggestion, and streaming as primary affordances
best_for: [ai_chat_products, ai_writing_tools, ai_agents, ai_assistants, ai_search]
---

# AI Product

## Mood references

- **Claude.ai / ChatGPT / Perplexity / Cursor / Granola** — calm conversation surface, streaming feels alive but not jittery, citations + tool calls rendered inline.
- **Cohere docs / Anthropic console** — structured tool surfaces, model picker, cost meter, history sidebar.
- **Notion AI / Linear AI** — AI integrated into product flow; not a chat-only paradigm.

Bar: streaming text appears within 200ms of submit; citations are clickable; the user always knows what the AI just did.

## Voice & tone

- Calm, precise, capable.
- Plain copy that explains what the AI can do and what it cannot.
- Honest about limits ("can be wrong", "verify outputs", "private by design").

## Latitude windows

| Dimension | Latitude | Notes |
|---|---|---|
| Hero composition | **HIGH** | Capability statement + live chat preview; varies per product. |
| Brand hue | **MEDIUM** | Cool brand hue (deep blue / violet / teal class). |
| Streaming-cursor accent | **LOW** | Single accent for streaming + suggestion chips. |
| Typography | **MEDIUM** | Geometric sans + humanist body + technical mono for code outputs. |
| Section rhythm | **LOW** | 8px base; chat row vertical rhythm 12–16px. |
| Surface stack | **MEDIUM** | Conversation column max 720–800px; side rail optional. |
| Motion temperament | **HIGH** within `alive-precise` | Streaming chunk in 100–140ms; suggestion chip spring. |
| Imagery direction | **LOW** | Minimal hero imagery; product UI screenshots dominate. Avoid stock "AI brain" imagery. |
| Content density | **MEDIUM** | Hero medium. Chat dense. Settings balanced. |

## Starting-point tokens

### Color
- background: near-white / near-black
- surface: white / graphite
- inset: slightly darker for assistant bubbles or rails
- primary: brand hue (deep blue / violet / teal class)
- accent: streaming-cursor / suggestion hue
- ai-bubble: subtle background distinct from user-bubble
- user-bubble: subtle background distinct from ai-bubble
- semantic palette standard

### Typography
- display: geometric sans
- body: highly readable humanist sans
- mono: technical mono for code outputs
- heading scale: 32 / 28 / 24 / 20
- body scale: 16 / 14
- streaming cursor: monospaced thin line, blinking ~1Hz

### Spacing
- 8px base
- chat row vertical rhythm: 12–16px between bubbles
- composer min-height: 56; max growth: 240

### Radius
- bubbles 12–16; composer 12; cards 12

## Required quality dimensions

- **hero_composition** — 2 (chat is the hero — surface itself, not marketing hero)
- **narrative_density** — 3 (capability + limit must be honest and clear)
- **trust_signal_placement** — 3 (privacy + citations + sources)
- **motion_temperament** — 3 (alive without jitter)
- **micro_detail_quality** — 3 (regenerate, copy, like/dislike, citation chip)
- **content_punch** — 2

Target for `world_class`: ≥ 16/18.

## Forbidden patterns

- Hiding the model name or capability scope.
- Auto-submitting prompts on focus.
- Decorative animation that competes with streaming text.
- Pretending the AI is a human.
- Blocking modal during streaming.
- Citation-less retrieval results when retrieval is part of the product.
- "AI brain" / glowing-orb / generic-AI imagery.

## Imagery direction

- Minimal hero imagery; product UI screenshots dominate.
- Diagrams allowed for explaining capabilities.
- Avoid stock "AI brain" imagery.

## Required trust + safety real estate

- Privacy line near every input where applicable.
- Citation / source UI for retrieval results.
- Feedback affordances (like / dislike) on every assistant response.
- Cost / usage indicator if applicable (per-user limit visible).
- Model picker visible; current model named.

## Iconography

- Outline 1.5px; sizes 16/20/24.
- Specialised icons: model picker, attach, voice, regenerate, copy, share, like/dislike feedback.

## Anti-template clause

This file declares content CATEGORIES and OUTCOMES required for this archetype. It MUST NOT name specific components, prescribe layouts, or list visual elements that constrain the planner's composition latitude. Categories are universal across this archetype; component names and compositions are project-specific, authored by the frontend planner per the brief and the visual-differentiation map. If a future edit introduces named components in this file, it is template drift and must be reverted.

## Required content categories (outcome-level, component-agnostic)

- `ai_capability_scope`: define what the AI can and cannot do in plain language.
- `primary_interaction_surface`: provide the main prompt/response interaction path.
- `response_transparency`: expose model/action provenance, citations, or tool traces where applicable.
- `safety_and_limit_disclosure`: communicate limits, uncertainty, and verification expectations.
- `control_surface`: expose user controls (model, mode, attachments, settings) needed for trust.
- `feedback_loop`: provide explicit response feedback and correction pathways.
- `history_and_retrieval`: support session continuity and revisitability.
- `cost_or_usage_visibility`: show usage boundaries, quotas, or pricing posture when applicable.
- `conversion_or_activation_path`: provide clear activation/upgrade/start path without disrupting core interaction.
- `footer_identity_and_policy`: include policy links, legal identity, and attribution contract.

## How to deviate intentionally

- AI agent products may emphasise tool-call surfaces over chat (recorded as override).
- AI search products lean on citations + result cards more than streaming.
- AI dev tools may incorporate `dashboard-ops` patterns for tool surfaces.

Deviation recorded in `design-system.md` overrides with reason.
