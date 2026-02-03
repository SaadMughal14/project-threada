import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Settings: React.FC = () => {
    const [supabaseUrl, setSupabaseUrl] = useState('');
    const [supabaseKey, setSupabaseKey] = useState('');
    const [discordWebhook, setDiscordWebhook] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Load keys from LocalStorage
        const storedUrl = localStorage.getItem('sb_url') || '';
        const storedKey = localStorage.getItem('sb_key') || '';
        setSupabaseUrl(storedUrl);
        setSupabaseKey(storedKey);

        // Load Webhook from DB
        const fetchWebhook = async () => {
            try {
                // We assume a 'settings' table exists with column 'key' and 'value'
                const { data, error } = await supabase
                    .from('settings')
                    .select('value')
                    .eq('key', 'discord_webhook')
                    .single();

                if (data) {
                    setDiscordWebhook(data.value);
                }
            } catch (err) {
                console.log('Error fetching webhook setting:', err);
                // It's okay if it fails first time (table might not exist yet)
            }
        };

        fetchWebhook();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // 1. Save keys to LocalStorage
            localStorage.setItem('sb_url', supabaseUrl.trim());
            localStorage.setItem('sb_key', supabaseKey.trim());

            // 2. Save Webhook to DB
            // First check if Supabase is connected/working
            if (!supabaseUrl || !supabaseKey) {
                // warning but proceed
            }

            const { error: dbError } = await supabase
                .from('settings')
                .upsert({ key: 'discord_webhook', value: discordWebhook.trim() })
                .select();

            if (dbError) {
                console.error('DB Error:', dbError);
                setMessage({ type: 'error', text: 'Saved local keys, but failed to save Webhook to DB (Check database setup).' });
            } else {
                setMessage({ type: 'success', text: 'Settings saved successfully! Refresh the page to apply Supabase Key changes.' });
            }

        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">Settings</h1>
                <p className="text-white/40 text-sm font-medium mt-1">Configure your application</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

                {/* Supabase Config */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8">
                    <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <span className="text-xl">⚡</span> Supabase Configuration
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Project URL</label>
                            <input
                                type="text"
                                value={supabaseUrl}
                                onChange={(e) => setSupabaseUrl(e.target.value)}
                                placeholder="https://your-project.supabase.co"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#D97B8D] transition-colors font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Anon / Public Key</label>
                            <input
                                type="password"
                                value={supabaseKey}
                                onChange={(e) => setSupabaseKey(e.target.value)}
                                placeholder="eyJh..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#D97B8D] transition-colors font-mono text-sm"
                            />
                        </div>
                        <p className="text-xs text-white/30 italic">These keys are stored locally in your browser. Refresh page after updating.</p>
                    </div>
                </div>

                {/* Integrations */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8">
                    <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <span className="text-xl">🤖</span> Integrations
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Discord Webhook URL</label>
                            <input
                                type="text"
                                value={discordWebhook}
                                onChange={(e) => setDiscordWebhook(e.target.value)}
                                placeholder="https://discord.com/api/webhooks/..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#D97B8D] transition-colors font-mono text-sm"
                            />
                        </div>
                        <p className="text-xs text-white/30 italic">Used for order notifications. Stored securely in database.</p>
                    </div>
                </div>

                {/* Feedback */}
                {message && (
                    <div className={`p-4 rounded-xl text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#D97B8D] text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#D97B8D]/90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Settings;
