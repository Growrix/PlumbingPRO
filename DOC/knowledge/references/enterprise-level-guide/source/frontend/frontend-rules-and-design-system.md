# Frontend Rules & Design System Governance

## Purpose

This document enforces strict rules for UI/UX development in Growrix OS, ensuring all frontend work is maintainable, scalable, and visually consistent through a centralized design system (DS).

## No Hardcoding Policy

- All colors, spacing, typography, radii, and shadows must be referenced from the design system tokens.
- No direct hex, rgb, px, rem, or string values in component code or stylesheets unless explicitly defined in the DS.
- Linting and CI must block hardcoded style values in PRs.

## Centralized Design System (DS)

- The DS is the only source of truth for UI primitives, tokens, and patterns.
- All UI components must consume tokens and primitives from the DS.
- The DS must be versioned and documented.
- Feature teams may not fork or override DS primitives without DS team review.

## Design System Structure

- **Tokens:** color, spacing, typography, border, shadow, z-index, breakpoints, etc.
- **Primitives:** Button, Input, Card, Badge, Table, Modal, Tooltip, etc.
- **Patterns:** Form layouts, steppers, notifications, banners, etc.
- **Theming:** Support for light/dark mode and brand customization via tokens.

## Contribution & Governance

- All new UI primitives or patterns must be proposed via a DS RFC (request for comment) process.
- DS maintainers review and approve changes before merging.
- All DS changes must include documentation and usage examples.
- Feature teams must update their usage to the latest DS version as part of each release cycle.

## Automated Enforcement

- Linting rules (e.g., stylelint, eslint-plugin-tailwindcss) must block hardcoded values and style drift.
- Visual regression tests must be run for all UI changes.
- CI must fail if DS usage is bypassed or if new hardcoded values are introduced.

## Versioning & Updates

- The DS must follow semantic versioning.
- Breaking changes require a migration guide and communication to all frontend contributors.
- Feature teams must not pin to old DS versions without explicit approval.

## Documentation & Onboarding

- The DS must have clear, up-to-date documentation for all tokens, primitives, and patterns.
- New contributors must complete a DS onboarding checklist before merging UI code.

## Anti-Patterns

- Hardcoded style values in component code or stylesheets.
- Duplicating primitives or tokens outside the DS.
- Bypassing DS review for new UI patterns.
- Inconsistent theming or brand application.

## Definition of Done for UI Work

- All UI uses DS tokens and primitives.
- No hardcoded style values.
- Visual regression and linting pass.
- DS documentation is updated if new patterns or tokens are added.