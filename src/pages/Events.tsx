import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import EventMap from '../components/EventMap';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Events = () => {
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [search, setSearch] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false });

            if (!error && data) {
                setEvents(data);
            }
            setLoading(false);
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === 'all' || event.status === filter;
        const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) ||
            event.city.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Create map events from filtered events (only show events with coordinates if available)
    const mapEvents = filteredEvents
        .filter(event => event.latitude && event.longitude)
        .map(event => ({
            id: event.id,
            name: event.name,
            venue: event.venue,
            position: [event.latitude, event.longitude] as [number, number]
        }));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-munera-violet"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-5xl font-bold mb-4 text-white text-glow">AGENDA</h1>
                    <p className="text-gray-400">Retrouvez toutes les dates du collectif.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un event..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-munera-violet transition-colors"
                        />
                    </div>

                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        {(['all', 'upcoming', 'past'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f
                                    ? 'bg-munera-violet text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {f === 'all' ? 'Tous' : f === 'upcoming' ? 'À venir' : 'Passés'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map Section - Only show if there are events with coordinates */}
            {mapEvents.length > 0 && (
                <div className="mb-16">
                    <EventMap events={mapEvents} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map(event => (
                    <EventCard
                        key={event.id}
                        id={event.id}
                        name={event.name}
                        date={new Date(event.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                        venue={event.venue}
                        city={event.city}
                        lineup={event.lineup}
                        status={event.status}
                    />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    {events.length === 0
                        ? "Aucun événement dans la base de données. Ajoutez-en via le dashboard admin !"
                        : "Aucun événement trouvé."}
                </div>
            )}
        </div>
    );
};

export default Events;
