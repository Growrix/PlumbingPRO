# OUTPUT FORMAT RULES

## PURPOSE
Standardize every codegen response so it can be parsed by humans and tools alike.

## OF1 — THREE-PART STRUCTURE
Every codegen response MUST contain, in order:

1. **FOLDER STRUCTURE**
2. **FILES**
3. **COMMANDS**

No prose between sections. No prefatory commentary.

## OF2 — FOLDER STRUCTURE FORMAT
A code-fenced tree.

```
project-root/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (app)/
│   │   ├── (marketing)/
│   │   └── api/
│   ├── lib/
│   ├── server/
│   │   ├── services/
│   │   └── repositories/
│   └── env.ts
├── emails/
├── studio/         (only when CMS is included)
├── middleware.ts
├── ENV.example
└── RUN.md
```

## OF3 — FILE FORMAT
For every file, emit a header line followed by a fenced block:

```
### FILE: src/lib/stripe.ts
```ts
// full content here
```
```

Rules:
- Header MUST start with `### FILE: ` followed by the path.
- Fence language MUST match the file extension (`ts`, `tsx`, `prisma`, `json`, `yaml`, `md`, `js`, `env`, `sql`).
- Content MUST be complete; no `...` truncation.

## OF4 — COMMAND FORMAT
Commands appear in a fenced `bash` block under the heading `COMMANDS`.

```
## COMMANDS
```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm dev
```
```

Each command MUST be runnable as written. Comments allowed via `#` prefix.

## OF5 — ORDER OF FILES
Files are emitted in this order:
1. `package.json`
2. `tsconfig.json`
3. `next.config.ts`
4. `tailwind.config.ts`
5. `postcss.config.mjs`
6. `middleware.ts`
7. `src/env.ts`
8. `src/lib/*`
9. `src/server/db/*`
10. `src/server/repositories/*`
11. `src/server/services/*`
12. `src/app/**`
13. `prisma/schema.prisma`
14. `studio/**` (if applicable)
15. `emails/**` (if applicable)
16. `ENV.example`
17. `RUN.md`

## OF6 — NO EXPLANATION OUTSIDE STRUCTURE
- No "Here's the code" preamble.
- No "Let me know if..." postscript.
- The response is the artifact.

## OF7 — DELTA RESPONSES
When responding to a change request:
- Emit only changed files using the same FILE header format.
- Emit a `## CHANGES` section listing each file with `+`/`~`/`-` markers.
- Re-emit `RUN.md` only if commands changed.

## OF8 — ENCODING
- UTF-8 only.
- LF line endings.
- No BOM.

## OF9 — NO BINARY
- Codegen never emits binary content.
- Images and fonts are referenced by path; the developer adds them.

## OF10 — REPRODUCIBILITY
The same plan, run twice, MUST produce byte-identical output across all files.
