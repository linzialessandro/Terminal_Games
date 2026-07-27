# Terminal Games Collection

Classic games in two flavors: a Python terminal suite and a modern React web app.

## Play Online

**[Play the web app on GitHub Pages](https://linzialessandro.github.io/Terminal_Games/)**

---

## Project Structure

| Path | Description |
|------|-------------|
| `web-app/` | React + TypeScript + Vite UI (glassmorphism, Framer Motion) |
| `terminal-games/` | Python CLI menu (`game.py`) + pure logic (`logic.py`) |
| `.github/workflows/deploy.yml` | Lint, unit tests, build, deploy to GitHub Pages |

### Games

Guess the Number · Roll the Dice · Hangman · Mastermind · Minesweeper · Rock Paper Scissors · Battleship

---

## Web Version

### Local development

```bash
cd web-app
npm install
npm run dev
```

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build (`dist/` + SPA `404.html` fallback) |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests for game logic |
| `npm run preview` | Preview production build |

### Deployment notes

- Vite `base` is `/Terminal_Games/` (repository name).
- React Router uses the same basename so routes work under GitHub Pages.
- Build copies `index.html` → `404.html` so deep links (e.g. `/minesweeper`) load the SPA.

### Client-side games (important)

All web games run entirely in the browser. Secret numbers, codes, mine maps, and ship positions live in React state and can be inspected with developer tools. That is expected for a casual single-player collection — not a competitive multiplayer product. Fairness is “for fun,” not cryptographic.

---

## Terminal Version (Python)

```bash
cd terminal-games
python game.py
```

### Tests

```bash
cd terminal-games
python -m unittest test_logic.py -v
```

Pure helpers live in `logic.py` (Mastermind scoring, ship tokens, flood-fill, RPS). The CLI imports them so behavior matches the tests.

---

## License

MIT License. See [LICENSE](LICENSE).
