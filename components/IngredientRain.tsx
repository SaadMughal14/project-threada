import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const IngredientRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const ingredients = [
    { label: '🌿', x: '10%', y: '15%', z: 50 },
    { label: '🌶️', x: '85%', y: '25%', z: 80 },
    { label: '🧄', x: '20%', y: '75%', z: 40 },
    { label: '🌿', x: '75%', y: '85%', z: 60 },
    { label: '🧀', x: '90%', y: '60%', z: 90 },
    { label: '🍅', x: '5%', y: '50%', z: 70 },
    { label: '🌿', x: '40%', y: '10%', z: 30 },
  ];

  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xNorm = clientX / window.innerWidth - 0.5;
      const yNorm = clientY / window.innerHeight - 0.5;

      elementsRef.current.forEach((el, i) => {
        if (!el) return;
        const depth = ingredients[i].z / 100;
        gsap.to(el, {
          x: xNorm * 100 * depth,
          y: yNorm * 100 * depth,
          rotation: (xNorm + yNorm) * 50 * depth,
          duration: 1.5,
          ease: "power2.out"
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {ingredients.map((ing, i) => (
        <div
          key={i}
          ref={(el) => { elementsRef.current[i] = el; }}
          className="absolute text-4xl select-none"
          style={{ top: ing.y, left: ing.x }}
        >
          {ing.label}
        </div>
      ))}
    </div>
  );
};

export default IngredientRain;