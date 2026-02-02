import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Added React import to resolve 'Cannot find namespace React' error on line 5
const useScrollSkew = (target: React.RefObject<HTMLElement>) => {
  const proxy = useRef({ skew: 0 });

  useEffect(() => {
    if (!target.current) return;

    const setter = gsap.quickSetter(target.current, "skewY", "deg");
    const clamp = gsap.utils.clamp(-15, 15); // Maximum 15 degree skew

    const onUpdate = () => {
      // Calculate skew based on velocity
      // We'll use a smoother approach with a delayed return to 0
      setter(proxy.current.skew);
    };

    const updateProxy = (velocity: number) => {
      const skew = clamp(velocity / 50); // Scale velocity to skew degree
      gsap.to(proxy.current, {
        skew: skew,
        duration: 0.1,
        onUpdate: onUpdate,
        ease: "power2.out"
      });

      // Spring back to zero
      gsap.to(proxy.current, {
        skew: 0,
        duration: 0.8,
        delay: 0.1,
        onUpdate: onUpdate,
        ease: "elastic.out(1, 0.3)"
      });
    };

    // Listen for window scroll velocity (or Lenis scroll if accessible)
    // Here we use a scroll listener and calculate velocity manually for simplicity
    let lastPos = window.pageYOffset;
    let lastTime = Date.now();

    const handleScroll = () => {
      const currentPos = window.pageYOffset;
      const currentTime = Date.now();
      const distance = currentPos - lastPos;
      const timeElapsed = currentTime - lastTime;
      
      if (timeElapsed > 0) {
        const velocity = distance / timeElapsed * 100;
        updateProxy(velocity);
      }
      
      lastPos = currentPos;
      lastTime = currentTime;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [target]);
};

export default useScrollSkew;