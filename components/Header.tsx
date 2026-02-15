import React from 'react';
import { useCartStore } from '../src/store/cartStore';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const itemCount = getItemCount();

    return (
        <header className="w-full bg-white z-50 relative pt-2 pb-2">
            {/* Main Container */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 border-b-4 border-black">

                {/* Top Utility Bar - Optimized for Mobile (Stacked) */}
                <div className="flex flex-col md:flex-row justify-between items-center py-4 md:py-3 text-[10px] md:text-sm font-bold uppercase tracking-tight border-b border-black gap-3 md:gap-0">
                    {/* Left: Collections */}
                    <div className="flex gap-6 md:gap-10">
                        <Link to="/" className="hover:text-gray-500 transition-colors">Man</Link>
                        <Link to="/" className="hover:text-gray-500 transition-colors">Woman</Link>
                        <Link to="/" className="hover:text-gray-500 transition-colors">Kids</Link>
                    </div>

                    {/* Right: Utilities */}
                    <div className="flex gap-6 md:gap-10">
                        <Link to="/admin-panel0/login" className="hover:text-gray-500 transition-colors">Account</Link>
                        <button className="hover:text-gray-500 transition-colors">Wishlist</button>
                        <button className="hover:text-gray-500 transition-colors">Search</button>
                        <button onClick={toggleCart} className="hover:text-gray-500 transition-colors">Cart ({itemCount})</button>
                    </div>
                </div>

                {/* Giant Brand Logo - Image Based - Responsive Crop */}
                {/* Mobile: 25vw height to prevent text clipping. Desktop: 14vw. 
                    object-cover ensures it fills the width. mix-blend-multiply handles background. */}
                <div className="w-full h-[25vw] md:h-[14vw] overflow-hidden flex justify-center items-center py-3">
                    <img
                        src="/logo1.png"
                        alt="Threada Logo"
                        className="w-full h-full object-cover object-center mix-blend-multiply grayscale contrast-200"
                    />
                </div>
            </div>
        </header>
    );
};
