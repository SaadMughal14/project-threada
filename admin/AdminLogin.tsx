import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            navigate('/admin-panel0', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error: signInError } = await signIn(email, password);

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
            } else {
                // Successful login - navigate to dashboard
                navigate('/admin-panel0', { replace: true });
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    // Show loading while checking auth state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
                <div className="text-white/40 text-sm font-bold uppercase tracking-widest animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-lg">
                            <circle cx="50" cy="50" r="45" fill="#D97B8D" />
                            <circle cx="35" cy="35" r="5" fill="#4A3728" />
                            <circle cx="65" cy="40" r="6" fill="#4A3728" />
                            <circle cx="45" cy="65" r="7" fill="#4A3728" />
                            <circle cx="70" cy="70" r="4" fill="#4A3728" />
                            <circle cx="25" cy="60" r="4" fill="#4A3728" />
                        </svg>
                    </div>
                    <h1 className="font-black text-2xl tracking-tight uppercase text-white">
                        <span>GRAV</span><span className="text-[#D97B8D]">ITY</span>
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-[0.3em] mt-2">Admin Panel</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 backdrop-blur-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-medium placeholder-white/20 focus:border-[#D97B8D] focus:outline-none transition-colors"
                                placeholder="admin@gravity.com"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-medium placeholder-white/20 focus:border-[#D97B8D] focus:outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D97B8D] text-[#1C1C1C] py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-[#D97B8D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-white/20 text-[10px] mt-6 font-medium">
                    Protected admin area. Authorized access only.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
