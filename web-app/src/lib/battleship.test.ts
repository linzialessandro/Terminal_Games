import { describe, it, expect } from 'vitest';
import {
  maxShipStartIndex,
  shipStartRange,
  getShipCoords,
  canPlaceShip,
  createEmptyBoard,
  applyShipHit,
  isShipSunk,
  randomStart,
  DEFAULT_BOARD_SIZE,
} from './battleship';

describe('ship placement bounds', () => {
  it('allows Carrier (5) to start at index 5 on a 10 board (uses last cells)', () => {
    expect(maxShipStartIndex(10, 5)).toBe(5);
    expect(shipStartRange(10, 5)).toBe(6); // 0..5 inclusive
  });

  it('randomStart can produce the last legal start index', () => {
    // rng that maps floor(x * 6) to 5 when x just under 1
    const start = randomStart(10, 5, true, () => 0.99);
    expect(start.c).toBe(5);
    const coords = getShipCoords(start.r, start.c, 5, true);
    expect(coords[coords.length - 1][1]).toBe(9);
  });

  it('getShipCoords vertical reaches last row', () => {
    const coords = getShipCoords(5, 0, 5, false);
    expect(coords).toEqual([
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
    ]);
  });

  it('canPlaceShip rejects out of bounds and occupied cells', () => {
    const board = createEmptyBoard(DEFAULT_BOARD_SIZE);
    board[0][0] = 'ship';
    expect(canPlaceShip(board, getShipCoords(0, 0, 3, true))).toBe(false);
    expect(canPlaceShip(board, getShipCoords(0, 8, 3, true))).toBe(false);
    expect(canPlaceShip(board, getShipCoords(0, 1, 3, true))).toBe(true);
  });
});

describe('applyShipHit', () => {
  it('immutably increments hitCount without mutating original', () => {
    const original = {
      Carrier: { coords: [[0, 0]] as [number, number][], hitCount: 0 },
    };
    const next = applyShipHit(original, 'Carrier');
    expect(next.Carrier.hitCount).toBe(1);
    expect(original.Carrier.hitCount).toBe(0);
    expect(next).not.toBe(original);
    expect(next.Carrier).not.toBe(original.Carrier);
  });

  it('detects sunk ships', () => {
    const ships = applyShipHit(
      { Destroyer: { coords: [[0, 0], [0, 1]], hitCount: 1 } },
      'Destroyer'
    );
    expect(isShipSunk(ships.Destroyer, 2)).toBe(true);
  });
});
