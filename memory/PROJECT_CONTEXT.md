# Project Context — Selena Birthday

## Purpose
Private birthday surprise website for Selena.

## Main URLs
- Live: https://selena-birthday.2s7k9hyct5.workers.dev
- Edit mode: https://selena-birthday.2s7k9hyct5.workers.dev/?edit=1
- GitHub: Moonsoul2s/selena-birthday

## Core experience
- PIN: 0707
- Birthday date shown: December 2
- Light blush / white / champagne romantic design
- Blow-out candle interaction using microphone, with tap fallback
- Story section with memories, 100 Things I Love About You, birthday letter, dinner reveal
- Music: I Love You 3000
- Dinner location not finalized

## Current architecture
- Cloudflare Worker serves static assets and API routes
- GitHub branch `main` is source
- D1 database: `selena-birthday-db`
- D1 binding: `DB`
- D1 database ID: `ca3fc825-b867-4bb9-868d-951394518856`
- R2 bucket: `selena-birthday-media`
- R2 binding: `MEDIA`
- Admin auth uses `ADMIN_PASSWORD` secret in Cloudflare; do not commit its value
- D1 stores published memory photos/settings
- R2 stores published MP3 audio

## Important files
- `src/worker.js` — API, D1/R2 logic, admin auth
- `public/index.html`
- `public/styles.css`
- `public/script.js`
- `wrangler.jsonc`
- `migrations/0001_init.sql`

## Publishing behavior
Photos:
Edit Mode -> choose photos -> Publish Photos -> compress in browser -> authenticated Worker endpoint -> D1 -> visible on live site.

Music:
Edit Mode -> choose MP3 -> Preview -> Publish Music -> authenticated Worker endpoint -> R2 -> live site streams from Worker.

## Content constraints
- Do not invent restaurant details.
- Do not change intentional text such as “vi ci eo” in reason #4.
- Preserve English section titles unless user requests otherwise.
