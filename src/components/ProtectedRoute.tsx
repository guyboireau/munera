import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const ADMIN_EMAILS = ['admin@munera.fr', 'guyboireau@gmail.com', 'admin@admin.com']; // Add your admin email here

const ProtectedRoute = () => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-munera-violet"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user?.email && !ADMIN_EMAILS.map(e => e.toLowerCase()).includes(user.email.toLowerCase())) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
                <div className="max-w-md w-full bg-zinc-900 p-8 rounded-xl border border-red-500/20 text-center">
                    <div className="text-5xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
                    <p className="text-zinc-400 mb-6">
                        You are logged in as: <br />
                        <span className="text-white font-mono bg-zinc-800 px-2 py-1 rounded mt-2 inline-block">{user.email}</span>
                    </p>
                    <p className="text-sm text-zinc-500 mb-6">
                        This account is not authorized to access the admin panel.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="w-full py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
