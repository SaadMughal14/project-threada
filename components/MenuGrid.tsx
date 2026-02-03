import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PIZZAS, PizzaProductExtended } from '../constants';
import { useProducts } from '../hooks/useProducts';
import BounceCards from './BounceCards';

const MenuGrid: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch products from Supabase (falls back to mock data)
  const { products } = useProducts();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use dynamic products for images
  const images = products.map(p => p.image);

  const transformStyles = isMobile
    ? ["rotate(6deg) translate(-60px, 10px)", "rotate(-4deg) translate(-30px, -5px)", "rotate(2deg) translate(-5px, 5px)", "rotate(-3deg) translate(5px, -8px)", "rotate(6deg) translate(40px, 8px)", "rotate(-8deg) translate(60px, -4px)"]
    : ["rotate(12deg) translate(-300px, 30px)", "rotate(-8deg) translate(-160px, -15px)", "rotate(4deg) translate(-30px, 10px)", "rotate(-6deg) translate(60px, -20px)", "rotate(10deg) translate(200px, 15px)", "rotate(-12deg) translate(330px, -5px)"];

  useGSAP(() => {
    gsap.from(".section-header", {
      scrollTrigger: { trigger: container.current, start: "top 85%" },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  }, { scope: container });

  return (
    <div ref={container} className="py-16 md:py-32 px-6 md:px-12 bg-[#FDFCFB] overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-24">
        <div className="section-header flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#1C1C1C] leading-[0.8]">
            Studio<br /><span className="text-[#D97B8D]">Icons</span>
          </h2>
          <p className="max-w-sm font-black uppercase text-[8px] md:text-[10px] tracking-[0.3em] opacity-40 leading-relaxed italic">
            A selection of our most coveted fire-forged artifacts. Each piece is unique.
          </p>
        </div>

        <div className="flex justify-center items-center py-6 md:py-10">
          <BounceCards
            images={images}
            containerWidth="100%"
            containerHeight={isMobile ? 300 : 450}
            animationDelay={0.2}
            animationStagger={0.1}
            easeType="expo.out"
            transformStyles={transformStyles}
            enableHover={true}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuGrid;