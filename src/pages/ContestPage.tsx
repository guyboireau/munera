import React, { useEffect, useState } from 'react';
import type { Database } from '../types/database.types';
import { supabase } from '../lib/supabase';
import ContestantCard from '../components/Contest/ContestantCard';
import ContestantDetailModal from '../components/Contest/ContestantDetailModal';
import VotingModal from '../components/Contest/VotingModal';
import Leaderboard from '../components/Contest/Leaderboard';

type Contestant = Database['public']['Tables']['contestants']['Row'];

const ContestPage: React.FC = () => {
    const [contestants, setContestants] = useState<Contestant[]>([]);
    const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
    const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        fetchContestants();
    }, []);

    const fetchContestants = async () => {
        const { data } = await supabase
            .from('contestants')
            .select('*')
            .order('name');

        if (data) setContestants(data);
    };

    const handleVoteClick = (contestant: Contestant) => {
        setSelectedContestant(contestant);
        setIsVotingModalOpen(true);
    };

    const handleContestantSelect = (contestant: Contestant) => {
        setSelectedContestant(contestant);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">

            <main className="flex-grow container mx-auto px-4 py-12 mt-16">
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-600 relative z-10">
                        DJ CONTEST 2026
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto relative z-10">
                        Discover the next generation of talent. Listen to their mixes and vote for your favorite using the code on your ticket.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                    <div className="lg:col-span-3">
                        {contestants.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {contestants.map(contestant => (
                                    <ContestantCard
                                        key={contestant.id}
                                        contestant={contestant}
                                        onVote={handleVoteClick}
                                        onSelect={handleContestantSelect}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
                                <p className="text-xl">No contestants announced yet.</p>
                                <p className="text-sm mt-2">Stay tuned!</p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <Leaderboard />

                            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4">How to Vote</h3>
                                <ol className="list-decimal list-inside text-zinc-400 space-y-3 text-sm">
                                    <li>Listen to the mixes by clicking on the DJs.</li>
                                    <li>Click <span className="text-orange-500 font-bold">"VOTE FOR ME"</span> on your favorite DJ.</li>
                                    <li>Enter your email address to receive a secure login link.</li>
                                    <li>Confirm your vote!</li>
                                </ol>
                                <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-600">
                                    * One vote per person. Email verification required to prevent fraud.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <VotingModal
                contestant={selectedContestant}
                isOpen={isVotingModalOpen}
                onClose={() => setIsVotingModalOpen(false)}
                onVoteSuccess={() => {
                    alert("✅ Vote registered successfully! Thank you for supporting the artists.");
                }}
            />

            {selectedContestant && (
                <ContestantDetailModal
                    contestant={selectedContestant}
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    onVote={(c) => {
                        setIsDetailModalOpen(false);
                        handleVoteClick(c);
                    }}
                />
            )}
        </div>
    );
};

export default ContestPage;
