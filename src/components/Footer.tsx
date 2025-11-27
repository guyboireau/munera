import { Instagram, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Footer = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleAdminClick = () => {
        if (user) {
            navigate('/admin/dashboard');
        } else {
            navigate('/admin/login');
        }
    };

    return (
        <footer className="bg-munera-darker border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <img
                            src="/images/FULL_LOGO_BLANC.png"
                            alt="MUNERA"
                            className="h-16 w-auto mb-4"
                        />
                        <p className="text-gray-500 text-sm">© 2025 MUNERA. Tous droits réservés.</p>
                    </div>

                    <div className="flex space-x-8">
                        <a
                            href="https://www.instagram.com/collectifmunera/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-munera-violet transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram size={24} />
                        </a>
                        <a
                            href="https://www.facebook.com/collectifmunera/?locale=fr_FR"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-munera-violet transition-colors"
                            aria-label="Facebook"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a
                            href="mailto:contact@munera.fr"
                            className="text-gray-400 hover:text-munera-violet transition-colors"
                            aria-label="Email"
                        >
                            <Mail size={24} />
                        </a>
                        <button
                            onClick={handleAdminClick}
                            className="text-gray-600 hover:text-gray-400 transition-colors opacity-30 hover:opacity-100"
                            aria-label="Admin"
                            title="Administration"
                        >
                            <Lock size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
