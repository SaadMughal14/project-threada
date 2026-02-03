import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLayout: React.FC = () => {
    const { user, loading, signOut } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto mb-4 animate-pulse">
                        <circle cx="50" cy="50" r="45" fill="#D97B8D" />
                        <circle cx="35" cy="35" r="5" fill="#4A3728" />
                        <circle cx="65" cy="40" r="6" fill="#4A3728" />
                        <circle cx="45" cy="65" r="7" fill="#4A3728" />
                        <circle cx="70" cy="70" r="4" fill="#4A3728" />
                        <circle cx="25" cy="60" r="4" fill="#4A3728" />
                    </svg>
                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin-panel0/login" replace />;
    }

    const handleLogout = async () => {
        await signOut();
    };

    const navItems = [
        { path: '/admin-panel0', label: 'Dashboard', icon: '📊', exact: true },
        { path: '/admin-panel0/products', label: 'Products', icon: '🍪' },
        { path: '/admin-panel0/products/new', label: 'Add Product', icon: '➕' },
    ];

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
                <Link to="/admin-panel0" className="flex items-center gap-2">
                    <svg viewBox="0 0 100 100" className="w-8 h-8">
                        <circle cx="50" cy="50" r="45" fill="#D97B8D" />
                        <circle cx="35" cy="35" r="5" fill="#4A3728" />
                        <circle cx="65" cy="40" r="6" fill="#4A3728" />
                        <circle cx="45" cy="65" r="7" fill="#4A3728" />
                        <circle cx="70" cy="70" r="4" fill="#4A3728" />
                        <circle cx="25" cy="60" r="4" fill="#4A3728" />
                    </svg>
                    <span className="font-black text-sm tracking-tight uppercase text-white">
                        GRAV<span className="text-[#D97B8D]">ITY</span>
                    </span>
                </Link>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white/60 p-2 hover:text-[#D97B8D] transition-colors"
                >
                    {sidebarOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                    )}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Mobile slide-in, Desktop fixed */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col
                transform transition-transform duration-300 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo - Desktop only */}
                <div className="hidden lg:block p-6 border-b border-white/5">
                    <Link to="/admin-panel0" className="flex items-center gap-3">
                        <svg viewBox="0 0 100 100" className="w-10 h-10">
                            <circle cx="50" cy="50" r="45" fill="#D97B8D" />
                            <circle cx="35" cy="35" r="5" fill="#4A3728" />
                            <circle cx="65" cy="40" r="6" fill="#4A3728" />
                            <circle cx="45" cy="65" r="7" fill="#4A3728" />
                            <circle cx="70" cy="70" r="4" fill="#4A3728" />
                            <circle cx="25" cy="60" r="4" fill="#4A3728" />
                        </svg>
                        <div>
                            <span className="font-black text-lg tracking-tight uppercase text-white">
                                GRAV<span className="text-[#D97B8D]">ITY</span>
                            </span>
                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-[0.2em]">Admin</p>
                        </div>
                    </Link>
                </div>

                {/* Mobile spacer */}
                <div className="lg:hidden h-16" />

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-4 lg:py-3 rounded-xl font-bold text-base lg:text-sm transition-all ${isActive(item.path, item.exact)
                                    ? 'bg-[#D97B8D] text-black'
                                    : 'text-white/50 hover:text-white hover:bg-white/5 active:bg-white/10'
                                }`}
                        >
                            <span className="text-xl lg:text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User / Logout */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl">
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-bold truncate">{user.email}</p>
                            <p className="text-white/30 text-[10px] font-medium">Administrator</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-white/40 hover:text-[#D97B8D] transition-colors ml-2 p-2"
                            title="Sign out"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Back to site */}
                <div className="p-4">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-4 lg:py-3 border border-white/10 rounded-xl text-white/40 font-bold text-sm lg:text-xs uppercase tracking-widest hover:border-[#D97B8D] hover:text-[#D97B8D] active:bg-[#D97B8D]/10 transition-all"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        View Site
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
                <div className="p-4 lg:p-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
