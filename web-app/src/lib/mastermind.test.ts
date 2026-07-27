import { describe, it, expect } from 'vitest';
import { scoreGuess, generateCode } from './mastermind';

describe('scoreGuess', () => {
  it('scores all exact matches', () => {
    expect(scoreGuess('1234', '1234')).toEqual({ exact: 4, partial: 0 });
  });

  it('scores all wrong', () => {
    expect(scoreGuess('1234', '5678')).toEqual({ exact: 0, partial: 0 });
  });

  it('scores partials without double-counting exacts', () => {
    // classic: secret 1122, guess 1212 → 2 exact (pos0=1, pos? wait)
    // 1122 vs 1212: pos0 1=1 exact, pos1 1!=2, pos2 2=2 exact, pos3 2!=1
    // remaining secret: one 1; remaining guess: one 1 → 1 partial
    expect(scoreGuess('1122', '1212')).toEqual({ exact: 2, partial: 2 });
  });

  it('handles duplicates in guess correctly', () => {
    // secret 1234, guess 1111 → 1 exact only
    expect(scoreGuess('1234', '1111')).toEqual({ exact: 1, partial: 0 });
  });

  it('handles all partials (scrambled)', () => {
    expect(scoreGuess('1234', '4321')).toEqual({ exact: 0, partial: 4 });
  });

  it('throws on length mismatch', () => {
    expect(() => scoreGuess('1234', '123')).toThrow();
  });
});

describe('generateCode', () => {
  it('returns requested length of digits', () => {
    const code = generateCode(4, 10, () => 0.5);
    expect(code).toHaveLength(4);
    expect(code).toMatch(/^\d+$/);
  });

  it('uses rng for deterministic digits', () => {
    // floor(0.9 * 10) = 9
    expect(generateCode(4, 10, () => 0.9)).toBe('9999');
  });
});
