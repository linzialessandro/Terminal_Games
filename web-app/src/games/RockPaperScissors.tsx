import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scissors, Hand, Scroll, RefreshCw, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'draw' | null;

const RockPaperScissors: React.FC = () => {
    const [userScore, setUserScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [userChoice, setUserChoice] = useState<Choice | null>(null);
    const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState<GameResult>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [matchWinner, setMatchWinner] = useState<'user' | 'computer' | null>(null);

    const choices: { id: Choice; icon: React.ElementType; color: string }[] = [
        { id: 'rock', icon: Hand, color: 'text-stone-400' },
        { id: 'paper', icon: Scroll, color: 'text-blue-300' },
        { id: 'scissors', icon: Scissors, color: 'text-pink-400' },
    ];

    const handleChoice = (choice: Choice) => {
        if (isAnimating || matchWinner) return;

        setUserChoice(choice);
        setIsAnimating(true);
        setResult(null);
        setComputerChoice(null);

        // Simulate computer thinking/animation
        setTimeout(() => {
            const randomChoice = choices[Math.floor(Math.random() * choices.length)].id;
            setComputerChoice(randomChoice);
            setIsAnimating(false);

            if (choice === randomChoice) {
                setResult('draw');
            } else if (
                (choice === 'rock' && randomChoice === 'scissors') ||
                (choice === 'scissors' && randomChoice === 'paper') ||
                (choice === 'paper' && randomChoice === 'rock')
            ) {
                setResult('win');
                const newScore = userScore + 1;
                setUserScore(newScore);
                checkMatchWinner(newScore, computerScore);
            } else {
                setResult('lose');
                const newScore = computerScore + 1;
                setComputerScore(newScore);
                checkMatchWinner(userScore, newScore);
            }
        }, 1000); // 1 second delay for tension
    };

    const checkMatchWinner = (uScore: number, cScore: number) => {
        // Win condition: Score >= 3 AND Score >= Other + 2
        if (uScore >= 3 && uScore >= cScore + 2) {
            setMatchWinner('user');
        } else if (cScore >= 3 && cScore >= uScore + 2) {
            setMatchWinner('computer');
        }
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
        const item = choices.find(c => c.id === choice);
        const Icon = item?.icon;
        return Icon ? <Icon size={64} className={item.color} /> : null;
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between w-full mb-8">
                <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-500">
                    Rock Paper Scissors
                </h2>
                <div className="w-10"></div>
            </div>

            <div className="glass-panel p-8 rounded-2xl w-full flex flex-col items-center min-h-[500px]">

                {/* Scoreboard */}
                <div className="flex justify-between w-full max-w-md mb-12 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex flex-col items-center">
                        <span className="text-sm uppercase text-white/50">You</span>
                        <span className="text-3xl font-bold text-green-400">{userScore}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-xs uppercase text-white/30">First to 3 (+2 lead)</span>
                        <span className="text-xl font-bold text-white/70 px-4">VS</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-sm uppercase text-white/50">Computer</span>
                        <span className="text-3xl font-bold text-red-400">{computerScore}</span>
                    </div>
                </div>

                {matchWinner ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <Trophy size={80} className="text-yellow-400 animate-bounce" />
                        <h3 className="text-3xl font-bold text-center">
                            {matchWinner === 'user' ? 'MATCH WON!' : 'MATCH LOST'}
                        </h3>
                        <p className="text-white/60 text-center max-w-xs">
                            {matchWinner === 'user' ? 'Congratulations! You dominated the computer.' : 'Better luck next time!'}
                        </p>
                        <button
                            onClick={resetMatch}
                            className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors mt-4"
                        >
                            <RefreshCw size={20} /> Play Again
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Battle Area */}
                        <div className="flex justify-center items-center gap-8 md:gap-20 mb-12 h-40">
                            <div className="flex flex-col items-center gap-2 w-32">
                                <AnimatePresence mode='wait'>
                                    {userChoice ? (
                                        <motion.div
                                            key="user-choice"
                                            initial={{ x: -50, opacity: 0, rotate: -45 }}
                                            animate={{ x: 0, opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-white/5 p-6 rounded-full border border-white/10"
                                        >
                                            {getIcon(userChoice)}
                                        </motion.div>
                                    ) : (
                                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                                            ?
                                        </div>
                                    )}
                                </AnimatePresence>
                                <span className="text-sm text-white/50">You</span>
                            </div>

                            <div className="text-2xl font-bold text-white/30 italic">
                                {isAnimating ? 'VS' : result ? result.toUpperCase() : 'Choose!'}
                            </div>

                            <div className="flex flex-col items-center gap-2 w-32">
                                <AnimatePresence mode='wait'>
                                    {computerChoice ? (
                                        <motion.div
                                            key="comp-choice"
                                            initial={{ x: 50, opacity: 0, rotate: 45 }}
                                            animate={{ x: 0, opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-white/5 p-6 rounded-full border border-white/10"
                                        >
                                            {getIcon(computerChoice)}
                                        </motion.div>
                                    ) : (
                                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                                            ?
                                        </div>
                                    )}
                                </AnimatePresence>
                                <span className="text-sm text-white/50">Computer</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4">
                            {choices.map((choice) => (
                                <button
                                    key={choice.id}
                                    onClick={() => handleChoice(choice.id)}
                                    disabled={isAnimating}
                                    className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl transition-all border border-white/5
                    ${userChoice === choice.id ? 'bg-white/20 border-white/30 scale-110' : 'bg-white/5 hover:bg-white/10 hover:scale-105'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                                >
                                    <choice.icon size={32} className={choice.color} />
                                    <span className="text-sm font-bold uppercase">{choice.id}</span>
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
