# Change Management

## Purpose

This document defines how product and technical changes should be proposed, approved, and documented.

## Change Categories

### Product Change

- alters user workflows
- adds or removes states
- changes pricing, queue behavior, or maintenance policy

### Technical Change

- alters architecture, schema, integrations, or operational behavior

### Emergency Change

- mitigates production risk or incident impact

## Required Documentation Updates

- Product behavior changes update product or architecture docs.
- Schema changes update data docs.
- Endpoint changes update API docs.
- Access changes update security or backend auth docs.

## Decision Rule

No high-impact change should exist only in code. The relevant docs must reflect the approved reality.

## Change Review Questions

- What user roles are affected?
- What lifecycle states change?
- What security boundary changes?
- What migration or rollback risk exists?
- What tests prove the change is safe?