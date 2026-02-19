import React from 'react';


export const FashionCategoryGrid = () => {
    const [selectedCategory, setSelectedCategory] = React.useState("Men's Fashion");
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const categories = ["Men's Fashion", "Women's Fashion", "Kids' Fashion"];

    return (
        <section className="mb-24">
            <div className="border-t-[1.5px] border-black mb-6"></div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="font-heading text-4xl md:text-6xl uppercase font-black tracking-tighter">Fashion Category</h2>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-xs font-bold uppercase border border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:border-black transition-colors flex items-center gap-2 bg-white"
                    >
                        {selectedCategory} <span className={`text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {/* Dropdown Menu */}
                    <div className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-20 transition-all duration-300 origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase transition-colors hover:bg-black hover:text-white ${selectedCategory === cat ? 'bg-gray-100' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile: Horizontal Scroll / Desktop: Grid */}
            <div className="flex overflow-x-auto snap-x gap-4 pb-6 md:grid md:grid-cols-2 md:gap-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                {/* Card 1 */}
                <div className="relative group cursor-pointer min-w-[280px] snap-center">
                    <div className="overflow-hidden aspect-[3/2] mb-3 rounded-2xl md:rounded-none">
                        <img
                            src="/cat-summer.png"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Summer Style"
                        />
                    </div>
                    {/* Editorial Numbering & Info */}
                    <div className="flex items-center gap-3 border-b border-black pb-2 mb-2">
                        <span className="text-sm font-body font-bold">01</span>
                        <div className="flex-grow"></div>
                        <span className="text-sm font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore ↗</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Summer Style</h3>
                </div>

                {/* Card 2 */}
                <div className="relative group cursor-pointer min-w-[280px] snap-center">
                    <div className="overflow-hidden aspect-[3/2] mb-3 rounded-2xl md:rounded-none">
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Art of Beat"
                        />
                    </div>
                    {/* Editorial Numbering & Info */}
                    <div className="flex items-center gap-3 border-b border-black pb-2 mb-2">
                        <span className="text-sm font-body font-bold">02</span>
                        <div className="flex-grow"></div>
                        <span className="text-sm font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore ↗</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Art of Beat</h3>
                </div>

                {/* Card 3 */}
                <div className="relative group cursor-pointer min-w-[280px] snap-center">
                    <div className="overflow-hidden aspect-[3/2] mb-3 rounded-2xl md:rounded-none">
                        <img
                            src="/cat-street.png"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Street Style"
                        />
                    </div>
                    {/* Editorial Numbering & Info */}
                    <div className="flex items-center gap-3 border-b border-black pb-2 mb-2">
                        <span className="text-sm font-body font-bold">03</span>
                        <div className="flex-grow"></div>
                        <span className="text-sm font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore ↗</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Street Style</h3>
                </div>

                {/* Card 4 */}
                <div className="relative group cursor-pointer min-w-[280px] snap-center">
                    <div className="overflow-hidden aspect-[3/2] mb-3 rounded-2xl md:rounded-none">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Classic Elegant"
                        />
                    </div>
                    {/* Editorial Numbering & Info */}
                    <div className="flex items-center gap-3 border-b border-black pb-2 mb-2">
                        <span className="text-sm font-body font-bold">04</span>
                        <div className="flex-grow"></div>
                        <span className="text-sm font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore ↗</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Classic Elegant</h3>
                </div>
            </div>
        </section>
    );
};
