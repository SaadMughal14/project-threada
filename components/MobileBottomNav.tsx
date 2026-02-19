import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, ShoppingBag, MessageSquare, User } from 'lucide-react';
import { useCartStore } from '../src/store/cartStore';

export const MobileBottomNav: React.FC = () => {
    const location = useLocation();
    const { toggleCart, items } = useCartStore();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1C1C1C]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                {/* Cart */}
                <button
                    onClick={toggleCart}
                    className="relative text-white/50 hover:text-white transition-colors"
                >
                    <ShoppingBag size={20} />
                    {items.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#D97B8D] rounded-full"></span>
                    )}
                </button>

                {/* Wishlist (Placeholder) */}
                <button className="text-white/50 hover:text-white transition-colors">
                    <Heart size={20} />
                </button>

                {/* Home (Active Indicator) */}
                <Link
                    to="/"
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg shadow-white/10 -mt-8 border-[4px] border-[#0a0a0a]"
                >
                    <Home size={22} fill="currentColor" />
                </Link>

                {/* Chat (Placeholder) */}
                <button className="text-white/50 hover:text-white transition-colors">
                    <MessageSquare size={20} />
                </button>

                {/* Profile */}
                <Link
                    to="/login"
                    className={`text-white/50 hover:text-white transition-colors ${isActive('/login') ? 'text-white' : ''}`}
                >
                    <User size={20} />
                </Link>
            </div>
        </div>
    );
};
