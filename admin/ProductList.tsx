import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminProducts } from '../hooks/useProducts';

const CATEGORIES = ['All', 'Cookies', 'Brownies', 'Cakes', 'Coffee & Tea', 'Sides'];

const ProductList: React.FC = () => {
    // Cast to include updateDisplayOrder which we added to the implementation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { products, loading, deleteProduct, toggleVisibility, toggleFeatured, refetch, updateDisplayOrder } = useAdminProducts() as any;
    const [filter, setFilter] = useState('All');
    const [deleting, setDeleting] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const filteredProducts = filter === 'All'
        ? products
        : products.filter((p: any) => p.category === filter);

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

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, id: string) => {
        if (filter !== 'All') return;
        setDraggedItem(id);
        e.dataTransfer.effectAllowed = 'move';
        // Optional: set custom drag image
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (filter !== 'All' || !draggedItem || draggedItem === targetId) return;
        // Logic to show placeholder could go here, but for simple sorting we just allow drop
    };

    const handleDrop = async (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (filter !== 'All' || !draggedItem || draggedItem === targetId) return;

        const sourceIndex = filteredProducts.findIndex((p: any) => p.id === draggedItem);
        const targetIndex = filteredProducts.findIndex((p: any) => p.id === targetId);

        if (sourceIndex === -1 || targetIndex === -1) return;

        // Create new array with swapped items
        const newProducts = [...filteredProducts];
        const [removed] = newProducts.splice(sourceIndex, 1);
        newProducts.splice(targetIndex, 0, removed);

        // Calculate new display orders (1-based index)
        const updates = newProducts.map((p: any, idx: number) => ({
            id: p.id,
            display_order: idx + 1
        }));

        setDraggedItem(null);

        if (updateDisplayOrder) {
            await updateDisplayOrder(updates);
        }
    };

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">Products</h1>
                    <p className="text-white/40 text-sm font-medium mt-1">
                        Manage your catalog •
                        {filter === 'All' ? (
                            <span className="text-[#D97B8D]"> Drag to reorder</span>
                        ) : (
                            <span className="text-white/20"> Switch to 'All' to reorder</span>
                        )}
                    </p>
                </div>
                <Link
                    to="/admin-panel0/products/new"
                    className="flex items-center justify-center gap-2 bg-[#D97B8D] text-black px-6 py-4 lg:py-3 rounded-xl font-black uppercase text-xs tracking-[0.15em] hover:bg-[#D97B8D]/90 active:scale-[0.98] transition-all shadow-lg"
                >
                    <span className="text-lg">➕</span>
                    Add Product
                </Link>
            </div>

            {/* Category Filter - Horizontal Scroll on Mobile */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2.5 lg:py-2 rounded-lg font-bold text-xs uppercase tracking-wide lg:tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${filter === cat
                            ? 'bg-[#D97B8D] text-black'
                            : 'bg-white/5 text-white/50 hover:text-white active:bg-white/10'
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
                <div className="bg-[#0a0a0a] border border-white/5 rounded-xl lg:rounded-2xl p-8 lg:p-12 text-center">
                    <div className="text-4xl lg:text-5xl mb-3 lg:mb-4">🍪</div>
                    <h3 className="text-lg lg:text-xl font-black text-white uppercase tracking-tight mb-2">No Products</h3>
                    <p className="text-white/50 text-sm mb-4 lg:mb-6">
                        {filter === 'All'
                            ? "No products yet."
                            : `No products in ${filter}.`}
                    </p>
                    <Link
                        to="/admin-panel0/products/new"
                        className="inline-flex items-center gap-2 bg-[#D97B8D] text-black px-6 lg:px-8 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#D97B8D]/90 active:scale-[0.98] transition-all shadow-lg"
                    >
                        Add Product
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile: Card Layout (Draggable) */}
                    <div className="lg:hidden space-y-3">
                        {filteredProducts.map((product: any) => (
                            <div
                                key={product.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, product.id)}
                                onDragOver={(e) => handleDragOver(e, product.id)}
                                onDrop={(e) => handleDrop(e, product.id)}
                                className={`bg-[#0a0a0a] border border-white/5 rounded-xl p-4 transition-opacity ${draggedItem === product.id ? 'opacity-30 border-dashed border-[#D97B8D]' : ''}`}
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="mt-1 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h8M8 12h8M8 18h8" /></svg>
                                    </div>
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-white/10"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                                            🍪
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white text-base truncate">{product.name}</p>
                                        <p className="text-white/40 text-xs truncate">{product.tagline}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[#D97B8D] font-bold text-sm">
                                                {product.size_options?.[0]?.price || 'N/A'}
                                            </span>
                                            <span className="text-white/30 text-xs">·</span>
                                            <span className="text-white/40 text-xs">{product.category}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Toggles Row */}
                                <div className="flex items-center gap-4 mb-4 py-3 border-y border-white/5">
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-white/40 text-xs font-bold uppercase">Visible</span>
                                        <button
                                            onClick={() => handleToggleVisibility(product.id, product.is_visible)}
                                            className={`w-12 h-7 rounded-full relative transition-colors ${product.is_visible ? 'bg-[#4ade80]' : 'bg-white/20'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${product.is_visible ? 'left-6' : 'left-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-white/40 text-xs font-bold uppercase">Featured</span>
                                        <button
                                            onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                                            className={`w-12 h-7 rounded-full relative transition-colors ${product.is_featured ? 'bg-[#D97B8D]' : 'bg-white/20'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${product.is_featured ? 'left-6' : 'left-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        to={`/admin-panel0/products/${product.id}`}
                                        className="flex-1 px-4 py-3 bg-white/5 active:bg-white/10 text-white text-center rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        disabled={deleting === product.id}
                                        className="flex-1 px-4 py-3 bg-red-500/10 active:bg-red-500/20 text-red-400 rounded-lg font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {deleting === product.id ? '...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table Layout (Draggable) */}
                    <div className="hidden lg:block bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="w-10"></th> {/* Drag handle column */}
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Product</th>
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Category</th>
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Price</th>
                                    <th className="text-center p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Visible</th>
                                    <th className="text-center p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Featured</th>
                                    <th className="text-right p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product: any) => (
                                    <tr
                                        key={product.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, product.id)}
                                        onDragOver={(e) => handleDragOver(e, product.id)}
                                        onDrop={(e) => handleDrop(e, product.id)}
                                        className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-move ${draggedItem === product.id ? 'opacity-30 bg-white/5' : ''}`}
                                    >
                                        <td className="p-4 text-center">
                                            <div className="text-white/20 hover:text-white/50">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h8M8 12h8M8 18h8" /></svg>
                                            </div>
                                        </td>
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
                </>
            )}

            {/* Refresh */}
            <div className="mt-6 text-center">
                <button
                    onClick={() => refetch()}
                    className="text-white/30 hover:text-white/60 active:text-white text-xs font-bold uppercase tracking-widest transition-colors py-3 px-6"
                >
                    ↻ Refresh List
                </button>
            </div>
        </div>
    );
};

export default ProductList;
