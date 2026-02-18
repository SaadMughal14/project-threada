import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/base.glb');
  return <primitive object={scene} scale={1.6} position={[0, -1, 0]} />;
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
  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center bg-[#F5F0EB]">
      {/* --- BACKGROUND TEXT LAYER (Z-0) --- */}
      <div className="absolute inset-0 flex justify-between items-center px-4 md:px-10 pointer-events-none z-0">
        {/* Left Block */}
        <div className="flex flex-col justify-center h-full">
          <span className="text-[12vw] leading-none font-black text-[#1C1C1C] uppercase tracking-tighter">
            AVANT
          </span>
        </div>

        {/* Right Block */}
        <div className="flex flex-col justify-center h-full text-right">
          <span className="text-[12vw] leading-none font-black text-[#1C1C1C] uppercase tracking-tighter">
            GARDE
          </span>
        </div>
      </div>

      {/* --- 3D CANVAS LAYER (Z-10) --- */}
      <div className="absolute inset-0 z-10">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            className="w-full h-full"
            camera={{ position: [0, 0, 5], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            {/* Cinematic Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.5}
              castShadow
            />
            <directionalLight
              position={[-5, 5, -5]}
              intensity={0.5}
              color="#e8d5c4"
            />

            <Environment preset="studio" />

            {/* Interactive Model */}
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-0.2, 0.2]}
              azimuth={[-0.5, 0.5]}
              snap={true}
            >
              <Float
                speed={2}
                rotationIntensity={0.5}
                floatIntensity={0.5}
              >
                <Model />
              </Float>
            </PresentationControls>
          </Canvas>
        </Suspense>
      </div>
    </section>
  );
};

export default Hero;