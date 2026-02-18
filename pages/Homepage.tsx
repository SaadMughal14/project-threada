import React, { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { PIZZAS } from '../constants';
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

    return <primitive object={scene} scale={1.15} position={[1.5, -1, 0]} />;
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
                        In the whole <br />
                        summer show, this <br />
                        is the designer's <br />
                        best look yet.
                    </p>
                    <p className="text-xs md:text-base font-bold uppercase text-right leading-tight tracking-tight">
                        {dateStr} <br /> {yearStr}
                    </p>
                </div>

                <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative border-b-[1.5px] border-black bg-[#e0dcd6]">

                    {/* Interaction hint */}
                    <div className="absolute bottom-3 md:bottom-4 right-4 md:right-8 z-20 pointer-events-none flex items-center gap-2 opacity-0 animate-[fadeIn_1.5s_1.5s_forwards]">
                        <span className="text-[7px] md:text-[9px] uppercase tracking-[0.4em] text-white/60 font-bold select-none">
                            ↻ Drag to Explore
                        </span>
                    </div>

                    <div className="absolute inset-0">
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

                                {/* Studio environment as the actual visible background */}
                                <Environment preset="studio" background />

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
