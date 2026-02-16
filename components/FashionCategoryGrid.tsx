import React from 'react';


export const FashionCategoryGrid = () => {
    return (
        <section className="mb-24">
            <div className="border-t-[1.5px] border-black mb-6"></div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="font-heading text-4xl md:text-6xl uppercase font-black tracking-tighter">Fashion Category</h2>
                <div className="text-xs font-bold uppercase border border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:border-black transition-colors flex items-center gap-2">
                    Men's Fashion <span className="text-[10px]">▼</span>
                </div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8 mb-10 border-b border-gray-200 pb-10">
                {/* Card 1 */}
                <div className="relative group cursor-pointer">
                    <div className="overflow-hidden h-[500px] mb-3">
                        <img
                            src="/cat-summer.png"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Summer Style"
                        />
                    </div>
                    {/* Editorial Numbering & Info */}
                    <div className="flex items-center gap-3 border-b border-black pb-2 mb-2">
                        <span className="font-serif italic font-light text-2xl">01</span>
                        <div className="flex-grow"></div>
                        <span className="text-sm font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore ↗</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Summer Style</h3>
                </div>

                {/* Card 2 */}
                <div className="relative group cursor-pointer">
                    <div className="overflow-hidden h-[500px] mb-3">
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Art of Beat"
                        />
                    </div>
                    {/* Editorial Numbering & Info */}
                    <div className="flex items-center gap-3 border-b border-black pb-2 mb-2">
                        <span className="font-serif italic font-light text-2xl">02</span>
                        <div className="flex-grow"></div>
                        <span className="text-sm font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore ↗</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Art of Beat</h3>
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card 3 */}
                <div className="relative group cursor-pointer">
                    <div className="overflow-hidden h-[400px] mb-3">
                        <img
                            src="/cat-street.png"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Street Style"
                        />
                    </div>
                    {/* Editorial Numbering & Info */}
                    <div className="flex items-center gap-3 border-b border-black pb-2 mb-2">
                        <span className="font-serif italic font-light text-2xl">03</span>
                        <div className="flex-grow"></div>
                        <span className="text-sm font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore ↗</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Street Style</h3>
                </div>

                {/* Card 4 */}
                <div className="relative group cursor-pointer">
                    <div className="overflow-hidden h-[400px] mb-3">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Classic Elegant"
                        />
                    </div>
                    {/* Editorial Numbering & Info */}
                    <div className="flex items-center gap-3 border-b border-black pb-2 mb-2">
                        <span className="font-serif italic font-light text-2xl">04</span>
                        <div className="flex-grow"></div>
                        <span className="text-sm font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore ↗</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Classic Elegant</h3>
                </div>
            </div>
        </section>
    );
};
