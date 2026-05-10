# DATA FLOW — FILE UPLOAD SYSTEM

## OVERVIEW
End-to-end flow for UploadThing-powered direct browser-to-storage file uploads with per-route auth, MIME validation, metadata persistence, and CDN delivery.

## INTEGRATIONS INVOLVED
- `uploadthing` (primary — handles direct uploads)
- `database` (file metadata persistence)
- `clerk` (upload authorization)
- `inngest` (post-upload processing, optional)

## ENTITIES
- `files` (DB: id, user_id, key, url, name, size, mime, route, uploaded_at)

## FLOW: FILE UPLOAD (DIRECT BROWSER → STORAGE)

```
[Browser]
  User selects file via <UploadButton> or <UploadDropzone>
       ↓
[UploadThing React SDK]
  POST /api/uploadthing (initiate upload)
  sends: { route: "avatarUpload", fileName, fileSize, fileType }
       ↓
[Next.js Route Handler /api/uploadthing]
  delegates to UploadThing router
       ↓
[UploadThing FileRouter — route: "avatarUpload"]
  middleware():
    const { userId } = auth()  // Clerk
    if (!userId) throw new UploadThingError("Unauthorized")
    return { userId }          // metadata forwarded to onUploadComplete
  validates: maxFileSize "4MB", fileTypes: ["image/jpeg", "image/png", "image/webp"]
       ↓
[UploadThing]
  generates a signed presigned URL
  returns presigned URL to browser
       ↓
[Browser]
  PUT <signed UploadThing URL> with file bytes (direct to storage, no Next.js involved)
       ↓
[UploadThing]
  stores file in UploadThing CDN
  calls POST /api/uploadthing (onUploadComplete webhook)
       ↓
[Next.js Route Handler — onUploadComplete callback]
  receives: { metadata: { userId }, file: { key, url, name, size, type } }
  call services.files.persist({ userId, key, url, name, size, mime: type, route: "avatarUpload" })
       ↓
[repositories.files.create]
  inserts row into files table
       ↓
[services.files.persist]
  optionally: update users.avatar_url = url for avatar route
  emits Inngest event "file.uploaded" for post-processing (virus scan, resizing)
       ↓
[Route Handler]
  200 OK
       ↓
[Browser]
  onClientUploadComplete callback fires with file URL
  updates UI
```

## FLOW: FILE DELETION

```
[Client]
  calls DELETE /api/files/<id>
       ↓
[Route Handler]
  authenticate, verify file ownership via repository
  call services.files.delete({ fileId, userId })
       ↓
[services.files.delete]
  step 1: call UTApi.deleteFiles([file.key])  // UploadThing server SDK
  step 2: soft-delete or hard-delete row in files table
       ↓
[Response]
  204 No Content
```

## FLOW: FILE SERVING (CDN)

```
[Browser]
  renders <img src={file.url} />  // UploadThing CDN URL
       ↓
[UploadThing CDN]
  serves file with long-lived Cache-Control headers
  (files are served directly from CDN, never proxied through the app)
```

## ENV VARS INVOLVED
- `UPLOADTHING_TOKEN`
- `UPLOADTHING_SECRET`
- `NEXT_PUBLIC_UPLOADTHING_APP_ID`

## CONSTRAINTS
- Per-route auth MUST resolve user via Clerk before signing; anonymous uploads blocked.
- File router MUST declare maxFileSize and allowed MIME per route.
- Secret token must only be used server-side.
- file.key must be persisted in DB to enable future deletion.
- Never proxy large file uploads through Next.js route handlers.
