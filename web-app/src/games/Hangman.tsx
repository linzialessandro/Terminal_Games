import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import { ArrowLeft, RefreshCw, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { applyGuess } from '../lib/hangman';

const HangmanDrawing = ({ attempts }: { attempts: number }) => {
    return (
        <div className="relative w-64 h-64 flex justify-center bg-white/5 rounded-xl border border-white/10" aria-hidden>
            <div className="absolute bottom-4 w-48 h-2 bg-white/30" />
            <div className="absolute bottom-4 left-1/2 -translate-x-12 w-2 h-56 bg-white/30" />
            <div className="absolute top-8 left-1/2 -translate-x-12 w-32 h-2 bg-white/30" />
            <div className="absolute top-8 right-12 w-2 h-8 bg-white/30" />

            {attempts < 6 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-16 right-[38px] w-10 h-10 rounded-full border-4 border-white" />
            )}
            {attempts < 5 && (
                <motion.div initial={{ height: 0 }} animate={{ height: 64 }} className="absolute top-24 right-[54px] w-1 h-16 bg-white" />
            )}
            {attempts < 4 && (
                <motion.div initial={{ rotate: -45, scale: 0 }} animate={{ rotate: -45, scale: 1 }} className="absolute top-32 right-[60px] w-1 h-12 bg-white origin-top-left" />
            )}
            {attempts < 3 && (
                <motion.div initial={{ rotate: 45, scale: 0 }} animate={{ rotate: 45, scale: 1 }} className="absolute top-32 right-[48px] w-1 h-12 bg-white origin-top-right" />
            )}
            {attempts < 2 && (
                <motion.div initial={{ rotate: -45, scale: 0 }} animate={{ rotate: -45, scale: 1 }} className="absolute top-40 right-[60px] w-1 h-12 bg-white origin-top-left" />
            )}
            {attempts < 1 && (
                <motion.div initial={{ rotate: 45, scale: 0 }} animate={{ rotate: 45, scale: 1 }} className="absolute top-40 right-[48px] w-1 h-12 bg-white origin-top-right" />
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
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between w-full mb-8">
                <Link
                    to="/"
                    className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                    aria-label="Back to home"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-500">
                    Hangman
                </h2>
                <button
                    onClick={() => setShowRules(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                    aria-label="Show rules"
                >
                    <Info className="w-6 h-6" />
                </button>
            </div>

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Hangman"
                gameType="skill"
                rules={rules}
            />

            <div className="flex flex-col md:flex-row w-full gap-8">
                <div className="flex-1 glass-panel p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
                    <HangmanDrawing attempts={attempts} />

                    <div className="flex flex-wrap justify-center gap-2 mb-8 mt-8" aria-label="Word progress">
                        {word.split('').map((char, i) => (
                            <div key={i} className="w-10 h-12 border-b-2 border-white/50 flex items-center justify-center text-3xl font-mono uppercase">
                                {gameState === 'lost' || guessedLetters.has(char) ? (
                                    <span className={gameState === 'lost' && !guessedLetters.has(char) ? 'text-red-400' : ''}>{char}</span>
                                ) : (
                                    ''
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="h-8 text-center bg-transparent" role="status">
                        {gameState === 'won' && <p className="text-green-400 text-xl font-bold animate-pulse">You Won!</p>}
                        {gameState === 'lost' && <p className="text-red-400 text-xl font-bold">Game Over! Word was: {word}</p>}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white/70 uppercase text-sm tracking-wider">Attempts Left</h3>
                            <span className={`text-2xl font-bold ${attempts < 3 ? 'text-red-400' : 'text-green-400'}`}>{attempts}</span>
                        </div>
                        <button
                            onClick={startNewGame}
                            className="glass-button w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                        >
                            <RefreshCw size={20} />
                            New Game
                        </button>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-wrap gap-2 justify-center" role="group" aria-label="Letter keyboard">
                        {keyboard.map((char) => {
                            const status = guessedLetters.has(char)
                                ? word.includes(char)
                                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                    : 'bg-white/5 text-white/20 border-transparent'
                                : 'hover:bg-white/10 border-white/10 cursor-pointer';

                            return (
                                <button
                                    key={char}
                                    type="button"
                                    onClick={() => handleGuess(char)}
                                    disabled={guessedLetters.has(char) || gameState !== 'playing'}
                                    className={`w-10 h-10 rounded-lg border font-mono text-lg uppercase transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${status}`}
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
