import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../constants';

export const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const normalizedCategory = category?.toLowerCase() || '';

    const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Collection';

    // Filter Logic
    const filteredProducts = PRODUCTS.filter(p => {
        const productGender = p.gender?.toLowerCase();
        const productCategory = p.category?.toLowerCase();

        return (
            productGender === normalizedCategory ||
            (p.gender === 'Unisex' && normalizedCategory !== 'kids') || // Don't show unisex adults in kids unless specified
            productCategory === normalizedCategory ||
            normalizedCategory === 'best-seller'
        );
    });

    // Provide all products if filter is empty (e.g. for "Classic", "Retro" until we tag them)
    const displayProducts = filteredProducts.length > 0 ? filteredProducts : PRODUCTS.slice(0, 4);

    // Different cover images based on category
    const getCoverImage = () => {
        switch (normalizedCategory) {
            case 'man': return "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=2000";
            case 'woman': return "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=2000";
            case 'kids': return "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=2000";
            default: return "https://images.unsplash.com/photo-1490481651871-61848521577e?auto=format&fit=crop&q=80&w=2000";
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden mb-16">
                <img
                    src={getCoverImage()}
                    alt={categoryTitle}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex justify-center items-center">
                    <h1 className="font-heading font-black text-5xl md:text-9xl text-white uppercase tracking-tighter mix-blend-overlay">
                        {categoryTitle}
                    </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-12 pb-20">

                {/* Editorial Info Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h2 className="font-heading font-black text-2xl uppercase tracking-tighter mb-4">
                            Defining {categoryTitle} <br /> Aesthetics
                        </h2>
                        <div className="w-12 h-1 bg-black mb-6"></div>
                    </div>
                    <div>
                        <p className="font-mono text-xs md:text-sm text-gray-500 leading-relaxed">
                            Our {categoryTitle} collection embodies the Threada philosophy.
                            We prioritize materials that breathe, move, and endure. From the molecular structure of our
                            textiles to the architectural cut of our silhouettes, every piece is designed to be a
                            foundational element of your personal expression. This is not just fashion; it is
                            engineered elegance for the modern age.
                        </p>
                    </div>
                </div>

                {/* Products Header */}
                <div className="flex justify-between items-center mb-8 border-b border-black pb-4 sticky top-[70px] z-10 bg-white pt-4">
                    <p className="font-mono text-xs text-gray-400">
                        {displayProducts.length} RESULTS
                    </p>
                    <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
                        <button className="hover:text-gray-500 transition-colors">Filter +</button>
                        <button className="hover:text-gray-500 transition-colors">Sort ▼</button>
                    </div>
                </div>

                {/* Products Grid */}
                {displayProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-6">
                        {displayProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    ...product,
                                    price: parseInt(product.price.replace(/[^0-9]/g, ''))
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-xl font-heading font-bold uppercase">Coming Soon</p>
                        <p className="text-sm text-gray-400 mt-2">This collection is currently being curated.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
