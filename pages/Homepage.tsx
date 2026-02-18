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
        const primaryMaterial = new THREE.MeshStandardMaterial({
            color: '#0a0a0a',
            roughness: 0.82,
            metalness: 0.18,
        });
        const accentMaterial = new THREE.MeshStandardMaterial({
            color: '#2a3444',
            roughness: 0.7,
            metalness: 0.25,
        });
        const hardwareMaterial = new THREE.MeshStandardMaterial({
            color: '#1a1a1a',
            roughness: 0.3,
            metalness: 0.9,
        });

        let meshIndex = 0;
        scene.traverse((child: any) => {
            if (child.isMesh) {
                // Alternate materials for dual-tone look
                if (meshIndex % 3 === 0) {
                    child.material = accentMaterial;
                } else if (meshIndex % 5 === 0) {
                    child.material = hardwareMaterial;
                } else {
                    child.material = primaryMaterial;
                }
                child.castShadow = true;
                child.receiveShadow = true;
                meshIndex++;
            }
        });
    }, [scene]);

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

                <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative border-b-[1.5px] border-black"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 40%, #e8e4e0 0%, #d4cfc9 35%, #bfb8b0 65%, #a8a099 100%)'
                    }}
                >
                    {/* Subtle vignette overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.08) 100%)'
                        }}
                    />

                    {/* Interaction hint — subtle, brutalist */}
                    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 opacity-0 animate-[fadeIn_2s_2s_forwards]">
                        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-black/25 font-bold">
                            Drag to Rotate
                        </span>
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-black/20 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                        </svg>
                    </div>

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
                            <ambientLight intensity={0.4} />
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

                            <OrbitControls
                                enableZoom={false}
                                enablePan={false}
                                autoRotate
                                autoRotateSpeed={1.5}
                                minPolarAngle={Math.PI / 3}
                                maxPolarAngle={Math.PI / 1.8}
                            />
                            <HeroModel />
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
