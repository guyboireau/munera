import React, { useEffect, useState } from 'react';
import type { Database } from '../../types/database.types';
import { supabase } from '../../lib/supabase';

type Contestant = Database['public']['Tables']['contestants']['Row'];

const Leaderboard: React.FC = () => {
    const [contestants, setContestants] = useState<Contestant[]>([]);

    useEffect(() => {
        fetchLeaderboard();

        // Realtime subscription
        const subscription = supabase
            .channel('public:contestants')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'contestants' }, (payload) => {
                setContestants(current => {
                    const updated = current.map(c => c.id === payload.new.id ? payload.new as Contestant : c);
                    return updated.sort((a, b) => b.total_votes - a.total_votes).slice(0, 5);
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchLeaderboard = async () => {
        const { data } = await supabase
            .from('contestants')
            .select('*')
            .order('total_votes', { ascending: false })
            .limit(5);

        if (data) setContestants(data);
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-500">🏆</span> Live Leaderboard
            </h3>
            <div className="space-y-3">
                {contestants.map((contestant, index) => (
                    <div key={contestant.id} className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg transition-all hover:bg-zinc-800">
                        <div className={`font-bold text-lg w-8 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-700' : 'text-zinc-500'}`}>
                            #{index + 1}
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                            {contestant.photo_url ? (
                                <img src={contestant.photo_url} alt={contestant.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs">🎧</div>
                            )}
                        </div>
                        <div className="flex-grow min-w-0">
                            <div className="font-bold text-white truncate">{contestant.name}</div>
                            <div className="text-xs text-zinc-500">{contestant.total_votes} votes</div>
                        </div>
                        {index === 0 && <div className="text-yellow-500 text-xl">👑</div>}
                    </div>
                ))}
                {contestants.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No votes yet</div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
