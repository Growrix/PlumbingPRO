# Component and Styling Standards

## Purpose

This document governs how Growrix OS frontend components should be structured, reused, and styled.

## Component Taxonomy

### Primitives

- Buttons
- inputs
- badges
- cards
- dialogs
- tables
- tabs
- steppers

These belong in shared component layers and must remain business-agnostic.

### Feature Components

- queue status panels
- demo request forms
- payment upgrade prompts
- project timelines
- chat threads
- maintenance ticket forms

These belong in feature modules and may depend on domain-specific types and states.

## Component Rules

- Prefer composition over monolithic components.
- Shared components must not import feature-specific modules.
- Feature components may wrap shared primitives but should not duplicate them.
- Complex widgets should expose explicit props for status, permissions, and actions.

## Styling Standards

- Use Tailwind CSS with a documented token system for color, spacing, radius, and typography.
- Establish semantic color usage for status families such as success, warning, danger, info, and neutral.
- Admin and developer surfaces may use denser operational layouts, while public and client surfaces should prioritize readability.
- Avoid hard-coded status colors across components. Use shared variants.

## Design Token Expectations

- Define brand tokens for primary, secondary, accent, surface, border, text, and muted text.
- Define semantic tokens for queue state, payment state, maintenance state, and system alerts.
- Keep typography and spacing scales consistent across surfaces.

## Layout Standards

- Use a consistent shell pattern for each dashboard type.
- Preserve predictable header, navigation, content, and action regions.
- Avoid layout shifts during async loads where possible.

## Table and Timeline Standards

- Operational tables must support sorting, filtering, and clear status visibility.
- Timelines and steppers must align with documented lifecycle stages.
- Avoid hiding critical project state inside expandable controls by default.

## Comment and Naming Standards

- Name components by responsibility, not screen placement.
- Add comments only for non-obvious interaction logic or rendering constraints.
- Keep prop names explicit. Prefer `projectStatus` over `status` when ambiguity is possible.