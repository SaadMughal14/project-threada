import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useCartStore } from '../src/store/cartStore';
import { Link } from 'react-router-dom';

const ThreadaLogo = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
            id="curve"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="transparent"
        />
        <text className="text-[14px] font-black uppercase tracking-[0.3em] fill-current">
            <textPath xlinkHref="#curve">
                Threada • Threada • Threada •
            </textPath>
        </text>
        <circle cx="50" cy="50" r="12" fill="currentColor" />
    </svg>
);

export const Header: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const logoRef = useRef<HTMLDivElement>(null);
    const itemCount = getItemCount();

    useEffect(() => {
        // Continuous rotation
        gsap.to(logoRef.current, {
            rotation: 360,
            duration: 10,
            ease: 'none',
            repeat: -1,
        });
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white px-6 py-4 flex justify-between items-center bg-transparent pointer-events-none">
            {/* Left: Logo */}
            <Link to="/" className="pointer-events-auto block">
                <div ref={logoRef} className="w-12 h-12 md:w-16 md:h-16">
                    <ThreadaLogo />
                </div>
            </Link>

            {/* Right: Cart Trigger */}
            <button
                onClick={toggleCart}
                className="pointer-events-auto group flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
                <span className="font-heading italic text-lg md:text-xl transform translate-y-1">Cart</span>
                <span className="font-body text-xs font-bold border border-white rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                </span>
            </button>
        </header>
    );
};
