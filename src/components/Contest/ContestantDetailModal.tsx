import React from 'react';
import { X, Play, ExternalLink } from 'lucide-react';
import type { Database } from '../../types/database.types';

type Contestant = Database['public']['Tables']['contestants']['Row'];

interface ContestantDetailModalProps {
    contestant: Contestant;
    isOpen: boolean;
    onClose: () => void;
    onVote: (contestant: Contestant) => void;
}

const ContestantDetailModal: React.FC<ContestantDetailModalProps> = ({ contestant, isOpen, onClose, onVote }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative aspect-square md:aspect-auto h-64 md:h-full bg-zinc-800">
                        {contestant.photo_url ? (
                            <img
                                src={contestant.photo_url}
                                alt={contestant.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-6xl">
                                🎧
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent md:hidden" />
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 flex flex-col h-full">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-white mb-2">{contestant.name}</h2>
                            <div className="flex items-center gap-2 text-orange-500 font-mono text-sm">
                                <span>#{contestant.id.slice(0, 4)}</span>
                                <span>•</span>
                                <span>{contestant.total_votes} votes</span>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto max-h-48 mb-6 pr-2 custom-scrollbar">
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {contestant.bio || "No bio available for this artist."}
                            </p>
                        </div>

                        <div className="space-y-4 mt-auto">
                            {contestant.soundcloud_url && (
                                <a
                                    href={contestant.soundcloud_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-3 bg-[#ff5500] hover:bg-[#ff5500]/90 text-white font-bold rounded-lg transition-all group"
                                >
                                    <Play size={20} className="fill-current" />
                                    <span>Listen on SoundCloud</span>
                                    <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                </a>
                            )}

                            <button
                                onClick={() => {
                                    onVote(contestant);
                                    onClose();
                                }}
                                className="w-full py-3 bg-white text-black hover:bg-zinc-200 font-bold rounded-lg transition-colors uppercase tracking-wide"
                            >
                                Vote for {contestant.name}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestantDetailModal;
