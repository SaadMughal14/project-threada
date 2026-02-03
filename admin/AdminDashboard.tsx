import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminProducts } from '../hooks/useProducts';

const CATEGORIES = ['Cookies', 'Brownies', 'Cakes', 'Coffee & Tea', 'Sides'];

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
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Dashboard</h1>
                <p className="text-white/40 text-sm font-medium mt-1">Manage your Gravity products</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Total Products</p>
                            <p className="text-4xl font-black text-white">{stats.total}</p>
                        </div>
                        <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Visible</p>
                            <p className="text-4xl font-black text-[#4ade80]">{stats.visible}</p>
                        </div>
                        <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Featured</p>
                            <p className="text-4xl font-black text-[#D97B8D]">{stats.featured}</p>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6 mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Products by Category</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {stats.byCategory.map((cat) => (
                                <div
                                    key={cat.name}
                                    className="bg-white/5 rounded-xl p-4 text-center border border-white/5"
                                >
                                    <p className="text-2xl font-black text-white mb-1">{cat.count}</p>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{cat.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Quick Actions</p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/admin-panel0/products/new"
                                className="inline-flex items-center gap-2 bg-[#D97B8D] text-[#1C1C1C] px-6 py-3 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#D97B8D]/90 transition-all shadow-lg"
                            >
                                <span className="text-lg">➕</span>
                                Add New Product
                            </Link>
                            <Link
                                to="/admin-panel0/products"
                                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white/10 transition-all"
                            >
                                <span className="text-lg">📋</span>
                                View All Products
                            </Link>
                        </div>
                    </div>

                    {/* Empty State */}
                    {stats.total === 0 && (
                        <div className="mt-8 bg-[#D97B8D]/10 border border-[#D97B8D]/30 rounded-2xl p-8 text-center">
                            <div className="text-5xl mb-4">🍪</div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">No Products Yet</h3>
                            <p className="text-white/50 text-sm mb-6">
                                Add your first product to get started. Your site is currently showing demo products.
                            </p>
                            <Link
                                to="/admin-panel0/products/new"
                                className="inline-flex items-center gap-2 bg-[#D97B8D] text-[#1C1C1C] px-8 py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-[#D97B8D]/90 transition-all shadow-lg"
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
