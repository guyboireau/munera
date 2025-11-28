import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const links = [
        { name: 'ACCUEIL', path: '/' },
        { name: 'ÉVÉNEMENTS', path: '/events' },
        { name: 'CONTEST', path: '/contest' },
        { name: 'SHOP', path: '/shop' },
    ];

    return (
        <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 bg-munera-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <img
                                src="/images/FULL_LOGO_BLANC.png"
                                alt="MUNERA"
                                className="h-12 w-auto"
                            />
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={clsx(
                                        'px-3 py-2 rounded-md text-sm font-bold tracking-wider transition-all duration-300',
                                        location.pathname === link.path
                                            ? 'text-munera-violet text-glow'
                                            : 'text-gray-300 hover:text-white hover:text-glow'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <button
                                    onClick={() => supabase.auth.signOut()}
                                    className="px-3 py-2 rounded-md text-sm font-bold tracking-wider text-red-500 hover:text-red-400 transition-all duration-300"
                                >
                                    DECONNEXION
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    'block px-3 py-2 rounded-md text-base font-bold tracking-wider',
                                    location.pathname === link.path
                                        ? 'text-munera-violet bg-white/5'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <button
                                onClick={() => {
                                    supabase.auth.signOut();
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-bold tracking-wider text-red-500 hover:text-red-400 hover:bg-white/5"
                            >
                                DECONNEXION
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
