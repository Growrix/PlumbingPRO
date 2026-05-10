# Skill: Direct Browser Upload Pattern

**Used by:** uploadthing, r2, s3

## Pattern

File uploads MUST go directly from the browser to the storage provider — NEVER proxied through the Next.js server. The server only issues a signed URL or manages the upload type contract.

### UploadThing flow

\\\
Browser ──POST metadata──▶ /api/uploadthing ──validate──▶ UploadThing service
                                                               │
Browser ◀──signed upload URL──────────────────────────────────┘
Browser ──PUT file bytes──▶ UploadThing CDN
UploadThing CDN ──callback──▶ /api/uploadthing (file.uploaded event)
App ──save URL to DB──▶ Database
\\\

### Rules
- Server MUST authenticate the user in the upload middleware before issuing a signed URL.
- File type and size MUST be declared on the server, not client.
- Final file URL MUST be persisted to the database in the \onUploadComplete\ callback.
- NEVER stream file bytes through the Next.js server (Vercel 4.5MB body limit).
