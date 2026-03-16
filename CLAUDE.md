# htmHellpad

Helldivers 2 Hellpad simulator — practice stratagem input sequences with visual/audio feedback. Built as a mobile-first PWA for use in cosplay props.

## Architecture

Pure static frontend — no build system, no bundler, no package manager.

- `index.html` — Single page entry point, semantic HTML (`<button>` for arrows)
- `scripts.js` — All game logic wrapped in an IIFE: stratagem definitions (50 stratagems), input handling, sequence matching, display. Supports touch, click, and keyboard (arrows + WASD/AZERTY)
- `styles.css` — Layout + CRT scanline/flicker effects + responsive breakpoints
- `lowLag.js` — Third-party low-latency audio lib (AudioContext / SoundManager2 / audioTag fallback)
- `sm2/` — SoundManager2 library (fallback audio engine)
- `service-worker.js` — PWA offline caching via Workbox (StaleWhileRevalidate on GET requests)
- `manifest.json` — PWA manifest, landscape fullscreen, relative URLs

## Key Concepts

- **Stratagems**: Array `STRATAGEMS` in `scripts.js` — each has `name`, `logo` (SVG path), `sequence` (array of directions)
- **Input**: Arrow buttons fire on `touchstart` (mobile) or `click` (desktop). Keyboard: arrow keys + WASD + AZERTY (z/q). Inputs blocked during display via `isProcessing` flag
- **Matching**: `findMatch()` does prefix matching — finds first stratagem whose sequence starts with current input. No match = immediate error. Complete match = show stratagem
- **Audio**: `lowLag` plays activation sound on success, error sound on failure. No directional sound on final input
- **Display**: Overlay + blur backdrop on activation (3s) / error (1s). Sequence arrows shown centered with flex-wrap

## File Layout

```
images/          — SVG stratagem icons + arrow buttons + PWA icons
sounds/          — MP3/OGG audio (button-up/down/left/right, activation, error)
sm2/             — SoundManager2 lib (JS + SWF)
```

## Dependencies

- SoundManager2 (local, `sm2/`)
- lowLag.js (local)
- Workbox 5.1.2 (CDN, service worker only)

## Dev Notes

- No build step — edit files directly, open `index.html` in browser
- Mobile: landscape orientation, touch input. Desktop: mouse + keyboard
- PWA: installable via "Add to Home Screen" on mobile
- Stratagem SVGs from nvigneux/Helldivers-2-Stratagems-icons-svg
