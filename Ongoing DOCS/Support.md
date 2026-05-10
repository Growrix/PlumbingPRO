
Studio local server:
- From repository root: `npm --prefix studio run dev`
- Or from studio directory: `cd studio` then `npx sanity dev --port 3333`

Sanity API Token requirement for shop items:
- **Important:** The `SANITY_API_TOKEN` must be set in `.env.local` for published shop items to appear on the shop page.
- Without the token, the Sanity catalog query falls back to local database items only, bypassing CMS content.
- To generate a token: From the `studio` directory, run `npx sanity tokens add`, select Viewer role, and add the token to `web/.env.local`.
- This is required for both local development and production deployments.

Homepage featured cards (CMS control):
- Shop featured cards use published `shopItem` entries sorted by `featuredRank` (lower number appears first).
- Portfolio featured cards use published `caseStudy` entries sorted by `featuredRank` (lower number appears first).
- To hide an item from public cards, set `published` to false in the relevant document.

Card preview behavior:
- Shop cards show `mainImage` first.
- If no `mainImage`, cards try `embeddedPreviewUrl`.
- If neither is available, cards fall back to the visual fallback surface.
- Portfolio cards show `heroImage` first, then try `embeddedPreviewUrl`.

Live preview links:
- Shop cards use `livePreviewUrl` (or `embeddedPreviewUrl`) for the Live Preview button.
- Portfolio slug pages use `livePreviewUrl` for the Visit live site action.

Slug page image preview behavior:
- Portfolio slug gallery images display in a dedicated "Experience gallery" section with click-to-preview fullscreen lightbox.
- Shop slug gallery images display in a dedicated "Template gallery" section with the same fullscreen lightbox behavior as portfolio.
- Use `Esc` to close and arrow keys or Prev/Next controls to switch gallery images.
- If gallery is empty but `mainImage` exists, a single preview image is shown in the gallery.

Shop slug content structure:
- Key features now render as a clean bullet list (checkmark rows) instead of card tiles.
- This mirrors the readability style used in the Files and delivery scope section.

Placeholder content guard:
- Public catalog output now suppresses placeholder records such as `new-product`/`new-project` and demo example URLs.

CMS content import workflow:
- Save each AI-generated shop, blog, or case-study content file into `web/content-import/inbox/`.
- Accepted file formats are `.md`, `.markdown`, `.yaml`, `.yml`, and `.json`.
- Markdown files can contain YAML inside a fenced `yaml` block; this matches the current importer behavior.

Recommended command flow from repository root:
- Dry run a single file: `npm --prefix web run cms:import -- --file ./content-import/inbox/your-file.md --dry-run`
- Import a single file: `npm --prefix web run cms:import -- --file ./content-import/inbox/your-file.md`
- Dry run all inbox files: `npm --prefix web run cms:import -- --dry-run`
- Import all inbox files: `npm --prefix web run cms:import`

Also accepted now:
- The importer accepts either `./content-import/inbox/...` or `./web/content-import/inbox/...` file paths.
- This avoids path-resolution failures when commands are run from either the repository root or inside `web`.

Required environment variable:
- Live imports require `SANITY_API_TOKEN` to be set in the active terminal session.
- PowerShell example: `$env:SANITY_API_TOKEN = "your-token-here"`
- Without that token, dry-run can work but write operations to Sanity will fail.

Working example for the current shop item:
- Place the file at `web/content-import/inbox/powerpro-electrical-service-website.md`
- Run dry-run: `npm --prefix web run cms:import -- --file ./content-import/inbox/powerpro-electrical-service-website.md --dry-run`
- Run live import after setting the token: `npm --prefix web run cms:import -- --file ./content-import/inbox/powerpro-electrical-service-website.md`

After successful import:
- Confirm the new document appears under Shop Item in Sanity Studio.
- Move the processed file from `web/content-import/inbox/` to `web/content-import/processed/`.