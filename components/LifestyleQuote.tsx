import React from 'react';

export const LifestyleQuote = () => {
    return (
        <section className="w-full relative py-20 md:py-28 mb-24 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                    alt="Lifestyle Background"
                    className="w-full h-full object-cover object-center"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-12 flex justify-center items-center h-full text-center">
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white leading-snug md:leading-tight lg:leading-tight max-w-4xl mx-auto">
                    "Threada is a fashion house delivering above-average quality and a wide variety of styles from emerging designers."
                </h2>
            </div>
        </section>
    );
};
