import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';

interface GameHeaderProps {
    title: string;
    accentClassName?: string;
    onShowRules: () => void;
    rulesLabel?: string;
}

/**
 * Shared game chrome: back, title, rules.
 * Min 44px touch targets; cursor-pointer; focus rings (ui-ux-pro-max checklist).
 */
const GameHeader: React.FC<GameHeaderProps> = ({
    title,
    accentClassName = 'from-primary to-secondary',
    onShowRules,
    rulesLabel = 'Show rules',
}) => {
    return (
        <div className="mb-8 flex items-center justify-between gap-3">
            <Link
                to="/"
                className="icon-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Back to home"
            >
                <ArrowLeft className="h-5 w-5" />
            </Link>

            <h1
                className={`text-center font-display text-xl font-bold tracking-wide sm:text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r ${accentClassName}`}
            >
                {title}
            </h1>

            <button
                type="button"
                onClick={onShowRules}
                className="icon-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={rulesLabel}
            >
                <Info className="h-5 w-5" />
            </button>
        </div>
    );
};

export default GameHeader;
