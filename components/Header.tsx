import React from 'react';
import { useCartStore } from '../src/store/cartStore';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const itemCount = getItemCount();

    return (
        <header className="w-full bg-white z-50 relative pt-4 pb-2">
            {/* Main Container */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 border-b-4 border-black">

                {/* Top Utility Bar - Optimized for Mobile */}
                <div className="flex justify-between items-center py-3 text-[9px] md:text-xs font-bold uppercase tracking-tight border-b border-black">
                    {/* Left: Collections */}
                    <div className="flex gap-4 md:gap-10">
                        <Link to="/" className="hover:text-gray-500 transition-colors">Man</Link>
                        <Link to="/" className="hover:text-gray-500 transition-colors">Woman</Link>
                        <Link to="/" className="hover:text-gray-500 transition-colors">Kids</Link>
                    </div>

                    {/* Right: Utilities */}
                    <div className="flex gap-4 md:gap-10">
                        <Link to="/admin-panel0/login" className="hover:text-gray-500 transition-colors">Account</Link>
                        <button className="hover:text-gray-500 transition-colors">Wishlist</button>
                        <button className="hover:text-gray-500 transition-colors">Search</button>
                        <button onClick={toggleCart} className="hover:text-gray-500 transition-colors">Cart ({itemCount})</button>
                    </div>
                </div>

                {/* Giant Brand Logo - Image Based - Full Width / CSS Zoom Crop */}
                {/* overflow-hidden + scale helps crop internal whitespace from the image file itself */}
                <div className="w-full overflow-hidden flex justify-center items-center py-2 md:py-4">
                    <img
                        src="/logo1.png"
                        alt="Threada Logo"
                        className="w-full h-auto transform scale-[1.15] md:scale-110 object-contain mix-blend-multiply grayscale contrast-200"
                    />
                </div>
            </div>
        </header>
    );
};
