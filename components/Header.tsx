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
                    className="font-logoza text-[23vw] md:text-[17.5vw] leading-[0.78] inline-block text-black scale-x-125 origin-center will-change-transform"
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
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const { scrollY } = useScroll();

    // Scroll-linked animations for "Orgasmic" smoothness

    // Header Background & Height
    // Fade in white background and blur
    const headerBgOpacity = useTransform(scrollY, [0, 50], [0, 0.95]);
    const headerBackdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
    const headerBorderOpacity = useTransform(scrollY, [0, 10], [1, 0]); // Fade out initial heavy border
    const headerShadowOpacity = useTransform(scrollY, [40, 60], [0, 0.1]);

    // Padding transition (Large to Compact)
    const headerPaddingY = useTransform(scrollY, [0, 100], [12, 0]); // px-3 to px-0 approx logic (rem mapped to px)

    // Big Logo Transitions (Fade out & Collapse)
    const bigLogoOpacity = useTransform(scrollY, [0, 150], [1, 0]);
    const bigLogoScale = useTransform(scrollY, [0, 150], [1, 0.8]);
    const bigLogoY = useTransform(scrollY, [0, 150], [0, -50]);
    // Max Height collapse: Sync with opacity to pull layout up seamlessly
    const bigLogoMaxHeight = useTransform(scrollY, [0, 200], ["50vh", "0vh"]);

    // Tiny Logo Transitions (Fade in & Slide Up)
    // Starts appearing as big logo is mostly gone
    const tinyLogoOpacity = useTransform(scrollY, [100, 200], [0, 1]);
    const tinyLogoY = useTransform(scrollY, [100, 200], [12, 0]); // Reduced travel to keep it "inside margins"

    // Pointer events helper to prevent clicking invisible tiny logo

    const [tinyLogoPointerEvents, setTinyLogoPointerEvents] = React.useState<'none' | 'auto'>('none');

    useMotionValueEvent(scrollY, "change", (latest) => {
        setTinyLogoPointerEvents(latest > 100 ? 'auto' : 'none');
    });

    const getNavLinks = () => {
        // ... (unchanged)
    };

    return (
        <motion.header
            className="sticky top-0 w-full z-50"
            style={{
                backgroundColor: useTransform(headerBgOpacity, opacity => `rgba(255, 255, 255, ${opacity})`),
                backdropFilter: headerBackdropBlur,
                paddingTop: headerPaddingY,
                paddingBottom: headerPaddingY,
                boxShadow: useTransform(headerShadowOpacity, opacity => `0 4px 6px -1px rgba(0, 0, 0, ${opacity})`),
            }}
        >
            {/* Main Container */}
            <motion.div
                className="max-w-[1400px] mx-auto px-4 md:px-12"
                style={{
                    borderBottomWidth: '4px',
                    borderBottomColor: 'black',
                    borderBottomStyle: 'solid',
                    borderColor: useTransform(headerBorderOpacity, opacity => `rgba(0, 0, 0, ${opacity})`)
                }}
            >

                {/* Navbar Top Row */}
                <div className="flex flex-row justify-between items-center py-3 md:py-4 border-b border-black text-[9px] md:text-sm font-bold uppercase tracking-tight whitespace-nowrap relative">
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

                    {/* Center: Tiny Logo (Fade In Logic) */}
                    <motion.div
                        className="absolute left-1/2 top-1/2"
                        style={{
                            opacity: pathname !== '/' ? 1 : tinyLogoOpacity,
                            y: pathname !== '/' ? 0 : tinyLogoY,
                            x: "-50%",
                            translateY: "-50%",
                            pointerEvents: pathname !== '/' ? 'auto' : tinyLogoPointerEvents
                        }}
                    >
                        <Link to="/" className="flex justify-center items-center">
                            <TinyLogoAnimation />
                        </Link>
                    </motion.div>

                    {/* Right: Utilities */}
                    <div className="flex gap-3 md:gap-10 items-center">
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
                        <div className="w-full flex justify-center items-center py-4">
                            <LogoAnimation />
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.header>
    );
};
