import React from 'react';
import { useCartStore } from '../src/store/cartStore';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const itemCount = getItemCount();

    return (
        <header className="w-full bg-white z-50 relative">
            {/* Top Utility Bar */}
            <div className="max-w-[1920px] mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center py-4 text-[11px] font-bold uppercase tracking-widest border-b-2 border-black">
                    {/* Left: Collections */}
                    <div className="flex gap-8">
                        <Link to="/" className="hover:text-gray-500 transition-colors">Man</Link>
                        <Link to="/" className="hover:text-gray-500 transition-colors">Woman</Link>
                        <Link to="/" className="hover:text-gray-500 transition-colors">Kids</Link>
                    </div>

                    {/* Right: Utilities */}
                    <div className="flex gap-8">
                        <Link to="/admin-panel0/login" className="hover:text-gray-500 transition-colors">Account</Link>
                        <button className="hover:text-gray-500 transition-colors">Wishlist</button>
                        <button className="hover:text-gray-500 transition-colors">Search</button>
                        <button onClick={toggleCart} className="hover:text-gray-500 transition-colors">Cart ({itemCount})</button>
                    </div>
                </div>

                {/* Giant Brand Title - Logo Style */}
                <div className="border-b-2 border-black py-0 overflow-hidden text-center leading-none">
                    <h1 className="font-logo text-[16vw] md:text-[22vw] leading-[0.8] tracking-tighter uppercase select-none pointer-events-none transform scale-y-[1.15] block">
                        Threada
                    </h1>
                </div>
            </div>
        </header>
    );
};
