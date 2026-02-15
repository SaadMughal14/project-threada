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

                {/* 
                    NAVBAR: Single Line on Mobile & Desktop (FORCED)
                    - flex-row: Forces horizontal layout
                    - whitespace-nowrap: Prevents text wrapping
                    - text-[9px]: Ensures fit on small screens
                    - gap-3: Tight spacing
                */}
                <div className="flex flex-row justify-between items-center py-3 md:py-4 text-[9px] md:text-sm font-bold uppercase tracking-tight border-b border-black whitespace-nowrap">
                    {/* Left: Collections */}
                    <div className="flex gap-3 md:gap-10">
                        <Link to="/" className="hover:text-gray-500 transition-colors">Man</Link>
                        <Link to="/" className="hover:text-gray-500 transition-colors">Woman</Link>
                        <Link to="/" className="hover:text-gray-500 transition-colors">Kids</Link>
                    </div>

                    {/* Right: Utilities */}
                    <div className="flex gap-3 md:gap-10">
                        <Link to="/admin-panel0/login" className="hover:text-gray-500 transition-colors">Account</Link>
                        <button className="hover:text-gray-500 transition-colors">Wishlist</button>
                        <button className="hover:text-gray-500 transition-colors">Search</button>
                        <button onClick={toggleCart} className="hover:text-gray-500 transition-colors">Cart ({itemCount})</button>
                    </div>
                </div>

                {/* 
                    SPLIT LAYOUT STRATEGY: 
                    Two separate visual blocks. One for Mobile, One for Desktop.
                */}

                {/* MOBILE LOGO (Visible only on mobile) */}
                {/* 
                    - block md:hidden: Shows only on mobile
                    - h-[18vw]: Specific mobile height ratio
                    - object-cover: Fills/Stretches to remove whitespace
                */}
                <div className="block md:hidden w-full overflow-hidden py-4">
                    <div className="w-full h-[18vw] flex justify-center items-center">
                        <img
                            src="/logo1.png"
                            alt="Threada Logo Mobile"
                            className="w-full h-full object-cover object-center mix-blend-multiply grayscale contrast-200"
                        />
                    </div>
                </div>

                {/* DESKTOP LOGO (Visible only on md+) */}
                {/* 
                    - hidden md:block: Shows only on desktop
                    - h-[14vw]: Specific desktop height ratio
                    - object-cover: Fills/Stretches
                */}
                <div className="hidden md:block w-full overflow-hidden py-4">
                    <div className="w-full h-[14vw] flex justify-center items-center">
                        <img
                            src="/logo1.png"
                            alt="Threada Logo Desktop"
                            className="w-full h-full object-cover object-center mix-blend-multiply grayscale contrast-200"
                        />
                    </div>
                </div>

            </div>
        </header>
    );
};
