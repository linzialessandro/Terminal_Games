import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import GameHeader from '../components/GameHeader';
import { RefreshCw } from 'lucide-react';
import { applyGuess } from '../lib/hangman';

const HangmanDrawing = ({ attempts }: { attempts: number }) => {
    return (
        <div
            className="relative flex h-64 w-64 justify-center rounded-2xl surface-inset"
            aria-hidden
        >
            <div className="absolute bottom-4 h-2 w-48 bg-white/30" />
            <div className="absolute bottom-4 left-1/2 h-56 w-2 -translate-x-12 bg-white/30" />
            <div className="absolute top-8 left-1/2 h-2 w-32 -translate-x-12 bg-white/30" />
            <div className="absolute top-8 right-12 h-8 w-2 bg-white/30" />

            {attempts < 6 && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-16 right-[38px] h-10 w-10 rounded-full border-4 border-white"
                />
            )}
            {attempts < 5 && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 64 }}
                    className="absolute top-24 right-[54px] h-16 w-1 bg-white"
                />
            )}
            {attempts < 4 && (
                <motion.div
                    initial={{ rotate: -45, scale: 0 }}
                    animate={{ rotate: -45, scale: 1 }}
                    className="absolute top-32 right-[60px] h-12 w-1 origin-top-left bg-white"
                />
            )}
            {attempts < 3 && (
                <motion.div
                    initial={{ rotate: 45, scale: 0 }}
                    animate={{ rotate: 45, scale: 1 }}
                    className="absolute top-32 right-[48px] h-12 w-1 origin-top-right bg-white"
                />
            )}
            {attempts < 2 && (
                <motion.div
                    initial={{ rotate: -45, scale: 0 }}
                    animate={{ rotate: -45, scale: 1 }}
                    className="absolute top-40 right-[60px] h-12 w-1 origin-top-left bg-white"
                />
            )}
            {attempts < 1 && (
                <motion.div
                    initial={{ rotate: 45, scale: 0 }}
                    animate={{ rotate: 45, scale: 1 }}
                    className="absolute top-40 right-[48px] h-12 w-1 origin-top-right bg-white"
                />
            )}
        </div>
    );
};

const WORDS = ['REACT', 'TYPESCRIPT', 'TAILWIND', 'COMPONENT', 'DEVELOPER', 'INTERFACE', 'VARIABLE', 'FUNCTION'];

const randomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const Hangman: React.FC = () => {
    const [word, setWord] = useState(randomWord);
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(() => new Set());
    const [attempts, setAttempts] = useState(6);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [showRules, setShowRules] = useState(false);

    const startNewGame = useCallback(() => {
        setWord(randomWord());
        setGuessedLetters(new Set());
        setAttempts(6);
        setGameState('playing');
    }, []);

    const handleGuess = useCallback(
        (char: string) => {
            if (gameState !== 'playing') return;
            const result = applyGuess(word, guessedLetters, char, attempts);
            setGuessedLetters(result.guessedLetters);
            setAttempts(result.attempts);
            setGameState(result.gameState);
        },
        [gameState, word, guessedLetters, attempts]
    );

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
                handleGuess(e.key);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleGuess]);

    const rules = [
        'A secret word is chosen at random.',
        'Guess the word letter by letter.',
        'You can type on your keyboard or click the buttons on screen.',
        'Each wrong guess draws a part of the hangman.',
        'You have 6 attempts before the game ends!',
    ];

    const keyboard = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
            <GameHeader
                title="Hangman"
                accentClassName="from-emerald-400 to-cyan-500"
                onShowRules={() => setShowRules(true)}
            />

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Hangman"
                gameType="skill"
                rules={rules}
            />

            <div className="flex w-full flex-col gap-6 md:flex-row md:gap-8">
                <div className="glass-panel flex min-h-[400px] flex-1 flex-col items-center justify-center rounded-2xl p-6 sm:p-8">
                    <HangmanDrawing attempts={attempts} />

                    <div className="mb-6 mt-8 flex flex-wrap justify-center gap-2" aria-label="Word progress">
                        {word.split('').map((char, i) => (
                            <div
                                key={i}
                                className="flex h-12 w-9 items-center justify-center border-b-2 border-white/40 font-mono text-2xl uppercase sm:w-10 sm:text-3xl"
                            >
                                {gameState === 'lost' || guessedLetters.has(char) ? (
                                    <span
                                        className={
                                            gameState === 'lost' && !guessedLetters.has(char) ? 'text-rose-400' : ''
                                        }
                                    >
                                        {char}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="h-8 text-center" role="status">
                        {gameState === 'won' && (
                            <p className="text-xl font-bold text-emerald-400">You won!</p>
                        )}
                        {gameState === 'lost' && (
                            <p className="text-lg font-bold text-rose-400">
                                Game over — word was: <span className="font-mono">{word}</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-4">
                    <div className="glass-panel rounded-2xl p-5 sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Attempts left
                            </h3>
                            <span
                                className={`font-mono text-2xl font-bold ${
                                    attempts < 3 ? 'text-rose-400' : 'text-emerald-400'
                                }`}
                            >
                                {attempts}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={startNewGame}
                            className="glass-button flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        >
                            <RefreshCw size={18} aria-hidden />
                            New Game
                        </button>
                    </div>

                    <div
                        className="glass-panel flex flex-wrap justify-center gap-2 rounded-2xl p-5 sm:p-6"
                        role="group"
                        aria-label="Letter keyboard"
                    >
                        {keyboard.map((char) => {
                            const status = guessedLetters.has(char)
                                ? word.includes(char)
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                    : 'bg-white/5 text-white/25 border-transparent'
                                : 'hover:bg-white/10 border-white/10 cursor-pointer text-foreground';

                            return (
                                <button
                                    key={char}
                                    type="button"
                                    onClick={() => handleGuess(char)}
                                    disabled={guessedLetters.has(char) || gameState !== 'playing'}
                                    className={`h-11 w-10 rounded-lg border font-mono text-base uppercase transition-all duration-200 ease-cinema focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed sm:h-10 sm:w-10 ${status}`}
                                    aria-label={`Guess letter ${char}`}
                                >
                                    {char}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hangman;
