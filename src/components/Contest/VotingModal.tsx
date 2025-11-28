import React, { useState, useEffect } from 'react';
import type { Database } from '../../types/database.types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

type Contestant = Database['public']['Tables']['contestants']['Row'];

interface VotingModalProps {
    contestant: Contestant | null;
    isOpen: boolean;
    onClose: () => void;
    onVoteSuccess: () => void;
}

const VotingModal: React.FC<VotingModalProps> = ({ contestant, isOpen, onClose, onVoteSuccess }) => {
    const { user, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        if (isOpen && user && contestant) {
            checkIfVoted();
        }
    }, [isOpen, user, contestant]);

    const checkIfVoted = async () => {
        if (!user || !contestant) return;

        // Check if user already voted in this contest
        const { data, error } = await supabase
            .from('votes')
            .select('*')
            .eq('user_id', user.id)
            .eq('contest_id', contestant.contest_id)
            .single();

        if (data) {
            setHasVoted(true);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.href,
            },
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Check your email for the login link!' });
        }
        setLoading(false);
    };

    const handleVote = async () => {
        if (!user || !contestant) return;
        setLoading(true);
        setMessage(null);

        try {
            // 1. Insert Vote
            const { error: voteError } = await supabase
                .from('votes')
                .insert({
                    user_id: user.id,
                    contest_id: contestant.contest_id,
                    contestant_id: contestant.id,
                    voted_at: new Date().toISOString()
                });

            if (voteError) {
                if (voteError.code === '23505') { // Unique violation
                    throw new Error("You have already voted in this contest.");
                }
                throw voteError;
            }

            // 2. Increment count (RPC)
            const { error: incrementError } = await supabase.rpc('increment_vote', { row_id: contestant.id });
            if (incrementError) console.error("RPC Error:", incrementError);

            onVoteSuccess();
            onClose();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !contestant) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Vote for {contestant.name}</h2>

                {authLoading ? (
                    <div className="py-8 text-center text-zinc-400">Loading...</div>
                ) : !user ? (
                    // LOGIN FORM
                    <div className="space-y-4">
                        <p className="text-zinc-400">Please login with your email to vote. No password required.</p>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-white text-black hover:bg-zinc-200 font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Sending Link...' : 'Send Magic Link'}
                            </button>
                        </form>
                    </div>
                ) : hasVoted ? (
                    // ALREADY VOTED
                    <div className="py-6 text-center">
                        <div className="text-orange-500 text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-white mb-2">You have already voted</h3>
                        <p className="text-zinc-400">Only one vote per person is allowed for this contest.</p>
                    </div>
                ) : (
                    // VOTE CONFIRMATION
                    <div className="space-y-6">
                        <p className="text-zinc-400">
                            You are logged in as <span className="text-white font-bold">{user.email}</span>.
                        </p>
                        <div className="bg-zinc-800/50 p-4 rounded-lg flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700">
                                {contestant.photo_url && <img src={contestant.photo_url} className="w-full h-full object-cover" />}
                            </div>
                            <div className="font-bold text-lg">{contestant.name}</div>
                        </div>
                        <button
                            onClick={handleVote}
                            disabled={loading}
                            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Confirm Vote'}
                        </button>
                    </div>
                )}

                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotingModal;
