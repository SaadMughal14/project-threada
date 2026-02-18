import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { PIZZAS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei';

import { FashionCategoryGrid } from '../components/FashionCategoryGrid';
import { LifestyleQuote } from '../components/LifestyleQuote';

function HeroModel() {
    const { scene } = useGLTF('/base.glb');
    return <primitive object={scene} scale={1} position={[0, -1, 0]} />;
}
useGLTF.preload('/base.glb');

export const Homepage = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }).replace('/', '.');
    const yearStr = today.getFullYear();

    return (
        <main className="max-w-[1400px] mx-auto px-4 md:px-12 pb-20">

            {/* Editorial Hero: Text Top / 3D Canvas Bottom */}
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

                <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative border-b-[1.5px] border-black bg-[#F5F0EB]">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-mono text-[11px] md:text-sm tracking-[0.5em] uppercase text-[#1C1C1C]/40 animate-pulse">
                                [ LOADING ASSET ]
                            </span>
                        </div>
                    }>
                        <Canvas
                            className="absolute inset-0"
                            camera={{ position: [0, 0.5, 4], fov: 35 }}
                            dpr={[1, 2]}
                            gl={{ antialias: true, alpha: true }}
                            style={{ background: 'transparent' }}
                        >
                            <ambientLight intensity={0.2} />
                            <directionalLight
                                position={[5, 8, 3]}
                                intensity={1.2}
                                castShadow
                            />
                            <directionalLight
                                position={[-3, 2, -2]}
                                intensity={0.3}
                                color="#e8d5c4"
                            />
                            <Environment preset="studio" environmentIntensity={0.5} />

                            <PresentationControls
                                global
                                rotation={[0, 0, 0]}
                                polar={[-0.1, 0.2]}
                                azimuth={[-0.5, 0.5]}
                                config={{ mass: 2, tension: 400 }}
                                snap={{ mass: 4, tension: 300 }}
                            >
                                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                                    <HeroModel />
                                </Float>
                            </PresentationControls>
                        </Canvas>
                    </Suspense>
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
