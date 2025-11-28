import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type Contestant = Database['public']['Tables']['contestants']['Row'];

const ContestManager = () => {
    const [contestants, setContestants] = useState<Contestant[]>([]);
    const [newContestant, setNewContestant] = useState({ name: '', bio: '', soundcloud_url: '', photo_url: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchContestants();
    }, []);

    const fetchContestants = async () => {
        const { data } = await supabase.from('contestants').select('*').order('total_votes', { ascending: false });
        if (data) setContestants(data);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('contest-photos')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('contest-photos').getPublicUrl(filePath);

            setNewContestant({ ...newContestant, photo_url: data.publicUrl });
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (contestant: Contestant) => {
        setNewContestant({
            name: contestant.name,
            bio: contestant.bio || '',
            soundcloud_url: contestant.soundcloud_url || '',
            photo_url: contestant.photo_url || ''
        });
        setEditingId(contestant.id);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewContestant({ name: '', bio: '', soundcloud_url: '', photo_url: '' });
        setEditingId(null);
    };

    const handleAddContestant = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                // Update existing
                const { error } = await (supabase.from('contestants') as any).update({
                    name: newContestant.name,
                    bio: newContestant.bio,
                    soundcloud_url: newContestant.soundcloud_url,
                    photo_url: newContestant.photo_url
                }).eq('id', editingId);

                if (error) throw error;
                alert("Contestant updated!");
            } else {
                // Create new
                // First get or create a contest
                let contestId;
                const { data: contests } = await (supabase.from('contest_editions') as any).select('id').limit(1);
                if (contests && contests.length > 0) {
                    contestId = contests[0].id;
                } else {
                    const { data: newContest } = await (supabase.from('contest_editions') as any).insert({
                        name: 'Default Contest',
                        start_date: new Date().toISOString(),
                        end_date: new Date(Date.now() + 86400000 * 30).toISOString(),
                        status: 'active'
                    }).select().single();
                    if (newContest) contestId = newContest.id;
                }

                if (!contestId) throw new Error("Could not get contest ID");

                const { error } = await (supabase.from('contestants') as any).insert({
                    name: newContestant.name,
                    bio: newContestant.bio,
                    soundcloud_url: newContestant.soundcloud_url,
                    photo_url: newContestant.photo_url,
                    contest_id: contestId
                });

                if (error) throw error;
                alert("Contestant added!");
            }

            handleCancelEdit();
            fetchContestants();
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 text-white">
            <div className="bg-zinc-800/50 border border-white/10 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>🎤</span> {editingId ? 'Edit Contestant' : 'Add Contestant'}
                </h3>
                <form onSubmit={handleAddContestant} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="bg-zinc-900 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        placeholder="Name"
                        value={newContestant.name}
                        onChange={e => setNewContestant({ ...newContestant, name: e.target.value })}
                        required
                    />
                    <input
                        className="bg-zinc-900 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        placeholder="Soundcloud URL"
                        value={newContestant.soundcloud_url}
                        onChange={e => setNewContestant({ ...newContestant, soundcloud_url: e.target.value })}
                    />

                    <div className="md:col-span-2">
                        <label className="block text-sm text-zinc-400 mb-2">Photo</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="block w-full text-sm text-zinc-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-orange-500 file:text-white
                                hover:file:bg-orange-600
                                "
                            />
                            {uploading && <span className="text-sm text-orange-400">Uploading...</span>}
                        </div>
                        {newContestant.photo_url && (
                            <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-700">
                                <img src={newContestant.photo_url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <textarea
                        className="bg-zinc-900 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-orange-500 md:col-span-2"
                        placeholder="Bio"
                        value={newContestant.bio}
                        onChange={e => setNewContestant({ ...newContestant, bio: e.target.value })}
                    />
                    <div className="md:col-span-2 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (editingId ? 'Update Contestant' : 'Add Contestant')}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-zinc-800/50 border border-white/10 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>📊</span> Manage Contestants
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {contestants.map((c, i) => (
                        <div key={c.id} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="text-zinc-500 font-mono w-6">#{i + 1}</span>
                                {c.photo_url && <img src={c.photo_url} className="w-8 h-8 rounded-full object-cover" />}
                                <span className="font-bold">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded text-sm font-bold">
                                    {c.total_votes} votes
                                </span>
                                <button
                                    onClick={() => handleEdit(c)}
                                    className="text-blue-500 hover:text-blue-400 p-1"
                                    title="Edit"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to delete this contestant?')) {
                                            await supabase.from('contestants').delete().eq('id', c.id);
                                            fetchContestants();
                                        }
                                    }}
                                    className="text-red-500 hover:text-red-400 p-1"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    {contestants.length === 0 && <p className="text-zinc-500">No contestants yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ContestManager;
