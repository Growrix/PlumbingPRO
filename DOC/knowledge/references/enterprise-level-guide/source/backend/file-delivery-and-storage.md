# File Delivery and Storage

## Purpose

This document defines file handling standards for uploads, deliverables, previews, and backups.

## Storage Categories

- logo and reference uploads
- project collaboration uploads
- demo preview assets
- final deliverables
- project backups
- gallery thumbnails and previews

## Storage Rules

- Separate assets by category and access level.
- Validate type, size, and ownership intent before upload.
- Keep private files private by default.
- Use signed or mediated download flows for protected assets.

## Upload Authorization

- Clients may upload only into their own request or project contexts.
- Developers may upload only into assigned work contexts.
- Admins may manage assets according to platform oversight needs.

## Delivery Rules

- Final deliverables and backups must be linked to a project record.
- Delivery completion should not rely on file presence alone; an explicit state change is required.
- Public gallery usage requires approved public assets, not implicit reuse of private files.

## Security Requirements

- Avoid public bucket exposure for sensitive assets.
- Sanitize file metadata where needed.
- Preserve auditability for final backup uploads.

## Failure Handling

- Failed uploads should not create false delivery states.
- Orphaned uploads should be detectable and cleanable.
- Large upload workflows should expose resumable or retry-aware behavior if supported.