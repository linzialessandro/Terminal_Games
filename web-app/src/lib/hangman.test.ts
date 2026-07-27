import { describe, it, expect } from 'vitest';
import { applyGuess } from './hangman';

describe('applyGuess', () => {
  it('records correct letters and wins when complete', () => {
    let state = applyGuess('HI', new Set(), 'H', 6);
    expect(state.gameState).toBe('playing');
    state = applyGuess('HI', state.guessedLetters, 'I', state.attempts);
    expect(state.gameState).toBe('won');
    expect(state.attempts).toBe(6);
  });

  it('decrements attempts on wrong letter and loses at 0', () => {
    const state = applyGuess('A', new Set(), 'B', 1);
    expect(state.attempts).toBe(0);
    expect(state.gameState).toBe('lost');
  });

  it('ignores duplicate guesses', () => {
    const first = applyGuess('A', new Set(), 'B', 6);
    const second = applyGuess('A', first.guessedLetters, 'B', first.attempts);
    expect(second.attempts).toBe(5);
    expect(second.guessedLetters.size).toBe(1);
  });
});
