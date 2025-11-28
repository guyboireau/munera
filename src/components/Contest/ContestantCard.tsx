import React from 'react';
import type { Database } from '../../types/database.types';

type Contestant = Database['public']['Tables']['contestants']['Row'];

interface ContestantCardProps {
    contestant: Contestant;
    onVote: (contestant: Contestant) => void;
    onSelect: (contestant: Contestant) => void;
}

const ContestantCard: React.FC<ContestantCardProps> = ({ contestant, onVote, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(contestant)}
            className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 group flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
        >
            <div className="relative aspect-square overflow-hidden bg-zinc-800">
                {contestant.photo_url ? (
                    <img
                        src={contestant.photo_url}
                        alt={contestant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <span className="text-4xl">🎧</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{contestant.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="bg-white/10 px-2 py-1 rounded-full">Click for details</span>
                    </div>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <p className="text-zinc-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {contestant.bio || "No bio available."}
                </p>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onVote(contestant);
                    }}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm z-10 relative"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Vote for me
                </button>
            </div>
        </div>
    );
};

export default ContestantCard;
