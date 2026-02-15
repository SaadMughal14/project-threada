import React from 'react';
import { useCartStore } from '../src/store/cartStore';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const itemCount = getItemCount();

    return (
        <header className="w-full bg-white z-50 relative border-b border-black">
            {/* Top Utility Bar */}
            <div className="flex justify-between items-center px-4 md:px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-widest border-b border-black/10">
                {/* Left: Collections */}
                <div className="flex gap-6 md:gap-8">
                    <Link to="/" className="hover:text-gray-500 transition-colors">Man</Link>
                    <Link to="/" className="hover:text-gray-500 transition-colors">Woman</Link>
                    <Link to="/" className="hover:text-gray-500 transition-colors">Kids</Link>
                </div>

                {/* Right: Utilities */}
                <div className="flex gap-6 md:gap-8">
                    <Link to="/admin-panel0/login" className="hover:text-gray-500 transition-colors">Account</Link>
                    <button className="hover:text-gray-500 transition-colors">Wishlist</button>
                    <button className="hover:text-gray-500 transition-colors">Search</button>
                    <button onClick={toggleCart} className="hover:text-gray-500 transition-colors">Cart ({itemCount})</button>
                </div>
            </div>

            {/* Giant Brand Title */}
            <div className="py-2 md:py-4 text-center">
                <h1 className="font-heading text-[12vw] md:text-[15vw] leading-[0.8] tracking-tighter uppercase mb-[-2vw] md:mb-[-3vw] pointer-events-none select-none">
                    THREADA
                </h1>
            </div>
        </header>
    );
};
