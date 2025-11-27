import React, { useState, useEffect } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const GalleryManager = () => {
    const [uploading, setUploading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [photos, setPhotos] = useState<any[]>([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            fetchPhotos(selectedEvent);
        } else {
            setPhotos([]);
        }
    }, [selectedEvent]);

    const fetchEvents = async () => {
        const { data } = await supabase.from('events').select('id, name').order('date', { ascending: false });
        setEvents(data || []);
    };

    const fetchPhotos = async (eventId: string) => {
        const { data } = await supabase
            .from('media')
            .select('*')
            .eq('event_id', eventId)
            .eq('type', 'photo');
        setPhotos(data || []);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !selectedEvent) return;

        try {
            setUploading(true);
            const files = Array.from(e.target.files);

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${selectedEvent}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('event-photos')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('event-photos')
                    .getPublicUrl(filePath);

                await supabase.from('media').insert({
                    event_id: selectedEvent,
                    url: publicUrl,
                    type: 'photo'
                } as any);
            }

            fetchPhotos(selectedEvent);
        } catch (error) {
            console.error('Error uploading photos:', error);
            alert('Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, url: string) => {
        if (!window.confirm('Supprimer cette photo ?')) return;

        try {
            // Extract path from URL for storage deletion
            // This is a bit hacky, ideally we store the path in DB
            const path = url.split('/').pop();
            if (path) {
                await supabase.storage.from('event-photos').remove([`${selectedEvent}/${path}`]);
            }

            await supabase.from('media').delete().eq('id', id);
            fetchPhotos(selectedEvent);
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Sélectionner un événement</label>
                <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                >
                    <option value="">Choisir un événement...</option>
                    {events.map((event) => (
                        <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                </select>
            </div>

            {selectedEvent && (
                <>
                    <div className="mb-8">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-munera-violet/50 transition-colors bg-white/5">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-400">
                                    <span className="font-semibold">Ajouter des photos</span>
                                </p>
                                <p className="text-xs text-gray-500">Sélection multiple possible</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </label>
                        {uploading && <p className="text-center text-munera-violet mt-2">Upload en cours...</p>}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="group relative aspect-square bg-black/50 rounded-lg overflow-hidden border border-white/10">
                                <img src={photo.url} alt="Event" className="w-full h-full object-cover" />

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(photo.id, photo.url)}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GalleryManager;
