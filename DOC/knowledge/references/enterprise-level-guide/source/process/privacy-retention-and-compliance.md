# Privacy, Retention, and Compliance

## Purpose

This document defines baseline privacy and retention rules for Growrix OS.

## Data Handling Principles

- collect only data needed to operate the service
- protect private collaboration content
- retain data intentionally, not indefinitely by accident
- keep auditability for critical commercial events

## Sensitive Data Categories

- account identity data
- private client files and project content
- payment metadata
- private chat history
- maintenance and support records

## Retention Guidance

- keep commercial and audit records according to legal and financial requirements
- review retention windows for uploads, backups, notifications, and chat history explicitly
- avoid retaining raw third-party payloads longer than needed where normalized records suffice

## Privacy Rules

- do not expose private project content publicly without explicit approval and the correct asset path
- do not put secrets or raw sensitive payment data into logs or analytics
- AI assistant logs must avoid unnecessary sensitive content retention where possible

## Compliance Readiness Guidance

- maintain a clear mapping of stored data types and ownership
- document who can access each class of data
- support deletion or export workflows when policy and law require them