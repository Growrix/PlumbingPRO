# Deployment and Environments

## Purpose

This document defines how Growrix OS environments should be structured and how changes move between them.

## Environment Model

- local
- staging
- production

## Environment Rules

- Each environment must have isolated secrets.
- Stripe and Supabase configuration should be environment-specific.
- Staging should mirror production critical behavior closely enough to validate auth, storage, webhooks, and realtime.

## Deployment Standards

- Build and deploy from reviewed code only.
- Schema changes must be versioned through migrations.
- Environment configuration changes should be documented alongside the release.
- Production rollouts for critical flows should include validation checkpoints.

## Pre-Deployment Checklist

- migrations reviewed
- secrets configured
- webhooks configured for target environment
- required background jobs or sync jobs configured
- monitoring ready for new critical paths

## Post-Deployment Checklist

- smoke-test login and route guards
- verify queue and dashboard core paths
- verify webhook health
- verify notification delivery for impacted flows