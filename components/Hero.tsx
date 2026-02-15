import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const CookieSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
    <circle cx="50" cy="50" r="45" fill="#D97B8D" />
    <circle cx="30" cy="30" r="6" fill="#4A3728" />
    <circle cx="70" cy="35" r="7" fill="#4A3728" />
    <circle cx="45" cy="70" r="8" fill="#4A3728" />
    <circle cx="75" cy="75" r="5" fill="#4A3728" />
    <circle cx="20" cy="60" r="4" fill="#4A3728" />
  </svg>
);

const BrownieSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
    <rect x="15" y="15" width="70" height="70" rx="8" fill="#3D2B1F" />
    <rect x="25" y="25" width="20" height="20" rx="4" fill="#2B1B10" opacity="0.6" />
    <rect x="55" y="60" width="15" height="15" rx="3" fill="#2B1B10" opacity="0.6" />
    <circle cx="30" cy="65" r="3" fill="#D97B8D" opacity="0.4" />
    <circle cx="70" cy="30" r="2" fill="#D97B8D" opacity="0.4" />
  </svg>
);

const CakeSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
    <path d="M20 70 L80 70 L80 85 Q50 90 20 85 Z" fill="#4A0E0E" />
    <path d="M20 50 L80 50 L80 70 L20 70 Z" fill="#D97B8D" />
    <path d="M20 30 L80 30 L80 50 L20 50 Z" fill="#FDFCFB" opacity="0.9" />
    <path d="M20 30 Q50 20 80 30 L50 15 Z" fill="#4A0E0E" />
  </svg>
);

const Hero: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const driftLayerRef = useRef<HTMLDivElement>(null);

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
      }, "-=1");

    // Desktop-only animations
    if (window.innerWidth >= 768) {
      const driftElements = gsap.utils.toArray('.drift-item');
      driftElements.forEach((el: any, i) => {
        const xMove = (Math.random() - 0.5) * 150;
        const yMove = (Math.random() - 0.5) * 150;
        const rotationAmount = (Math.random() - 0.5) * 360;

        gsap.to(el, {
          x: xMove,
          y: yMove,
          rotation: rotationAmount,
          duration: 10 + (Math.random() * 15),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to(el, {
          y: "+=20",
          duration: 2 + (Math.random() * 2),
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      });

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 40;
        const y = (clientY / window.innerHeight - 0.5) * 40;
        if (driftLayerRef.current) {
          gsap.to(driftLayerRef.current, { x, y, duration: 2.5, ease: "power2.out" });
        }
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, { scope: container });

  return (
    <section ref={container} className="h-[75dvh] md:h-[90dvh] w-full flex items-start md:items-center justify-center relative bg-[#F2DCE0] overflow-hidden">

      {/* --- DESKTOP VIEW (Video + SVGs) --- */}
      <div className="hidden md:block absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2DCE0]/40 via-transparent to-[#F2DCE0]/90 z-10"></div>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="w-full h-full object-cover scale-105 opacity-[0.35] will-change-transform grayscale"
        >
          <source src="https://player.vimeo.com/external/494248848.sd.mp4?s=91480c5e648f572111756570c91550c82270923e&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
        </video>
      </div>

      <div ref={driftLayerRef} className="hidden md:block absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => {
          const type = i % 3;
          return (
            <div
              key={i}
              className="drift-item absolute will-change-transform"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${15 + (Math.random() * 40)}px`,
                opacity: 0.08 + (Math.random() * 0.1),
                filter: Math.random() > 0.7 ? 'blur(1px)' : 'none',
                transform: `scale(${0.5 + Math.random()})`
              }}
            >
              {type === 0 ? <CookieSVG /> : type === 1 ? <BrownieSVG /> : <CakeSVG />}
            </div>
          );
        })}
      </div>

      {/* --- MOBILE VIEW (GIF) --- */}
      <div className="block md:hidden absolute inset-0 z-0 overflow-hidden bg-[#F2DCE0]">
        {/* Navbar background match area */}
        <div className="absolute top-0 left-0 w-full h-[52px] bg-[#F2DCE0] z-20"></div>

        {/* Texture Overlay */}
        <div className="absolute inset-0 z-10 opacity-20 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>

        <img
          src="/hero.gif"
          alt="Hero Animation"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2DCE0]/0 via-transparent to-[#F2DCE0]/30 pointer-events-none"></div>
      </div>

      {/* --- CONTENT (Shared but positioned) --- */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-full px-4 md:px-8 h-full justify-start pt-32 md:pt-0 md:justify-center md:pb-0">
        <div className="overflow-hidden w-full flex justify-center">
          <h1 className="hero-title font-display text-hero font-black text-[#1C1C1C] uppercase select-none will-change-transform mix-blend-multiply">
            GRAVITY
          </h1>
        </div>

        <div className="studio-details flex flex-col items-center mt-4 md:mt-10 text-center space-y-4 md:space-y-8">
          {/* Mobile: Space reserved in GIF negative space / Desktop: Standard Layout */}
          <div className="flex items-center gap-3 md:gap-10 opacity-60 md:opacity-60 w-full justify-center px-4">
            <span className="font-black uppercase text-[10px] md:text-[14px] tracking-[0.6em] md:tracking-[1em] whitespace-nowrap text-[#1C1C1C]">Sculpted by Heat</span>
          </div>

          <div className="space-y-2 px-2">
            <p className="font-black text-[#1C1C1C] uppercase text-[12px] md:text-3xl tracking-[0.2em] md:tracking-[0.3em] leading-tight max-w-2xl mx-auto">
              Defined by gravity.
            </p>
            <p className="hidden md:block text-[#D97B8D] opacity-60 uppercase text-[7px] md:text-[10px] font-black tracking-[0.4em] italic">
              EST 2025 • ARTISANAL BATCHES
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;