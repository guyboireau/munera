import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import EventForm from './EventForm';

const EventsManager = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingEvent, setEditingEvent] = useState<any>(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleEdit = (event: any) => {
        setEditingEvent(event);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingEvent(null);
        setIsFormOpen(true);
    };

    const handleSuccess = () => {
        fetchEvents();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Liste des événements</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-munera-violet hover:bg-munera-violet/80 text-white rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    Nouvel événement
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Chargement...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-white/5 rounded-lg border border-white/10">
                    Aucun événement trouvé.
                </div>
            ) : (
                <div className="grid gap-4">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-munera-violet/30 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-munera-dark rounded-lg flex items-center justify-center border border-white/10">
                                    <Calendar className="text-munera-violet" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{event.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        {new Date(event.date).toLocaleDateString()} • {event.city}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${event.status === 'upcoming' ? 'bg-munera-violet/20 text-munera-violet' : 'bg-gray-700/50 text-gray-400'
                                    }`}>
                                    {event.status === 'upcoming' ? 'À venir' : 'Passé'}
                                </span>
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <EventForm
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={handleSuccess}
                    initialData={editingEvent}
                />
            )}
        </div>
    );
};

export default EventsManager;
