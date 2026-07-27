"""Unit tests for pure terminal game logic (run: python -m pytest test_logic.py)."""

from __future__ import annotations

import unittest

from logic import (
    flood_reveal,
    match_winner,
    rps_round_winner,
    score_mastermind,
    ship_start_range,
    unique_ship_tokens,
)


class TestMastermind(unittest.TestCase):
    def test_all_exact(self):
        self.assertEqual(score_mastermind(list("1234"), list("1234")), (4, 0))

    def test_all_partial(self):
        self.assertEqual(score_mastermind(list("1234"), list("4321")), (0, 4))

    def test_duplicates(self):
        self.assertEqual(score_mastermind(list("1234"), list("1111")), (1, 0))

    def test_mixed(self):
        self.assertEqual(score_mastermind(list("1122"), list("1212")), (2, 2))


class TestShipTokens(unittest.TestCase):
    def test_carrier_cruiser_unique(self):
        names = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"]
        tokens = unique_ship_tokens(names)
        self.assertEqual(len(tokens), len(set(tokens.values())))
        self.assertNotEqual(tokens["Carrier"], tokens["Cruiser"])
        # reverse lookup must be unambiguous
        reverse = {v: k for k, v in tokens.items()}
        self.assertEqual(len(reverse), len(names))


class TestShipStartRange(unittest.TestCase):
    def test_carrier_on_10(self):
        self.assertEqual(ship_start_range(10, 5), 6)  # indices 0..5


class TestFloodReveal(unittest.TestCase):
    def test_opens_zero_region(self):
        board = [
            ["0", "0", "1"],
            ["0", "1", "*"],
            ["1", "*", "2"],
        ]
        revealed = [[False] * 3 for _ in range(3)]
        flood_reveal(board, revealed, 0, 0)
        self.assertTrue(revealed[0][0])
        self.assertTrue(revealed[0][1])
        self.assertTrue(revealed[1][0])
        self.assertTrue(revealed[0][2])  # border number
        self.assertTrue(revealed[1][1])
        self.assertFalse(revealed[1][2])  # mine
        self.assertFalse(revealed[2][1])


class TestRps(unittest.TestCase):
    def test_round(self):
        self.assertEqual(rps_round_winner("rock", "scissors"), "player")
        self.assertEqual(rps_round_winner("rock", "rock"), "draw")
        self.assertEqual(rps_round_winner("rock", "paper"), "computer")

    def test_match(self):
        self.assertEqual(match_winner(3, 1), "user")
        self.assertIsNone(match_winner(3, 2))
        self.assertEqual(match_winner(1, 3), "computer")


if __name__ == "__main__":
    unittest.main()
