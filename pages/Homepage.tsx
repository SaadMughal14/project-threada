import React from 'react';
import { Link } from 'react-router-dom';
import { PIZZAS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { FashionCategoryGrid } from '../components/FashionCategoryGrid';
import { LifestyleQuote } from '../components/LifestyleQuote';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LogoAnimation } from '../components/LogoAnimation';

export const Homepage = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }).replace('/', '.');
    const yearStr = today.getFullYear();

    const { scrollY } = useScroll();

    // Scroll-linked animations for the Big Logo
    const bigLogoOpacity = useTransform(scrollY, [0, 100], [1, 0]);
    const bigLogoScale = useTransform(scrollY, [0, 100], [1, 0.8]);
    const bigLogoMaxHeight = useTransform(scrollY, [0, 150], ["45vh", "0vh"]);

    return (
        <main className="max-w-[1400px] mx-auto px-4 md:px-12 pb-20">
            {/* Big Hero Logo: Now part of the page flow */}
            <motion.div
                className="w-full flex justify-center items-center overflow-hidden"
                style={{
                    opacity: bigLogoOpacity,
                    scale: bigLogoScale,
                    maxHeight: bigLogoMaxHeight,
                    transformOrigin: "center center"
                }}
            >
                <div className="py-20">
                    <LogoAnimation />
                </div>
            </motion.div>

            {/* Editorial Hero: Text Top / Image Bottom */}
            <section className="mb-20">
                <div className="flex justify-between items-start pt-6 pb-4 mb-2 border-b border-black">
                    <p className="w-1/3 text-xs md:text-base font-light leading-tight tracking-tight">
                        In the whole summer show, this <br />
                        is the designer's best look yet.
                    </p>
                    <p className="text-xs md:text-base font-bold uppercase text-right leading-tight tracking-tight">
                        {dateStr} <br /> {yearStr}
                    </p>
                </div>

                <div className="w-full h-[60vh] md:h-[80vh] overflow-hidden relative group border-b-[1.5px] border-black">
                    <img
                        src="/hero.png"
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        alt="Hero Campaign"
                    />
                </div>
            </section>

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

        </main>
    );
};
