import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { supabase, SupabaseProduct } from '../supabaseClient';

const CATEGORIES = ['Cookies', 'Brownies', 'Cakes', 'Coffee & Tea', 'Sides'];

// Aesthetic color presets
const COLOR_PRESETS = [
    { name: 'Charcoal', color: '#1C1C1C' },
    { name: 'Deep Purple', color: '#2D1B4E' },
    { name: 'Forest Green', color: '#1B3D2F' },
    { name: 'Midnight Blue', color: '#1B2838' },
    { name: 'Burgundy', color: '#4A1C2D' },
    { name: 'Dark Teal', color: '#1A3A3A' },
    { name: 'Espresso', color: '#3C2415' },
    { name: 'Slate', color: '#2F3640' },
    { name: 'Rose Gold', color: '#4A3035' },
    { name: 'Ocean', color: '#1B3A4B' },
];

// Size option presets
const SIZE_PRESETS = [
    { name: '1 Piece', price: 'Rs. 500' },
    { name: '2 Pieces', price: 'Rs. 900' },
    { name: '4 Pieces', price: 'Rs. 1600' },
    { name: '6 Pieces', price: 'Rs. 2200' },
    { name: '12 Pieces', price: 'Rs. 4000' },
    { name: 'Small', price: 'Rs. 400' },
    { name: 'Medium', price: 'Rs. 600' },
    { name: 'Large', price: 'Rs. 800' },
    { name: 'Regular', price: 'Rs. 350' },
    { name: 'Hot', price: 'Rs. 400' },
    { name: 'Cold', price: 'Rs. 450' },
    { name: 'Single Serving', price: 'Rs. 550' },
    { name: 'Family Pack', price: 'Rs. 1800' },
    { name: 'Party Box', price: 'Rs. 3500' },
];

interface SizeOption {
    name: string;
    price: string;
}

const ProductForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        description: '',
        category: 'Cookies',
        color: '#1C1C1C',
        image_url: '',
        ingredients: [''],
        size_options: [{ name: '', price: '' }] as SizeOption[],
        is_featured: false,
        is_visible: true,
        display_order: 0,
    });

    // Fetch existing product if editing
    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                alert('Failed to load product');
                navigate('/admin-panel0/products');
                return;
            }

            if (data) {
                setFormData({
                    name: data.name || '',
                    tagline: data.tagline || '',
                    description: data.description || '',
                    category: data.category || 'Cookies',
                    color: data.color || '#1C1C1C',
                    image_url: data.image_url || '',
                    ingredients: data.ingredients?.length ? data.ingredients : [''],
                    size_options: data.size_options?.length ? data.size_options : [{ name: '', price: '' }],
                    is_featured: data.is_featured || false,
                    is_visible: data.is_visible ?? true,
                    display_order: data.display_order || 0,
                });
                setImagePreview(data.image_url || null);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id, navigate]);

    // Image upload with dropzone
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) {
            alert(`Upload failed: ${uploadError.message}`);
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, image_url: publicUrl }));
        setImagePreview(publicUrl);
        setUploading(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxFiles: 1,
    });

    // Form handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleIngredientChange = (index: number, value: string) => {
        setFormData(prev => {
            const newIngredients = [...prev.ingredients];
            newIngredients[index] = value;
            return { ...prev, ingredients: newIngredients };
        });
    };

    const addIngredient = () => {
        setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
    };

    const removeIngredient = (index: number) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    const handleSizeChange = (index: number, field: 'name' | 'price', value: string) => {
        setFormData(prev => {
            const newOptions = [...prev.size_options];
            // Auto-prepend 'Rs. ' if user types a number in price field
            let processedValue = value;
            if (field === 'price' && value && !value.startsWith('Rs.')) {
                // Remove any existing Rs. or Rs prefix and numbers only
                const numericValue = value.replace(/[^0-9]/g, '');
                if (numericValue) {
                    processedValue = `Rs. ${numericValue}`;
                }
            }
            newOptions[index] = { ...newOptions[index], [field]: processedValue };
            return { ...prev, size_options: newOptions };
        });
    };

    const applySizePreset = (preset: { name: string; price: string }) => {
        setFormData(prev => ({
            ...prev,
            size_options: [...prev.size_options.filter(s => s.name || s.price), preset],
        }));
    };

    const addSizeOption = () => {
        setFormData(prev => ({
            ...prev,
            size_options: [...prev.size_options, { name: '', price: 'Rs. ' }],
        }));
    };

    const removeSizeOption = (index: number) => {
        setFormData(prev => ({
            ...prev,
            size_options: prev.size_options.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Clean up empty values
        const cleanedData = {
            ...formData,
            ingredients: formData.ingredients.filter(i => i.trim()),
            size_options: formData.size_options.filter(s => s.name.trim() && s.price.trim()),
        };

        if (cleanedData.size_options.length === 0) {
            alert('Please add at least one size option');
            setSaving(false);
            return;
        }

        try {
            if (isEditing) {
                const { error } = await supabase
                    .from('products')
                    .update(cleanedData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([cleanedData]);
                if (error) throw error;
            }

            navigate('/admin-panel0/products');
        } catch (err: any) {
            alert(`Failed to save: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white/40 text-sm font-bold uppercase tracking-widest animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">
                    {isEditing ? 'Edit Product' : 'Add Product'}
                </h1>
                <p className="text-white/40 text-sm font-medium mt-1">
                    {isEditing ? 'Update details' : 'Create a new product'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-medium placeholder-white/20 focus:border-[#D97B8D] focus:outline-none transition-colors"
                                placeholder="Molten Artifact"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                                Tagline
                            </label>
                            <input
                                type="text"
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-medium placeholder-white/20 focus:border-[#D97B8D] focus:outline-none transition-colors"
                                placeholder="The Thermal Core"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-medium placeholder-white/20 focus:border-[#D97B8D] focus:outline-none transition-colors resize-none"
                            placeholder="Deep valrhona dark chocolate base with a liquid center..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#D97B8D] focus:outline-none transition-colors"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                                Background Color
                            </label>
                            {/* Color Presets */}
                            <div className="mb-3">
                                <select
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#D97B8D] focus:outline-none transition-colors"
                                >
                                    {COLOR_PRESETS.map(preset => (
                                        <option key={preset.color} value={preset.color} className="bg-[#0a0a0a]">
                                            {preset.name}
                                        </option>
                                    ))}
                                    <option value="custom" className="bg-[#0a0a0a]">Custom Color...</option>
                                </select>
                            </div>
                            {/* Color Preview + Custom Picker */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-xl border border-white/10"
                                    style={{ backgroundColor: formData.color }}
                                />
                                <input
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                                />
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-[#D97B8D] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Product Image</h2>

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-[#D97B8D] bg-[#D97B8D]/10' : 'border-white/10 hover:border-white/30'
                            }`}
                    >
                        <input {...getInputProps()} />
                        {uploading ? (
                            <div className="text-white/40">
                                <div className="text-2xl mb-2 animate-pulse">⏳</div>
                                <p className="text-sm font-bold uppercase tracking-widest">Uploading...</p>
                            </div>
                        ) : imagePreview ? (
                            <div className="space-y-4">
                                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl mx-auto border border-white/10" />
                                <p className="text-white/40 text-xs font-medium">Drag a new image or click to replace</p>
                            </div>
                        ) : (
                            <div className="text-white/40">
                                <div className="text-3xl mb-2">📷</div>
                                <p className="text-sm font-bold uppercase tracking-widest mb-1">
                                    {isDragActive ? 'Drop here!' : 'Drag & drop image'}
                                </p>
                                <p className="text-xs text-white/20">or click to browse</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Size Options */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Size Options *</h2>
                        <button
                            type="button"
                            onClick={addSizeOption}
                            className="text-[#D97B8D] text-xs font-bold uppercase tracking-widest hover:text-[#D97B8D]/80 transition-colors"
                        >
                            + Add Custom
                        </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="mb-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Quick Add:</p>
                        <div className="flex flex-wrap gap-2">
                            {SIZE_PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => applySizePreset(preset)}
                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/60 hover:text-white font-medium transition-all"
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current Size Options */}
                    <div className="space-y-3">
                        {formData.size_options.map((option, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={option.name}
                                    onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                                    placeholder="Size name"
                                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-medium placeholder-white/20 focus:border-[#D97B8D] focus:outline-none transition-colors"
                                />
                                <input
                                    type="text"
                                    value={option.price}
                                    onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                                    placeholder="Rs. 0"
                                    className="w-32 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-medium placeholder-white/20 focus:border-[#D97B8D] focus:outline-none transition-colors"
                                />
                                {formData.size_options.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSizeOption(index)}
                                        className="text-red-400 hover:text-red-300 p-2 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ingredients */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Ingredients</h2>
                        <button
                            type="button"
                            onClick={addIngredient}
                            className="text-[#D97B8D] text-xs font-bold uppercase tracking-widest hover:text-[#D97B8D]/80 transition-colors"
                        >
                            + Add Ingredient
                        </button>
                    </div>

                    {/* Emoji Quick-Add */}
                    <div className="mb-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Quick Add Emoji:</p>
                        <div className="flex flex-wrap gap-1">
                            {['🍫', '🍪', '☕', '🥛', '🧈', '🥚', '🍯', '🌰', '🥜', '🍓', '🫐', '🍋', '🍊', '🍌', '🥥', '🌿', '🍵', '🧂', '🍦', '🎂', '🧁', '🍰', '🍩', '🥐', '🍞', '🍮', '🍡', '🍧', '🧇', '🥞', '🍨', '🌸', '🍁', '🧊', '💧', '🌱', '🫚', '🍬', '🍭', '🍿', '🥧', '🍒', '🍑', '🍇', '🥝', '🍍', '🥭', '🫒', '🌶️', '🍎', '🍐', '🥕', '🥄', '🍴'].map((emoji, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        const lastEmptyIdx = formData.ingredients.findIndex(i => !i.trim());
                                        if (lastEmptyIdx >= 0) {
                                            handleIngredientChange(lastEmptyIdx, emoji);
                                        } else {
                                            setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, emoji] }));
                                        }
                                    }}
                                    className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-lg transition-all hover:scale-110"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ingredient List */}
                    <div className="flex flex-wrap gap-3">
                        {formData.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    placeholder="🍫 Dark Cacao"
                                    className="w-40 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-medium placeholder-white/20 focus:border-[#D97B8D] focus:outline-none transition-colors"
                                />
                                {formData.ingredients.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toggle Options */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Visibility</h2>

                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div
                                className={`w-12 h-7 rounded-full relative transition-colors ${formData.is_visible ? 'bg-[#4ade80]' : 'bg-white/20'
                                    }`}
                                onClick={() => setFormData(prev => ({ ...prev, is_visible: !prev.is_visible }))}
                            >
                                <span
                                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.is_visible ? 'left-6' : 'left-1'
                                        }`}
                                />
                            </div>
                            <span className="text-white/60 font-medium text-sm group-hover:text-white transition-colors">
                                Visible on site
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div
                                className={`w-12 h-7 rounded-full relative transition-colors ${formData.is_featured ? 'bg-[#D97B8D]' : 'bg-white/20'
                                    }`}
                                onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                            >
                                <span
                                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.is_featured ? 'left-6' : 'left-1'
                                        }`}
                                />
                            </div>
                            <span className="text-white/60 font-medium text-sm group-hover:text-white transition-colors">
                                Featured product
                            </span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 pb-8">
                    <button
                        type="button"
                        onClick={() => navigate('/admin-panel0/products')}
                        className="px-6 py-4 sm:py-3 text-white/50 font-bold text-sm uppercase tracking-widest hover:text-white active:text-white/80 transition-colors text-center"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-4 bg-[#D97B8D] text-black rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#D97B8D]/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                        {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
