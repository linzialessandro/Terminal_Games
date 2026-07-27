export type Choice = 'rock' | 'paper' | 'scissors';
export type RoundResult = 'win' | 'lose' | 'draw';
export type MatchWinner = 'user' | 'computer' | null;

export function roundResult(player: Choice, computer: Choice): RoundResult {
  if (player === computer) return 'draw';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'scissors' && computer === 'paper') ||
    (player === 'paper' && computer === 'rock')
  ) {
    return 'win';
  }
  return 'lose';
}

/** Best-of style: first to ≥3 with a 2-point lead. */
export function matchWinner(userScore: number, computerScore: number): MatchWinner {
  if (userScore >= 3 && userScore >= computerScore + 2) return 'user';
  if (computerScore >= 3 && computerScore >= userScore + 2) return 'computer';
  return null;
}
