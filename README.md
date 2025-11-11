```markdown
# NULL — Rope & Silence (Text Adventure)

A lightweight browser text-adventure built to explore the "Null" setting: a world where light and sound attract predators. This project is intentionally small and split into clear parts so developers can extend visuals, asset handling, and mechanics.

Project layout:
- index.html — entry page
- css/style.css — theme and layout
- js/game.js — core game state and actions
- js/ui.js — UI rendering and event wiring
- assets/svg/bell.svg — bell visual
- assets/svg/bead.svg — bead visual
- assets/sounds/README.md — notes about adding sound assets

How to run:
1. Serve the folder with any static server (or just open `index.html` in the browser).
   - Recommended: `npx http-server` or the Live Server extension for VSCode.
2. Open `index.html`.

Notes for developers:
- `js/game.js` contains the authoritative state model. Add or change actions here.
- `js/ui.js` reads that state via the `Game` global and renders the DOM. Keep separation of concerns: move UI-only code here.
- To add visuals: replace the SVGs in `assets/svg` or reference other images in index.html.
- To add sounds: put files in `assets/sounds/` and use the Web Audio API or <audio> elements; be mindful that sound in Null is narrative risk — design with muting / safe toggles.

Ideas for improvements:
- Convert to ES modules for stricter encapsulation.
- Add staged events and random encounters.
- Expand item usage (Quencher Powder, Blackglass mechanics).
- Add a small editor to create / edit braid routes (good dev tooling project).
```