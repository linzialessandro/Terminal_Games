export type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
};

export const DIRECTIONS: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export function createEmptyGrid(size: number): Cell[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0,
    }))
  );
}

/** Deep-clone a grid so cell objects are not shared with React state. */
export function cloneGrid(grid: Cell[][]): Cell[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * Place mines, never on excluded cells (typically first-click cell and neighbors).
 */
export function placeMines(
  grid: Cell[][],
  numMines: number,
  exclude: ReadonlyArray<readonly [number, number]> = [],
  rng: () => number = Math.random
): Cell[][] {
  const size = grid.length;
  const next = cloneGrid(grid);
  const excluded = new Set(exclude.map(([r, c]) => `${r},${c}`));

  let minesPlaced = 0;
  let guard = 0;
  const maxGuard = size * size * 20;

  while (minesPlaced < numMines && guard < maxGuard) {
    guard++;
    const r = Math.floor(rng() * size);
    const c = Math.floor(rng() * size);
    if (excluded.has(`${r},${c}`) || next[r][c].isMine) continue;
    next[r][c] = { ...next[r][c], isMine: true };
    minesPlaced++;
  }

  return calculateNeighbors(next);
}

export function calculateNeighbors(grid: Cell[][]): Cell[][] {
  const size = grid.length;
  const next = cloneGrid(grid);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (next[r][c].isMine) {
        next[r][c] = { ...next[r][c], neighborCount: 0 };
        continue;
      }
      let count = 0;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && next[nr][nc].isMine) {
          count++;
        }
      }
      next[r][c] = { ...next[r][c], neighborCount: count };
    }
  }
  return next;
}

/** Cells to exclude for first-click safety (click + 8 neighbors). */
export function firstClickSafeZone(
  r: number,
  c: number,
  size: number
): [number, number][] {
  const cells: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        cells.push([nr, nc]);
      }
    }
  }
  return cells;
}

/**
 * Flood-fill reveal from (r,c). Returns new grid and how many flags were cleared.
 */
export function floodReveal(
  grid: Cell[][],
  r: number,
  c: number
): { grid: Cell[][]; flagsRemoved: number } {
  const size = grid.length;
  const next = cloneGrid(grid);
  let flagsRemoved = 0;
  const stack: [number, number][] = [[r, c]];

  while (stack.length > 0) {
    const [cr, cc] = stack.pop()!;
    const cell = next[cr][cc];
    if (cell.isRevealed || cell.isMine) continue;

    if (cell.isFlagged) flagsRemoved++;
    next[cr][cc] = { ...cell, isRevealed: true, isFlagged: false };

    if (next[cr][cc].neighborCount === 0) {
      for (const [dr, dc] of DIRECTIONS) {
        const nr = cr + dr;
        const nc = cc + dc;
        if (
          nr >= 0 &&
          nr < size &&
          nc >= 0 &&
          nc < size &&
          !next[nr][nc].isRevealed &&
          !next[nr][nc].isMine
        ) {
          stack.push([nr, nc]);
        }
      }
    }
  }

  return { grid: next, flagsRemoved };
}

export function checkWin(grid: Cell[][]): boolean {
  for (const row of grid) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isRevealed) return false;
    }
  }
  return true;
}

export function countFlags(grid: Cell[][]): number {
  let n = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.isFlagged) n++;
    }
  }
  return n;
}
