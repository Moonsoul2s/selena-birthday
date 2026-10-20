# Handoff — Selena Birthday

## Current state
The site has been migrated from static-only hosting toward a real Cloudflare Worker backend similar to Selena Nails.

Working / implemented:
- PIN 0707
- December 2 birthday text
- Microphone candle blow detection
- 100 Things I Love About You
- Edit Mode
- D1 database created and `settings` table created
- D1 binding configured as `DB`
- Cloudflare `ADMIN_PASSWORD` variable configured by user
- R2 bucket created: `selena-birthday-media`
- R2 binding configured as `MEDIA`
- Photo publishing code added
- Music publishing code added using R2
- Live music playback endpoint added

## Next verification
1. Open Edit Mode and verify Publish Photos works end-to-end.
2. Verify published photos appear on another device.
3. Publish MP3 and verify live website streams it on another device.
4. If Cloudflare deployment fails, inspect Deployments/build logs and verify `wrangler.jsonc` plus Worker entrypoint.
5. Keep root static files and `public/` copies in sync if both remain in repo; ideally consolidate later.

## Important recent architecture correction
Do not re-introduce the GitHub-token publishing flow. The desired UX is the same as the nail website: browser admin -> Worker API -> Cloudflare storage.

## Known user expectation
When user says “like nail web,” inspect the nail implementation first instead of inferring.
