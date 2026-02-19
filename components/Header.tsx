import React from 'react';
import { useCartStore } from '../src/store/cartStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

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
                staggerChildren: 0.1, // Slower bleed
            },
        },
    };

    const letterVariants = {
        hidden: {
            y: 10,
            opacity: 0,
            scale: 1.1,
            filter: "blur(8px)",
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 1.4,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
    };

    return (
        <motion.div
            className="flex justify-center items-center cursor-default py-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={letterVariants}
                    className="font-logoza text-[18vw] md:text-[16vw] leading-[0.78] inline-block text-black scale-x-125 origin-center will-change-transform"
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
                    className="font-logoza text-lg md:text-3xl leading-none inline-block text-black"
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
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const { scrollY } = useScroll();

    // Scroll-linked animations — fast snap to prevent mid-scroll jank

    // Header Background & Height
    const headerBorderOpacity = useTransform(scrollY, [0, 10], [1, 0]);
    const headerShadowOpacity = useTransform(scrollY, [30, 50], [0, 0.1]);

    // Padding transition (Large to Compact)
    const headerPaddingY = useTransform(scrollY, [0, 50], [12, 0]);

    // Big Logo Transitions — opacity snaps fast, but height collapses smoothly
    const bigLogoOpacity = useTransform(scrollY, [0, 40], [1, 0]);
    const bigLogoScale = useTransform(scrollY, [0, 50], [1, 0.85]);
    const bigLogoY = useTransform(scrollY, [0, 50], [0, -30]);
    // Max Height collapse — slower than fade so hero slides up smoothly, not jerks
    const bigLogoMaxHeight = useTransform(scrollY, [0, 150], ["50vh", "0vh"]);

    // Tiny Logo — starts appearing WHILE big logo is still fading (tight crossfade)
    const tinyLogoOpacity = useTransform(scrollY, [25, 55], [0, 1]);
    const tinyLogoY = useTransform(scrollY, [25, 55], [8, 0]);

    // Pointer events helper to prevent clicking invisible tiny logo

    const [tinyLogoPointerEvents, setTinyLogoPointerEvents] = React.useState<'none' | 'auto'>('none');

    useMotionValueEvent(scrollY, "change", (latest) => {
        setTinyLogoPointerEvents(latest > 40 ? 'auto' : 'none');
    });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const getNavLinks = () => {
        // ... (existing helper preserved logically, but we'll use manual links for mobile to be safe or reuse)
        return (
            <>
                <Link to="/category/man" className="hover:text-gray-500 transition-colors font-bold">Man</Link>
                <Link to="/category/woman" className="hover:text-gray-500 transition-colors font-bold">Woman</Link>
                <Link to="/category/kids" className="hover:text-gray-500 transition-colors font-bold">Kids</Link>
            </>
        );
    };

    return (
        <>
            <motion.header
                className="sticky top-0 w-full z-50"
            >
                {/* Full-width glass nav bar — edge to edge */}
                <motion.div
                    className="w-full bg-white/85 backdrop-blur-xl border-b border-black"
                    style={{
                        boxShadow: useTransform(headerShadowOpacity, opacity => `0 4px 6px -1px rgba(0, 0, 0, ${opacity})`),
                    }}
                >
                    <div className="max-w-[1400px] mx-auto px-4 md:px-12">
                        <div className="flex flex-row justify-between items-center py-4 md:py-5 text-sm font-bold uppercase tracking-tight whitespace-nowrap relative">

                            {/* MOBILE LEFT: Menu Button */}
                            <div className="md:hidden z-50">
                                <button onClick={() => setIsMobileMenuOpen(true)}>
                                    <span className="font-heading text-lg">Menu</span>
                                </button>
                            </div>

                            {/* DESKTOP LEFT: Collections & Back Arrow */}
                            <div className="hidden md:flex gap-10 items-center">
                                {pathname !== '/' && (
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="hover:text-gray-500 transition-colors"
                                        aria-label="Go Back"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                {getNavLinks()}
                            </div>

                            {/* Center: Tiny Logo (Robust Centering) */}
                            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                                <motion.div
                                    style={{
                                        opacity: pathname !== '/' ? 1 : tinyLogoOpacity,
                                        y: pathname !== '/' ? 0 : tinyLogoY,
                                        pointerEvents: (pathname !== '/' ? 'auto' : tinyLogoPointerEvents) as any
                                    }}
                                    className="pointer-events-auto"
                                >
                                    <Link to="/" className="flex justify-center items-center">
                                        <TinyLogoAnimation />
                                    </Link>
                                </motion.div>
                            </div>

                            {/* MOBILE RIGHT: Cart */}
                            <div className="md:hidden flex items-center gap-4 z-50 relative">
                                <CartButton itemCount={itemCount} toggleCart={toggleCart} />
                            </div>

                            {/* DESKTOP RIGHT: Utilities */}
                            <div className="hidden md:flex gap-10 items-center">
                                <Link to="/login" className="hover:text-gray-500 transition-colors font-bold">Account</Link>

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
                    </div>
                </motion.div>

                {/* 
                COLLAPSIBLE HERO LOGO
                Only on Home Page
            */}
                {pathname === '/' && (
                    <motion.div
                        className="w-full overflow-hidden"
                        style={{
                            maxHeight: bigLogoMaxHeight,
                            opacity: bigLogoOpacity,
                            scale: bigLogoScale,
                            y: bigLogoY,
                            transformOrigin: "top center"
                        }}
                    >
                        <div className="max-w-[1400px] mx-auto px-4 md:px-12">
                            <div className="w-full flex flex-col justify-center items-center py-4">
                                <LogoAnimation />
                            </div>
                        </div>
                        {/* Full width edge-to-edge line */}
                        <div className="w-full h-[3px] bg-black mt-2" />
                    </motion.div>
                )}
            </motion.header>

            {/* MOBILE MENU OVERLAY */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-12">
                        <span className="font-heading text-2xl">MENU</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-2xl">×</button>
                    </div>

                    <nav className="flex flex-col gap-6 text-3xl font-heading font-black uppercase tracking-tight">
                        <Link to="/" className="hover:text-gray-500">Home</Link>
                        <Link to="/category/man" className="hover:text-gray-500">Man</Link>
                        <Link to="/category/woman" className="hover:text-gray-500">Woman</Link>
                        <Link to="/category/kids" className="hover:text-gray-500">Kids</Link>
                    </nav>

                    <div className="mt-auto space-y-4 border-t border-gray-100 pt-8">
                        <Link to="/login" className="block text-sm font-bold uppercase tracking-widest">Account</Link>
                        <button className="block text-sm font-bold uppercase tracking-widest text-left w-full">Search</button>
                        <Link to="/support" className="block text-sm font-bold uppercase tracking-widest text-gray-400">Support</Link>
                    </div>
                </div>
            )}
        </>
    );
};
