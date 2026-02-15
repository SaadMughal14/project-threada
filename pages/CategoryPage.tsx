import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../constants'; // Assuming we have products here

export const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const normalizedCategory = category?.toLowerCase();

    // Mock filtering logic - in a real app, this would query a DB
    // For now, we'll just show all products or random subset to simulate content
    // since our constants might not have "Man/Woman" tags explicitly on everything yet

    const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Collection';

    // Different cover images based on category
    const getCoverImage = () => {
        switch (normalizedCategory) {
            case 'man': return "https://images.unsplash.com/photo-1488161628813-99c974fc5bcd?auto=format&fit=crop&q=80&w=2000";
            case 'woman': return "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000";
            case 'kids': return "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=2000";
            default: return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000";
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Hero Section for Category */}
            <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden mb-12">
                <img
                    src={getCoverImage()}
                    alt={categoryTitle}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex justify-center items-center">
                    <h1 className="font-heading font-black text-5xl md:text-8xl text-white uppercase tracking-tighter mix-blend-overlay">
                        {categoryTitle}
                    </h1>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 pb-20">
                <div className="flex justify-between items-center mb-8 border-b border-black pb-4">
                    <p className="font-mono text-xs text-gray-400 sticky top-20">
                        SHOWING RESULTS FOR "{categoryTitle}"
                    </p>
                    {/* Fake filters for visual */}
                    <div className="flex gap-4 text-xs font-bold uppercase">
                        <button className="hover:text-gray-500">Filter</button>
                        <button className="hover:text-gray-500">Sort</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
                    {PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {/* Duplicate to fill space if needed */}
                    {PRODUCTS.map((product) => (
                        <ProductCard key={`${product.id}-dup`} product={{ ...product, id: `${product.id}-dup` }} />
                    ))}
                </div>
            </div>
        </div>
    );
};
