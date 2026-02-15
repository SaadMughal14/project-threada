import React, { useEffect, useState } from 'react';
import { useImageZoom } from '../context/ImageZoomContext';
import { gsap } from 'gsap';

const ImageZoomOverlay: React.FC = () => {
    const { zoomedImageSrc, closeZoom } = useImageZoom();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (zoomedImageSrc) {
            setIsActive(true);
            document.body.style.overflow = 'hidden';

            // Animation in
            gsap.fromTo(".zoom-overlay-bg",
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );
            gsap.fromTo(".zoom-image-container",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
            );

        } else {
            document.body.style.overflow = '';
            setIsActive(false);
        }
    }, [zoomedImageSrc]);

    if (!isActive && !zoomedImageSrc) return null;

    const handleClose = () => {
        gsap.to(".zoom-overlay-bg", { opacity: 0, duration: 0.2 });
        gsap.to(".zoom-image-container", { scale: 0.8, opacity: 0, duration: 0.2, onComplete: closeZoom });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10">
            <div
                className="zoom-overlay-bg absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
                onClick={handleClose}
            ></div>

            <div className="zoom-image-container relative max-w-[95vw] max-h-[95vh] w-auto h-auto shadow-2xl pointer-events-none">
                <img
                    src={zoomedImageSrc || ''}
                    alt="Zoomed Product"
                    className="w-full h-full object-contain max-h-[90vh] pointer-events-auto rounded-xl"
                />

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 md:-top-4 md:-right-4 translate-x-0 translate-y-0 md:translate-x-1/2 md:-translate-y-1/2 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg pointer-events-auto border-2 border-black z-50 group"
                    aria-label="Close Zoom"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:rotate-90 transition-transform duration-300">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ImageZoomOverlay;
