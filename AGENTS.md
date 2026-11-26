# Repository notes

- This is a small, unbundled Manifest V3 browser extension. `manifest.json` is the executable source of truth: it loads `script.js` on LeetCode problem pages and uses `hello.html` as the popup; no build, test, or package scripts are present.
- `script.js` runs as the content script. It injects `inject.js` into the page context (listed under `web_accessible_resources`); `inject.js` waits for Monaco, shows the closest longer keyword match in a clickable top-of-page panel, accepts it with Tab, dismisses it with Escape, and sends editor text with `window.postMessage`. Keep the message type `LEETCODE_CODE` consistent between the two scripts.
- The popup is currently just `hello.html` plus `popup.js`; do not assume it implements the editor integration.
