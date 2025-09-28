import random

def guess_numbers_game():
    """Function to run the guessing game."""
    print("\n--- Guess the Number ---")
    while True:
        print("\nChoose a difficulty level:")
        print("1: Easy (1-50)")
        print("2: Medium (1-100)")
        print("3: Hard (1-200)")
        print("m: Back to Main Menu")

        choice = input("Enter your choice (or 'm' for main menu, 'q' to quit): ")

        if choice.lower() == 'm':
            return
        if choice.lower() == 'q':
            print("Thanks for playing!")
            exit()

        if choice not in ['1', '2', '3']:
            print("Invalid choice. Please try again.")
            continue

        if choice == '1':
            max_number = 50
        elif choice == '2':
            max_number = 100
        else:
            max_number = 200

        secret_number = random.randint(1, max_number)
        attempts = 0
        guess = None

        print(f"\nI'm thinking of a number between 1 and {max_number}.")

        while guess != secret_number:
            try:
                guess_input = input("Enter your guess (or 'm' for main menu, 'q' to quit): ")
                if guess_input.lower() == 'm':
                    return
                if guess_input.lower() == 'q':
                    print("Thanks for playing!")
                    exit()

                guess = int(guess_input)
                attempts += 1

                if guess < secret_number:
                    print("Too low!")
                elif guess > secret_number:
                    print("Too high!")
                else:
                    print(f"You guessed in {attempts} attempts. Congratulations!")
            except ValueError:
                print("Invalid input. Please enter a number.")
        
        if guess == secret_number:
            break

def roll_dice_game():
    """Function to run the Roll Dice game."""
    print("\n--- Roll the Dice ---")
    while True:
        num_dice_choice = input("Roll 1, 2, or 3 dice? (or 'm' for main menu, 'q' to quit): ")
        if num_dice_choice.lower() == 'm':
            return
        if num_dice_choice.lower() == 'q':
            print("Thanks for playing!")
            exit()
        
        if num_dice_choice not in ['1', '2', '3']:
            print("Invalid choice. Please enter 1, 2, or 3.")
            continue

        num_dice = int(num_dice_choice)
        
        while True:
            secret_dice = [random.randint(1, 6) for _ in range(num_dice)]
            secret_roll = sum(secret_dice)
            
            input("Press Enter to roll your dice...")
            
            user_dice = [random.randint(1, 6) for _ in range(num_dice)]
            user_roll = sum(user_dice)
            
            print(f"\nYour roll: {user_roll} {user_dice}")
            print(f"Secret roll: {secret_roll} {secret_dice}")
            
            if user_roll == secret_roll:
                print("Congratulations! You matched the secret roll!")
            else:
                print("You didn't match.")

            play_again_input = input("Try again with a new secret roll? (yes/no, 'm' for main menu, or 'q' to quit): ")
            if play_again_input.lower() in ['n', 'no', 'm']:
                break
            if play_again_input.lower() == 'q':
                print("Thanks for playing!")
                exit()
            if play_again_input.lower() not in ['y', 'yes']:
                break
        
        break

def hangman_game():
    """Function to run the Hangman game."""
    print("\n--- Hangman ---")

    words = ["python", "developer", "gemini", "code", "challenge", "programming", "computer", "algorithm", "software", "engineer"]
    word = random.choice(words)
    guessed_letters = []
    attempts = 6

    while attempts > 0:
        display_word = ""
        for letter in word:
            if letter in guessed_letters:
                display_word += letter
            else:
                display_word += "_"

        print(f"\nWord: {display_word}")
        print(f"Attempts left: {attempts}")
        print(f"Guessed letters: {', '.join(guessed_letters)}")

        if display_word == word:
            print(f"Congratulations! You guessed the word: {word}")
            break

        guess_input = input("Guess a letter: ")
        
         
        guess = guess_input.lower()

        if len(guess) != 1 or not guess.isalpha():
            print("Invalid input. Please enter a single letter.")
            continue

        if guess in guessed_letters:
            print("You already guessed that letter.")
            continue

        guessed_letters.append(guess)

        if guess not in word:
            attempts -= 1
            print("Incorrect guess.")
            if attempts == 0:
                print(f"You ran out of attempts. The word was: {word}")

def mastermind_game():
    """Function to run the Mastermind game."""
    print("\n--- Mastermind ---")
    secret_code = [str(random.randint(0, 9)) for _ in range(4)]
    attempts = 10

    print("I have generated a 4-digit code. Each digit is between 0 and 9.")
    print(f"You have {attempts} attempts to guess it.")

    while attempts > 0:
        try:
            guess_str = input(f"\nAttempt {11 - attempts}/10 | Enter your 4-digit guess (or 'm' for main menu, 'q' to quit): ")
            if guess_str.lower() == 'm':
                return
            if guess_str.lower() == 'q':
                print("Thanks for playing!")
                exit()

            if len(guess_str) != 4 or not guess_str.isdigit():
                print("Invalid input. Please enter exactly 4 digits.")
                continue

            guess = list(guess_str)
            
            if guess == secret_code:
                print(f"Congratulations! You guessed the code: {''.join(secret_code)}")
                return

            exact_matches = sum(1 for i in range(4) if guess[i] == secret_code[i])
            
            secret_code_counts = {}
            guess_counts = {}
            
            for digit in secret_code:
                secret_code_counts[digit] = secret_code_counts.get(digit, 0) + 1
            
            for digit in guess:
                guess_counts[digit] = guess_counts.get(digit, 0) + 1

            common_digits = 0
            for digit, count in guess_counts.items():
                if digit in secret_code_counts:
                    common_digits += min(count, secret_code_counts[digit])
            
            partial_matches = common_digits - exact_matches

            print(f"Feedback: {exact_matches} exact matches, {partial_matches} partial matches.")
            
            attempts -= 1

        except Exception as e:
            print(f"An error occurred: {e}")

    print(f"\nSorry, you've run out of attempts. The secret code was: {''.join(secret_code)}")

def minesweeper_game():
    """Function to run the Minesweeper game."""
    print("\n--- Minesweeper ---")
    
    grid_size = 5
    num_mines = 5

    board = [['0' for _ in range(grid_size)] for _ in range(grid_size)]
    revealed = [[False for _ in range(grid_size)] for _ in range(grid_size)]

    mines_placed = 0
    while mines_placed < num_mines:
        row = random.randint(0, grid_size - 1)
        col = random.randint(0, grid_size - 1)
        if board[row][col] != '*':
            board[row][col] = '*'
            mines_placed += 1

    for r in range(grid_size):
        for c in range(grid_size):
            if board[r][c] == '*':
                continue
            count = 0
            for i in range(-1, 2):
                for j in range(-1, 2):
                    if 0 <= r + i < grid_size and 0 <= c + j < grid_size and board[r + i][c + j] == '*':
                        count += 1
            board[r][c] = str(count)

    def print_board(show_mines=False):
        print("\n  " + " ".join(str(i + 1) for i in range(grid_size)))
        for r in range(grid_size):
            print(str(r + 1), end=" ")
            for c in range(grid_size):
                if revealed[r][c] or show_mines:
                    print(board[r][c], end=" ")
                else:
                    print(".", end=" ")
            print()

    while True:
        print_board()
        
        revealed_count = sum(row.count(True) for row in revealed)
        print(f"[DEBUG] Revealed cells: {revealed_count} / {grid_size * grid_size - num_mines}")
        if revealed_count == grid_size * grid_size - num_mines:
            print_board(show_mines=True)
            print("\nCongratulations! You've cleared all the mines!")
            return

        try:
            move = input("Enter row and column (e.g., 1 2), or 'm' for main menu, 'q' to quit: ")
            if move.lower() == 'm':
                return
            if move.lower() == 'q':
                print("Thanks for playing!")
                exit()

            parts = move.split()
            if len(parts) != 2:
                print("Invalid input. Please enter row and column separated by a space.")
                continue

            row, col = int(parts[0]) - 1, int(parts[1]) - 1

            if not (0 <= row < grid_size and 0 <= col < grid_size):
                print("Coordinates out of range. Please enter numbers from 1 to 5.")
                continue

            if revealed[row][col]:
                print("This cell has already been revealed.")
                continue

            revealed[row][col] = True

            if board[row][col] == '*':
                print_board(show_mines=True)
                print("\nGame Over! You hit a mine.")
                return

        except (ValueError, IndexError):
            print("Invalid input. Please enter row and column numbers (e.g., 1 2).")

def rock_paper_scissors_game():
    """Function to run the Rock-Paper-Scissors game."""
    print("\n--- Rock, Paper, Scissors ---")

    while True:
        user_score = 0
        computer_score = 0

        while True:
            player_input = input("Choose Rock, Paper, or Scissors (or 'm' for main menu, 'q' to quit): ").lower()

            if player_input == 'm':
                return
            if player_input == 'q':
                print("Thanks for playing!")
                exit()

            if player_input in ['r', 'rock']:
                player_choice = 'rock'
            elif player_input in ['p', 'paper']:
                player_choice = 'paper'
            elif player_input in ['s', 'scissors']:
                player_choice = 'scissors'
            else:
                print("Invalid choice. Please try again.")
                continue

            computer_choice = random.choice(['rock', 'paper', 'scissors'])

            print(f"\nYour choice: {player_choice.capitalize()}")
            print(f"Computer's choice: {computer_choice.capitalize()}")

            if player_choice == computer_choice:
                print("It's a draw!")
            elif (player_choice == 'rock' and computer_choice == 'scissors') or \
                 (player_choice == 'scissors' and computer_choice == 'paper') or \
                 (player_choice == 'paper' and computer_choice == 'rock'):
                print("You win this round!")
                user_score += 1
            else:
                print("You lose this round!")
                computer_score += 1

            print(f"\nScore: You {user_score} - {computer_score} Computer")

            if user_score >= 3 and user_score >= computer_score + 2:
                print("\nCongratulations! You won the match!")
                break
            elif computer_score >= 3 and computer_score >= user_score + 2:
                print("\nSorry, you lost the match.")
                break

        play_again = input("\nPlay again? (yes/no): ").lower()
        if play_again in ['n', 'no']:
            break
        if play_again == 'q':
            print("Thanks for playing!")
            exit()
        if play_again not in ['y', 'yes']:
            break


def battleship_game():
    """Function to run the Battleship game."""
    print("\n--- Battleship ---")
    while True:
        play_battleship_round()
        play_again = input("Play again? (yes/no, 'm' for main menu, or 'q' to quit): ").lower()
        if play_again in ['n', 'no', 'm']:
            break
        if play_again == 'q':
            print("Thanks for playing!")
            exit()
        if play_again not in ['y', 'yes']:
            break

def play_battleship_round():
    """Plays a single round of Battleship."""
    BOARD_SIZE = 10
    SHIP_CONFIG = {"Carrier": 5, "Battleship": 4, "Cruiser": 3, "Submarine": 3, "Destroyer": 2}
    
    player_board = [['~' for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
    solution_board, ship_positions = place_ships_randomly(BOARD_SIZE, SHIP_CONFIG)
    
    hits = set()
    sunk_ships = {} 

    def print_board(board):
        print("\n  " + " ".join(chr(ord('A') + i) for i in range(BOARD_SIZE)))
        for r in range(BOARD_SIZE):
            print(f"{r+1:2d} " + " ".join(board[r]))

    while len(sunk_ships) < len(SHIP_CONFIG):
        print_board(player_board)
        guess_str = input("Enter your guess (e.g., A5) or 'm' for menu, 'q' to quit: ").upper()

        if guess_str == 'M':
            return
        if guess_str == 'Q':
            print("Thanks for playing!")
            exit()

        if len(guess_str) < 2 or not guess_str[0].isalpha() or not guess_str[1:].isdigit():
            print("Invalid format. Please use format like 'A5'.")
            continue

        col = ord(guess_str[0]) - ord('A')
        row = int(guess_str[1:]) - 1

        if not (0 <= row < BOARD_SIZE and 0 <= col < BOARD_SIZE):
            print("Coordinates are out of bounds.")
            continue

        if player_board[row][col] != '~':
            print("You've already guessed this location.")
            continue

        if solution_board[row][col] != '~':
            ship_initial = solution_board[row][col]
            ship_map = {name[0]: name for name in SHIP_CONFIG.keys()}
            ship_name = ship_map[ship_initial]
            
            print("HIT!")
            player_board[row][col] = 'X'
            hits.add((row, col))

            # Check if the ship is sunk
            ship_hit = True
            for r_ship, c_ship in ship_positions[ship_name]:
                if (r_ship, c_ship) not in hits:
                    ship_hit = False
                    break
            
            if ship_hit:
                print(f"You sunk the {ship_name}!")
                sunk_ships[ship_name] = True
        else:
            print("MISS!")
            player_board[row][col] = 'O'

    print("\nCongratulations! You've sunk all the enemy ships!")
    print_board(player_board)

def place_ships_randomly(board_size, ship_config):
    """Places ships on the board randomly."""
    board = [['~' for _ in range(board_size)] for _ in range(board_size)]
    ship_positions = {}

    for ship_name, ship_length in ship_config.items():
        placed = False
        while not placed:
            orientation = random.choice(['horizontal', 'vertical'])
            if orientation == 'horizontal':
                row = random.randint(0, board_size - 1)
                col = random.randint(0, board_size - ship_length)
            else:
                row = random.randint(0, board_size - ship_length)
                col = random.randint(0, board_size - 1)

            # Check for collisions
            collision = False
            ship_coords = []
            for i in range(ship_length):
                if orientation == 'horizontal':
                    if board[row][col + i] != '~':
                        collision = True
                        break
                    ship_coords.append((row, col + i))
                else:
                    if board[row + i][col] != '~':
                        collision = True
                        break
                    ship_coords.append((row + i, col))
            
            if not collision:
                ship_positions[ship_name] = []
                for r, c in ship_coords:
                    board[r][c] = ship_name[0]
                    ship_positions[ship_name].append((r, c))
                placed = True
    
    return board, ship_positions

def main():
    """Main function to run the game selection menu."""
    while True:
        print("\n--- Game Menu ---")
        print("1: Guess Numbers")
        print("2: Roll Dice")
        print("3: Hangman")
        print("4: Mastermind")
        print("5: Minesweeper")
        print("6: Rock, Paper, Scissors")
        print("7: Battleship")
        print("q: Quit")

        choice = input("Enter your choice: ")

        if choice == '1':
            guess_numbers_game()
        elif choice == '2':
            roll_dice_game()
        elif choice == '3':
            hangman_game()
        elif choice == '4':
            mastermind_game()
        elif choice == '5':
            minesweeper_game()
        elif choice == '6':
            rock_paper_scissors_game()
        elif choice == '7':
            battleship_game()
        elif choice.lower() == 'q':
            print("Thanks for playing!")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()