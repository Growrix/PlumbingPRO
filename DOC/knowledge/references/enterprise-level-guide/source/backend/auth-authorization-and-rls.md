# Auth, Authorization, and RLS

## Purpose

This document defines the access control model for Growrix OS at the backend and data layers.

## Access Model

- `client` users access only their own commercial and collaboration data.
- `developer` users access only assigned work and related conversations.
- `admin` users access platform-wide operations and oversight functions.

## Authentication Standards

- Use Supabase Auth as the primary identity layer.
- Keep admin and developer account creation controlled by admins.
- Separate public client signup from internal user provisioning.

## Authorization Standards

- Enforce role checks in middleware for route access.
- Recheck authorization in server actions and APIs.
- Backstop access with RLS policies.
- Never trust a client-supplied role field.

## Route Rules

- `/growrix-admin/**` requires `admin` role.
- `/growrix-team/**` requires `developer` role.
- client dashboard routes require authenticated `client` ownership.
- public routes must not expose internal operational data.

## RLS Guidance by Domain

- `demo_requests`: clients can manage their own requests, developers only assigned requests, admins all.
- `projects`: clients own by `client_id`, developers by `developer_id`, admins all.
- `messages`: project participants only plus authorized admin oversight.
- `project_backups`: restricted to owning project participants and admins.
- `maintenance_requests`: owner client, assigned developer, admins.
- `notifications`: only target user and admins where absolutely necessary.

## Security Rules

- Hidden URLs are not a permission model.
- Role escalation attempts should fail closed and be logged when high risk.
- Use service-role or elevated credentials only on the server and only where required.

## Review Checklist

- Does the API check role and ownership?
- Does the database enforce the same boundary?
- Can a developer access non-assigned client records through an indirect path?
- Can a client infer internal-only metadata?