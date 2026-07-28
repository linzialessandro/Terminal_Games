import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import GameHeader from '../components/GameHeader';
import { Dices, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

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
        setMessage('Rolling…');

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
                setMessage("You didn't match. Try again!");
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
        'Choose the number of dice you want to roll (1, 2, or 3).',
        "Click 'Roll Dice' to roll your dice and the secret dice simultaneously.",
        'The goal is to match the sum of your dice with the sum of the secret dice.',
        "It's purely a game of luck. Good luck!",
    ];

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
            <GameHeader
                title="Roll the Dice"
                accentClassName="from-violet-400 to-pink-500"
                onShowRules={() => setShowRules(true)}
            />

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Roll the Dice"
                gameType="luck"
                rules={rules}
            />

            <div className="glass-panel flex w-full flex-col items-center gap-6 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Number of dice
                    </span>
                    <div className="flex rounded-xl surface-inset p-1" role="group" aria-label="Dice count">
                        {[1, 2, 3].map((n) => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => {
                                    setNumDice(n);
                                    reset();
                                }}
                                disabled={gameState === 'rolling'}
                                className={`min-h-11 min-w-11 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ease-cinema disabled:cursor-not-allowed disabled:opacity-50 ${
                                    numDice === n
                                        ? 'bg-primary text-primary-foreground shadow-glow-sm'
                                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex w-full min-h-[200px] items-center justify-around gap-4 py-6">
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-300">Your roll</h3>
                        <div className="flex gap-2">
                            {gameState === 'idle' ? (
                                Array.from({ length: numDice }).map((_, i) => (
                                    <Dices key={i} size={48} className="text-white/20" aria-hidden />
                                ))
                            ) : (
                                userRolls.map((val, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ rotate: 180, scale: 0.5 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ type: 'spring', bounce: 0.45 }}
                                    >
                                        <DiceIcon value={val} className="h-14 w-14 text-violet-400 sm:h-16 sm:w-16" />
                                    </motion.div>
                                ))
                            )}
                        </div>
                        {gameState === 'revealed' && (
                            <p className="font-mono text-2xl font-semibold">
                                {userRolls.reduce((a, b) => a + b, 0)}
                            </p>
                        )}
                    </div>

                    <div className="h-28 w-px bg-white/10" aria-hidden />

                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-pink-300">Secret roll</h3>
                        <div className="flex gap-2">
                            {gameState === 'idle' ? (
                                Array.from({ length: numDice }).map((_, i) => (
                                    <Dices key={i} size={48} className="text-white/20" aria-hidden />
                                ))
                            ) : gameState === 'rolling' ? (
                                Array.from({ length: numDice }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
                                    >
                                        <Dices size={56} className="text-pink-400/50" aria-hidden />
                                    </motion.div>
                                ))
                            ) : (
                                secretRolls.map((val, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <DiceIcon value={val} className="h-14 w-14 text-pink-400 sm:h-16 sm:w-16" />
                                    </motion.div>
                                ))
                            )}
                        </div>
                        {gameState === 'revealed' && (
                            <p className="font-mono text-2xl font-semibold">
                                {secretRolls.reduce((a, b) => a + b, 0)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="min-h-8 text-center" role="status">
                    <p
                        className={`text-base font-medium ${
                            message.includes('Congratulations') ? 'text-emerald-400' : 'text-muted-foreground'
                        }`}
                    >
                        {message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={roll}
                    disabled={gameState === 'rolling'}
                    className="btn-primary w-full max-w-sm rounded-xl py-3.5 text-base disabled:opacity-50"
                >
                    {gameState === 'idle' ? 'Roll Dice' : 'Roll Again'}
                </button>
            </div>
        </div>
    );
};

export default RollTheDice;
