import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import GameHeader from '../components/GameHeader';
import { RefreshCw, KeyRound, CheckCircle2, Circle } from 'lucide-react';
import { generateCode, scoreGuess } from '../lib/mastermind';

const Mastermind: React.FC = () => {
    const [secretCode, setSecretCode] = useState(() => generateCode(4));
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState(10);
    const [history, setHistory] = useState<{ id: string; guess: string; exact: number; partial: number }[]>([]);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [showRules, setShowRules] = useState(false);

    const startNewGame = useCallback(() => {
        setSecretCode(generateCode(4));
        setGuess('');
        setAttempts(10);
        setHistory([]);
        setGameState('playing');
    }, []);

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (guess.length !== 4 || gameState !== 'playing') return;

        const { exact, partial } = scoreGuess(secretCode, guess);
        const entry = {
            id: `${Date.now()}-${guess}-${history.length}`,
            guess,
            exact,
            partial,
        };
        setHistory([entry, ...history]);

        if (exact === 4) {
            setGameState('won');
        } else {
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);
            if (newAttempts === 0) setGameState('lost');
        }
        setGuess('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.length <= 4 && /^\d*$/.test(val)) {
            setGuess(val);
        }
    };

    const rules = [
        'A 4-digit secret code (0-9) is generated.',
        'Your goal is to guess the code within 10 attempts.',
        'Green check: correct number in the correct position.',
        'White circle: correct number but wrong position.',
        'Use logic to deduce the code!',
    ];

    return (
        <div className="mx-auto flex h-full w-full max-w-2xl flex-col overflow-hidden">
            <GameHeader
                title="Mastermind"
                accentClassName="from-amber-400 to-orange-500"
                onShowRules={() => setShowRules(true)}
            />

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Mastermind"
                gameType="logic"
                rules={rules}
            />

            <div className="glass-panel flex w-full flex-1 flex-col overflow-hidden rounded-2xl p-5 sm:p-6">
                <div className="mb-6 flex items-center justify-between rounded-xl surface-inset p-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Attempts left
                        </span>
                        <span
                            className={`font-mono text-2xl font-bold ${
                                attempts < 4 ? 'text-rose-400' : 'text-amber-400'
                            }`}
                        >
                            {attempts}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Status
                        </span>
                        <span
                            className={`text-base font-bold ${
                                gameState === 'playing'
                                    ? 'text-foreground'
                                    : gameState === 'won'
                                      ? 'text-emerald-400'
                                      : 'text-rose-400'
                            }`}
                        >
                            {gameState === 'playing' ? 'Crack the code' : gameState === 'won' ? 'Unlocked!' : 'Failed'}
                        </span>
                    </div>
                </div>

                <div className="mb-6 flex justify-center gap-3" aria-label="Secret code">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex h-16 w-12 items-center justify-center rounded-xl surface-inset font-mono text-3xl font-bold text-amber-400"
                        >
                            {gameState !== 'playing' ? secretCode[i] : '?'}
                        </div>
                    ))}
                </div>

                {gameState === 'playing' ? (
                    <form onSubmit={handleGuess} className="mb-6 flex gap-3">
                        <div className="relative flex-1">
                            <KeyRound
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                                aria-hidden
                            />
                            <input
                                type="text"
                                inputMode="numeric"
                                value={guess}
                                onChange={handleInputChange}
                                placeholder="4 digits (0–9)"
                                aria-label="Four digit guess"
                                className="w-full rounded-xl surface-inset py-4 pl-12 pr-4 font-mono text-xl tracking-widest text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={guess.length !== 4}
                            className="btn-primary rounded-xl px-6 font-bold disabled:opacity-50 sm:px-8"
                        >
                            Guess
                        </button>
                    </form>
                ) : (
                    <button
                        type="button"
                        onClick={startNewGame}
                        className="glass-button mb-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                        <RefreshCw size={18} aria-hidden /> Play Again
                    </button>
                )}

                <div className="flex-1 overflow-y-auto pr-1">
                    <AnimatePresence>
                        {history.map((record) => (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-2 flex items-center justify-between rounded-xl surface-inset p-4"
                            >
                                <div className="font-mono text-2xl tracking-[0.4em] text-foreground/90">
                                    {record.guess}
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <div
                                        className="flex items-center gap-1 text-emerald-400"
                                        title="Correct number & position"
                                    >
                                        <CheckCircle2 size={16} aria-hidden />
                                        <span className="font-bold font-mono">{record.exact}</span>
                                    </div>
                                    <div
                                        className="flex items-center gap-1 text-muted-foreground"
                                        title="Correct number, wrong position"
                                    >
                                        <Circle size={16} aria-hidden />
                                        <span className="font-bold font-mono">{record.partial}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {history.length === 0 && (
                        <div className="mt-10 text-center text-sm italic text-muted-foreground/50">
                            Attempts will appear here…
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Mastermind;
