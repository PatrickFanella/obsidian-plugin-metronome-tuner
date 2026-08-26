# Metronome & Tuner

An Obsidian plugin with a Web Audio metronome and chromatic instrument tuner.

## Features

- 30 to 300 BPM with tap tempo, configurable meter, accents, volume, and seven click sounds
- Chromatic tuner with configurable A4 reference from 415 to 466 Hz
- Mobile support through standard browser Web Audio and media APIs

Microphone access starts only after pressing **Start tuner**. Audio from the microphone is analyzed locally and is never routed to an output.

## Development

```bash
npm install
npm run dev
```

`npm run build` writes `main.js` at the repository root. Copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/metronome-tuner/` for a manual install.

## Validation

```bash
npm run typecheck
npm run build
```
