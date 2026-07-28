import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { pathname } = useLocation();
    const isHome = pathname === '/' || pathname === '';
    const wide = pathname.includes('battleship');
    const maxWidth = wide ? 'max-w-7xl' : 'max-w-5xl';

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Ambient atmospheric blobs (cinema dark) */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
                <div className="ambient-blob -top-24 left-1/4 h-72 w-72 bg-primary/40" />
                <div className="ambient-blob top-1/3 -right-16 h-80 w-80 bg-accent/25" />
                <div className="ambient-blob bottom-0 left-0 h-64 w-64 bg-blue-600/20" />
            </div>

            <header className="relative z-20 border-b border-white/[0.06] bg-[#0a0a14]/70 backdrop-blur-xl">
                <div className={`mx-auto flex h-16 items-center justify-between px-4 sm:px-6 ${maxWidth}`}>
                    <Link
                        to="/"
                        className="group flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 shadow-glow-sm transition-transform duration-200 ease-cinema group-hover:scale-105">
                            <Gamepad2 size={18} aria-hidden />
                        </span>
                        <span className="flex flex-col leading-tight">
                            <span className="font-display text-sm font-bold tracking-wide text-foreground sm:text-base">
                                Terminal Games
                            </span>
                            <span className="hidden text-[11px] text-muted-foreground sm:block">
                                Collection
                            </span>
                        </span>
                    </Link>

                    {!isHome && (
                        <Link
                            to="/"
                            className="glass-button rounded-xl px-3.5 py-2 text-sm text-foreground/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            All games
                        </Link>
                    )}
                </div>
            </header>

            <main className="relative z-10 flex-1 px-4 py-6 sm:px-6 sm:py-10">
                <div className={`mx-auto w-full ${maxWidth}`}>{children}</div>
            </main>

            <footer className="relative z-10 border-t border-white/[0.06] py-6 text-center">
                <p className="text-xs text-muted-foreground">
                    Terminal Games Collection &copy; {new Date().getFullYear()}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/70 max-w-md mx-auto px-4">
                    Single-player, client-side games — secrets live in your browser (not competitive-secure).
                </p>
            </footer>
        </div>
    );
};

export default Layout;
