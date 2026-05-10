# CLI COMMAND RULES

## PURPOSE
Define the exact CLI commands every generated project must include and the order in which they run.

## CL1 — REQUIRED PHASES
Every project MUST document commands for these phases:
1. Install
2. Configure environment
3. Database setup
4. Studio setup (if CMS present)
5. Development server
6. Build
7. Smoke test
8. Deploy

## CL2 — PACKAGE MANAGER
Default to `pnpm`. Document npm/yarn alternatives only if explicitly requested.

## CL3 — INSTALL COMMANDS
```bash
pnpm install
```

## CL4 — ENV COMMANDS
```bash
cp ENV.example .env.local
# Fill in every value in .env.local before continuing
```

`ENV.example` MUST be generated from the exact planned env var set.

## CL5 — DATABASE COMMANDS (POSTGRES + PRISMA)
```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
# Production:
pnpm prisma migrate deploy
```

## CL6 — STUDIO COMMANDS (SANITY)
```bash
cd studio
pnpm install
pnpm sanity dev
# Deploy studio:
pnpm sanity deploy
cd ..
```

## CL7 — DEV SERVER
```bash
pnpm dev
# App runs on http://localhost:3000
```

Also verify root runtime command compatibility:
```bash
npm run dev
```

## CL8 — BUILD
```bash
pnpm build
pnpm start
```

## CL9 — WEBHOOK REGISTRATION
Each integration's webhook MUST be registered in its dashboard. The generated `RUN.md` MUST include the exact URLs:

- Stripe → `https://<domain>/api/webhooks/stripe`
- Clerk → `https://<domain>/api/webhooks/clerk`
- Sanity → `https://<domain>/api/webhooks/sanity`
- Resend → `https://<domain>/api/webhooks/resend`

## CL10 — LOCAL WEBHOOK TESTING
For Stripe, document:
```bash
stripe login
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

## CL11 — SMOKE TEST
After `pnpm dev`, the developer must verify:
```bash
# in another terminal
curl -i http://localhost:3000/
curl -i http://localhost:3000/sign-in
curl -i http://localhost:3000/api/webhooks/stripe -X POST   # expects 400 (no signature)
```

`npm run dev` must pass the same smoke checks.

## CL12 — DEPLOYMENT (VERCEL DEFAULT)
```bash
# First-time:
vercel link
vercel env pull
vercel --prod
```

## CL13 — DATABASE MIGRATION ON DEPLOY
Run as a CI step before promoting:
```bash
pnpm prisma migrate deploy
```

## CL14 — RUN.md TEMPLATE STRUCTURE
The generated `RUN.md` MUST contain these headings, in order:
1. Prerequisites
2. Install
3. Configure environment
4. Database
5. Studio (if CMS)
6. Run dev
7. Webhooks
8. Smoke tests
9. Build
10. Deploy
11. Troubleshooting

## CL15 — NO INTERACTIVE PROMPTS WITHOUT FLAGS
Commands MUST be runnable non-interactively where possible. Use `--yes`, `--name`, etc. to avoid prompts.
