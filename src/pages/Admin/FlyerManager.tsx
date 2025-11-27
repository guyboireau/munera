import React, { useState, useEffect } from 'react';
import { Upload, X, Copy, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const FlyerManager = () => {
    const [uploading, setUploading] = useState(false);
    const [flyers, setFlyers] = useState<{ name: string; url: string }[]>([]);
    const [copied, setCopied] = useState<string | null>(null);

    const fetchFlyers = async () => {
        const { data, error } = await supabase.storage.from('flyers').list();
        if (error) {
            console.error('Error fetching flyers:', error);
            return;
        }

        const flyersWithUrls = data.map(file => {
            const { data: { publicUrl } } = supabase.storage.from('flyers').getPublicUrl(file.name);
            return { name: file.name, url: publicUrl };
        });

        setFlyers(flyersWithUrls);
    };

    useEffect(() => {
        fetchFlyers();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error } = await supabase.storage.from('flyers').upload(filePath, file);
            if (error) throw error;

            fetchFlyers();
        } catch (error) {
            console.error('Error uploading flyer:', error);
            alert('Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (name: string) => {
        if (!window.confirm('Supprimer ce flyer ?')) return;

        try {
            const { error } = await supabase.storage.from('flyers').remove([name]);
            if (error) throw error;
            fetchFlyers();
        } catch (error) {
            console.error('Error deleting flyer:', error);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopied(url);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div>
            <div className="mb-8">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-munera-violet/50 transition-colors bg-white/5">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
                {uploading && <p className="text-center text-munera-violet mt-2">Upload en cours...</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {flyers.map((flyer) => (
                    <div key={flyer.name} className="group relative aspect-[4/5] bg-black/50 rounded-lg overflow-hidden border border-white/10">
                        <img src={flyer.url} alt={flyer.name} className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <button
                                onClick={() => copyToClipboard(flyer.url)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                title="Copier l'URL"
                            >
                                {copied === flyer.url ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                            </button>
                            <button
                                onClick={() => handleDelete(flyer.name)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-500 transition-colors"
                                title="Supprimer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlyerManager;
