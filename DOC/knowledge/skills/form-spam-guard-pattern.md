# Skill: Form Spam Guard Pattern

**Used by:** cloudflare-turnstile, hcaptcha

## Pattern

Every public form that triggers server-side side effects (email send, DB write, booking) MUST be guarded by a bot challenge token verified server-side.

### Cloudflare Turnstile implementation

\\\	s
// 1. Client: render the widget and capture the token
// <div data-sitekey={NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
// token captured in state on challenge complete

// 2. Server: verify the token before processing
async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token }),
  })
  const data = await res.json()
  return data.success === true
}

// In route handler:
const isHuman = await verifyTurnstile(body.turnstileToken)
if (!isHuman) return new Response('Forbidden', { status: 403 })
\\\

### Rules
- Verification MUST be server-side — never client-only.
- Token MUST NOT be reused (one-time use by design).
- Secret key MUST be an env var.
- Site key (public) goes in NEXT_PUBLIC_ prefix.
