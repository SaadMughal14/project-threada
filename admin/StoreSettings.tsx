import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { StoreSettings as StoreSettingsType } from '../../types';

const StoreSettings = () => {
    const [settings, setSettings] = useState<StoreSettingsType>({
        id: '',
        primary_color: '#000000',
        secondary_color: '#ffffff',
        font_family: 'Inter',
        hero_headline: 'Welcome to Threada',
        hero_image_url: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('store_settings')
                .select('*')
                .single();

            if (data) {
                setSettings(data);
            } else {
                // Init default if none
                // In a real app we might insert a default row here or handling empty state
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('store_settings')
                .upsert(settings);

            if (error) throw error;
            alert('Settings saved!');
        } catch (error: any) {
            alert('Error saving settings: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
            <h1 className="text-2xl font-bold mb-6">Store Settings</h1>

            <div className="space-y-6">
                {/* Branding */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold border-b pb-2">Branding & Visuals</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Primary Color</label>
                            <input
                                type="color"
                                name="primary_color"
                                value={settings.primary_color}
                                onChange={handleChange}
                                className="w-full h-10 p-1 rounded border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Secondary Color</label>
                            <input
                                type="color"
                                name="secondary_color"
                                value={settings.secondary_color}
                                onChange={handleChange}
                                className="w-full h-10 p-1 rounded border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Font Family</label>
                            <input
                                name="font_family"
                                value={settings.font_family}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="e.g. Inter, Playfair Display"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Hero Headline</label>
                            <input
                                name="hero_headline"
                                value={settings.hero_headline}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1">Hero Image URL</label>
                            <input
                                name="hero_image_url"
                                value={settings.hero_image_url || ''}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </section>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 rounded font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                >
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default StoreSettings;
