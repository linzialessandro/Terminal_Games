"""Pure game helpers shared by the terminal UI and tests."""

from __future__ import annotations

from typing import Dict, List, Sequence, Tuple


def score_mastermind(secret: Sequence[str], guess: Sequence[str]) -> Tuple[int, int]:
    """Return (exact, partial) matches for Mastermind."""
    if len(secret) != len(guess):
        raise ValueError("secret and guess must be the same length")

    exact = 0
    secret_counts: Dict[str, int] = {}
    guess_counts: Dict[str, int] = {}

    for s, g in zip(secret, guess):
        if s == g:
            exact += 1
        else:
            secret_counts[s] = secret_counts.get(s, 0) + 1
            guess_counts[g] = guess_counts.get(g, 0) + 1

    partial = 0
    for digit, count in guess_counts.items():
        if digit in secret_counts:
            partial += min(count, secret_counts[digit])
    return exact, partial


def ship_start_range(board_size: int, ship_length: int) -> int:
    """Number of valid start indices for a ship of given length."""
    return board_size - ship_length + 1


def unique_ship_tokens(ship_names: Sequence[str]) -> Dict[str, str]:
    """
    Map ship names to unique board tokens.
    Prefer first letter; on collision use first two letters, etc.
    """
    tokens: Dict[str, str] = {}
    used = set()
    for name in ship_names:
        token = None
        for n in range(1, len(name) + 1):
            candidate = name[:n]
            if candidate not in used:
                token = candidate
                break
        if token is None:
            token = name
        tokens[name] = token
        used.add(token)
    return tokens


def flood_reveal(
    board: List[List[str]],
    revealed: List[List[bool]],
    start_row: int,
    start_col: int,
) -> None:
    """In-place flood fill reveal for zero-count cells (and their border numbers)."""
    size = len(board)
    stack = [(start_row, start_col)]
    while stack:
        r, c = stack.pop()
        if not (0 <= r < size and 0 <= c < size):
            continue
        if revealed[r][c]:
            continue
        if board[r][c] == "*":
            continue
        revealed[r][c] = True
        if board[r][c] == "0":
            for i in range(-1, 2):
                for j in range(-1, 2):
                    if i == 0 and j == 0:
                        continue
                    stack.append((r + i, c + j))


def rps_round_winner(player: str, computer: str) -> str:
    """Return 'draw', 'player', or 'computer'."""
    if player == computer:
        return "draw"
    wins = {
        ("rock", "scissors"),
        ("scissors", "paper"),
        ("paper", "rock"),
    }
    if (player, computer) in wins:
        return "player"
    return "computer"


def match_winner(user_score: int, computer_score: int) -> str | None:
    """First to >=3 with a lead of 2. Returns 'user', 'computer', or None."""
    if user_score >= 3 and user_score >= computer_score + 2:
        return "user"
    if computer_score >= 3 and computer_score >= user_score + 2:
        return "computer"
    return None
