# Service Design and Domain Rules

## Purpose

This document defines how backend services should be structured and how domain rules should be encoded.

## Service Design Principles

- One service owns one domain's rules.
- Services expose intent-driven operations, not raw table mutations.
- Domain logic should be reusable across APIs, server actions, and scheduled jobs.
- Services should fail with explicit, typed business errors where possible.

## Recommended Service Pattern

Each service should define:

- inputs and validation
- authorization expectations
- allowed preconditions
- transactional persistence behavior
- side effects and follow-up events
- failure modes

## Example Domain Responsibilities

### Queue Service

- create or place demo requests into a batch
- compute queue position and ETA
- promote a request to priority
- recalculate ordering after status changes

### Assignment Service

- assign work to a developer
- create or update a corresponding project record
- enforce admin-only assignment behavior

### Delivery Service

- record preview or final deliverable uploads
- mark work delivered
- create gallery drafts where appropriate
- create maintenance coverage on delivery completion

## Domain Error Guidance

Use stable error semantics for conditions such as:

- unauthorized action
- invalid state transition
- full batch
- duplicate payment reconciliation
- duplicate assignment
- expired maintenance coverage

## Transaction Rules

- Queue writes that affect ordering or capacity must be atomic.
- Assignment and project creation should occur in one logical transaction.
- Payment success handling must not partially update request priority without recording payment state.

## Anti-Patterns

- route handlers directly mutating multiple tables with no service boundary
- services that accept unvalidated raw request bodies
- UI-specific branching inside domain services
- silent state coercion when a transition is invalid