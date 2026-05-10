# Frontend Performance and Analytics

## Purpose

This document defines performance and analytics expectations for Growrix OS frontend work.

## Performance Principles

- Optimize public pages for acquisition and trust.
- Optimize dashboards for task completion and perceived responsiveness.
- Do not trade away correctness or security for superficial speed.

## Performance Standards

- Use code splitting by route and feature where helpful.
- Lazy-load heavy media, charts, and non-critical dashboard sections.
- Optimize images for gallery, reviews, and shop content.
- Avoid unnecessary client bundles for server-friendly pages.
- Prevent repeated data fetching from multiple layers.

## Core Web Experience Focus

- Public pages should prioritize fast content display, stable layout, and responsive interactions.
- Dashboard screens should prioritize quick navigation, snappy filters, and reliable async state feedback.

## Analytics Standards

- Track business-significant events, not vanity noise.
- Define event names by module and action, such as `demo_request_submitted`, `priority_upgrade_clicked`, `demo_approved`, or `maintenance_ticket_created`.
- Do not log sensitive content in analytics payloads.
- Distinguish between anonymous public events and authenticated dashboard events.

## Privacy Rules for Analytics

- Do not capture private message content, secrets, or raw payment data.
- Use minimum necessary identifiers.
- Align event retention with privacy and compliance guidance.

## Monitoring Frontend Failures

- Capture client-side exceptions with route and actor context where safe.
- Track failed uploads, repeated reconnect issues, and high-friction form abandonment signals.
- Route severity based on impact to revenue or delivery flows.