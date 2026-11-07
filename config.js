// 1) Share the sheet: Share > General access > "Anyone with the link" > Viewer.
// 2) Paste the ID from the sheet URL: docs.google.com/spreadsheets/d/<SHEET_ID>/edit
// Leave SHEET_ID empty to show "-" everywhere.
window.CONFIG = {
  SHEET_ID: "1nFya7MIxhxONkdHNRbipgysjDyJOvmQ8A1tyGBsadLg",
  SHEET_NAME: "LiveStreamData",
  POLL_MS: 2000,   // how often to check for new data (no page reload)
  TCP_ROTATE_MS: 10000      // lower third "Show 2CP": how long each seat stays on screen
};
