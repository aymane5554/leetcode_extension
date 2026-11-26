# LeetCode Keyword Suggestions

A small Manifest V3 browser extension that suggests identifiers already used in the current LeetCode solution.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this repository folder.
4. Open or reload a LeetCode problem page.

## Use

- On LeetCode problem pages, the extension looks for Monaco’s code editor.
- As you type a word that is a prefix of another identifier in the current code, a panel at the top of the page shows the closest matching longer identifier.
- Press **Tab** to complete the suggestion, or click it. Press **Esc** to hide it until you type again.
- Suggestions come from identifiers in the current editor contents; they are not generated from the problem statement or an external source.
- The toolbar popup currently only displays “Hello Extensions.”

## Project files

- `manifest.json` — extension configuration and LeetCode URL matching.
- `script.js` — content script that communicates with the page.
- `inject.js` — page-context editor integration and suggestions panel.
- `hello.html`, `popup.js` — popup page and script.

There is no build step or automated test suite; the extension consists of plain files loaded directly by the browser.
