
import React, { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { useCartStore } from '../src/store/cartStore';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';

import { FashionCategoryGrid } from '../components/FashionCategoryGrid';
import { LifestyleQuote } from '../components/LifestyleQuote';

function HeroModel() {
    const { scene } = useGLTF('/base.glb');

    useEffect(() => {
        const material = new THREE.MeshStandardMaterial({
            color: '#111111',
            roughness: 0.85,
            metalness: 0.15,
        });
        scene.traverse((child: any) => {
            if (child.isMesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    return <primitive object={scene} scale={1.3} position={[1.5, -1, 0]} />;
}
useGLTF.preload('/base.glb');

export const Homepage = () => {
    const { addItem, toggleCart } = useCartStore();

    const handleQuickAdd = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        const price = parseInt(product.price.toString().replace(/[^0-9]/g, ''));

        addItem({
            id: `${product.id}-quick`,
            productId: product.id,
            name: product.name,
            price: price,
            quantity: 1,
            image: product.image,
            size: 'M', // Default fallback
            color: product.color || 'Standard',
            maxStock: 99
        });

        toggleCart();
    };
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }).replace('/', '.');
    const yearStr = today.getFullYear();

    return (
        <main className="max-w-[1400px] mx-auto px-4 md:px-12 pb-20">

            {/* Mobile Header (Welcome & Promo) */}
            <div className="md:hidden mt-4 mb-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Welcome Back!</p>
                            <h3 className="text-sm font-black uppercase tracking-tight">Jason Jacktion</h3>
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        <span className="text-lg">🛍️</span>
                    </button>
                </div>

                <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-black text-white p-6 flex flex-col justify-center shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1507680434567-5739c8cb31db?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Spring Collection" />
                    <div className="relative z-10">
                        <p className="text-xs font-medium mb-1 opacity-90">Your Spring</p>
                        <h2 className="text-3xl font-black uppercase leading-none mb-2">Collection</h2>
                        <div className="text-4xl font-black text-white mb-2">50% OFF</div>
                        <p className="text-[10px] opacity-70 mb-4">For selected spring style</p>
                        <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-2 rounded-full text-xs font-bold uppercase">Shop Now</button>
                    </div>
                </div>
            </div>

            {/* Desktop Hero (Hidden on Mobile) */}
            <section className="hidden md:block mb-20">
                {/* ... existing hero content ... */}
                <div className="flex justify-between items-start pt-6 pb-4 mb-2 border-b border-black">
                    <p className="w-1/3 text-xs md:text-base font-light leading-tight tracking-tight">
                        Every thread tells <br />
                        a story — this season, <br />
                        the narrative is <br />
                        unmistakably bold.
                    </p>
                    <p className="text-xs md:text-base font-bold uppercase text-right leading-tight tracking-tight">
                        {dateStr} <br /> {yearStr}
                    </p>
                </div>

                <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative border-b-[1.5px] border-white/20 bg-[radial-gradient(circle_at_50%_40%,_#3a3a3a_0%,_#0a0a0a_70%,_#000000_100%)]">
                    {/* ... (keep existing hero internals) ... */}
                    {/* Noise Overlay */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==')]"></div>

                    {/* SANDWICH LAYER 1 */}
                    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none overflow-hidden -ml-[4vw]">
                        <h1
                            className="text-[14vw] md:text-[12vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap"
                            style={{
                                WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                                color: 'transparent',
                                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.1))',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text'
                            }}
                        >
                            AVANT <span className="opacity-0">GARDE</span>
                        </h1>
                    </div>

                    {/* Interaction hint */}
                    <div className="absolute bottom-3 md:bottom-4 right-4 md:right-8 z-30 pointer-events-none flex items-center gap-2 opacity-0 animate-[fadeIn_1.5s_1.5s_forwards]">
                        <span className="text-[7px] md:text-[9px] uppercase tracking-[0.4em] text-white/60 font-bold select-none">
                            ↻ Drag to Explore
                        </span>
                    </div>

                    {/* LAYER 2: 3D Canvas */}
                    <div className="absolute inset-0 z-10">
                        <Suspense fallback={
                            <div className="absolute inset-0 flex items-center justify-center bg-[#e0dcd6]">
                                <span className="font-mono text-[11px] md:text-sm tracking-[0.5em] uppercase text-[#1C1C1C]/40 animate-pulse">
                                    [ LOADING ASSET ]
                                </span>
                            </div>
                        }>
                            <Canvas
                                className="absolute inset-0"
                                camera={{ position: [5, 2, 5], fov: 30 }}
                                dpr={[1, 2]}
                                shadows
                                gl={{ antialias: true }}
                            >
                                <ambientLight intensity={0.5} />
                                <directionalLight
                                    position={[4, 6, 4]}
                                    intensity={1.5}
                                    castShadow
                                    shadow-mapSize={[2048, 2048]}
                                />
                                <directionalLight
                                    position={[-4, 3, -2]}
                                    intensity={0.4}
                                    color="#c8d4e0"
                                />

                                <Environment preset="studio" />

                                <OrbitControls
                                    enableZoom={false}
                                    enablePan={false}
                                    autoRotate
                                    autoRotateSpeed={1.5}
                                    minPolarAngle={Math.PI / 3}
                                    maxPolarAngle={Math.PI / 1.8}
                                    target={[1.5, 0, 0]}
                                />
                                <HeroModel />
                            </Canvas>
                        </Suspense>
                    </div>

                    {/* SANDWICH LAYER 3 */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none select-none overflow-hidden -ml-[4vw]">
                        <h1
                            className="text-[14vw] md:text-[12vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap"
                            style={{
                                WebkitTextStroke: '1.5px rgba(255,255,255,0.6)',
                                color: 'transparent',
                                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.1))',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text'
                            }}
                        >
                            <span className="opacity-0">AVANT</span> GARDE
                        </h1>
                    </div>
                </div>
            </section>

            {/* Best Seller Section */}
            <section className="mb-12 md:mb-24">
                <div className="border-t-[1.5px] border-black mb-6 hidden md:block"></div>
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h2 className="font-heading text-2xl md:text-6xl uppercase font-black tracking-tighter">Top Collection</h2>
                    <Link to="/" className="text-[10px] md:text-xs font-bold uppercase hover:underline flex items-center gap-2 text-gray-400">
                        More
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll / Desktop: Grid */}
                <div className="flex overflow-x-auto snap-x gap-4 pb-6 md:grid md:grid-cols-3 md:gap-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {PRODUCTS.slice(0, 3).map((product: any) => (
                        <div key={product.id} className="min-w-[160px] md:min-w-0 snap-center">
                            <ProductCard
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    price: parseInt(product.price.replace(/[^0-9]/g, '')),
                                    image: product.image,
                                    category: product.category,
                                    images: [product.image]
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="border-b-[1.5px] border-black mt-8 md:mt-16 hidden md:block"></div>
            </section>

            {/* Latest Arrivals Section */}
            <section className="mb-24">
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    <h2 className="font-heading text-2xl md:text-6xl uppercase font-black tracking-tighter">New Arrivals</h2>
                    <Link to="/" className="text-[10px] md:text-xs font-bold uppercase hover:underline flex items-center gap-2 text-gray-400">
                        More
                    </Link>
                </div>

                <div className="flex overflow-x-auto snap-x gap-4 pb-6 md:grid md:grid-cols-4 md:gap-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {PRODUCTS.slice(3, 7).map((product: any) => (
                        <Link to={`/products/${product.id}`} key={product.id} className="group cursor-pointer block relative min-w-[200px] snap-center">
                            <div className="bg-[#F4F4F4] mb-3 md:mb-6 aspect-[3/4] md:aspect-square overflow-hidden relative rounded-2xl md:rounded-none">
                                <img
                                    src={product.image}
                                    className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700"
                                />
                                <button
                                    onClick={(e) => handleQuickAdd(e, product)}
                                    className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white hidden md:block" // Hidden on mobile for clutter-free
                                >
                                    Quick Add +
                                </button>
                                {/* Mobile Heart Icon */}
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white/50 backdrop-blur rounded-full flex items-center justify-center md:hidden">
                                    <span className="text-sm">♡</span>
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm font-bold uppercase md:border-b md:border-gray-300 md:pb-3">
                                <span className="truncate">{product.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#D97B8D]">${parseInt(product.price.replace(/[^0-9]/g, ''))}</span>
                                    <span className="text-[10px] text-gray-400">⭐ 5.0</span>
                                </div>
                            </div>
                        </Link>
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
