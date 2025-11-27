import { useState } from 'react';
import { Calendar, Image, Upload, LogOut, Wand2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

import EventsManager from './EventsManager';
import FlyerManager from './FlyerManager';
import GalleryManager from './GalleryManager';
import FlyerGenerator from '../FlyerGenerator';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<'events' | 'flyers' | 'gallery' | 'generator'>('events');
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    return (
        <div className="flex h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <aside className="w-64 bg-munera-darker border-r border-white/10 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-8 tracking-widest">ADMIN</h2>

                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'events' ? 'bg-munera-violet text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Calendar size={20} />
                        Events
                    </button>
                    <button
                        onClick={() => setActiveTab('flyers')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'flyers' ? 'bg-munera-violet text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Upload size={20} />
                        Flyers
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-munera-violet text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Image size={20} />
                        Galerie
                    </button>
                    <button
                        onClick={() => setActiveTab('generator')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'generator' ? 'bg-munera-violet text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Wand2 size={20} />
                        Générateur de Flyers
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-auto"
                >
                    <LogOut size={20} />
                    Déconnexion
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-munera-dark">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        {activeTab === 'events' && 'Gestion des Événements'}
                        {activeTab === 'flyers' && 'Gestion des Flyers'}
                        {activeTab === 'gallery' && 'Gestion de la Galerie'}
                        {activeTab === 'generator' && 'Générateur de Flyers'}
                    </h1>

                    <div className="bg-munera-darker/50 border border-white/5 rounded-xl p-6">
                        {activeTab === 'events' && <EventsManager />}
                        {activeTab === 'flyers' && <FlyerManager />}
                        {activeTab === 'gallery' && <GalleryManager />}
                        {activeTab === 'generator' && <FlyerGenerator />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
