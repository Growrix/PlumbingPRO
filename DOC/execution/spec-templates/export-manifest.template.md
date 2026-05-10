# Export Manifest

## Required Bundle
- `.github/`
- `DOC/`
- Frontend app root (example: `web/`)

## Runtime Root Contract
- Declare the frontend runtime root path used for install/dev/build commands.
- If root-level command shims are present, they must proxy to this runtime root.

## Post-Export Bootstrap
1. Enter runtime root.
2. Install dependencies.
3. Prepare `.env.local` from `ENV.example`.
4. Run `npm run dev`.
5. Run smoke probes for required routes.

## Validation Criteria
- Dev server starts from exported location.
- Home route responds locally.
- No missing-script or invalid root errors.

## Recovery Notes
- Include platform-specific recovery steps (Windows process lock cleanup, lockfile reset) if startup fails.