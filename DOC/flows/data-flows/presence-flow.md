# DATA FLOW - PRESENCE TRACKING

## OVERVIEW
Tracks who is online, active, and editing in a shared workspace without leaking tenant data.

## INTEGRATIONS INVOLVED
- liveblocks or supabase-realtime
- clerk (identity)
- database (workspace membership)

## FLOW: USER ENTERS SHARED ROOM

```
[Browser]
  user opens collaborative screen
       v
[Frontend]
  requests room auth token from server
       v
[Auth Endpoint]
  verifies user session and workspace membership
  signs room token for tenant-scoped room id
       v
[Realtime Provider]
  opens presence channel and broadcasts join
       v
[Other Clients]
  receive join event and update avatar/presence bar
```

## FLOW: HEARTBEAT + LEAVE

```
[Client]
  sends periodic heartbeat while tab is active
       v
[Realtime Provider]
  updates last_seen timestamp
       v
[Timeout or explicit close]
  emits leave event
       v
[Other Clients]
  remove user from presence list
```

## CONSTRAINTS
- Presence identities must use stable user ids, never email addresses.
- Room id must include tenant scope.
- Presence metadata should be minimal: user_id, display_name, avatar_url, status.
- Server must reject room auth when user is not a workspace member.