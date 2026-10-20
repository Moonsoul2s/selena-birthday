# Decisions — Selena Birthday

## Use Cloudflare backend, not GitHub-token publishing
Decision: publishing from Edit Mode should work through authenticated Worker APIs.

Reason:
The nail site already provides the desired UX: upload in admin and publish directly to the live site without asking for GitHub credentials.

## Photos in D1
Decision: compress images client-side and store them in D1 settings as base64.

Reason:
This mirrors the nail site's proven implementation and keeps small published images easy to serve through Worker routes.

## Music in R2
Decision: store the MP3 in R2, not D1.

Reason:
The birthday MP3 is much larger than a compressed image. R2 is appropriate object storage for audio and supports streaming.

## Keep GitHub as source of code, not user-media publication path
Decision:
Code/config stays in GitHub. User-uploaded media is published through Cloudflare storage.

## Admin secret
Decision:
`ADMIN_PASSWORD` stays in Cloudflare runtime secrets/variables and must not be committed to GitHub.
