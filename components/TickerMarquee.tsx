import React from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const TickerMarquee: React.FC = () => {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(".marquee-inner", {
      xPercent: -50,
      repeat: -1,
      duration: 35,
      ease: "linear"
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative w-full py-8 md:py-12 bg-[#1C1C1C] overflow-hidden whitespace-nowrap border-y border-white/5">
      <div className="marquee-inner flex font-display text-3xl md:text-7xl lg:text-8xl font-black uppercase text-[#FDFCFB] tracking-tighter items-center">
        <div className="flex items-center gap-12 md:gap-24 px-6 md:px-12">
          <span>BAKED FRESH</span>
          <span className="text-outline-pink opacity-20">THREADA</span>
          <span>HAND-CRAFTED</span>
          <span className="text-[#D97B8D]">EVERY DAY</span>
          <span>PREMIUM</span>
          <span className="text-outline-pink opacity-20">STUDIO</span>
        </div>
        <div className="flex items-center gap-12 md:gap-24 px-6 md:px-12">
          <span>BAKED FRESH</span>
          <span className="text-outline-pink opacity-20">THREADA</span>
          <span>HAND-CRAFTED</span>
          <span className="text-[#D97B8D]">EVERY DAY</span>
          <span>PREMIUM</span>
          <span className="text-outline-pink opacity-20">STUDIO</span>
        </div>
      </div>
      <style>{`
        .text-outline-pink {
          -webkit-text-stroke: 1.5px #D97B8D;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default TickerMarquee;