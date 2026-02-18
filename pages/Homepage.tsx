import React from 'react';
import { Link } from 'react-router-dom';
import { PIZZAS } from '../constants';
import { ProductCard } from '../components/ProductCard';

import Hero from '../components/Hero';
import { FashionCategoryGrid } from '../components/FashionCategoryGrid';
import { LifestyleQuote } from '../components/LifestyleQuote';

export const Homepage = () => {
    return (
        <main className="w-full">
            <Hero />

            <div className="max-w-[1400px] mx-auto px-4 md:px-12 pb-20">

                {/* Best Seller Section */}
                <section className="mb-24">
                    <div className="border-t-[1.5px] border-black mb-6"></div> {/* Refined Line */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-heading text-4xl md:text-6xl uppercase font-black tracking-tighter">Best Seller</h2>
                        <Link to="/" className="text-xs font-bold uppercase hover:underline flex items-center gap-2">
                            See All <span className="text-sm">↗</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PIZZAS.slice(0, 3).map((product: any) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    price: parseInt(product.price.replace(/[^0-9]/g, '')),
                                    image: product.image,
                                    category: product.category,
                                    images: [product.image] // Pass single image as array for now, verifying backend data structure is important though
                                }}
                            />
                        ))}
                    </div>
                    <div className="border-b-[1.5px] border-black mt-16"></div> {/* Refined Line */}
                </section>

                {/* Latest Arrivals Section */}
                <section className="mb-24">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="font-heading text-4xl md:text-6xl uppercase font-black tracking-tighter">Latest Arrivals</h2>
                        <Link to="/" className="text-xs font-bold uppercase hover:underline flex items-center gap-2">
                            See All <span className="text-sm">↗</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {PIZZAS.slice(3, 5).map((product: any) => (
                            <div key={product.id} className="group cursor-pointer">
                                <div className="bg-[#F4F4F4] mb-6 aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={product.image}
                                        className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold uppercase border-b border-gray-300 pb-3">
                                    <span>{product.name}</span>
                                    <span>{product.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Full Width Lifestyle Quote */}
                <LifestyleQuote />

                {/* Fashion Category - Asymmetrical Grid with Editorial Numbering */}
                <FashionCategoryGrid />

            </div>
        </main>
    );
};
