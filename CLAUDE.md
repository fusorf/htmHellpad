# htmHellpad

Helldivers 2 Hellpad simulator — PWA for cosplay props. Runs on a phone inside a 3D-printed stratagem pad case. Fully offline.

## Architecture

Pure static frontend — no build system, no bundler, no package manager.

- `index.html` — Single page with four screens: boot, welcome, stratagem, app
- `config.js` — All tweakable constants (timings, names, toggles)
- `scripts.js` — All game logic in an IIFE: boot sequence, screen transitions, 82 stratagems with sound mappings, input handling, sequence matching, idle screensaver, voiceline playback
- `styles.css` — Helldivers-themed UI. Shared screen base (background, grid, scanlines, glow lines), responsive, portrait rotation
- `lowLag.js` — Third-party low-latency audio lib for button sounds
- `sm2/` — SoundManager2 library (fallback audio engine)
- `service-worker.js` — PWA offline caching with precache manifest
- `manifest.json` — PWA manifest, landscape fullscreen

## Screens

1. **Boot** — SEMOX ASCII art, DemocracyKernel, BIOS POST, hardware init, security, orbital uplink to ship, stratagem mount, threat assessment. Top-down scrolling. Configurable duration, skippable
2. **Welcome** — Blueprint background, Helldivers logo with pulse glow, "PERSONAL HELLPAD SYSTEM". Acts as screensaver. Tap/click/key to enter app
3. **App** — D-pad input (touch/click/keyboard), sequence display with frame, arrow icons. Error flash with overlay on wrong input
4. **Stratagem** — Own screen with same background. Logo in frame, name, progress bar (GPU-accelerated scaleX), "STRATAGEM SENT" status. Voiceline plays after delay. Tap/key to dismiss or auto-dismiss

## Key Implementation Details

- **Input**: D-pad fires on `touchstart` (mobile) or `click` (desktop). Keyboard: arrows + WASD + AZERTY. `isProcessing` flag blocks input during displays
- **Matching**: `findMatch()` does prefix matching on input sequence against all 82 stratagems
- **Audio**: `lowLag` for low-latency button/activation/error sounds. `new Audio()` with preload for voicelines (Super Destroyer / Eagle 1 PA lines, randomly selected per category)
- **Progress bar**: Real DOM element, CSS `@keyframes` with `transform: scaleX()` + `will-change: transform` for GPU compositing. Restarted via inline style `animation: none` + `requestAnimationFrame`
- **Portrait rotation**: CSS `transform: rotate(90deg)` on `<html>` with `translateX(100vw)`. Configurable flip via `.rotation-alt` class. Also attempts `screen.orientation.lock('landscape')`
- **Shared screen base**: All screens (welcome, stratagem, app) share background gradient, `::before` blueprint grid, `::after` scanlines, `.screen-line` horizontal glow lines

## File Layout

```
config.js        — Tweakable constants
images/          — SVG stratagem icons (82) + arrow buttons + PWA icons + helldivers_logo.svg
sounds/          — MP3/OGG button sounds + activation + error
sounds/stratagems/ — MP3 voicelines (Eagle 1, Super Destroyer)
sm2/             — SoundManager2 lib
```

## Dependencies

- SoundManager2 (local, `sm2/`)
- lowLag.js (local)
- Google Fonts: Orbitron (UI), Share Tech Mono (boot terminal)

## Dev Notes

- No build step — edit files directly, serve with `python -m http.server`
- Stratagem SVGs from nvigneux/Helldivers-2-Stratagems-icons-svg
- 2 stratagems missing SVGs (not in community repo): B/FLAM-80 Cremator, A/GM-17 Gas Mortar Sentry
- Portrait rotation: `rotate(90deg)` is default, `rotate(-90deg)` via `FLIP_ORIENTATION` config
- **Service worker**: After any significant update, bump `CACHE_NAME` version in `service-worker.js` (e.g. `htmhellpad-v3` to `htmhellpad-v4`). If new files were added (sounds, images, scripts), add them to `PRECACHE_ASSETS`. This forces the PWA to re-download all assets on next launch
