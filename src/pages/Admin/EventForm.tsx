import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

interface EventFormData {
    name: string;
    date: string;
    venue: string;
    city: string;
    status: 'upcoming' | 'past';
    lineup: { name: string }[];
    description: string;
    shotgun_link: string;
    flyer?: FileList;
}

interface EventFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // To be typed properly
}

const EventForm: React.FC<EventFormProps> = ({ onClose, onSuccess, initialData }) => {
    // Format date for datetime-local input
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const { register, control, handleSubmit } = useForm<EventFormData>({
        defaultValues: initialData ? {
            ...initialData,
            date: formatDateForInput(initialData.date),
            lineup: initialData.lineup.map((l: string) => ({ name: l }))
        } : {
            status: 'upcoming',
            lineup: [{ name: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lineup"
    });

    const [uploading, setUploading] = useState(false);
    const [geocoding, setGeocoding] = useState(false);
    const [addressError, setAddressError] = useState('');

    // Geocode address using Nominatim (OpenStreetMap)
    const geocodeAddress = async (venue: string, city: string): Promise<{ lat: number; lon: number } | null> => {
        try {
            const query = `${venue}, ${city}, France`;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon)
                };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };

    const onSubmit = async (data: EventFormData) => {
        try {
            setUploading(true);
            setAddressError('');
            let flyerUrl = initialData?.flyer_url;

            // Geocode address
            setGeocoding(true);
            const coordinates = await geocodeAddress(data.venue, data.city);
            setGeocoding(false);

            if (!coordinates) {
                setAddressError('Impossible de localiser l\'adresse. Vérifiez le lieu et la ville.');
                setUploading(false);
                return;
            }

            // Upload flyer if exists
            if (data.flyer && data.flyer.length > 0) {
                const file = data.flyer[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('flyers')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('flyers')
                    .getPublicUrl(filePath);

                flyerUrl = publicUrl;
            }

            const eventData = {
                name: data.name,
                date: new Date(data.date).toISOString(),
                venue: data.venue,
                city: data.city,
                status: data.status,
                lineup: data.lineup.map(l => l.name),
                description: data.description || null,
                shotgun_link: data.shotgun_link || null,
                flyer_url: flyerUrl || null,
                latitude: coordinates.lat,
                longitude: coordinates.lon
            };

            if (initialData) {
                const { error } = await supabase
                    .from('events')
                    // @ts-ignore - Supabase type inference issue with Database types
                    .update(eventData as EventUpdate)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('events')
                    // @ts-ignore - Supabase type inference issue with Database types
                    .insert([eventData as EventInsert]);
                if (error) throw error;
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Erreur lors de la sauvegarde');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-munera-darker border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-munera-darker z-10">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Modifier l\'événement' : 'Nouvel événement'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nom</label>
                            <input
                                {...register("name", { required: true })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                            <input
                                type="datetime-local"
                                {...register("date", { required: true })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Lieu</label>
                            <input
                                {...register("venue", { required: true })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Ville</label>
                            <input
                                {...register("city", { required: true })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                            />
                        </div>
                    </div>
                    {addressError && (
                        <div className="col-span-2">
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                                {addressError}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Statut</label>
                        <select
                            {...register("status")}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                        >
                            <option value="upcoming">À venir</option>
                            <option value="past">Passé</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Lineup</label>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        {...register(`lineup.${index}.name` as const, { required: true })}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                                        placeholder="Artiste"
                                    />
                                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-400">
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => append({ name: "" })}
                                className="flex items-center gap-2 text-sm text-munera-violet hover:text-white"
                            >
                                <Plus size={16} /> Ajouter un artiste
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea
                            {...register("description")}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Lien Shotgun</label>
                        <input
                            {...register("shotgun_link")}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                            placeholder="https://shotgun.live/..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Flyer</label>

                        {/* Current flyer preview */}
                        {initialData?.flyer_url && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">Flyer actuel :</p>
                                <div className="relative w-full max-w-xs mx-auto">
                                    <img
                                        src={initialData.flyer_url}
                                        alt="Flyer actuel"
                                        className="w-full h-auto rounded-lg border border-white/10"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">Uploadez une nouvelle image pour remplacer</p>
                            </div>
                        )}

                        <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer relative hover:border-munera-violet/50">
                            <input
                                type="file"
                                accept="image/*"
                                {...register("flyer")}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="mx-auto text-gray-500 mb-2" />
                            <p className="text-sm text-gray-400">
                                {initialData?.flyer_url ? 'Cliquez pour changer le flyer' : 'Cliquez pour uploader'}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={uploading || geocoding}
                            className="px-6 py-2 bg-munera-violet hover:bg-munera-violet/80 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {geocoding ? 'Vérification de l\'adresse...' : uploading ? 'Sauvegarde...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
