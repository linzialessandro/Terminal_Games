import { useState, useEffect, useCallback } from 'react';
import GameRulesModal from '../components/GameRulesModal';
import { ArrowLeft, RefreshCw, Crosshair, Anchor, RotateCcw, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    type CellState,
    type ShipData,
    DEFAULT_BOARD_SIZE,
    DEFAULT_SHIP_CONFIG,
    getShipCoords,
    canPlaceShip,
    createEmptyBoard,
    applyShipHit,
    isShipSunk,
    randomStart,
} from '../lib/battleship';

const BOARD_SIZE = DEFAULT_BOARD_SIZE;
const SHIP_CONFIG = DEFAULT_SHIP_CONFIG;

type GamePhase = 'setup' | 'playing' | 'won' | 'lost';

function generateComputerFleet(): { board: CellState[][]; ships: Record<string, ShipData> } {
    const newBoard = createEmptyBoard(BOARD_SIZE);
    const newShips: Record<string, ShipData> = {};

    SHIP_CONFIG.forEach((ship) => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 500) {
            attempts++;
            const horizontal = Math.random() < 0.5;
            const { r, c } = randomStart(BOARD_SIZE, ship.length, horizontal);
            const coords = getShipCoords(r, c, ship.length, horizontal);
            if (canPlaceShip(newBoard, coords, BOARD_SIZE)) {
                coords.forEach(([nr, nc]) => {
                    newBoard[nr][nc] = 'ship';
                });
                newShips[ship.name] = { coords, hitCount: 0 };
                placed = true;
            }
        }
    });
    return { board: newBoard, ships: newShips };
}

const BattleshipComponent = () => {
    const [gameState, setGameState] = useState<GamePhase>('setup');
    const [turn, setTurn] = useState<'user' | 'computer'>('user');
    const [message, setMessage] = useState('Place your Carrier (5 cells)');
    const [showRules, setShowRules] = useState(false);

    const [userBoard, setUserBoard] = useState(() => createEmptyBoard(BOARD_SIZE));
    // Seed computer fleet once on mount (paired board + ships); reset via startNewGame.
    const [initialComputer] = useState(generateComputerFleet);
    const [computerBoard, setComputerBoard] = useState(initialComputer.board);
    const [userShips, setUserShips] = useState<Record<string, ShipData>>({});
    const [computerShips, setComputerShips] = useState(initialComputer.ships);
    const [sunkComputerShips, setSunkComputerShips] = useState<string[]>([]);
    const [sunkUserShips, setSunkUserShips] = useState<string[]>([]);

    const [currentShipIndex, setCurrentShipIndex] = useState(0);
    const [isHorizontal, setIsHorizontal] = useState(true);
    const [hoverCoords, setHoverCoords] = useState<[number, number][]>([]);

    const startNewGame = useCallback(() => {
        const fleet = generateComputerFleet();
        setUserBoard(createEmptyBoard(BOARD_SIZE));
        setComputerBoard(fleet.board);
        setUserShips({});
        setComputerShips(fleet.ships);
        setSunkComputerShips([]);
        setSunkUserShips([]);
        setGameState('setup');
        setTurn('user');
        setCurrentShipIndex(0);
        setMessage('Place your Carrier (5 cells)');
    }, []);

    const fireAt = (board: CellState[][], ships: Record<string, ShipData>, r: number, c: number) => {
        const cell = board[r][c];
        if (cell === 'ship') {
            board[r][c] = 'hit';
            for (const [name, data] of Object.entries(ships)) {
                if (data.coords.some(([sr, sc]) => sr === r && sc === c)) {
                    return { hitShipName: name, hitShipLength: SHIP_CONFIG.find((s) => s.name === name)!.length };
                }
            }
        } else if (cell === 'empty') {
            board[r][c] = 'miss';
        }
        return { hitShipName: null as string | null, hitShipLength: 0 };
    };

    const makeComputerMove = useCallback(() => {
        if (gameState !== 'playing') return;

        let r = 0;
        let c = 0;
        let valid = false;
        let attempts = 0;
        while (!valid && attempts < 200) {
            r = Math.floor(Math.random() * BOARD_SIZE);
            c = Math.floor(Math.random() * BOARD_SIZE);
            if (userBoard[r][c] !== 'hit' && userBoard[r][c] !== 'miss') {
                valid = true;
            }
            attempts++;
        }
        if (!valid) return;

        const newBoard = userBoard.map((row) => [...row]);
        const result = fireAt(newBoard, userShips, r, c);

        setUserBoard(newBoard);

        if (result.hitShipName) {
            const newShips = applyShipHit(userShips, result.hitShipName);
            setUserShips(newShips);

            if (isShipSunk(newShips[result.hitShipName], result.hitShipLength)) {
                const newSunk = [...sunkUserShips, result.hitShipName];
                setSunkUserShips(newSunk);
                setMessage(`Computer sunk your ${result.hitShipName}!`);
                if (newSunk.length === SHIP_CONFIG.length) {
                    setGameState('lost');
                    setMessage('DEFEAT! Your fleet was destroyed.');
                    return;
                }
            } else {
                setMessage('Computer HIT your ship!');
            }
        } else {
            setMessage('Computer MISSED!');
        }
        setTurn('user');
    }, [gameState, userBoard, userShips, sunkUserShips]);

    useEffect(() => {
        if (gameState === 'playing' && turn === 'computer') {
            const timer = setTimeout(() => {
                makeComputerMove();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, gameState, makeComputerMove]);

    const handleSetupHover = (r: number, c: number) => {
        if (gameState !== 'setup') return;
        const ship = SHIP_CONFIG[currentShipIndex];
        const coords = getShipCoords(r, c, ship.length, isHorizontal);
        if (canPlaceShip(userBoard, coords, BOARD_SIZE)) {
            setHoverCoords(coords);
        } else {
            setHoverCoords([]);
        }
    };

    const handleSetupClick = () => {
        if (gameState !== 'setup' || hoverCoords.length === 0) return;

        const ship = SHIP_CONFIG[currentShipIndex];
        const newBoard = userBoard.map((row) => [...row]);

        hoverCoords.forEach(([r, c]) => {
            newBoard[r][c] = 'ship';
        });

        const newShips = { ...userShips, [ship.name]: { coords: hoverCoords, hitCount: 0 } };

        setUserBoard(newBoard);
        setUserShips(newShips);
        setHoverCoords([]);

        if (currentShipIndex < SHIP_CONFIG.length - 1) {
            setCurrentShipIndex((prev) => prev + 1);
            setMessage(
                `Place your ${SHIP_CONFIG[currentShipIndex + 1].name} (${SHIP_CONFIG[currentShipIndex + 1].length} cells)`
            );
        } else {
            setGameState('playing');
            setMessage('Game Start! Fire at enemy waters!');
        }
    };

    const handleUserFire = (r: number, c: number) => {
        if (gameState !== 'playing' || turn !== 'user') return;
        if (computerBoard[r][c] === 'hit' || computerBoard[r][c] === 'miss') return;

        const newBoard = computerBoard.map((row) => [...row]);
        const result = fireAt(newBoard, computerShips, r, c);

        setComputerBoard(newBoard);

        if (result.hitShipName) {
            const newShips = applyShipHit(computerShips, result.hitShipName);
            setComputerShips(newShips);

            if (isShipSunk(newShips[result.hitShipName], result.hitShipLength)) {
                const newSunk = [...sunkComputerShips, result.hitShipName];
                setSunkComputerShips(newSunk);
                setMessage(`You sunk the Computer's ${result.hitShipName}!`);
                if (newSunk.length === SHIP_CONFIG.length) {
                    setGameState('won');
                    setMessage('VICTORY! You destroyed the enemy fleet!');
                    return;
                }
            } else {
                setMessage('HIT!');
            }
            setTurn('computer');
        } else {
            setMessage('MISS!');
            setTurn('computer');
        }
    };

    const renderGrid = (
        board: CellState[][],
        isEnemy: boolean,
        onClick: (r: number, c: number) => void,
        onHover?: (r: number, c: number) => void
    ) => (
        <div className="relative bg-blue-900/30 p-2 sm:p-4 rounded-xl border border-blue-500/30 select-none">
            <div className="absolute top-2 left-2 text-xs font-bold text-white/30 uppercase tracking-widest">
                {isEnemy ? 'Enemy Waters' : 'Friendly Waters'}
            </div>
            <div
                className="grid grid-cols-10 border-t border-l border-blue-500/30 mt-6 select-none bg-blue-900/40"
                onMouseLeave={() => setHoverCoords([])}
                role="grid"
                aria-label={isEnemy ? 'Enemy board' : 'Your board'}
            >
                {board.map((row, r) =>
                    row.map((cell, c) => {
                        const isHovered = !isEnemy && hoverCoords.some(([hr, hc]) => hr === r && hc === c);
                        const showShip = !isEnemy && cell === 'ship';

                        return (
                            <div
                                key={`${r}-${c}`}
                                role="gridcell"
                                tabIndex={isEnemy && gameState === 'playing' && turn === 'user' ? 0 : -1}
                                onClick={() => onClick(r, c)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onClick(r, c);
                                    }
                                }}
                                onMouseEnter={() => onHover && onHover(r, c)}
                                className={`
                                    w-8 h-8 sm:w-10 sm:h-10 relative transition-all duration-200 border-b border-r border-blue-500/30 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                                    ${isHovered ? (canPlaceShip(userBoard, hoverCoords, BOARD_SIZE) ? 'bg-green-500/40' : 'bg-red-500/40') : ''}
                                    ${cell === 'hit' ? 'bg-red-500/30' : cell === 'miss' ? 'bg-white/5' : ''}
                                    ${showShip ? 'bg-gray-500/50' : ''}
                                    ${!isEnemy && !isHovered && cell === 'empty' ? 'hover:bg-blue-500/20' : ''}
                                    ${isEnemy && gameState === 'playing' && turn === 'user' && cell !== 'hit' && cell !== 'miss' ? 'cursor-pointer hover:bg-red-500/20' : ''}
                                `}
                            >
                                {cell === 'hit' && <Crosshair size={20} className="text-red-500 animate-pulse" />}
                                {cell === 'miss' && <div className="w-2 h-2 rounded-full bg-white/30" />}
                                {showShip && <div className="absolute inset-1 border border-white/20" />}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );

    const rules = [
        'Place your fleet of 5 ships on your grid (Friendly Waters).',
        "Take turns firing coordinates at the Enemy's Waters.",
        'Hit ships are marked with red, misses with white.',
        'Sink all 5 opponent ships to win the game!',
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 pb-20">
            <div className="flex items-center justify-between w-full mb-6">
                <Link
                    to="/"
                    className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    aria-label="Back to home"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
                    Battleship
                </h2>
                <button
                    onClick={() => setShowRules(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    aria-label="Show rules"
                >
                    <Info className="w-6 h-6" />
                </button>
            </div>

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Battleship"
                gameType="strategy"
                rules={rules}
            />

            <div className="glass-panel w-full max-w-3xl p-4 mb-8 text-center rounded-xl bg-blue-900/20 border-blue-500/30">
                <span
                    className={`text-xl font-bold tracking-wide ${gameState === 'won' ? 'text-green-400' : gameState === 'lost' ? 'text-red-400' : 'text-blue-100'}`}
                    role="status"
                >
                    {message}
                </span>
                {gameState === 'setup' && (
                    <div className="mt-4 flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => setIsHorizontal(!isHorizontal)}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                            <RotateCcw size={16} /> Rotate: {isHorizontal ? 'Horizontal' : 'Vertical'}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col xl:flex-row gap-8 lg:gap-16 items-start justify-center w-full max-w-7xl">
                <div className="flex flex-col gap-12 w-full max-w-2xl mx-auto">
                    <div className={gameState === 'setup' ? '' : 'order-2'}>
                        {renderGrid(userBoard, false, gameState === 'setup' ? handleSetupClick : () => {}, gameState === 'setup' ? handleSetupHover : undefined)}
                        <div className="mt-2 text-center text-sm text-white/40">You</div>
                    </div>

                    {gameState !== 'setup' && (
                        <div className="order-1">
                            {renderGrid(computerBoard, true, (r, c) => handleUserFire(r, c))}
                            <div className="mt-2 text-center text-sm text-white/40">Computer</div>
                        </div>
                    )}
                </div>

                <div className="glass-panel p-6 rounded-xl min-w-[250px] w-full lg:w-auto">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-200">
                        <Anchor size={20} /> Fleet Status
                    </h3>

                    <div className="mb-6">
                        <h4 className="text-xs uppercase text-white/40 mb-2 font-bold">Your Fleet</h4>
                        <div className="flex flex-col gap-2">
                            {SHIP_CONFIG.map((ship) => {
                                const isSunk = sunkUserShips.includes(ship.name);
                                const isPlaced = Object.keys(userShips).includes(ship.name);
                                return (
                                    <div
                                        key={ship.name}
                                        className={`flex items-center justify-between text-sm ${isSunk ? 'text-red-400 line-through' : isPlaced ? 'text-green-300' : 'text-white/30'}`}
                                    >
                                        <span>{ship.name}</span>
                                        <div className="flex gap-1">
                                            {Array.from({ length: ship.length }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${isSunk ? 'bg-red-400' : isPlaced ? 'bg-green-400' : 'bg-white/10'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {gameState !== 'setup' && (
                        <div>
                            <h4 className="text-xs uppercase text-white/40 mb-2 font-bold">Enemy Fleet</h4>
                            <div className="flex flex-col gap-2">
                                {SHIP_CONFIG.map((ship) => {
                                    const isSunk = sunkComputerShips.includes(ship.name);
                                    return (
                                        <div
                                            key={ship.name}
                                            className={`flex items-center justify-between text-sm ${isSunk ? 'text-red-400 line-through' : 'text-white/60'}`}
                                        >
                                            <span>{ship.name}</span>
                                            <div className="flex gap-1">
                                                {Array.from({ length: ship.length }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-1.5 h-1.5 rounded-full ${isSunk ? 'bg-red-400' : 'bg-red-500/20'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {(gameState === 'won' || gameState === 'lost') && (
                        <button
                            type="button"
                            onClick={startNewGame}
                            className="mt-8 w-full glass-button px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                            <RefreshCw size={20} /> Play Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BattleshipComponent;
