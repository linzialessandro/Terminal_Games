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
    Crosshair,
    ArrowUpRight,
    Sparkles,
} from 'lucide-react';

const games = [
    {
        path: '/guess-number',
        name: 'Guess the Number',
        blurb: 'Binary-search your way to the secret.',
        icon: Gamepad2,
        accent: 'text-sky-400',
        ring: 'group-hover:ring-sky-400/40',
        glow: 'from-sky-500/20 to-transparent',
        type: 'Logic',
    },
    {
        path: '/roll-dice',
        name: 'Roll the Dice',
        blurb: 'Match the secret sum. Pure luck.',
        icon: Dices,
        accent: 'text-violet-400',
        ring: 'group-hover:ring-violet-400/40',
        glow: 'from-violet-500/20 to-transparent',
        type: 'Luck',
    },
    {
        path: '/hangman',
        name: 'Hangman',
        blurb: 'Guess the word before the figure is complete.',
        icon: Type,
        accent: 'text-emerald-400',
        ring: 'group-hover:ring-emerald-400/40',
        glow: 'from-emerald-500/20 to-transparent',
        type: 'Skill',
    },
    {
        path: '/mastermind',
        name: 'Mastermind',
        blurb: 'Crack a 4-digit code with logic.',
        icon: Lock,
        accent: 'text-amber-400',
        ring: 'group-hover:ring-amber-400/40',
        glow: 'from-amber-500/20 to-transparent',
        type: 'Logic',
    },
    {
        path: '/minesweeper',
        name: 'Minesweeper',
        blurb: 'Clear the field. First click is safe.',
        icon: Bomb,
        accent: 'text-rose-400',
        ring: 'group-hover:ring-rose-400/40',
        glow: 'from-rose-500/20 to-transparent',
        type: 'Logic',
    },
    {
        path: '/rps',
        name: 'Rock Paper Scissors',
        blurb: 'First to 3 with a 2-point lead.',
        icon: Scissors,
        accent: 'text-pink-400',
        ring: 'group-hover:ring-pink-400/40',
        glow: 'from-pink-500/20 to-transparent',
        type: 'Luck',
    },
    {
        path: '/battleship',
        name: 'Battleship',
        blurb: 'Place your fleet. Sink the computer.',
        icon: Crosshair,
        accent: 'text-cyan-400',
        ring: 'group-hover:ring-cyan-400/40',
        glow: 'from-cyan-500/20 to-transparent',
        type: 'Strategy',
        wide: true,
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const item = {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
};

const Home: React.FC = () => {
    return (
        <div className="flex flex-col gap-10 sm:gap-12">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-2xl glass-panel-strong px-6 py-10 sm:px-10 sm:py-14"
            >
                <div
                    className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
                    aria-hidden
                />

                <div className="relative max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-secondary">
                        <Sparkles size={12} aria-hidden />
                        7 classic games · browser-only
                    </div>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Play smarter.
                        <span className="mt-1 block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Stay sharp.
                        </span>
                    </h1>
                    <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
                        A polished collection of terminal classics — logic, luck, and strategy —
                        rebuilt for the modern web.
                    </p>
                </div>
            </motion.section>

            {/* Bento game grid */}
            <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="font-display text-lg font-semibold tracking-wide text-foreground sm:text-xl">
                            Choose a game
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pick a title to start instantly — no accounts, no installs.
                        </p>
                    </div>
                    <span className="hidden text-xs font-mono text-muted-foreground sm:block">
                        {games.length} titles
                    </span>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {games.map((game) => (
                        <motion.div
                            key={game.path}
                            variants={item}
                            className={game.wide ? 'sm:col-span-2 lg:col-span-1' : undefined}
                        >
                            <Link
                                to={game.path}
                                className={`group relative flex h-full min-h-[168px] flex-col overflow-hidden rounded-2xl glass-panel p-5 ring-1 ring-white/[0.04] transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:bg-white/[0.07] hover:shadow-glow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${game.ring}`}
                            >
                                <div
                                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${game.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                                    aria-hidden
                                />

                                <div className="relative flex items-start justify-between">
                                    <span
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10 ${game.accent}`}
                                    >
                                        <game.icon size={22} aria-hidden />
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-white/[0.06]">
                                        {game.type}
                                    </span>
                                </div>

                                <div className="relative mt-auto pt-6">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-base font-semibold text-foreground sm:text-lg">
                                            {game.name}
                                        </h3>
                                        <ArrowUpRight
                                            size={18}
                                            className="shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                                            aria-hidden
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                        {game.blurb}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
