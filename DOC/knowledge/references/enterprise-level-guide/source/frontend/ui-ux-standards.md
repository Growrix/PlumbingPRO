# UI and UX Standards

## Purpose

This document defines the experience standards for Growrix OS interfaces. The product promise depends on trust, clarity, and operational transparency, so the UI must communicate status and next actions without ambiguity.

## Experience Principles

- Clarity over decoration.
- Trust through explicit status and timelines.
- Actionability over density.
- Consistency across surfaces, with role-appropriate tone and controls.
- Professional polish without obscuring critical information.

## SaaS UX Rules

- Every role-facing screen must answer: what is happening, what is expected next, and what the user can do now.
- Queue, assignment, delivery, payment, and maintenance states must be visible as structured UI, not buried in paragraphs.
- Destructive actions require confirmation and visible consequences.
- Money-related flows must clearly distinguish pending, successful, failed, and refunded states.
- Empty states should guide the next meaningful action.

## Public UX Standards

- Showcase trust signals early: demo wall, reviews, process transparency, maintenance promise.
- Demo request flows should reduce friction while preserving data quality.
- Priority upsell messaging must be clear, honest, and non-deceptive.
- Public content must avoid suggesting that hidden routes are a security guarantee.

## Dashboard UX Standards

- Dashboards should begin with a summary layer, then expand into detailed workflow views.
- Tables and timelines must expose critical status, owner, urgency, and deadline information.
- Notifications should deep link into the exact area requiring attention.
- Chat and uploads must show confirmation, progress, and recovery states.

## Form Standards

- Required fields must be clearly marked.
- Validation must be immediate where helpful and final on submit.
- File constraints must be visible before upload.
- Long forms should be staged or grouped logically.
- Preserve user input on recoverable failure.

## Error and Recovery UX

- Authorization failures should redirect or block with a clear, non-leaky message.
- Recoverable server errors should provide retry guidance.
- Realtime interruptions should show reconnect state without discarding unsent user intent.
- Payment failures should preserve the original request state and explain the next step.

## Status Communication Standards

- Use consistent status labels across UI, API, and data docs.
- Pair badges with contextual explanation when the status has business implications.
- ETA should include both the current estimate and the reason it can change.

## Mobile and Responsive Standards

- All primary user tasks must be possible on small screens.
- Dense tables should collapse into cards or summary rows on mobile.
- Critical actions must remain reachable without hover-only interactions.

## Approval UX Standards

- Demo and delivery approval screens must distinguish between approve, request revision, and ask a question.
- Revision requests should route into the same project communication history.