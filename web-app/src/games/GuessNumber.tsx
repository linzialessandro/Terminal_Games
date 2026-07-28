import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import { RefreshCw, ArrowLeft, Trophy, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        setTarget(Math.floor(Math.random() * max) + 1);
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
        "Select a difficulty level to determine the range of numbers.",
        "Enter your guess in the input field.",
        "I will tell you if your guess is too high or too low.",
        "Keep guessing until you find the secret number!",
        "Try to guess it in as few attempts as possible."
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between w-full mb-8">
                <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Guess the Number
                </h2>
                <button
                    onClick={() => setShowRules(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-blue-300"
                >
                    <Info className="w-6 h-6" />
                </button>
            </div>

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Guess the Number"
                gameType="logic"
                rules={rules}
            />

            {!difficulty ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 w-full"
                >
                    <p className="text-center text-lg mb-4 text-white/80">Select Difficulty Level</p>
                    <button onClick={() => startGame(1)} className="glass-button p-4 rounded-xl text-left hover:border-blue-400/50">
                        <div className="font-bold text-lg text-blue-400">Easy</div>
                        <div className="text-sm opacity-60">Range: 1 - 50</div>
                    </button>
                    <button onClick={() => startGame(2)} className="glass-button p-4 rounded-xl text-left hover:border-purple-400/50">
                        <div className="font-bold text-lg text-purple-400">Medium</div>
                        <div className="text-sm opacity-60">Range: 1 - 100</div>
                    </button>
                    <button onClick={() => startGame(3)} className="glass-button p-4 rounded-xl text-left hover:border-pink-400/50">
                        <div className="font-bold text-lg text-pink-400">Hard</div>
                        <div className="text-sm opacity-60">Range: 1 - 200</div>
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full flex flex-col items-center"
                >
                    <div className="glass-panel p-6 rounded-2xl w-full mb-6 text-center">
                        <p className="text-xl mb-2">{message}</p>
                        {gameOver && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex flex-col items-center mt-4 text-yellow-400"
                            >
                                <Trophy size={48} className="mb-2" />
                                <p className="font-bold">You won in {attempts} attempts!</p>
                            </motion.div>
                        )}
                    </div>

                    {!gameOver && (
                        <form onSubmit={handleGuess} className="flex gap-2 w-full max-w-md mb-8">
                            <input
                                type="number"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                placeholder="Enter your guess..."
                                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Guess
                            </button>
                        </form>
                    )}

                    {gameOver && (
                        <button
                            onClick={resetGame}
                            className="glass-button flex items-center gap-2 px-6 py-3 rounded-xl mb-8"
                        >
                            <RefreshCw size={20} />
                            Play Again
                        </button>
                    )}

                    <div className="w-full max-w-md">
                        <h3 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">History</h3>
                        <div className="flex flex-col gap-2">
                            <AnimatePresence>
                                {history.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5"
                                    >
                                        <span className="font-mono text-lg">{item.value}</span>
                                        <span className={`text-sm ${item.result.includes('low') ? 'text-blue-400' :
                                            item.result.includes('high') ? 'text-red-400' :
                                                'text-green-400'
                                            }`}>{item.result}</span>
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
