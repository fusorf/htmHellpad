# htmHellpad

Helldivers 2 Hellpad simulator. A PWA designed to run on a phone inside a 3D-printed stratagem pad case for cosplay. Works fully offline once installed.

## Features

- **82 stratagems** with SVG icons, directional input sequences, and prefix matching
- **Immersive boot sequence** — SEMOX kernel, BIOS POST, orbital uplink, threat assessment, ASCII art header. Configurable duration and line weights
- **Welcome screen** — blueprint-style idle screen with Helldivers logo, doubles as screensaver after configurable timeout
- **Stratagem activation screen** — fullscreen display with logo, name, GPU-accelerated progress bar, and status text. Tap/key to dismiss or auto-dismiss
- **Voicelines** — Super Destroyer and Eagle 1 PA lines on stratagem activation, randomly selected per category (weapons, sentries, orbitals, eagles, backpacks, mines, emplacements, hellbomb)
- **D-pad input** — touch, click, and keyboard (arrow keys + WASD + AZERTY). Inputs blocked during animations
- **Audio feedback** — directional button sounds, activation chime, error buzz
- **Sci-fi UI** — Orbitron font, blueprint grid, CRT scanlines, horizontal glow lines, vignette. Consistent across all screens
- **Portrait rotation** — CSS transform rotates to landscape on portrait phones. Configurable rotation direction
- **PWA** — installable via "Add to Home Screen", fully offline with service worker precaching
- **Configurable** — `config.js` for ship name, operator name, timings, orientation, boot skip, auto-dismiss

## Configuration

Edit `config.js` to customize:

| Setting | Default | Description |
|---|---|---|
| `HELLDIVER_NAME` | `'HELLDIVER [UNREGISTERED]'` | Operator name in boot sequence |
| `SHIP_NAME` | `'Star of Democracy'` | Super Destroyer name |
| `FLIP_ORIENTATION` | `false` | Rotate screen 180 degrees |
| `BOOT_DURATION` | `7000` | Boot sequence length (ms) |
| `ERROR_DURATION` | `1000` | Error flash time (ms) |
| `IDLE_TIMEOUT` | `10000` | Screensaver delay (ms) |
| `STRATAGEM_DURATION` | `3500` | Progress bar duration (ms) |
| `VOICELINE_DELAY` | `800` | Delay before voiceline (ms) |
| `SKIP_BOOT` | `false` | Skip boot, go to welcome screen |
| `AUTO_DISMISS_STRATAGEM` | `false` | Auto-dismiss 1s after progress completes |

## Installation

1. Open [https://fusorf.github.io/htmHellpad/](https://fusorf.github.io/htmHellpad/) on your phone
2. Tap Share (iOS) or Menu (Android) > "Add to Home Screen"
3. Open from home screen for fullscreen landscape mode
4. Put the phone in your 3D-printed Hellpad case

## Local Development

No build system. Serve the files and go:

```sh
python -m http.server 8001
```

## Credits

- Stratagem SVGs: [nvigneux/Helldivers-2-Stratagems-icons-svg](https://github.com/nvigneux/Helldivers-2-Stratagems-icons-svg)
- Fonts: [Orbitron](https://fonts.google.com/specimen/Orbitron), [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono)
- Sound effects for personal use only
