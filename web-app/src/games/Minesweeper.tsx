import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import { ArrowLeft, Bomb, Flag, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    createEmptyGrid,
    placeMines,
    firstClickSafeZone,
    floodReveal,
    checkWin,
    cloneGrid,
} from '../lib/minesweeper';

const GRID_SIZE = 8;
const NUM_MINES = 10;

const Minesweeper: React.FC = () => {
    const [grid, setGrid] = useState(() => createEmptyGrid(GRID_SIZE));
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [mineCount, setMineCount] = useState(NUM_MINES);
    const [timer, setTimer] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [minesPlaced, setMinesPlaced] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const startNewGame = useCallback(() => {
        setGrid(createEmptyGrid(GRID_SIZE));
        setGameState('playing');
        setMineCount(NUM_MINES);
        setTimer(0);
        setTimerRunning(false);
        setMinesPlaced(false);
    }, []);

    useEffect(() => {
        if (!timerRunning || gameState !== 'playing') return;
        const interval = setInterval(() => setTimer((t) => t + 1), 1000);
        return () => clearInterval(interval);
    }, [timerRunning, gameState]);

    const revealCell = (r: number, c: number) => {
        if (gameState !== 'playing' || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

        let working = grid;

        // First-click safety: place mines after first reveal, excluding click neighborhood
        if (!minesPlaced) {
            const safe = firstClickSafeZone(r, c, GRID_SIZE);
            working = placeMines(createEmptyGrid(GRID_SIZE), NUM_MINES, safe);
            setMinesPlaced(true);
            setTimerRunning(true);
        }

        if (working[r][c].isMine) {
            const lost = cloneGrid(working);
            lost.forEach((row) =>
                row.forEach((cell, ci) => {
                    if (cell.isMine) row[ci] = { ...cell, isRevealed: true };
                })
            );
            lost[r][c] = { ...lost[r][c], isRevealed: true };
            setGrid(lost);
            setGameState('lost');
            setTimerRunning(false);
            return;
        }

        const { grid: revealed, flagsRemoved } = floodReveal(working, r, c);
        if (flagsRemoved > 0) {
            setMineCount((prev) => prev + flagsRemoved);
        }
        setGrid(revealed);

        if (checkWin(revealed)) {
            setGameState('won');
            setTimerRunning(false);
        }
    };

    const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (gameState !== 'playing' || grid[r][c].isRevealed) return;

        const newGrid = cloneGrid(grid);
        const nextFlag = !newGrid[r][c].isFlagged;
        newGrid[r][c] = { ...newGrid[r][c], isFlagged: nextFlag };
        setGrid(newGrid);
        setMineCount((prev) => (nextFlag ? prev - 1 : prev + 1));
        if (!timerRunning && !minesPlaced) {
            // optional: don't start timer on flag-only
        }
    };

    const getCellColor = (count: number) => {
        const colors = [
            'text-transparent',
            'text-blue-400',
            'text-green-400',
            'text-red-400',
            'text-purple-400',
            'text-yellow-400',
            'text-cyan-400',
            'text-white',
            'text-gray-400',
        ];
        return colors[count] || 'text-white';
    };

    const rules = [
        'Reveal all safe squares without detonating a mine.',
        'Your first click is always safe (mines are placed after it).',
        'Numbers indicate how many mines are adjacent to that square.',
        'Right-click (or long-press) to flag a square you suspect contains a mine.',
        'If you click a mine, the game ends.',
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between w-full mb-6">
                <Link
                    to="/"
                    className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    aria-label="Back to home"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    Minesweeper
                </h2>
                <button
                    onClick={() => setShowRules(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    aria-label="Show rules"
                >
                    <Info className="w-6 h-6" />
                </button>
            </div>

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Minesweeper"
                gameType="logic"
                rules={rules}
            />

            <div className="glass-panel p-6 rounded-2xl w-full flex flex-col items-center">
                <div className="flex justify-between w-full max-w-[400px] mb-6 px-4 bg-black/20 py-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-500/20 p-2 rounded-lg text-red-500">
                            <Bomb size={20} />
                        </div>
                        <span className="font-mono text-2xl font-bold" aria-label="Mines remaining">
                            {mineCount}
                        </span>
                    </div>

                    <button
                        onClick={startNewGame}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        title="Restart"
                        aria-label="Restart game"
                    >
                        {gameState === 'playing' ? '🙂' : gameState === 'won' ? '😎' : '😵'}
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="font-mono text-2xl font-bold text-white/80" aria-label="Timer">
                            {String(timer).padStart(3, '0')}
                        </span>
                        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-500">
                            <span className="text-xs font-bold">TIME</span>
                        </div>
                    </div>
                </div>

                <div
                    className="grid gap-1 mb-6 p-2 bg-black/40 rounded-xl border border-white/10 select-none shadow-inner"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                    onContextMenu={(e) => e.preventDefault()}
                    role="grid"
                    aria-label="Minesweeper board"
                >
                    {grid.map((row, r) =>
                        row.map((cell, c) => (
                            <motion.button
                                key={`${r}-${c}`}
                                type="button"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.1, delay: (r * GRID_SIZE + c) * 0.005 }}
                                className={`
                            w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md font-bold text-lg sm:text-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400
                            ${
                                cell.isRevealed
                                    ? cell.isMine
                                        ? 'bg-red-500/50 border-red-500'
                                        : 'bg-white/5 border-white/5'
                                    : 'bg-white/10 hover:bg-white/20 border-t border-l border-white/10 border-b-black/30 border-r-black/30 active:bg-white/5'
                            }
                        `}
                                onClick={() => revealCell(r, c)}
                                onContextMenu={(e) => toggleFlag(e, r, c)}
                                aria-label={
                                    cell.isRevealed
                                        ? cell.isMine
                                            ? 'Mine'
                                            : `Cell ${cell.neighborCount} adjacent mines`
                                        : cell.isFlagged
                                          ? `Flagged cell row ${r + 1} column ${c + 1}`
                                          : `Hidden cell row ${r + 1} column ${c + 1}`
                                }
                            >
                                {cell.isRevealed ? (
                                    cell.isMine ? (
                                        <Bomb size={24} className="text-red-500 animate-pulse" />
                                    ) : cell.neighborCount > 0 ? (
                                        <span className={getCellColor(cell.neighborCount)}>{cell.neighborCount}</span>
                                    ) : (
                                        ''
                                    )
                                ) : cell.isFlagged ? (
                                    <Flag size={20} className="text-red-400" />
                                ) : (
                                    ''
                                )}
                            </motion.button>
                        ))
                    )}
                </div>

                {gameState !== 'playing' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xl font-bold mb-4 ${gameState === 'won' ? 'text-green-400' : 'text-red-400'}`}
                        role="status"
                    >
                        {gameState === 'won' ? 'Congratulations! You cleared the field!' : 'Game Over! You hit a mine.'}
                    </motion.div>
                )}

                <div className="text-xs text-white/30">Left click to reveal • Right click to flag</div>
            </div>
        </div>
    );
};

export default Minesweeper;
