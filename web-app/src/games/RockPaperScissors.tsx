import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import GameHeader from '../components/GameHeader';
import { Scissors, Hand, Scroll, RefreshCw, Trophy } from 'lucide-react';
import { type Choice, type RoundResult, roundResult, matchWinner as computeMatchWinner } from '../lib/rps';

const RockPaperScissors: React.FC = () => {
    const [userScore, setUserScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [userChoice, setUserChoice] = useState<Choice | null>(null);
    const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState<RoundResult | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [matchWinner, setMatchWinner] = useState<'user' | 'computer' | null>(null);
    const [showRules, setShowRules] = useState(false);

    const choices: { id: Choice; icon: React.ElementType; color: string }[] = [
        { id: 'rock', icon: Hand, color: 'text-stone-300' },
        { id: 'paper', icon: Scroll, color: 'text-sky-300' },
        { id: 'scissors', icon: Scissors, color: 'text-pink-400' },
    ];

    const handleChoice = (choice: Choice) => {
        if (isAnimating || matchWinner) return;

        setUserChoice(choice);
        setIsAnimating(true);
        setResult(null);
        setComputerChoice(null);

        setTimeout(() => {
            const randomChoice = choices[Math.floor(Math.random() * choices.length)].id;
            setComputerChoice(randomChoice);
            setIsAnimating(false);

            const outcome = roundResult(choice, randomChoice);
            setResult(outcome);

            if (outcome === 'win') {
                const newScore = userScore + 1;
                setUserScore(newScore);
                setMatchWinner(computeMatchWinner(newScore, computerScore));
            } else if (outcome === 'lose') {
                const newScore = computerScore + 1;
                setComputerScore(newScore);
                setMatchWinner(computeMatchWinner(userScore, newScore));
            }
        }, 1000);
    };

    const resetMatch = () => {
        setUserScore(0);
        setComputerScore(0);
        setMatchWinner(null);
        setUserChoice(null);
        setComputerChoice(null);
        setResult(null);
    };

    const getIcon = (choice: Choice | null) => {
        if (!choice) return null;
        const item = choices.find((c) => c.id === choice);
        const Icon = item?.icon;
        return Icon ? <Icon size={56} className={item.color} /> : null;
    };

    const rules = [
        'Choose Rock, Paper, or Scissors against the computer.',
        'Rock beats Scissors, Scissors beats Paper, Paper beats Rock.',
        'Win rounds to increase your score.',
        'First to reach 3 points (with a 2-point lead) wins the match!',
    ];

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
            <GameHeader
                title="Rock Paper Scissors"
                accentClassName="from-pink-400 to-rose-500"
                onShowRules={() => setShowRules(true)}
            />

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Rock Paper Scissors"
                gameType="luck"
                rules={rules}
            />

            <div className="glass-panel flex min-h-[480px] w-full flex-col items-center rounded-2xl p-6 sm:p-8">
                <div className="mb-10 flex w-full max-w-md justify-between rounded-xl surface-inset p-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">You</span>
                        <span className="font-mono text-3xl font-bold text-emerald-400">{userScore}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                            First to 3 (+2 lead)
                        </span>
                        <span className="px-4 text-lg font-bold text-muted-foreground">VS</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Computer
                        </span>
                        <span className="font-mono text-3xl font-bold text-rose-400">{computerScore}</span>
                    </div>
                </div>

                {matchWinner ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-5"
                    >
                        <Trophy size={72} className="text-amber-400" aria-hidden />
                        <h3 className="text-center font-display text-2xl font-bold sm:text-3xl">
                            {matchWinner === 'user' ? 'Match won!' : 'Match lost'}
                        </h3>
                        <p className="max-w-xs text-center text-muted-foreground">
                            {matchWinner === 'user'
                                ? 'Congratulations — you dominated the computer.'
                                : 'Better luck next time!'}
                        </p>
                        <button
                            type="button"
                            onClick={resetMatch}
                            className="glass-button mt-2 flex items-center gap-2 rounded-xl px-8 py-3 font-semibold"
                        >
                            <RefreshCw size={18} aria-hidden /> Play Again
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div className="mb-10 flex h-40 items-center justify-center gap-6 sm:gap-16">
                            <div className="flex w-28 flex-col items-center gap-2 sm:w-32">
                                <AnimatePresence mode="wait">
                                    {userChoice ? (
                                        <motion.div
                                            key="user-choice"
                                            initial={{ x: -40, opacity: 0, rotate: -30 }}
                                            animate={{ x: 0, opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="rounded-full surface-inset p-5"
                                        >
                                            {getIcon(userChoice)}
                                        </motion.div>
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-white/10 text-2xl text-muted-foreground/40">
                                            ?
                                        </div>
                                    )}
                                </AnimatePresence>
                                <span className="text-sm text-muted-foreground">You</span>
                            </div>

                            <div className="min-w-[4.5rem] text-center font-display text-lg font-bold uppercase tracking-wide text-muted-foreground">
                                {isAnimating ? 'VS' : result ? result : 'Choose'}
                            </div>

                            <div className="flex w-28 flex-col items-center gap-2 sm:w-32">
                                <AnimatePresence mode="wait">
                                    {computerChoice ? (
                                        <motion.div
                                            key="comp-choice"
                                            initial={{ x: 40, opacity: 0, rotate: 30 }}
                                            animate={{ x: 0, opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="rounded-full surface-inset p-5"
                                        >
                                            {getIcon(computerChoice)}
                                        </motion.div>
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-white/10 text-2xl text-muted-foreground/40">
                                            ?
                                        </div>
                                    )}
                                </AnimatePresence>
                                <span className="text-sm text-muted-foreground">Computer</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            {choices.map((choice) => (
                                <button
                                    key={choice.id}
                                    type="button"
                                    onClick={() => handleChoice(choice.id)}
                                    disabled={isAnimating}
                                    className={`flex min-h-[88px] min-w-[88px] cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 ease-cinema disabled:cursor-not-allowed disabled:opacity-50 ${
                                        userChoice === choice.id
                                            ? 'scale-105 border-white/25 bg-white/15 shadow-glow-sm'
                                            : 'border-white/[0.06] bg-white/[0.04] hover:scale-[1.03] hover:bg-white/[0.08]'
                                    }`}
                                >
                                    <choice.icon size={28} className={choice.color} aria-hidden />
                                    <span className="text-xs font-bold uppercase tracking-wide">{choice.id}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RockPaperScissors;
