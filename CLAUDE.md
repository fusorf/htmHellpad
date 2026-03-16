# htmHellpad

Helldivers 2 Hellpad simulator — practice stratagem input sequences with visual/audio feedback. Built as a mobile-first PWA for use in cosplay props.

## Architecture

Pure static frontend — no build system, no bundler, no package manager.

- `index.html` — Single page with three screens: boot sequence, welcome screen, main app. Semantic HTML (`<button>` for arrows, `<div id="app">` wrapper for portrait rotation)
- `scripts.js` — All game logic wrapped in an IIFE: boot sequence, screen transitions, stratagem definitions (82 stratagems), input handling, sequence matching, idle screensaver. Supports touch, click, and keyboard (arrows + WASD/AZERTY)
- `styles.css` — Helldivers-themed UI with Orbitron font, blueprint-style backgrounds, CRT scanline/vignette effects, responsive breakpoints, portrait-to-landscape CSS rotation
- `lowLag.js` — Third-party low-latency audio lib (AudioContext / SoundManager2 / audioTag fallback)
- `sm2/` — SoundManager2 library (fallback audio engine)
- `service-worker.js` — PWA offline caching with precache manifest (all assets listed explicitly)
- `manifest.json` — PWA manifest, landscape fullscreen, relative URLs

## Key Concepts

- **Boot Sequence**: Console-style verbose boot with weighted line delays (some lines take longer). White/green/yellow text on black. ~3s duration + 0.5s hold on last line
- **Welcome Screen**: Blueprint-style blue background, Helldivers logo SVG, "PERSONAL HELLPAD SYSTEM" text, horizontal glow lines. Acts as screensaver — reappears after 30s idle. Tap anywhere to enter app
- **Stratagems**: Array `STRATAGEMS` in `scripts.js` — each has `name`, `logo` (SVG path), `sequence` (array of directions). 82 stratagems total including vehicles
- **Input**: D-pad layout (up alone on top row, left/down/right on bottom row). Fires on `touchstart` (mobile) or `click` (desktop). Keyboard: arrow keys + WASD + AZERTY (z/q). Inputs blocked during display via `isProcessing` flag
- **Matching**: `findMatch()` does prefix matching — finds first stratagem whose sequence starts with current input. No match = immediate error. Complete match = show stratagem
- **Audio**: `lowLag` plays activation sound on success, error sound on failure. Directional sounds on intermediate inputs. Audio init deferred until app screen (needs user gesture)
- **Stratagem Display**: Large popup with logo + name, tap anywhere to dismiss. Blue-themed border and glow
- **Error Display**: Red flash animation, auto-dismisses after 1s
- **Idle Screensaver**: After 30s of no input, returns to welcome screen. Any input/direction resets the timer
- **Portrait Rotation**: CSS `transform: translateY(100vh) rotate(-90deg)` on `<html>` element. Uses negative rotation because the html element has no CSS parent to clip it before transform. Also attempts `screen.orientation.lock('landscape')` for installed PWA

## File Layout

```
images/          — SVG stratagem icons (82) + arrow buttons + PWA icons + helldivers_logo.svg
sounds/          — MP3/OGG audio (button-up/down/left/right, activation, error)
sm2/             — SoundManager2 lib (JS + SWF)
```

## Dependencies

- SoundManager2 (local, `sm2/`)
- lowLag.js (local)
- Google Fonts: Orbitron (UI), Share Tech Mono (boot terminal)

## Dev Notes

- No build step — edit files directly, serve with `python -m http.server`
- Mobile: landscape orientation, touch input. Desktop: mouse + keyboard
- PWA: installable via "Add to Home Screen" on mobile
- Stratagem SVGs from nvigneux/Helldivers-2-Stratagems-icons-svg
- Portrait rotation: must use `rotate(-90deg)` not `rotate(90deg)` — positive rotation sends content off-viewport. The transform is on `<html>` itself to avoid parent overflow clipping
- 2 stratagems missing SVGs (not in community repo): B/FLAM-80 Cremator, A/GM-17 Gas Mortar Sentry
