import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

interface GameRulesModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    gameType: 'luck' | 'skill' | 'logic' | 'strategy';
    rules: string[];
}

const GameRulesModal: React.FC<GameRulesModalProps> = ({
    isOpen,
    onClose,
    title,
    gameType,
    rules,
}) => {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/65 backdrop-blur-md"
                        aria-hidden
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="game-rules-title"
                        initial={{ scale: 0.94, opacity: 0, y: 16 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.96, opacity: 0, y: 12 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-2xl glass-panel-strong p-6 shadow-2xl"
                    >
                        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/25 blur-3xl" aria-hidden />

                        <div className="relative mb-6 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-secondary ring-1 ring-primary/30">
                                    <BookOpen size={20} aria-hidden />
                                </div>
                                <div>
                                    <h2 id="game-rules-title" className="text-lg font-bold text-foreground sm:text-xl">
                                        How to Play
                                    </h2>
                                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        {gameType} · {title}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="icon-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                aria-label="Close rules"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <ol className="relative space-y-3">
                            {rules.map((rule, idx) => (
                                <li
                                    key={idx}
                                    className="flex gap-3 rounded-xl surface-inset p-3.5 transition-colors duration-200 hover:bg-white/[0.04]"
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 font-mono text-xs font-bold text-secondary ring-1 ring-primary/25">
                                        {idx + 1}
                                    </span>
                                    <p className="pt-0.5 text-sm leading-relaxed text-foreground/85">{rule}</p>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-8 flex justify-end border-t border-white/[0.06] pt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-primary rounded-xl px-6 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GameRulesModal;
