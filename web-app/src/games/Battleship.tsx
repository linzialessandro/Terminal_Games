import { useState, useEffect, useCallback } from 'react';
import GameRulesModal from '../components/GameRulesModal';
import GameHeader from '../components/GameHeader';
import { RefreshCw, Crosshair, Anchor, RotateCcw } from 'lucide-react';
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
            setMessage('Game start! Fire at enemy waters!');
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
        <div className="relative select-none rounded-2xl border border-cyan-500/25 bg-cyan-950/30 p-2 sm:p-4">
            <div className="absolute left-3 top-2 text-[10px] font-bold uppercase tracking-widest text-cyan-200/40">
                {isEnemy ? 'Enemy waters' : 'Friendly waters'}
            </div>
            <div
                className="mt-5 grid grid-cols-10 border-l border-t border-cyan-500/25 bg-cyan-950/40 select-none"
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
                                    relative flex h-8 w-8 items-center justify-center border-b border-r border-cyan-500/25 transition-all duration-200 ease-cinema focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:h-10 sm:w-10
                                    ${isHovered ? (canPlaceShip(userBoard, hoverCoords, BOARD_SIZE) ? 'bg-emerald-500/40' : 'bg-rose-500/40') : ''}
                                    ${cell === 'hit' ? 'bg-rose-500/35' : cell === 'miss' ? 'bg-white/5' : ''}
                                    ${showShip ? 'bg-slate-500/45' : ''}
                                    ${!isEnemy && !isHovered && cell === 'empty' ? 'hover:bg-cyan-500/20' : ''}
                                    ${isEnemy && gameState === 'playing' && turn === 'user' && cell !== 'hit' && cell !== 'miss' ? 'cursor-pointer hover:bg-rose-500/25' : ''}
                                `}
                            >
                                {cell === 'hit' && <Crosshair size={18} className="text-rose-400" aria-hidden />}
                                {cell === 'miss' && <div className="h-2 w-2 rounded-full bg-white/35" />}
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
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center pb-8">
            <GameHeader
                title="Battleship"
                accentClassName="from-cyan-400 to-blue-500"
                onShowRules={() => setShowRules(true)}
            />

            <GameRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Battleship"
                gameType="strategy"
                rules={rules}
            />

            <div className="glass-panel mb-8 w-full max-w-3xl rounded-2xl border-cyan-500/20 bg-cyan-950/20 p-4 text-center sm:p-5">
                <span
                    className={`text-lg font-semibold tracking-wide sm:text-xl ${
                        gameState === 'won'
                            ? 'text-emerald-400'
                            : gameState === 'lost'
                              ? 'text-rose-400'
                              : 'text-cyan-50'
                    }`}
                    role="status"
                >
                    {message}
                </span>
                {gameState === 'setup' && (
                    <div className="mt-4 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setIsHorizontal(!isHorizontal)}
                            className="glass-button flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                            <RotateCcw size={16} aria-hidden /> Rotate:{' '}
                            {isHorizontal ? 'Horizontal' : 'Vertical'}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex w-full max-w-7xl flex-col items-start justify-center gap-8 xl:flex-row xl:gap-12">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
                    <div className={gameState === 'setup' ? '' : 'order-2'}>
                        {renderGrid(
                            userBoard,
                            false,
                            gameState === 'setup' ? handleSetupClick : () => {},
                            gameState === 'setup' ? handleSetupHover : undefined
                        )}
                        <div className="mt-2 text-center text-sm text-muted-foreground">You</div>
                    </div>

                    {gameState !== 'setup' && (
                        <div className="order-1">
                            {renderGrid(computerBoard, true, (r, c) => handleUserFire(r, c))}
                            <div className="mt-2 text-center text-sm text-muted-foreground">Computer</div>
                        </div>
                    )}
                </div>

                <div className="glass-panel w-full min-w-[250px] rounded-2xl p-6 lg:w-auto">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-cyan-100">
                        <Anchor size={18} aria-hidden /> Fleet status
                    </h3>

                    <div className="mb-6">
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Your fleet
                        </h4>
                        <div className="flex flex-col gap-2">
                            {SHIP_CONFIG.map((ship) => {
                                const isSunk = sunkUserShips.includes(ship.name);
                                const isPlaced = Object.keys(userShips).includes(ship.name);
                                return (
                                    <div
                                        key={ship.name}
                                        className={`flex items-center justify-between text-sm ${
                                            isSunk
                                                ? 'text-rose-400 line-through'
                                                : isPlaced
                                                  ? 'text-emerald-300'
                                                  : 'text-muted-foreground/50'
                                        }`}
                                    >
                                        <span>{ship.name}</span>
                                        <div className="flex gap-1">
                                            {Array.from({ length: ship.length }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        isSunk
                                                            ? 'bg-rose-400'
                                                            : isPlaced
                                                              ? 'bg-emerald-400'
                                                              : 'bg-white/15'
                                                    }`}
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
                            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Enemy fleet
                            </h4>
                            <div className="flex flex-col gap-2">
                                {SHIP_CONFIG.map((ship) => {
                                    const isSunk = sunkComputerShips.includes(ship.name);
                                    return (
                                        <div
                                            key={ship.name}
                                            className={`flex items-center justify-between text-sm ${
                                                isSunk ? 'text-rose-400 line-through' : 'text-muted-foreground'
                                            }`}
                                        >
                                            <span>{ship.name}</span>
                                            <div className="flex gap-1">
                                                {Array.from({ length: ship.length }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            isSunk ? 'bg-rose-400' : 'bg-rose-500/25'
                                                        }`}
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
                            className="glass-button mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                            <RefreshCw size={18} aria-hidden /> Play Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BattleshipComponent;
