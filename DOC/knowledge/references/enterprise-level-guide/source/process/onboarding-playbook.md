# Onboarding Playbook

## Purpose

This document helps new engineers and AI-assisted contributors ramp into Growrix OS without breaking core business rules.

## First Read Sequence

1. [README.md](../../README.md)
2. [product/product-requirements.md](../product/product-requirements.md)
3. [architecture/system-architecture.md](../architecture/system-architecture.md)
4. [architecture/module-boundaries.md](../architecture/module-boundaries.md)
5. [data/data-model.md](../data/data-model.md)
6. [api/api-design.md](../api/api-design.md)
7. Relevant frontend, backend, quality, and process docs for the target task

## What New Contributors Must Understand

- Growrix OS has four distinct role surfaces.
- Hidden routes are not security boundaries.
- Queue integrity is a first-class business rule.
- Developers do not self-assign work.
- Delivered work is private until approved for public display.
- Maintenance begins automatically on delivery.

## Recommended First Tasks

- read one module end to end across product, architecture, data, and API docs
- inspect any existing implementation for that module
- make a small documentation or low-risk feature change before touching critical logic

## AI Contributor Rule

AI agents should read the docs in dependency order and avoid improvising undocumented states or workflows.