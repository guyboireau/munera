import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type HomeImage = Database['public']['Tables']['home_images']['Row'];

const HomeManager = () => {
    const [images, setImages] = useState<HomeImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [randomMode, setRandomMode] = useState(false);

    useEffect(() => {
        fetchImages();
        fetchSettings();
    }, []);

    const fetchImages = async () => {
        const { data } = await (supabase.from('home_images') as any)
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setImages(data);
    };

    const fetchSettings = async () => {
        const { data } = await (supabase.from('app_settings') as any)
            .select('*')
            .eq('key', 'home_gallery_random_mode')
            .single();

        if (data && data.value) {
            setRandomMode(data.value.enabled);
        }
    };

    const toggleRandomMode = async () => {
        const newValue = !randomMode;
        setRandomMode(newValue);

        const { error } = await (supabase.from('app_settings') as any)
            .upsert({
                key: 'home_gallery_random_mode',
                value: { enabled: newValue }
            });

        if (error) {
            alert("Error saving setting: " + error.message);
            setRandomMode(!newValue); // Revert on error
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true);
            if (!e.target.files || e.target.files.length === 0) return;

            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('home-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('home-images').getPublicUrl(filePath);

                const { error: dbError } = await (supabase.from('home_images') as any)
                    .insert({
                        url: urlData.publicUrl,
                        active: true
                    });

                if (dbError) throw dbError;
            }

            fetchImages();
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (image: HomeImage) => {
        const { error } = await (supabase.from('home_images') as any)
            .update({ active: !image.active })
            .eq('id', image.id);

        if (!error) fetchImages();
    };

    const handleDelete = async (image: HomeImage) => {
        if (!window.confirm('Delete this image?')) return;

        // Note: We should ideally delete from storage too, but for now just DB
        const { error } = await (supabase.from('home_images') as any)
            .delete()
            .eq('id', image.id);

        if (!error) fetchImages();
    };

    return (
        <div className="space-y-8 text-white">
            <div className="bg-zinc-800/50 border border-white/10 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span>🖼️</span> Home Gallery
                    </h3>
                    <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-sm text-zinc-400">Random Mode</span>
                        <button
                            onClick={toggleRandomMode}
                            className={`w-12 h-6 rounded-full transition-colors relative ${randomMode ? 'bg-green-500' : 'bg-zinc-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${randomMode ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block w-full cursor-pointer bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-orange-500 rounded-xl p-8 text-center transition-colors">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={loading}
                        />
                        <div className="text-4xl mb-2">📤</div>
                        <p className="font-bold text-lg">Click to Upload Images</p>
                        <p className="text-zinc-500 text-sm">Supports multiple files</p>
                        {loading && <p className="text-orange-500 mt-2">Uploading...</p>}
                    </label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map(img => (
                        <div key={img.id} className={`relative group rounded-lg overflow-hidden border-2 transition-colors ${img.active ? 'border-green-500/50' : 'border-red-500/50 opacity-50'}`}>
                            <div className="aspect-square">
                                <img src={img.url} className="w-full h-full object-cover" />
                            </div>

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <button
                                    onClick={() => toggleActive(img)}
                                    className={`px-3 py-1 rounded text-xs font-bold ${img.active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                    {img.active ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                    onClick={() => handleDelete(img)}
                                    className="px-3 py-1 rounded text-xs font-bold bg-zinc-700 hover:bg-zinc-600"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${img.active ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                    ))}
                </div>

                {images.length === 0 && (
                    <p className="text-center text-zinc-500 py-10">No images uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default HomeManager;
