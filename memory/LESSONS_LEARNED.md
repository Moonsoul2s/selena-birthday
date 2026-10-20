# Lessons Learned — Selena Birthday

1. Do not assume how a sibling project works. Inspect the actual Selena Nails code first.
2. The nail site's media publishing is not “upload to GitHub.” It uses Worker admin APIs and D1.
3. Browser IndexedDB is useful for preview, but it is device-local and is not publication.
4. GitHub connector text-file APIs are not a good path for binary MP3 publication.
5. A GitHub token prompt inside the website was the wrong UX for this project and should not return.
6. D1 is acceptable for compressed photos in this small project; R2 is the better fit for MP3/audio.
7. Cloudflare may initially treat a project as static-only. Worker entrypoint/config must deploy successfully before runtime variables and bindings are available.
8. When changing Cloudflare architecture, verify the live deployment after GitHub changes instead of assuming auto-deploy succeeded.
9. Preserve user-written intentional phrases exactly; do not “correct” them automatically.
