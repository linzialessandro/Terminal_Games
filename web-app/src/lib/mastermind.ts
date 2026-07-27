/**
 * Score a Mastermind guess against a secret code.
 * Exact = correct digit in correct position.
 * Partial = correct digit in wrong position (multiset, excluding exact matches).
 */
export function scoreGuess(secret: string, guess: string): { exact: number; partial: number } {
  if (secret.length !== guess.length) {
    throw new Error('Secret and guess must be the same length');
  }

  let exact = 0;
  const secretCounts: Record<string, number> = {};
  const guessCounts: Record<string, number> = {};

  for (let i = 0; i < secret.length; i++) {
    if (guess[i] === secret[i]) {
      exact++;
    } else {
      secretCounts[secret[i]] = (secretCounts[secret[i]] || 0) + 1;
      guessCounts[guess[i]] = (guessCounts[guess[i]] || 0) + 1;
    }
  }

  let partial = 0;
  for (const char of Object.keys(guessCounts)) {
    if (secretCounts[char]) {
      partial += Math.min(guessCounts[char], secretCounts[char]);
    }
  }

  return { exact, partial };
}

export function generateCode(length = 4, digitMax = 10, rng: () => number = Math.random): string {
  return Array.from({ length }, () => Math.floor(rng() * digitMax)).join('');
}
