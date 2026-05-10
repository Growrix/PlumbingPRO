# Realtime, Chat, and Client Resilience

## Purpose

This document defines standards for chat, live updates, notifications, and degraded connectivity behavior.

## Core Principle

Realtime improves responsiveness, but durable server state remains authoritative. The interface must remain trustworthy during disconnects, retries, or message lag.

## Chat Standards

- Chat is scoped to an assigned project or other explicitly allowed entity context.
- Participants are limited to the client, assigned developer, and admin oversight roles where permitted.
- Message history must be durable before the UI treats a send as complete.
- File attachments must pass the same authorization and validation model as other uploads.

## Realtime Subscription Rules

- Subscribe only to entities the current user is authorized to observe.
- Unsubscribe on route or identity changes.
- Avoid broad global subscriptions when narrower project-scoped channels exist.

## Message Ordering and Delivery

- Display optimistic local send state separately from confirmed persistence.
- Preserve server ordering once the message is acknowledged.
- Detect and recover from duplicate delivery when reconnecting.

## Reconnect Behavior

- Show reconnect state when live channels drop.
- Retry subscriptions automatically with backoff.
- Refetch affected data after reconnect to close gaps.
- Preserve unsent drafts locally when possible.

## Queue and Notification Updates

- Realtime queue updates should supplement, not replace, explicit refresh paths.
- In-app notifications should be durable records with realtime delivery as a convenience layer.
- High-impact events such as delivery completion and payment success should also trigger non-realtime notification paths.

## Failure Handling

- If chat delivery fails, keep the draft or failed message state visible.
- If a realtime subscription fails repeatedly, fall back to manual refresh or polling guidance.
- Do not silently discard user actions because of connectivity loss.