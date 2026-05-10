# Accessibility and Localization

## Purpose

This document defines accessibility and localization standards for Growrix OS.

## Accessibility Baseline

- Meet WCAG 2.1 AA standards as the minimum target.
- Every interactive control must be keyboard accessible.
- Focus order must follow logical workflow order.
- Visible focus styles are mandatory.
- Color must not be the only carrier of meaning.

## Semantic Standards

- Use native HTML elements before custom roles.
- Label all form controls clearly.
- Use headings in a logical hierarchy.
- Announce async status changes where needed for assistive technologies.

## Dashboard Accessibility

- Tables must remain navigable and understandable with assistive technologies.
- Chat interfaces must expose sender, timestamp, and message state accessibly.
- File upload controls must explain accepted types, size limits, and status.

## Error Accessibility

- Validation errors must be tied to the relevant field.
- Global errors must be announced clearly and not trap keyboard users.

## Localization Standards

- Structure copy so it can be externalized later even if English is the initial language.
- Avoid hard-coding concatenated strings for status or dates.
- Use locale-aware formatting for dates, times, and currency.
- Keep status labels and workflow terminology consistent across surfaces.

## Future Internationalization Readiness

- Centralize user-facing strings where practical.
- Use formatting utilities that support locale expansion.
- Reserve space in layouts for longer translated content.