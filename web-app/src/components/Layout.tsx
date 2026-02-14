import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl glass-panel rounded-2xl overflow-hidden min-h-[80vh] flex flex-col relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {children}
                </main>
                <footer className="p-4 text-center text-white/30 text-xs border-t border-white/5">
                    Terminal Games Collection &copy; {new Date().getFullYear()}
                </footer>
            </div>
        </div>
    );
};

export default Layout;
