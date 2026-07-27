import { describe, it, expect } from 'vitest';
import { roundResult, matchWinner } from './rps';

describe('roundResult', () => {
  it('detects draws', () => {
    expect(roundResult('rock', 'rock')).toBe('draw');
  });

  it('rock beats scissors', () => {
    expect(roundResult('rock', 'scissors')).toBe('win');
    expect(roundResult('scissors', 'rock')).toBe('lose');
  });

  it('paper beats rock', () => {
    expect(roundResult('paper', 'rock')).toBe('win');
  });

  it('scissors beats paper', () => {
    expect(roundResult('scissors', 'paper')).toBe('win');
  });
});

describe('matchWinner', () => {
  it('requires score >= 3 and lead of 2', () => {
    expect(matchWinner(3, 1)).toBe('user');
    expect(matchWinner(3, 2)).toBe(null);
    expect(matchWinner(2, 0)).toBe(null);
    expect(matchWinner(1, 3)).toBe('computer');
    expect(matchWinner(4, 2)).toBe('user');
  });
});
