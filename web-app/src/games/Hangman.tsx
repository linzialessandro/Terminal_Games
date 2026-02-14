import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const WORDS = ["python", "developer", "gemini", "code", "challenge", "programming", "computer", "algorithm", "software", "engineer"];

const HangmanDrawing = ({ attempts }: { attempts: number }) => {
    return (
        <div className="relative w-64 h-64 border-b-4 border-white/20 mx-auto mb-8">
            {/* Base */}
            <div className="absolute bottom-0 left-12 w-4 h-60 bg-white/20 ml-20"></div>
            <div className="absolute top-4 left-32 w-40 h-4 bg-white/20"></div>
            <div className="absolute top-4 right-12 w-2 h-12 bg-white/20"></div>

            {/* Head */}
            {attempts < 6 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-16 right-8 w-10 h-10 rounded-full border-4 border-white"></motion.div>
            )}

            {/* Body */}
            {attempts < 5 && (
                <motion.div initial={{ height: 0 }} animate={{ height: 80 }} className="absolute top-24 right-[42px] w-2 bg-white"></motion.div>
            )}

            {/* Left Arm */}
            {attempts < 4 && (
                <motion.div initial={{ width: 0 }} animate={{ width: 40 }} className="absolute top-32 right-[44px] h-2 bg-white origin-right rotate-[-45deg]"></motion.div>
            )}

            {/* Right Arm */}
            {attempts < 3 && (
                <motion.div initial={{ width: 0 }} animate={{ width: 40 }} className="absolute top-32 right-[4px] h-2 bg-white origin-left rotate-[45deg]"></motion.div>
            )}

            {/* Left Leg */}
            {attempts < 2 && (
                <motion.div initial={{ height: 0 }} animate={{ height: 40 }} className="absolute top-[174px] right-[44px] w-2 bg-white origin-top rotate-[30deg]"></motion.div>
            )}

            {/* Right Leg */}
            {attempts < 1 && (
                <motion.div initial={{ height: 0 }} animate={{ height: 40 }} className="absolute top-[174px] right-[38px] w-2 bg-white origin-top rotate-[-30deg]"></motion.div>
            )}
        </div>
    );
};

const Hangman: React.FC = () => {
    const [word, setWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [attempts, setAttempts] = useState(6);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

    const startNewGame = useCallback(() => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setWord(randomWord);
        setGuessedLetters(new Set());
        setAttempts(6);
        setGameState('playing');
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    const handleGuess = (letter: string) => {
        if (gameState !== 'playing' || guessedLetters.has(letter)) return;

        const newGuessed = new Set(guessedLetters);
        newGuessed.add(letter);
        setGuessedLetters(newGuessed);

        if (!word.includes(letter)) {
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);
            if (newAttempts === 0) setGameState('lost');
        } else {
            const isWon = word.split('').every(char => newGuessed.has(char));
            if (isWon) setGameState('won');
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const char = e.key.toLowerCase();
            if (char.match(/^[a-z]$/)) {
                handleGuess(char);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guessedLetters, gameState, word, attempts]); // correct deps needed for handleGuess consistency

    const keyboard = 'abcdefghijklmnopqrstuvwxyz'.split('');

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between w-full mb-8">
                <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-500">
                    Hangman
                </h2>
                <div className="w-10"></div>
            </div>

            <div className="flex flex-col md:flex-row w-full gap-8">
                {/* Left Side: Drawing & Word */}
                <div className="flex-1 glass-panel p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
                    <HangmanDrawing attempts={attempts} />

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {word.split('').map((char, i) => (
                            <div key={i} className="w-10 h-12 border-b-2 border-white/50 flex items-center justify-center text-3xl font-mono uppercase">
                                {(gameState === 'lost' || guessedLetters.has(char)) ? (
                                    <span className={gameState === 'lost' && !guessedLetters.has(char) ? 'text-red-400' : ''}>{char}</span>
                                ) : ''}
                            </div>
                        ))}
                    </div>

                    <div className="h-8 text-center bg-transparent">
                        {gameState === 'won' && <p className="text-green-400 text-xl font-bold animate-pulse">You Won!</p>}
                        {gameState === 'lost' && <p className="text-red-400 text-xl font-bold">Game Over! Word was: {word}</p>}
                    </div>
                </div>

                {/* Right Side: Keyboard & Info */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white/70 uppercase text-sm tracking-wider">Attempts Left</h3>
                            <span className={`text-2xl font-bold ${attempts < 3 ? 'text-red-400' : 'text-green-400'}`}>{attempts}</span>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-wrap gap-2 justify-center">
                        {keyboard.map((char) => {
                            const status = guessedLetters.has(char)
                                ? word.includes(char)
                                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                    : 'bg-white/5 text-white/20 border-transparent'
                                : 'hover:bg-white/10 border-white/10 cursor-pointer'; // Default

                            return (
                                <button
                                    key={char}
                                    onClick={() => handleGuess(char)}
                                    disabled={guessedLetters.has(char) || gameState !== 'playing'}
                                    className={`w-10 h-10 rounded-lg border font-mono text-lg uppercase transition-all ${status}`}
                                >
                                    {char}
                                </button>
                            );
                        })}
                    </div>

                    {(gameState !== 'playing') && (
                        <button
                            onClick={startNewGame}
                            className="glass-button w-full py-4 rounded-xl text-xl font-bold flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={24} /> Play Again
                        </button>
                    )}

                    <div className="glass-panel p-4 rounded-xl flex items-start gap-3 bg-red-900/10 border-red-500/20">
                        <AlertCircle className="text-red-400 shrink-0 mt-1" size={20} />
                        <p className="text-sm text-white/70">
                            Type on your keyboard to guess letters quickly!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hangman;
