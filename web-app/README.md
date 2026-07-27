# Terminal Games Web App

React + TypeScript port of the Terminal Games collection.

## Games

1. **Guess the Number** — difficulty ranges 1–50 / 1–100 / 1–200  
2. **Roll the Dice** — match the secret sum with 1–3 dice  
3. **Hangman** — on-screen keyboard + physical keyboard  
4. **Mastermind** — 4-digit code, exact/partial feedback  
5. **Minesweeper** — first-click safe, flood-fill, flags  
6. **Rock, Paper, Scissors** — first to 3 with a 2-point lead  
7. **Battleship** — place fleet, sink the computer  

## Stack

- React 19, TypeScript, Vite  
- Tailwind CSS v4, Framer Motion, Lucide  
- Pure logic under `src/lib/` (unit-tested with Vitest)

## Commands

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Deployment

Configured for GitHub Pages (`base: /Terminal_Games/`). CI runs lint, tests, and build before deploy. See root README for client-side game caveats.
