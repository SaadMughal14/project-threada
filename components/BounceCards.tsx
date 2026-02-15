import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface BounceCardsProps {
  className?: string;
  images?: string[];
  containerWidth?: number | string;
  containerHeight?: number | string;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
}

export default function BounceCards({
  className = '',
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)'
  ],
  enableHover = false
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.card',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationDelay, animationStagger, easeType]);

  const getNoRotationTransform = (transformStr: string): string => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    const scale = isMobile ? ' scale(1.05)' : ' scale(1.1)';
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, `rotate(0deg)${scale}`);
    } else if (transformStr === 'none') {
      return `rotate(0deg)${scale}`;
    } else {
      return `${transformStr} rotate(0deg)${scale}`;
    }
  };

  const getPushedTransform = (baseTransform: string, offsetX: number): string => {
    const translateRegex = /translate\(([-0-9.]+)px(?:,\s*([-0-9.]+)px)?\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const currentY = match[2] ? `, ${match[2]}px` : '';
      const newX = currentX + (offsetX * (isMobile ? 0.5 : 1));
      return baseTransform.replace(translateRegex, `translate(${newX}px${currentY})`);
    } else {
      return baseTransform === 'none' ? `translate(${offsetX * (isMobile ? 0.5 : 1)}px)` : `${baseTransform} translate(${offsetX * (isMobile ? 0.5 : 1)}px)`;
    }
  };

  const pushSiblings = (hoveredIdx: number) => {
    const q = gsap.utils.selector(containerRef);
    if (!enableHover || !containerRef.current) return;

    images.forEach((_, i) => {
      const selector = q(`.card-${i}`);
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || 'none';

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform);
        gsap.to(selector, {
          transform: noRotation,
          duration: 0.5,
          ease: 'back.out(1.4)',
          overwrite: 'auto',
          zIndex: 50
        });
      } else {
        const baseOffset = 120;
        const offsetX = i < hoveredIdx ? -baseOffset : baseOffset;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.03;

        gsap.to(selector, {
          transform: pushedTransform,
          duration: 0.5,
          ease: 'power3.out',
          delay,
          overwrite: 'auto',
          zIndex: 10 - distance
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);

    images.forEach((_, i) => {
      const selector = q(`.card-${i}`);
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || 'none';
      gsap.to(selector, {
        transform: baseTransform,
        duration: 0.5,
        ease: 'elastic.out(1, 0.7)',
        overwrite: 'auto',
        zIndex: 5
      });
    });
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      ref={containerRef}
      style={{
        width: containerWidth,
        height: isMobile ? '350px' : containerHeight
      }}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`card card-${idx} absolute w-[140px] md:w-[280px] aspect-square border-[6px] md:border-[14px] border-white rounded-[30px] md:rounded-[60px] overflow-hidden cursor-pointer`}
          style={{
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            transform: transformStyles[idx] || 'none',
            zIndex: 5
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
          onClick={() => pushSiblings(idx)}
        >
          <img className="w-full h-full object-cover" src={src} alt={`card-${idx}`} />
        </div>
      ))}
    </div>
  );
}
