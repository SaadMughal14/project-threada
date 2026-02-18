import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

function Model() {
  const { scene } = useGLTF('/base.glb');
  return <primitive object={scene} scale={1.3} position={[0, -1, 0]} />;
}

useGLTF.preload('/base.glb');

const LoadingFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center z-10">
    <span className="font-mono text-[11px] md:text-sm tracking-[0.5em] uppercase text-[#1C1C1C]/40 animate-pulse">
      [ LOADING ASSET ]
    </span>
  </div>
);

const Hero: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const [scrollOpacity, setScrollOpacity] = React.useState(1);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Fade out quickly: 0 to 100px scroll reduces opacity from 1 to 0
      const newOpacity = Math.max(0, 1 - scrollY / 50);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".hero-title", {
      y: "80%",
      opacity: 0,
      duration: 1.4,
      ease: "expo.out"
    })
      .from(".studio-details", {
        opacity: 0,
        y: 15,
        duration: 1,
        ease: "power2.out"
      }, "-=1")
      .from(".hero-canvas-wrapper", {
        opacity: 0,
        scale: 0.96,
        duration: 1.6,
        ease: "power3.out"
      }, "-=1.2");
  }, { scope: container });

  return (
    <section
      ref={container}
      className="w-full flex flex-col relative bg-[#F5F0EB] overflow-hidden"
    >
      {/* --- 3D CANVAS BACKGROUND --- */}
      <div className="hero-canvas-wrapper relative w-full aspect-[16/9] md:aspect-[21/9]">
        {/* Gradient overlays for blending */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#F5F0EB] via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#F5F0EB]/30 via-transparent to-transparent" />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            className="absolute inset-0 z-0"
            camera={{ position: [0, 0.5, 4], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            {/* Cinematic Lighting */}
            <ambientLight intensity={0.2} />
            <directionalLight
              position={[5, 8, 3]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight
              position={[-3, 2, -2]}
              intensity={0.3}
              color="#e8d5c4"
            />

            <Environment preset="studio" environmentIntensity={0.5} />

            {/* Interactive Model */}
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-0.1, 0.2]}
              azimuth={[-0.5, 0.5]}
              config={{ mass: 2, tension: 400 }}
              snap={{ mass: 4, tension: 300 }}
            >
              <Float
                speed={1.5}
                rotationIntensity={0.2}
                floatIntensity={0.5}
              >
                <Model />
              </Float>
            </PresentationControls>
          </Canvas>
        </Suspense>
      </div>

      {/* --- CONTENT OVERLAY --- */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-full px-4 md:px-8 -mt-20 md:-mt-32 pb-12 md:pb-20">
        <div className="overflow-hidden w-full flex justify-center">
          <h1 className="hero-title font-display text-hero font-black text-[#1C1C1C] uppercase select-none will-change-transform">
            THREADA
          </h1>
        </div>

        {/* Magazine Line Separator */}
        <div
          className="w-full h-[1px] bg-[#1C1C1C] my-4 md:my-6 transition-opacity duration-300 ease-out origin-center transform scale-x-90 md:scale-x-75"
          style={{ opacity: scrollOpacity }}
        />

        <div className="studio-details flex flex-col items-center mt-4 md:mt-10 text-center space-y-4 md:space-y-8">
          <div className="flex items-center gap-3 md:gap-10 opacity-60 md:opacity-60 w-full justify-center px-4">
            <span className="font-black uppercase text-[10px] md:text-[14px] tracking-[0.6em] md:tracking-[1em] whitespace-nowrap text-[#1C1C1C]">ESTABLISHED 2026</span>
          </div>

          <div className="space-y-2 px-2">
            <p className="font-black text-[#1C1C1C] uppercase text-[12px] md:text-3xl tracking-[0.2em] md:tracking-[0.3em] leading-tight max-w-2xl mx-auto">
              Defined by You.
            </p>
            <p className="hidden md:block text-[#8B7355] opacity-60 uppercase text-[7px] md:text-[10px] font-black tracking-[0.4em] italic">
              LUXURY FASHION • BRUTALIST CRAFT
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;