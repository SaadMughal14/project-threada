import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

interface InfoModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ title, content, onClose }) => {
    // Animation specific to this component
    useEffect(() => {
        gsap.fromTo("#info-modal-content",
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
        );
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex justify-center items-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                id="info-modal-content"
                className="bg-white text-black w-full max-w-md p-8 md:p-12 relative shadow-2xl overflow-hidden border border-gray-100"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-black" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <h2 className="font-heading font-black text-3xl uppercase tracking-tighter mb-4">{title}</h2>
                    <div className="w-12 h-0.5 bg-black mb-6"></div>
                    <p className="font-mono text-sm text-gray-500 leading-relaxed max-w-[80%]">
                        {content}
                    </p>

                    <button
                        onClick={onClose}
                        className="mt-8 px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors w-full"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
