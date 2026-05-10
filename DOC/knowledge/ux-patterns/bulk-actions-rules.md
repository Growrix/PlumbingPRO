# Bulk Actions Rules

## Purpose
Safe and efficient execution of operations over selected sets.

## Required capabilities
- Select visible rows
- Select all rows matching current filter
- Batch progress and partial-failure reporting

## Rules
- Show exact affected count before action execution
- Destructive actions require confirmation and rollback path when possible
- Batch jobs must be idempotent and resumable

## Anti-patterns
- Implicitly selecting hidden rows without warning
- Silent partial failures