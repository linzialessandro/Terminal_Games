export function applyGuess(
  word: string,
  guessedLetters: ReadonlySet<string>,
  char: string,
  attempts: number
): {
  guessedLetters: Set<string>;
  attempts: number;
  gameState: 'playing' | 'won' | 'lost';
} {
  const upper = char.toUpperCase();
  if (guessedLetters.has(upper) || !/^[A-Z]$/.test(upper)) {
    return {
      guessedLetters: new Set(guessedLetters),
      attempts,
      gameState: 'playing',
    };
  }

  const next = new Set(guessedLetters);
  next.add(upper);

  if (!word.includes(upper)) {
    const newAttempts = attempts - 1;
    return {
      guessedLetters: next,
      attempts: newAttempts,
      gameState: newAttempts === 0 ? 'lost' : 'playing',
    };
  }

  const isWon = word.split('').every((c) => next.has(c));
  return {
    guessedLetters: next,
    attempts,
    gameState: isWon ? 'won' : 'playing',
  };
}
