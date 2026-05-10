# Data Fetching and State Management

## Purpose

This document defines how frontend code should fetch, cache, mutate, and present data in Growrix OS.

## State Principles

- Server state and client UI state are not the same.
- Business truth belongs to the server.
- Client state should be minimized to view concerns, optimistic UI where safe, and ephemeral interaction state.

## Preferred State Model

- Server-render or server-fetch auth-bound data when possible.
- Use client-side caching libraries only for data that benefits from refetching, subscription, or mutation orchestration.
- Keep form draft state local until submission.
- Normalize repeated status interpretation through shared utilities.

## Query Rules

- Co-locate data requirements with feature modules, not generic pages only.
- Use stable query keys by module, actor, and entity.
- Refetch after mutations that change authoritative status, queue position, or assignment state.
- Avoid duplicate fetching in nested components when a parent already owns the data contract.

## Mutation Rules

- Every mutation must go through a server-validated path.
- Optimistic updates are allowed only when rollback is simple and user confusion risk is low.
- Never optimistic-update payment success, role changes, assignment ownership, or final queue position.
- Surface mutation progress and final outcome explicitly.

## Cache Invalidation Guidance

- Invalidate queue-related views after request creation, assignment, cancellation, delivery, or priority promotion.
- Invalidate project and message views after chat sends, uploads, approvals, or delivery changes.
- Invalidate maintenance views after ticket creation or status updates.

## Pagination and Infinite Scroll

- Required for demo wall, shop, reviews, and large admin tables.
- Use cursor or stable page parameters.
- Preserve filters and sorting in the URL for navigable state where appropriate.

## Realtime Interaction with Cached Data

- Realtime events should update or invalidate affected caches.
- Reconnect should trigger refetch for entities with missed update risk.
- Resolve conflicts in favor of the latest server-confirmed state.

## Anti-Patterns

- storing authoritative queue ordering only in local state
- deriving permissions from UI path alone
- duplicating state between page, feature, and component without a clear ownership reason
- using client-only state to simulate delivery success before server confirmation