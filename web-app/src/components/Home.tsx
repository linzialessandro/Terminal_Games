import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Gamepad2,
    Dices,
    Type,
    Lock,
    Bomb,
    Scissors,
    Crosshair
} from 'lucide-react';

const games = [
    { path: '/guess-number', name: 'Guess Number', icon: Gamepad2, color: 'text-blue-400' },
    { path: '/roll-dice', name: 'Roll Dice', icon: Dices, color: 'text-purple-400' },
    { path: '/hangman', name: 'Hangman', icon: Type, color: 'text-green-400' },
    { path: '/mastermind', name: 'Mastermind', icon: Lock, color: 'text-yellow-400' },
    { path: '/minesweeper', name: 'Minesweeper', icon: Bomb, color: 'text-red-400' },
    { path: '/rps', name: 'Rock Paper Scissors', icon: Scissors, color: 'text-pink-400' },
    { path: '/battleship', name: 'Battleship', icon: Crosshair, color: 'text-cyan-400' },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 neon-text">
                    Terminal Games
                </h1>
                <p className="text-white/60">Select a game to start playing</p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl"
            >
                {games.map((game) => (
                    <motion.div key={game.path} variants={item}>
                        <Link
                            to={game.path}
                            className="glass-button flex flex-col items-center justify-center p-6 rounded-xl h-40 group hover:border-white/30 hover:scale-105 transition-all"
                        >
                            <game.icon size={40} className={`mb-4 ${game.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                            <span className="font-medium text-lg text-white/90">{game.name}</span>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Home;
