# Outbound Webhook Signing Rules

Every outbound webhook payload emitted by the platform MUST be signed using HMAC-SHA256.

---

## Signing algorithm

```
signature = "sha256=" + HMAC-SHA256(secretKey, rawBodyString)
```

- Algorithm: HMAC-SHA256
- Input: the raw JSON body string (UTF-8, no extra whitespace)
- Secret: the tenant's or platform's signing secret (32+ random bytes, base64 or hex encoded)

## Request headers

| Header | Value | Required |
|---|---|---|
| `X-Signature-256` | `sha256=<hex_digest>` | YES |
| `X-Event-Type` | e.g., `subscription.created` | YES |
| `X-Delivery-Id` | UUID v4 per delivery attempt | YES |
| `X-Timestamp` | Unix epoch seconds (string) | YES |
| `Content-Type` | `application/json` | YES |

## Replay protection

Receivers MUST reject deliveries where `X-Timestamp` is older than **5 minutes** from current time. The delivery log MUST record both sent and verified timestamps.

## Retry policy

See `automation-rules.md` Rule AR6 for the full exponential backoff schedule.

## Signing secret management

| Scenario | Secret scope |
|---|---|
| Platform → external webhook (single tenant) | Single `OUTBOUND_WEBHOOK_SECRET` env var |
| Platform → customer-registered webhook (multi-tenant) | Per-customer secret in `automation_tokens` table |

### Per-customer secret rotation
- Provide "rotate secret" UI in customer settings.
- Keep old secret valid for a 24-hour grace period during rotation.
- Record rotation event in audit log.

## SSRF prevention (recipient URL validation)

Before dispatching any outbound webhook, the recipient URL MUST pass all of:

1. Must be HTTPS (scheme === "https")
2. Must resolve to a public IP (reject RFC 1918 + link-local + loopback)
3. Must not be a cloud metadata IP (169.254.169.254, fd00:ec2::254)
4. Must not be a localhost variant (127.x.x.x, 0.0.0.0, ::1)

Fail with status `delivery_blocked` and log the blocked URL (redact query params).

## Reference implementation

See skill: `outbound-webhook-signing-pattern.md`
