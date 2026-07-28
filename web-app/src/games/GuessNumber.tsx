import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import GameHeader from '../components/GameHeader';
import { RefreshCw, Trophy } from 'lucide-react';

const randomInRange = (max: number) => Math.floor(Math.random() * max) + 1;

const GuessNumber: React.FC = () => {
    const [difficulty, setDifficulty] = useState<number | null>(null);
    const [target, setTarget] = useState<number | null>(null);
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [history, setHistory] = useState<{ value: number; result: string }[]>([]);
    const [showRules, setShowRules] = useState(false);

    const startGame = (level: number) => {
        let max = 50;
        if (level === 2) max = 100;
        if (level === 3) max = 200;

        setDifficulty(level);
        setTarget(randomInRange(max));
        setMessage(`I'm thinking of a number between 1 and ${max}.`);
        setAttempts(0);
        setGameOver(false);
        setHistory([]);
        setGuess('');
    };

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guess || !target || gameOver) return;

        const num = parseInt(guess);
        if (isNaN(num)) return;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        let result = '';
        if (num < target) {
            result = 'Too low!';
            setMessage('Too low! Try again.');
        } else if (num > target) {
            result = 'Too high!';
            setMessage('Too high! Try again.');
        } else {
            result = 'Correct!';
            setMessage(`Correct! The number was ${target}.`);
            setGameOver(true);
        }

        setHistory([{ value: num, result }, ...history]);
        setGuess('');
    };

    const resetGame = () => {
        setDifficulty(null);
        setTarget(null);
        setMessage('');
        setAttempts(0);
        setGameOver(false);
        setHistory([]);
    };

    const rules = [
        'Select a difficulty level to determine the range of numbers.',
        'Enter your guess in the input field.',
        'I will tell you if your guess is too high or too low.',
        'Keep guessing until you find the secret number!',
        'Try to guess it in as few attempts as possible.',
    ];

    const difficulties = [
        { level: 1, label: 'Easy', range: '1 – 50', color: 'text-sky-400', hover: 'hover:ring-sky-400/40' },
        { level: 2, label: 'Medium', range: '1 – 100', color: 'text-violet-400', hover: 'hover:ring-violet-400/40' },
        { level: 3, label: 'Hard', range: '1 – 200', color: 'text-rose-400', hover: 'hover:ring-rose-400/40' },
    ];

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col">
            <GameHeader
                title="Guess the Number"
                accentClassName="from-sky-400 to-violet-500"
                onShowRules={() => setShowRules(true)}
            />

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Guess the Number"
                gameType="logic"
                rules={rules}
            />

            {!difficulty ? (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex w-full flex-col gap-3"
                >
                    <p className="mb-2 text-center text-sm text-muted-foreground">Select difficulty</p>
                    {difficulties.map((d) => (
                        <button
                            key={d.level}
                            type="button"
                            onClick={() => startGame(d.level)}
                            className={`glass-button rounded-2xl p-5 text-left ring-1 ring-white/[0.04] transition-all duration-200 ease-cinema ${d.hover}`}
                        >
                            <div className={`text-lg font-semibold ${d.color}`}>{d.label}</div>
                            <div className="mt-0.5 text-sm text-muted-foreground">Range: {d.range}</div>
                        </button>
                    ))}
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full flex-col items-center">
                    <div className="glass-panel mb-6 w-full rounded-2xl p-6 text-center">
                        <p className="text-lg text-foreground/90">{message}</p>
                        {gameOver && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mt-5 flex flex-col items-center text-amber-400"
                            >
                                <Trophy size={44} className="mb-2" aria-hidden />
                                <p className="font-semibold text-foreground">
                                    You won in <span className="font-mono text-amber-400">{attempts}</span> attempts!
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {!gameOver && (
                        <form onSubmit={handleGuess} className="mb-8 flex w-full max-w-md gap-2">
                            <label className="sr-only" htmlFor="guess-input">
                                Your guess
                            </label>
                            <input
                                id="guess-input"
                                type="number"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                placeholder="Enter your guess…"
                                className="surface-inset flex-1 rounded-xl px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                autoFocus
                            />
                            <button type="submit" className="btn-primary rounded-xl px-6 py-3 text-sm">
                                Guess
                            </button>
                        </form>
                    )}

                    {gameOver && (
                        <button
                            type="button"
                            onClick={resetGame}
                            className="glass-button mb-8 flex items-center gap-2 rounded-xl px-6 py-3"
                        >
                            <RefreshCw size={18} aria-hidden />
                            Play Again
                        </button>
                    )}

                    <div className="w-full max-w-md">
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            History
                        </h3>
                        <div className="flex flex-col gap-2">
                            <AnimatePresence>
                                {history.map((item, index) => (
                                    <motion.div
                                        key={`${item.value}-${index}`}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center justify-between rounded-xl surface-inset px-4 py-3"
                                    >
                                        <span className="font-mono text-lg">{item.value}</span>
                                        <span
                                            className={`text-sm font-medium ${
                                                item.result.includes('low')
                                                    ? 'text-sky-400'
                                                    : item.result.includes('high')
                                                      ? 'text-rose-400'
                                                      : 'text-emerald-400'
                                            }`}
                                        >
                                            {item.result}
                                        </span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default GuessNumber;
