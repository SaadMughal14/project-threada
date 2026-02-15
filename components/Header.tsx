import React from 'react';
import { useCartStore } from '../src/store/cartStore';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const itemCount = getItemCount();

    return (
        <header className="w-full bg-white z-50 relative pt-4 pb-2">
            {/* Main Container - Constrained width for "Newspaper" margins */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 border-b-4 border-black">

                {/* Top Utility Bar */}
                <div className="flex justify-between items-center py-3 text-[11px] md:text-sm font-bold uppercase tracking-tight border-b border-black">
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

                {/* Giant Brand Title - Full Width Justified */}
                <div className="py-2 md:py-1 overflow-hidden">
                    <h1 className="font-heading text-[13vw] md:text-[14.5vw] leading-[0.8] tracking-tighter uppercase text-justify w-full flex justify-between select-none pointer-events-none transform scale-y-110 origin-top text-black">
                        <span>T</span>
                        <span>H</span>
                        <span>R</span>
                        <span>E</span>
                        <span>A</span>
                        <span>D</span>
                        <span>A</span>
                    </h1>
                </div>
            </div>
        </header>
    );
};
