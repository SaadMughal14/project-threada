import React from 'react';
import { useCartStore } from '../src/store/cartStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CartButton = ({ itemCount, toggleCart }: { itemCount: number; toggleCart: () => void }) => {
    const [animate, setAnimate] = React.useState(false);

    React.useEffect(() => {
        if (itemCount > 0) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 300);
            return () => clearTimeout(timer);
        }
    }, [itemCount]);

    return (
        <button
            onClick={toggleCart}
            className={`transition-all duration-300 ${animate ? 'text-black scale-110 font-black' : 'hover:text-gray-500'}`}
        >
            Cart ({itemCount})
        </button>
    );
};

const LogoAnimation = () => {
    const title = "THREADA";
    const letters = title.split("");

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const letterVariants = {
        hidden: {
            y: 40,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                damping: 15,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            className="flex overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={letterVariants}
                    className="font-logoza text-[24vw] md:text-[17.5vw] leading-[0.78] inline-block text-black scale-x-125 origin-center"
                >
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

const TinyLogoAnimation = () => {
    const title = "THREADA";
    const letters = title.split("");

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const letterVariants = {
        hidden: {
            y: 20,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                damping: 15,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            className="flex overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={letterVariants}
                    className="font-logoza text-2xl md:text-3xl leading-none inline-block text-black"
                >
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    )
}

export const Header: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const itemCount = getItemCount();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getNavLinks = () => {
        if (pathname.includes('/category/man')) {
            return (
                <>
                    <Link to="/" className="hover:text-gray-500 transition-colors">Home</Link>
                    <Link to="/category/woman" className="hover:text-gray-500 transition-colors">Woman</Link>
                    <Link to="/category/kids" className="hover:text-gray-500 transition-colors">Kids</Link>
                </>
            );
        } else if (pathname.includes('/category/woman')) {
            return (
                <>
                    <Link to="/category/man" className="hover:text-gray-500 transition-colors">Man</Link>
                    <Link to="/" className="hover:text-gray-500 transition-colors">Home</Link>
                    <Link to="/category/kids" className="hover:text-gray-500 transition-colors">Kids</Link>
                </>
            );
        } else if (pathname.includes('/category/kids')) {
            return (
                <>
                    <Link to="/category/man" className="hover:text-gray-500 transition-colors">Man</Link>
                    <Link to="/category/woman" className="hover:text-gray-500 transition-colors">Woman</Link>
                    <Link to="/" className="hover:text-gray-500 transition-colors">Home</Link>
                </>
            );
        } else {
            return (
                <>
                    <Link to="/category/man" className="hover:text-gray-500 transition-colors">Man</Link>
                    <Link to="/category/woman" className="hover:text-gray-500 transition-colors">Woman</Link>
                    <Link to="/category/kids" className="hover:text-gray-500 transition-colors">Kids</Link>
                </>
            );
        }
    };

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
                    {/* Left: Collections & Back Arrow */}
                    <div className="flex gap-3 md:gap-10 items-center">
                        {pathname !== '/' && (
                            <button
                                onClick={() => navigate(-1)}
                                className="hover:text-gray-500 transition-colors"
                                aria-label="Go Back"
                            >
                                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        )}
                        {getNavLinks()}
                    </div>

                    {/* Center: Tiny Logo */}
                    {/* 
                        Logic: 
                        - If on Home ('/'): Show only when scrolled (opacity-0 -> opacity-100)
                        - If NOT on Home: ALWAYS visible (opacity-100)
                    */}
                    <Link to="/" className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out ${pathname !== '/' || isScrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        <TinyLogoAnimation />
                    </Link>

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

                        <CartButton itemCount={itemCount} toggleCart={toggleCart} />
                    </div>
                </div>

                {/* 
                    SPLIT LAYOUT STRATEGY: 
                    Two separate visual blocks. One for Mobile, One for Desktop.
                    COLLAPSE ON SCROLL
                    
                    CRITICAL: Only show on Home Page ('/')
                */}
                {pathname === '/' && (
                    <>
                        {/* MOBILE LOGO (Visible only on mobile) */}
                        <div className={`block md:hidden w-full overflow-hidden transition-all duration-500 ease-in-out ${isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-[40vh] opacity-100 py-1'}`}>
                            <div className="w-full flex justify-center items-center">
                                <LogoAnimation />
                            </div>
                        </div>

                        {/* DESKTOP LOGO (Visible only on md+) */}
                        <div className={`hidden md:block w-full overflow-hidden transition-all duration-500 ease-in-out ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-[50vh] opacity-100 py-2'}`}>
                            <div className="w-full flex justify-center items-center">
                                <LogoAnimation />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};
