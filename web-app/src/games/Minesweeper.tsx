import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bomb, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const GRID_SIZE = 8; // Slightly larger than python version for better web exp
const NUM_MINES = 10;

type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborCount: number;
};

const Minesweeper: React.FC = () => {
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [mineCount, setMineCount] = useState(NUM_MINES);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (gameState === 'playing') {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [gameState]);

    const startNewGame = () => {
        // Initialize grid
        const newGrid: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
            Array.from({ length: GRID_SIZE }, () => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborCount: 0,
            }))
        );

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < NUM_MINES) {
            const r = Math.floor(Math.random() * GRID_SIZE);
            const c = Math.floor(Math.random() * GRID_SIZE);
            if (!newGrid[r][c].isMine) {
                newGrid[r][c].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate neighbors
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (newGrid[r][c].isMine) continue;
                let count = 0;
                directions.forEach(([dr, dc]) => {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newGrid[nr][nc].isMine) {
                        count++;
                    }
                });
                newGrid[r][c].neighborCount = count;
            }
        }

        setGrid(newGrid);
        setGameState('playing');
        setMineCount(NUM_MINES);
        setTimer(0);
    };

    const revealCell = (r: number, c: number) => {
        if (gameState !== 'playing' || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

        const newGrid = [...grid.map(row => [...row])];

        if (newGrid[r][c].isMine) {
            // Game Over
            newGrid[r][c].isRevealed = true;
            // Reveal all mines
            newGrid.forEach(row => row.forEach(cell => {
                if (cell.isMine) cell.isRevealed = true;
            }));
            setGrid(newGrid);
            setGameState('lost');
            return;
        }

        // Flood fill
        const stack = [[r, c]];
        while (stack.length > 0) {
            const [cr, cc] = stack.pop()!;
            if (newGrid[cr][cc].isRevealed) continue;

            newGrid[cr][cc].isRevealed = true;
            newGrid[cr][cc].isFlagged = false; // Unflag if auto-revealed (shouldn't happen usually but strictness)

            if (newGrid[cr][cc].neighborCount === 0) {
                const directions = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1], [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];
                directions.forEach(([dr, dc]) => {
                    const nr = cr + dr;
                    const nc = cc + dc;
                    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && !newGrid[nr][nc].isRevealed) {
                        stack.push([nr, nc]);
                    }
                });
            }
        }

        setGrid(newGrid);
        checkWinCondition(newGrid);
    };

    const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (gameState !== 'playing' || grid[r][c].isRevealed) return;

        const newGrid = [...grid.map(row => [...row])];
        newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
        setGrid(newGrid);
        setMineCount(prev => newGrid[r][c].isFlagged ? prev - 1 : prev + 1);
    };

    const checkWinCondition = (currentGrid: Cell[][]) => {
        let unrevealedSafeCells = 0;
        currentGrid.forEach(row => row.forEach(cell => {
            if (!cell.isMine && !cell.isRevealed) unrevealedSafeCells++;
        }));

        if (unrevealedSafeCells === 0) {
            setGameState('won');
        }
    };

    const getCellColor = (count: number) => {
        const colors = [
            'text-transparent', // 0
            'text-blue-400',
            'text-green-400',
            'text-red-400',
            'text-purple-400',
            'text-yellow-400',
            'text-cyan-400',
            'text-white',
            'text-gray-400'
        ];
        return colors[count] || 'text-white';
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between w-full mb-6">
                <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    Minesweeper
                </h2>
                <div className="w-10"></div>
            </div>

            <div className="glass-panel p-6 rounded-2xl w-full flex flex-col items-center">

                <div className="flex justify-between w-full max-w-[400px] mb-6 px-4 bg-black/20 py-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-500/20 p-2 rounded-lg text-red-500">
                            <Bomb size={20} />
                        </div>
                        <span className="font-mono text-2xl font-bold">{mineCount}</span>
                    </div>

                    <button
                        onClick={startNewGame}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        title="Restart"
                    >
                        {gameState === 'playing' ? '🙂' : gameState === 'won' ? '😎' : '😵'}
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="font-mono text-2xl font-bold text-white/80">
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
                >
                    {grid.map((row, r) => (
                        row.map((cell, c) => (
                            <motion.button
                                key={`${r}-${c}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.1, delay: (r * GRID_SIZE + c) * 0.005 }}
                                className={`
                            w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md font-bold text-lg sm:text-xl transition-colors
                            ${cell.isRevealed
                                        ? (cell.isMine ? 'bg-red-500/50 border-red-500' : 'bg-white/5 border-white/5')
                                        : 'bg-white/10 hover:bg-white/20 border-t border-l border-white/10 border-b-black/30 border-r-black/30 active:bg-white/5'
                                    }
                        `}
                                onClick={() => revealCell(r, c)}
                                onContextMenu={(e) => toggleFlag(e, r, c)}
                            >
                                {cell.isRevealed ? (
                                    cell.isMine ? <Bomb size={24} className="text-red-500 animate-pulse" /> :
                                        cell.neighborCount > 0 ? <span className={getCellColor(cell.neighborCount)}>{cell.neighborCount}</span> : ''
                                ) : (
                                    cell.isFlagged ? <Flag size={20} className="text-red-400" /> : ''
                                )}
                            </motion.button>
                        ))
                    ))}
                </div>

                {gameState !== 'playing' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xl font-bold mb-4 ${gameState === 'won' ? 'text-green-400' : 'text-red-400'}`}
                    >
                        {gameState === 'won' ? 'Congratulations! You cleared the field!' : 'Game Over! You hit a mine.'}
                    </motion.div>
                )}

                <div className="text-xs text-white/30">
                    Left click to reveal • Right click to flag
                </div>

            </div>
        </div>
    );
};

export default Minesweeper;
