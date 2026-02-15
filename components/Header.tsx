import React from 'react';
import { useCartStore } from '../src/store/cartStore';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const itemCount = getItemCount();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md pt-0 pb-0 shadow-sm' : 'bg-white pt-2 pb-2'
                }`}
        >
            {/* Main Container */}
            <div className={`max-w-[1400px] mx-auto px-4 md:px-12 transition-all duration-300 ${isScrolled ? 'border-b-0' : 'border-b-4 border-black'}`}>

                {/* 
                    NAVBAR: Single Line on Mobile & Desktop (FORCED)
                    - flex-row: Forces horizontal layout
                    - whitespace-nowrap: Prevents text wrapping
                    - text-[9px]: Ensures fit on small screens
                    - gap-3: Tight spacing
                */}
                <div className={`flex flex-row justify-between items-center transition-all duration-300 ${isScrolled ? 'py-3 border-b border-black' : 'py-3 md:py-4 border-b border-black'} text-[9px] md:text-sm font-bold uppercase tracking-tight whitespace-nowrap relative`}>
                    {/* Left: Collections */}
                    <div className="flex gap-3 md:gap-10">
                        <Link to="/category/man" className="hover:text-gray-500 transition-colors">Man</Link>
                        <Link to="/category/woman" className="hover:text-gray-500 transition-colors">Woman</Link>
                        <Link to="/category/kids" className="hover:text-gray-500 transition-colors">Kids</Link>
                    </div>

                    {/* Center: Tiny Logo */}
                    {/* 
                        Logic: 
                        - ALWAYS CENTERED via absolute positioning.
                        - HIDDEN AT TOP (opacity-0).
                        - VISIBLE ON SCROLL (opacity-100).
                        - Applies to BOTH Mobile and Desktop.
                    */}
                    <img
                        src="/logo1.png"
                        alt="Threada Tiny"
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-auto object-contain brightness-0 transition-opacity duration-300 ease-in-out pointer-events-none 
                            ${isScrolled ? 'h-9 md:h-10 opacity-100 pointer-events-auto' : 'h-8 md:h-12 opacity-0 pointer-events-none'}
                        `}
                    />

                    {/* Right: Utilities */}
                    <div className="flex gap-3 md:gap-10 items-center">
                        <Link to="/login" className="hover:text-gray-500 transition-colors">Account</Link>
                        {/* Wishlist Removed for Balance */}

                        {/* Search Dropdown Trigger */}
                        <div className="relative group">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="hover:text-gray-500 transition-colors flex items-center gap-2"
                            >
                                Search
                            </button>

                            {/* Search Dropdown Overlay */}
                            <div className={`absolute right-0 top-full mt-4 w-[300px] bg-white shadow-xl border border-gray-100 p-4 transition-all duration-300 origin-top-right ${isSearchOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                                <div className="flex items-center border-b-2 border-black pb-2">
                                    <input
                                        type="text"
                                        placeholder="SEARCH PRODUCTS..."
                                        className="w-full text-sm font-bold uppercase placeholder-gray-400 focus:outline-none"
                                        autoFocus={isSearchOpen}
                                    />
                                    <button className="text-gray-400 hover:text-black">
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button onClick={toggleCart} className="hover:text-gray-500 transition-colors">Cart ({itemCount})</button>
                    </div>
                </div>

                {/* 
                    SPLIT LAYOUT STRATEGY: 
                    Two separate visual blocks. One for Mobile, One for Desktop.
                    COLLAPSE ON SCROLL
                */}

                {/* MOBILE LOGO (Visible only on mobile) */}
                <div className={`block md:hidden w-full overflow-hidden transition-all duration-500 ease-in-out ${isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-[200px] opacity-100 py-4'}`}>
                    <div className="w-full h-[18vw] flex justify-center items-center">
                        <img
                            src="/logo1.png"
                            alt="Threada Logo Mobile"
                            className="w-full h-full object-cover object-center mix-blend-multiply grayscale contrast-200"
                        />
                    </div>
                </div>

                {/* DESKTOP LOGO (Visible only on md+) */}
                <div className={`hidden md:block w-full overflow-hidden transition-all duration-500 ease-in-out ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-[300px] opacity-100'}`}>
                    <div className="w-full aspect-[100/22] flex justify-center items-center">
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
