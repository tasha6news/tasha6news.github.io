# 6News Election Graphics

Pages (1920x1080): `index.html?view=clock | seat | called | state | lower`

## Live data (no publishing delay, no page reloads)
The graphics poll the sheet directly every 2 seconds (`POLL_MS`) through Google gviz JSON endpoint and only redraw when values change.
1. Open the sheet > Share > General access > **Anyone with the link: Viewer**.
2. Copy the ID from the URL (`/spreadsheets/d/<SHEET_ID>/edit`) into `config.js`.
3. Tab name must be `LiveStreamData` (or change `SHEET_NAME`). Layout: rows 2, 6-10, and 21 (columns A-I; I = seat counted %).
If a fetch fails, the last good data stays on screen.

## GitHub Pages
Upload the folder contents to a repo > Settings > Pages > deploy from `main` / root.
Use `https://USER.github.io/REPO/?view=lower` etc. as 1920x1080 browser sources.
