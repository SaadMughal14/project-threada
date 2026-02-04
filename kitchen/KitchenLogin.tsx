import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const KitchenLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            setError(authError.message);
        } else {
            navigate('/kitchen/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tight">
                        Kitchen <span className="text-[#D97B8D]">Portal</span>
                    </h1>
                    <p className="text-white/30 text-sm mt-2 font-medium">Staff Login</p>
                </div>

                <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#D97B8D] transition-colors"
                            placeholder="staff@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#D97B8D] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D97B8D] text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#D97B8D]/90 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Enter Kitchen'}
                    </button>
                </form>

                <p className="text-center text-white/20 text-xs mt-6">
                    GRAVITY STUDIO — Kitchen Management
                </p>
            </div>
        </div>
    );
};

export default KitchenLogin;
