import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

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

  }, { scope: container });

  return (
    <section ref={container} className="h-[75dvh] md:h-[90dvh] w-full flex items-end justify-center relative bg-[#F2DCE0] overflow-hidden">

      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/hero.gif"
          alt="Hero Animation"
          className="w-full h-full object-cover"
        />
        {/* Gradients to blend edges if needed, though gif is full screen */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2DCE0]/10 via-transparent to-[#F2DCE0]/20 pointer-events-none"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center w-full max-w-full px-4 md:px-8 pb-12 md:pb-24">
        <div className="overflow-hidden w-full flex justify-center">
          <h1 className="hero-title font-display text-hero font-black text-[#1C1C1C] uppercase select-none will-change-transform mix-blend-multiply">
            GRAVITY
          </h1>
        </div>

        <div className="studio-details flex flex-col items-center mt-4 md:mt-8 text-center space-y-4">
          {/* Space reserved for text in GIF negative space */}
          <div className="flex items-center gap-3 md:gap-10 opacity-70 w-full justify-center px-4">
            <span className="font-black uppercase text-[10px] md:text-[14px] tracking-[0.6em] whitespace-nowrap text-[#1C1C1C]">Sculpted by Heat</span>
          </div>

          <div className="space-y-2 px-2">
            <p className="font-black text-[#1C1C1C] uppercase text-[12px] md:text-2xl tracking-[0.2em] md:tracking-[0.4em] leading-tight max-w-2xl mx-auto">
              Defined by gravity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;