import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminProducts } from '../hooks/useProducts';

const CATEGORIES = ['All', 'Cookies', 'Brownies', 'Cakes', 'Coffee & Tea', 'Sides'];

const ProductList: React.FC = () => {
    const { products, loading, deleteProduct, toggleVisibility, toggleFeatured, refetch } = useAdminProducts();
    const [filter, setFilter] = useState('All');
    const [deleting, setDeleting] = useState<string | null>(null);

    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.category === filter);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        setDeleting(id);
        const { error } = await deleteProduct(id);
        if (error) {
            alert(`Failed to delete: ${error.message}`);
        }
        setDeleting(null);
    };

    const handleToggleVisibility = async (id: string, currentValue: boolean) => {
        const { error } = await toggleVisibility(id, !currentValue);
        if (error) alert(`Failed to update: ${error.message}`);
    };

    const handleToggleFeatured = async (id: string, currentValue: boolean) => {
        const { error } = await toggleFeatured(id, !currentValue);
        if (error) alert(`Failed to update: ${error.message}`);
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Products</h1>
                    <p className="text-white/40 text-sm font-medium mt-1">Manage your product catalog</p>
                </div>
                <Link
                    to="/admin-panel0/products/new"
                    className="inline-flex items-center gap-2 bg-[#D97B8D] text-[#1C1C1C] px-6 py-3 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#D97B8D]/90 transition-all shadow-lg"
                >
                    <span className="text-lg">➕</span>
                    Add Product
                </Link>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${filter === cat
                                ? 'bg-[#D97B8D] text-[#1C1C1C]'
                                : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-white/40 text-sm font-bold uppercase tracking-widest animate-pulse">
                        Loading...
                    </div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-12 text-center">
                    <div className="text-5xl mb-4">🍪</div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">No Products</h3>
                    <p className="text-white/50 text-sm mb-6">
                        {filter === 'All'
                            ? "You haven't added any products yet."
                            : `No products in the ${filter} category.`}
                    </p>
                    <Link
                        to="/admin-panel0/products/new"
                        className="inline-flex items-center gap-2 bg-[#D97B8D] text-[#1C1C1C] px-8 py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-[#D97B8D]/90 transition-all shadow-lg"
                    >
                        Add Your First Product
                    </Link>
                </div>
            ) : (
                <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Product</th>
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Category</th>
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Price</th>
                                <th className="text-center p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Visible</th>
                                <th className="text-center p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Featured</th>
                                <th className="text-right p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-white/10"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                                                    🍪
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-white text-sm">{product.name}</p>
                                                <p className="text-white/40 text-xs">{product.tagline}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-white/60 text-sm font-medium">{product.category}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[#D97B8D] font-bold text-sm">
                                            {product.size_options?.[0]?.price || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleToggleVisibility(product.id, product.is_visible)}
                                            className={`w-10 h-6 rounded-full relative transition-colors ${product.is_visible ? 'bg-[#4ade80]' : 'bg-white/20'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${product.is_visible ? 'left-5' : 'left-1'
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                                            className={`w-10 h-6 rounded-full relative transition-colors ${product.is_featured ? 'bg-[#D97B8D]' : 'bg-white/20'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${product.is_featured ? 'left-5' : 'left-1'
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin-panel0/products/${product.id}`}
                                                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                disabled={deleting === product.id}
                                                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                                            >
                                                {deleting === product.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Refresh */}
            <div className="mt-6 text-center">
                <button
                    onClick={() => refetch()}
                    className="text-white/30 hover:text-white/60 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                    ↻ Refresh List
                </button>
            </div>
        </div>
    );
};

export default ProductList;
