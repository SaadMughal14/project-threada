import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Outlet } from 'react-router-dom';

const KitchenLayout: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setAuthenticated(true);
            } else {
                navigate('/kitchen');
            }
            setLoading(false);
        };
        checkAuth();

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                navigate('/kitchen');
            }
        });

        return () => { listener.subscription.unsubscribe(); };
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/kitchen');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white/50 text-lg font-bold animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!authenticated) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="bg-[#111] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <span className="text-2xl">👨‍🍳</span>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Kitchen Dashboard</h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Order Management</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                    Logout
                </button>
            </header>

            {/* Main Content */}
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default KitchenLayout;
