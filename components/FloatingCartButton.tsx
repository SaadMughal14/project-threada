import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCartStore } from '../src/store/cartStore';

export const FloatingCartButton: React.FC = () => {
    const { getItemCount, toggleCart } = useCartStore();
    const itemCount = getItemCount();
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Initialize position to bottom-right
        setPosition({
            x: window.innerWidth - 80,
            y: window.innerHeight - 100
        });
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        const touch = e.touches[0];
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            dragStartPos.current = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const touch = e.touches[0];

        let newX = touch.clientX - dragStartPos.current.x;
        let newY = touch.clientY - dragStartPos.current.y;

        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;

        newX = Math.max(10, Math.min(newX, maxX));
        newY = Math.max(10, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleClick = () => {
        if (!isDragging) toggleCart();
    };

    if (!position) return null;

    return createPortal(
        <button
            ref={buttonRef}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                position: 'fixed',
                touchAction: 'none'
            }}
            className="md:hidden z-[9999] w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform border border-white/10"
        >
            <div className="relative pointer-events-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 20C9 21.1046 8.10457 22 7 22C5.89543 22 5 21.1046 5 20C5 18.8954 5.89543 18 7 18C8.10457 18 9 18.8954 9 20Z" fill="currentColor" />
                    <path d="M20 20C20 21.1046 19.1046 22 18 22C16.8954 22 16 21.1046 16 20C16 18.8954 16.8954 18 18 18C19.1046 18 20 18.8954 20 20Z" fill="currentColor" />
                    <path d="M1 1H4L6.68 14.39C6.77144 14.8504 7.02191 15.264 7.38755 15.5583C7.75318 15.8526 8.2107 16.009 8.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#D97B8D] text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-black">
                        {itemCount}
                    </span>
                )}
            </div>
        </button>,
        document.body
    );
};
