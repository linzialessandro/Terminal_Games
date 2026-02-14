import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import { ArrowLeft, Dices, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const DiceIcon = ({ value, className }: { value: number; className?: string }) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1] || Dices;
    return <Icon className={className} />;
};

const RollTheDice: React.FC = () => {
    const [numDice, setNumDice] = useState<number>(1);
    const [userRolls, setUserRolls] = useState<number[]>([]);
    const [secretRolls, setSecretRolls] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'idle' | 'rolling' | 'revealed'>('idle');
    const [message, setMessage] = useState('');
    const [showRules, setShowRules] = useState(false);

    const roll = () => {
        setGameState('rolling');
        setMessage('Rolling...');

        // Animation delay
        setTimeout(() => {
            const newSecretRolls = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
            const newUserRolls = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);

            setSecretRolls(newSecretRolls);
            setUserRolls(newUserRolls);
            setGameState('revealed');

            const secretSum = newSecretRolls.reduce((a, b) => a + b, 0);
            const userSum = newUserRolls.reduce((a, b) => a + b, 0);

            if (userSum === secretSum) {
                setMessage('Congratulations! You matched the secret roll!');
            } else {
                setMessage('You didn\'t match. Try again!');
            }
        }, 1000);
    };

    const reset = () => {
        setGameState('idle');
        setMessage('');
        setUserRolls([]);
        setSecretRolls([]);
    };

    const rules = [
        "Choose the number of dice you want to roll (1, 2, or 3).",
        "Click 'Roll Dice' to roll your dice and the secret dice simultaneously.",
        "The goal is to match the sum of your dice with the sum of the secret dice.",
        "It's purely a game of luck. Good luck!"
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between w-full mb-8">
                <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Roll the Dice
                </h2>
                <button
                    onClick={() => setShowRules(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-pink-300"
                >
                    <Info className="w-6 h-6" />
                </button>
            </div>

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Roll the Dice"
                gameType="luck"
                rules={rules}
            />

            <div className="glass-panel p-6 rounded-2xl w-full flex flex-col items-center gap-6">

                {/* Configuration */}
                <div className="flex flex-col items-center gap-2">
                    <label className="text-white/70 text-sm uppercase tracking-wider">Number of Dice</label>
                    <div className="flex bg-black/30 p-1 rounded-lg">
                        {[1, 2, 3].map(n => (
                            <button
                                key={n}
                                onClick={() => { setNumDice(n); reset(); }}
                                className={`px-4 py-2 rounded-md transition-all ${numDice === n ? 'bg-purple-600 text-white shadow-lg' : 'hover:bg-white/5 text-white/50'}`}
                                disabled={gameState === 'rolling'}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Game Area */}
                <div className="w-full flex justify-around items-center min-h-[200px] py-8">

                    {/* User Rolls */}
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-xl font-bold text-purple-300">Your Roll</h3>
                        <div className="flex gap-2">
                            {gameState === 'idle' ? (
                                Array.from({ length: numDice }).map((_, i) => (
                                    <Dices key={i} size={48} className="text-white/20" />
                                ))
                            ) : (
                                userRolls.map((val, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ rotate: 180, scale: 0.5 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                    >
                                        <DiceIcon value={val} className="w-16 h-16 text-purple-400" />
                                    </motion.div>
                                ))
                            )}
                        </div>
                        {gameState === 'revealed' && (
                            <p className="text-2xl font-mono">{userRolls.reduce((a, b) => a + b, 0)}</p>
                        )}
                    </div>

                    <div className="h-32 w-px bg-white/10"></div>

                    {/* Secret Rolls */}
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-xl font-bold text-pink-300">Secret Roll</h3>
                        <div className="flex gap-2">
                            {gameState === 'idle' ? (
                                Array.from({ length: numDice }).map((_, i) => (
                                    <Dices key={i} size={48} className="text-white/20" />
                                ))
                            ) : gameState === 'rolling' ? (
                                Array.from({ length: numDice }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                    >
                                        <Dices size={64} className="text-pink-400/50" />
                                    </motion.div>
                                ))
                            ) : (
                                secretRolls.map((val, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <DiceIcon value={val} className="w-16 h-16 text-pink-400" />
                                    </motion.div>
                                ))
                            )}
                        </div>
                        {gameState === 'revealed' && (
                            <p className="text-2xl font-mono">{secretRolls.reduce((a, b) => a + b, 0)}</p>
                        )}
                    </div>
                </div>

                {/* Message */}
                <div className="h-8">
                    <p className={`text-lg font-medium ${message.includes('Congrats') ? 'text-green-400' : 'text-white/70'}`}>
                        {message}
                    </p>
                </div>

                {/* Controls */}
                <button
                    onClick={roll}
                    disabled={gameState === 'rolling'}
                    className="glass-button w-full max-w-sm py-4 rounded-xl text-xl font-bold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {gameState === 'idle' ? 'Roll Dice' : 'Roll Again'}
                </button>

            </div>
        </div>
    );
};

export default RollTheDice;
