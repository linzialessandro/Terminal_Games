import React from 'react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { pathname } = useLocation();
    const wide = pathname.includes('battleship');
    const maxWidth = wide ? 'max-w-7xl' : 'max-w-4xl';

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className={`w-full ${maxWidth} glass-panel rounded-2xl overflow-hidden min-h-[80vh] flex flex-col relative`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {children}
                </main>
                <footer className="p-4 text-center text-white/30 text-xs border-t border-white/5">
                    Terminal Games Collection &copy; {new Date().getFullYear()}
                    <span className="block mt-1 text-white/20">
                        Single-player, client-side games — secrets live in your browser (not competitive-secure).
                    </span>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
