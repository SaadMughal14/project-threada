import React from 'react';
import { Link } from 'react-router-dom';
import { PIZZAS } from '../constants';
import { ProductCard } from '../components/ProductCard';

export const Homepage = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }).replace('/', '.');
    const yearStr = today.getFullYear();

    return (
        <main className="max-w-[1400px] mx-auto px-4 md:px-12 pb-20">

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

                <div className="w-full h-[60vh] md:h-[80vh] overflow-hidden relative group border-b-4 border-black">
                    <img
                        src="/hero.png"
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        alt="Hero Campaign"
                    />
                </div>
            </section>

            {/* Best Seller Section */}
            <section className="mb-24">
                <div className="border-t-4 border-black mb-6"></div> {/* Heavy Line */}
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
                                category: product.category
                            }}
                        />
                    ))}
                </div>
                <div className="border-b-4 border-black mt-16"></div> {/* Heavy Line */}
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

            {/* Fashion Category - Asymmetrical Grid */}
            <section className="mb-24">
                <div className="border-t-4 border-black mb-6"></div>
                <div className="flex justify-between items-center mb-10">
                    <h2 className="font-heading text-4xl md:text-6xl uppercase font-black tracking-tighter">Fashion Category</h2>
                    <div className="text-xs font-bold uppercase border border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:border-black transition-colors flex items-center gap-2">
                        Men's Fashion <span className="text-[10px]">▼</span>
                    </div>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8 mb-10 border-b border-gray-200 pb-10">
                    {/* Card 1 */}
                    <div className="relative group overflow-hidden h-[500px]">
                        <img src="/cat-summer.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-x-0 bottom-0 bg-white p-5 flex justify-between items-center border-t border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400">01</span>
                                <span className="text-base font-bold uppercase">Summer Style</span>
                            </div>
                            <span className="text-sm font-bold uppercase">Explore ↗</span>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="relative group overflow-hidden h-[500px]">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-x-0 bottom-0 bg-white p-5 flex justify-between items-center border-t border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400">02</span>
                                <span className="text-base font-bold uppercase">Art of Beat</span>
                            </div>
                            <span className="text-sm font-bold uppercase">Explore ↗</span>
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 3 */}
                    <div className="relative group overflow-hidden h-[400px]">
                        <img src="/cat-street.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-5 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400">03</span>
                                <span className="text-base font-bold uppercase">Street Style</span>
                            </div>
                            <span className="text-sm font-bold uppercase">Explore ↗</span>
                        </div>
                    </div>
                    {/* Card 4 */}
                    <div className="relative group overflow-hidden h-[400px]">
                        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-5 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400">04</span>
                                <span className="text-base font-bold uppercase">Classic Elegant</span>
                            </div>
                            <span className="text-sm font-bold uppercase">Explore ↗</span>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
};
