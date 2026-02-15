import React from 'react';
import { useCartStore } from '../src/store/cartStore';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const itemCount = getItemCount();

    return (
        <header className="w-full bg-white z-50 relative">
            {/* Top Utility Bar - Max Width to match content */}
            <div className="max-w-[1920px] mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-black">
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

                {/* Giant Brand Title - Full Width Justified */}
                <div className="border-b border-black py-2 md:py-0 overflow-hidden">
                    <h1 className="font-heading text-[12vw] md:text-[18.5vw] leading-[0.8] tracking-tighter uppercase text-center md:text-justify w-full flex justify-between select-none pointer-events-none transform scale-y-110 origin-top">
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
