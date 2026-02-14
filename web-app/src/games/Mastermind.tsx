
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import { ArrowLeft, RefreshCw, KeyRound, CheckCircle2, Circle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mastermind: React.FC = () => {
    const [secretCode, setSecretCode] = useState<string>('');
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState(10);
    const [history, setHistory] = useState<{ guess: string; exact: number; partial: number }[]>([]);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [showRules, setShowRules] = useState(false);

    const startNewGame = useCallback(() => {
        const code = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
        setSecretCode(code);
        setGuess('');
        setAttempts(10);
        setHistory([]);
        setGameState('playing');
    }, []);

    // ... (rest of logic remains same, just render GameRulesModal)

    useEffect(() => {
        // eslint-disable-next-line
        startNewGame();
    }, [startNewGame]);

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (guess.length !== 4 || gameState !== 'playing') return;

        let exact = 0;
        let partial = 0;

        const secretCounts: Record<string, number> = {};
        const guessCounts: Record<string, number> = {};

        for (const char of secretCode) secretCounts[char] = (secretCounts[char] || 0) + 1;
        for (const char of guess) guessCounts[char] = (guessCounts[char] || 0) + 1;

        for (let i = 0; i < 4; i++) {
            if (guess[i] === secretCode[i]) {
                exact++;
            }
        }

        let totalCommon = 0;
        for (const char in guessCounts) {
            if (secretCounts[char]) {
                totalCommon += Math.min(guessCounts[char], secretCounts[char]);
            }
        }

        partial = totalCommon - exact;

        const newHistory = [{ guess, exact, partial }, ...history];
        setHistory(newHistory);

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
        "A 4-digit secret code (0-9) is generated.",
        "Your goal is to guess the code within 10 attempts.",
        "Green Check: Correct number in the correct position.",
        "White Circle: Correct number but wrong position.",
        "Use logic to deduce the code!"
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto h-full overflow-hidden">
            <div className="flex items-center justify-between w-full mb-6">
                <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                    Mastermind
                </h2>
                <button
                    onClick={() => setShowRules(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-yellow-500"
                >
                    <Info className="w-6 h-6" />
                </button>
            </div>

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Mastermind"
                gameType="logic"
                rules={rules}
            />

            <div className="glass-panel w-full flex-1 flex flex-col p-6 rounded-2xl overflow-hidden">

                {/* Status Header */}
                <div className="flex justify-between items-center mb-6 bg-white/5 p-4 rounded-xl">
                    <div className="flex flex-col">
                        <span className="text-sm text-white/50 uppercase">Attempts Left</span>
                        <span className={`text - 2xl font - mono font - bold ${attempts < 4 ? 'text-red-400' : 'text-yellow-400'} `}>
                            {attempts}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-white/50 uppercase">Status</span>
                        <span className={`text - lg font - bold ${gameState === 'playing' ? 'text-white' :
                            gameState === 'won' ? 'text-green-400' : 'text-red-400'
                            } `}>
                            {gameState === 'playing' ? 'Crack the Code' : gameState === 'won' ? 'UNLOCKED!' : 'FAILED'}
                        </span>
                    </div>
                </div>

                {/* Secret Code Reveal */}
                <div className="flex justify-center mb-6 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-12 h-16 bg-black/40 border border-white/10 rounded-lg flex items-center justify-center text-3xl font-mono font-bold text-yellow-500">
                            {gameState !== 'playing' ? secretCode[i] : '?'}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                {gameState === 'playing' ? (
                    <form onSubmit={handleGuess} className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                value={guess}
                                onChange={handleInputChange}
                                placeholder="Enter 4 digits (0-9)"
                                className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-xl font-mono tracking-widest focus:outline-none focus:border-yellow-500/50 transition-colors"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={guess.length !== 4}
                            className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            GUESS
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={startNewGame}
                        className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 transition-colors"
                    >
                        <RefreshCw /> Play Again
                    </button>
                )}

                {/* History List */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    <AnimatePresence>
                        {history.map((record, idx) => (
                            <motion.div
                                key={attempts + idx} // Unique key based on attempts remaining or index
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-between items-center bg-white/5 p-4 rounded-xl mb-2 border border-white/5"
                            >
                                <div className="font-mono text-2xl tracking-[0.5em] text-white/90">
                                    {record.guess}
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <div className="flex items-center gap-1 text-green-400" title="Correct Number & Position">
                                        <CheckCircle2 size={16} />
                                        <span className="font-bold">{record.exact}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white/50" title="Correct Number, Wrong Position">
                                        <Circle size={16} />
                                        <span className="font-bold">{record.partial}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {history.length === 0 && (
                        <div className="text-center text-white/20 mt-10 italic">
                            Attempts will appear here...
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Mastermind;
