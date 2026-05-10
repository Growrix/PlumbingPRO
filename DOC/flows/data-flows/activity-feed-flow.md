# DATA FLOW - ACTIVITY FEED

## OVERVIEW
Capture and display structured timeline of user/system events.

## FLOW
- Domain writes emit activity event envelope
- Activity service stores normalized timeline row
- Feed queries return tenant-scoped, filterable stream
- UI renders timeline entries with deep links and actor metadata

## CONSTRAINTS
- Event ordering must be deterministic by event time then id
- Sensitive payload fields must be redacted before render