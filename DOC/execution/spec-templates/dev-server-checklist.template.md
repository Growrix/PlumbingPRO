# Dev Server Checklist

## Purpose
Use this checklist before running local development server commands.

## 1. Runtime Root Verification
- Confirm the runtime app root (example: `web/`) and run install/dev commands there.
- If root shim scripts exist, verify they proxy to the same runtime root.

## 2. Dependency Preflight
- Confirm `package.json` exists in runtime root.
- Run dependency install from runtime root.
- If install fails, record exact package and error code.

## 3. Environment Variable Preflight
- Confirm `ENV.example` exists.
- Create/update `.env.local` from `ENV.example` placeholders.
- Validate required frontend env vars are present (`NEXT_PUBLIC_*`).

## 4. Port and Process Preflight
- Check if target dev port is already in use.
- Stop stale `node`/`npm` processes that can lock dependencies or ports.

## 5. Windows Binary Lock Recovery (if applicable)
- Stop active `node`/`npm`/`npx` processes.
- Remove `node_modules` and lockfile from runtime root.
- Re-run install once.
- If still failing, classify as environment blocker and capture exact failing binary/package.

## 6. Dev Startup
- Run `npm run dev` from runtime root.
- Confirm local URL is printed by framework startup logs.

## 7. Smoke Verification
- Probe the home route (`/`) and required key routes.
- Confirm initial compile succeeds without startup blockers.

## 8. Export Portability Verification
- After copying project to a new root, repeat this checklist unchanged.
- Confirm runtime root commands behave identically in the exported location.