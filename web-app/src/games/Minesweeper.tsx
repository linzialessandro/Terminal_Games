import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import GameRulesModal from '../components/GameRulesModal';
import GameHeader from '../components/GameHeader';
import { Bomb, Flag, Smile, Laugh, Frown } from 'lucide-react';
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
    };

    const getCellColor = (count: number) => {
        const colors = [
            'text-transparent',
            'text-sky-400',
            'text-emerald-400',
            'text-rose-400',
            'text-violet-400',
            'text-amber-400',
            'text-cyan-400',
            'text-white',
            'text-muted-foreground',
        ];
        return colors[count] || 'text-white';
    };

    const FaceIcon = gameState === 'playing' ? Smile : gameState === 'won' ? Laugh : Frown;
    const faceColor =
        gameState === 'playing' ? 'text-amber-300' : gameState === 'won' ? 'text-emerald-400' : 'text-rose-400';

    const rules = [
        'Reveal all safe squares without detonating a mine.',
        'Your first click is always safe (mines are placed after it).',
        'Numbers indicate how many mines are adjacent to that square.',
        'Right-click (or long-press) to flag a square you suspect contains a mine.',
        'If you click a mine, the game ends.',
    ];

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
            <GameHeader
                title="Minesweeper"
                accentClassName="from-rose-500 to-orange-500"
                onShowRules={() => setShowRules(true)}
            />

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Minesweeper"
                gameType="logic"
                rules={rules}
            />

            <div className="glass-panel flex w-full flex-col items-center rounded-2xl p-5 sm:p-6">
                <div className="mb-6 flex w-full max-w-[420px] items-center justify-between rounded-xl surface-inset px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-rose-500/15 p-2 text-rose-400 ring-1 ring-rose-500/25">
                            <Bomb size={18} aria-hidden />
                        </div>
                        <span className="font-mono text-2xl font-bold" aria-label="Mines remaining">
                            {mineCount}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={startNewGame}
                        className="icon-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                        title="Restart"
                        aria-label="Restart game"
                    >
                        <FaceIcon size={22} className={faceColor} aria-hidden />
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="font-mono text-2xl font-bold text-foreground/85" aria-label="Timer">
                            {String(timer).padStart(3, '0')}
                        </span>
                        <div className="rounded-lg bg-sky-500/15 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-400 ring-1 ring-sky-500/25">
                            Time
                        </div>
                    </div>
                </div>

                <div
                    className="mb-5 grid gap-1 rounded-xl surface-inset p-2 shadow-inner select-none"
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
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.12, delay: (r * GRID_SIZE + c) * 0.004 }}
                                className={`
                            flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-lg font-bold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 sm:h-12 sm:w-12 sm:text-xl
                            ${
                                cell.isRevealed
                                    ? cell.isMine
                                        ? 'bg-rose-500/40 ring-1 ring-rose-500/50'
                                        : 'bg-white/[0.04] ring-1 ring-white/[0.04]'
                                    : 'bg-white/[0.08] ring-1 ring-white/10 hover:bg-white/[0.14] active:bg-white/[0.05]'
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
                                        <Bomb size={22} className="text-rose-400" aria-hidden />
                                    ) : cell.neighborCount > 0 ? (
                                        <span className={getCellColor(cell.neighborCount)}>{cell.neighborCount}</span>
                                    ) : (
                                        ''
                                    )
                                ) : cell.isFlagged ? (
                                    <Flag size={18} className="text-rose-400" aria-hidden />
                                ) : (
                                    ''
                                )}
                            </motion.button>
                        ))
                    )}
                </div>

                {gameState !== 'playing' && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-3 text-center text-lg font-bold ${
                            gameState === 'won' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                        role="status"
                    >
                        {gameState === 'won'
                            ? 'Congratulations! You cleared the field!'
                            : 'Game over — you hit a mine.'}
                    </motion.div>
                )}

                <p className="text-xs text-muted-foreground">Left click to reveal · Right click to flag</p>
            </div>
        </div>
    );
};

export default Minesweeper;
