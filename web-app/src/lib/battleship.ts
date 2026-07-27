export type CellState = 'empty' | 'hit' | 'miss' | 'ship';
export type ShipData = { coords: [number, number][]; hitCount: number };
export type ShipConfig = { name: string; length: number };

export const DEFAULT_BOARD_SIZE = 10;
export const DEFAULT_SHIP_CONFIG: ShipConfig[] = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Cruiser', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Destroyer', length: 2 },
];

/** Inclusive max start index so ships can reach the last board edge. */
export function maxShipStartIndex(boardSize: number, shipLength: number): number {
  return boardSize - shipLength;
}

/** Number of valid start positions along one axis (for Math.random range). */
export function shipStartRange(boardSize: number, shipLength: number): number {
  return maxShipStartIndex(boardSize, shipLength) + 1;
}

export function getShipCoords(
  r: number,
  c: number,
  length: number,
  horizontal: boolean
): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i < length; i++) {
    coords.push([horizontal ? r : r + i, horizontal ? c + i : c]);
  }
  return coords;
}

export function canPlaceShip(
  board: CellState[][],
  coords: [number, number][],
  boardSize: number = board.length
): boolean {
  return coords.every(
    ([r, c]) => r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === 'empty'
  );
}

export function createEmptyBoard(boardSize: number): CellState[][] {
  return Array.from({ length: boardSize }, () => Array(boardSize).fill('empty') as CellState[]);
}

/**
 * Immutable hitCount update — clones the ship entry so React state is not mutated.
 */
export function applyShipHit(
  ships: Record<string, ShipData>,
  shipName: string
): Record<string, ShipData> {
  const ship = ships[shipName];
  if (!ship) return ships;
  return {
    ...ships,
    [shipName]: { ...ship, hitCount: ship.hitCount + 1 },
  };
}

export function isShipSunk(ship: ShipData, length: number): boolean {
  return ship.hitCount >= length;
}

export function randomStart(
  boardSize: number,
  shipLength: number,
  horizontal: boolean,
  rng: () => number = Math.random
): { r: number; c: number } {
  if (horizontal) {
    return {
      r: Math.floor(rng() * boardSize),
      c: Math.floor(rng() * shipStartRange(boardSize, shipLength)),
    };
  }
  return {
    r: Math.floor(rng() * shipStartRange(boardSize, shipLength)),
    c: Math.floor(rng() * boardSize),
  };
}
