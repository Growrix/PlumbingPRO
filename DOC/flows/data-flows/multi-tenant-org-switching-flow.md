# DATA FLOW - MULTI-TENANT ORG SWITCHING

## OVERVIEW
Safe context switching across organizations/workspaces.

## FLOW
- User opens org switcher
- Server validates membership in selected org
- Active org context token/session claim updates
- Client refetches org-scoped data and clears stale caches

## CONSTRAINTS
- Never retain prior-org cached sensitive responses
- Every write request must include active org scope