# 6News Election Graphics

Pages (1920x1080): `index.html?view=clock | seat | called | state | lower`

## Connect the Google Sheet
1. Open the sheet > File > Share > Publish to web.
2. Choose the **LiveStreamData** tab and format **Comma-separated values (.csv)** > Publish.
3. Copy the link (ends `output=csv`) into `config.js` as `SHEET_CSV_URL`.
4. Keep the layout (rows 2, 6-10, 21) unchanged. Published sheets refresh roughly every 5 minutes; Google controls that.

## GitHub Pages
Upload the folder contents to a repo > Settings > Pages > deploy from `main` / root.
Use `https://USER.github.io/REPO/?view=lower` etc. as OBS/vMix Browser Sources (1920x1080).
