# htmHellpad — Helldivers 2 Hellpad Simulator

A web-based Hellpad simulator for practicing Helldivers 2 stratagem input sequences. Built as a mobile-first PWA, designed to run on a phone embedded in cosplay props (like Galactic Armory's Hellpad 3D print).

## Features

- **82 stratagems** — support weapons, orbitals, eagles, sentries, emplacements, backpacks, and vehicles
- **Boot sequence** — in-universe verbose console boot with SEAF terminal branding
- **Welcome screen** — blueprint-style display with Helldivers logo, acts as idle screensaver (30s timeout)
- **D-pad input** — keyboard-style arrow layout with touch, click, and keyboard support (arrows + WASD + AZERTY)
- **Visual feedback** — stratagem logo/name popup on success, error flash on wrong input
- **Audio feedback** — directional button sounds, activation and error sounds
- **Sci-fi UI** — Orbitron font, blueprint grid, CRT scanlines, vignette, glow effects
- **Portrait rotation** — auto-rotates to landscape on portrait screens via CSS transform
- **PWA** — installable, works offline with precached assets

## PWA Installation

1. Open the app at [https://fusorf.github.io/htmHellpad/](https://fusorf.github.io/htmHellpad/) on your mobile browser
2. Tap "Share" (iOS Safari) or menu (Android Chrome)
3. Select "Add to Home Screen"
4. Open from your home screen for fullscreen landscape mode

## Local Development

```sh
git clone https://github.com/your-username/htmhellpad.git
cd htmhellpad
python -m http.server 8001
```

Open `http://localhost:8001` in your browser.

## Credits

- Stratagem SVGs from [nvigneux/Helldivers-2-Stratagems-icons-svg](https://github.com/nvigneux/Helldivers-2-Stratagems-icons-svg)
- Sound effects: for personal use only, not owned by this project
- Fonts: [Orbitron](https://fonts.google.com/specimen/Orbitron), [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) (Google Fonts)

## License

This project is for educational and entertainment purposes only.
