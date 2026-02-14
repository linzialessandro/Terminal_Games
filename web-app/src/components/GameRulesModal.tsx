import React from 'react';
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
    rules
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-[#1a1b2e] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">How to Play</h2>
                                <span className="text-xs text-white/50 uppercase tracking-wider">{gameType} • {title}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        {rules.map((rule, idx) => (
                            <div key={idx} className="flex gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors border border-white/5">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                                    {idx + 1}
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    {rule}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors text-sm"
                        >
                            Got it!
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GameRulesModal;
