import { describe, it, expect } from 'vitest';
import {
  createEmptyGrid,
  placeMines,
  firstClickSafeZone,
  floodReveal,
  checkWin,
  countFlags,
  calculateNeighbors,
} from './minesweeper';

describe('placeMines first-click safety', () => {
  it('never places a mine on excluded first-click zone', () => {
    const size = 8;
    const numMines = 10;
    const exclude = firstClickSafeZone(3, 3, size);
    // Deterministic-ish: run many placements with Math.random
    for (let trial = 0; trial < 30; trial++) {
      const grid = placeMines(createEmptyGrid(size), numMines, exclude);
      for (const [r, c] of exclude) {
        expect(grid[r][c].isMine).toBe(false);
      }
      let mines = 0;
      for (const row of grid) for (const cell of row) if (cell.isMine) mines++;
      expect(mines).toBe(numMines);
    }
  });
});

describe('floodReveal', () => {
  it('reveals contiguous zero-neighbor region and clears flags', () => {
    // 3x3 empty board — all neighbor counts 0
    let grid = createEmptyGrid(3);
    grid = calculateNeighbors(grid);
    grid[0][0] = { ...grid[0][0], isFlagged: true };
    grid[1][1] = { ...grid[1][1], isFlagged: true };

    const { grid: revealed, flagsRemoved } = floodReveal(grid, 1, 1);
    expect(flagsRemoved).toBe(2);
    for (const row of revealed) {
      for (const cell of row) {
        expect(cell.isRevealed).toBe(true);
        expect(cell.isFlagged).toBe(false);
      }
    }
  });

  it('does not reveal mines', () => {
    let grid = createEmptyGrid(2);
    grid[0][1] = { ...grid[0][1], isMine: true };
    grid = calculateNeighbors(grid);
    const { grid: revealed } = floodReveal(grid, 0, 0);
    expect(revealed[0][0].isRevealed).toBe(true);
    expect(revealed[0][1].isRevealed).toBe(false);
  });
});

describe('checkWin', () => {
  it('returns true only when every safe cell is revealed', () => {
    let grid = createEmptyGrid(2);
    grid[0][0] = { ...grid[0][0], isMine: true };
    grid = calculateNeighbors(grid);
    expect(checkWin(grid)).toBe(false);
    grid[0][1] = { ...grid[0][1], isRevealed: true };
    grid[1][0] = { ...grid[1][0], isRevealed: true };
    grid[1][1] = { ...grid[1][1], isRevealed: true };
    expect(checkWin(grid)).toBe(true);
  });
});

describe('countFlags', () => {
  it('counts flagged cells', () => {
    const grid = createEmptyGrid(2);
    grid[0][0].isFlagged = true;
    grid[1][1].isFlagged = true;
    expect(countFlags(grid)).toBe(2);
  });
});
