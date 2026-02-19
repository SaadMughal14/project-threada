import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminProducts } from '../hooks/useProducts';

const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Footwear'];

const AdminDashboard: React.FC = () => {
    const { products, loading } = useAdminProducts();

    const stats = {
        total: products.length,
        visible: products.filter(p => p.is_visible).length,
        featured: products.filter(p => p.is_featured).length,
        byCategory: CATEGORIES.map(cat => ({
            name: cat,
            count: products.filter(p => p.category === cat).length,
        })),
    };

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">Dashboard</h1>
                <p className="text-white/40 text-sm font-medium mt-1">Manage your Threada products</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-white/40 text-sm font-bold uppercase tracking-widest animate-pulse">
                        Loading...
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-8">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                            <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-white/40 mb-1 lg:mb-2">Total</p>
                            <p className="text-2xl lg:text-4xl font-black text-white">{stats.total}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                            <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-white/40 mb-1 lg:mb-2">Visible</p>
                            <p className="text-2xl lg:text-4xl font-black text-[#4ade80]">{stats.visible}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                            <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-white/40 mb-1 lg:mb-2">Featured</p>
                            <p className="text-2xl lg:text-4xl font-black text-[#D97B8D]">{stats.featured}</p>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8">
                        <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-white/40 mb-3 lg:mb-4">By Category</p>
                        <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4">
                            {stats.byCategory.map((cat) => (
                                <div
                                    key={cat.name}
                                    className="bg-white/5 rounded-lg lg:rounded-xl p-3 lg:p-4 text-center border border-white/5"
                                >
                                    <p className="text-xl lg:text-2xl font-black text-white mb-0.5 lg:mb-1">{cat.count}</p>
                                    <p className="text-[8px] lg:text-[10px] font-bold text-white/40 uppercase tracking-wide lg:tracking-widest truncate">{cat.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                        <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-white/40 mb-3 lg:mb-4">Quick Actions</p>
                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                            <Link
                                to="/admin-panel0/products/new"
                                className="flex items-center justify-center gap-2 bg-[#D97B8D] text-black px-6 py-4 lg:py-3 rounded-xl font-black uppercase text-xs lg:text-[11px] tracking-[0.15em] lg:tracking-[0.2em] hover:bg-[#D97B8D]/90 active:scale-[0.98] transition-all shadow-lg"
                            >
                                <span className="text-lg">➕</span>
                                Add New Product
                            </Link>
                            <Link
                                to="/admin-panel0/products"
                                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-4 lg:py-3 rounded-xl font-black uppercase text-xs lg:text-[11px] tracking-[0.15em] lg:tracking-[0.2em] hover:bg-white/10 active:scale-[0.98] transition-all"
                            >
                                <span className="text-lg">📋</span>
                                View All Products
                            </Link>
                        </div>
                    </div>

                    {/* Empty State */}
                    {stats.total === 0 && (
                        <div className="mt-6 lg:mt-8 bg-[#D97B8D]/10 border border-[#D97B8D]/30 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-center">
                            <div className="text-4xl lg:text-5xl mb-3 lg:mb-4">🧥</div>
                            <h3 className="text-lg lg:text-xl font-black text-white uppercase tracking-tight mb-2">No Products Yet</h3>
                            <p className="text-white/50 text-sm mb-4 lg:mb-6">
                                Add your first product to get started.
                            </p>
                            <Link
                                to="/admin-panel0/products/new"
                                className="inline-flex items-center gap-2 bg-[#D97B8D] text-black px-6 lg:px-8 py-4 rounded-xl font-black uppercase text-xs lg:text-[11px] tracking-[0.2em] lg:tracking-[0.3em] hover:bg-[#D97B8D]/90 active:scale-[0.98] transition-all shadow-lg"
                            >
                                Add Your First Product
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
