
import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const HandStory: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Entrance Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 100%", 
        end: "bottom 20%",
        scrub: 0.8,
      }
    });

    tl.from(handRef.current, {
      y: 120,
      rotation: -5,
      opacity: 0,
      ease: "power2.out"
    })
    .from(textRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 40,
        ease: "expo.out"
    }, "-=0.6")
    .from(noticeRef.current, {
        y: 150,
        rotation: 15,
        opacity: 0,
        ease: "back.out(1.2)"
    }, "-=0.5");

    // Exit Animation
    gsap.to(handRef.current, {
      scrollTrigger: {
        trigger: container.current,
        start: "bottom 50%",
        end: "bottom top",
        scrub: 1,
      },
      y: -80,
      opacity: 0.4,
      ease: "none"
    });

  }, { scope: container });

  return (
    <section ref={container} className="py-24 md:py-40 bg-[#FDFCFB] flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-8 z-[20]">
        
        {/* Subtle Watermark 'G' */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex items-center justify-center z-0">
             <span className="font-display text-[70vw] md:text-[50vw] font-black leading-none text-[#1C1C1C] select-none translate-y-[-10%]">G</span>
        </div>

        <div className="relative w-full max-w-5xl flex flex-col items-center justify-center z-10">
            
            {/* Soft Shadow Base */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[15%] md:top-[20%] w-[250px] h-[60px] md:w-[500px] md:h-[120px] bg-black opacity-10 blur-[40px] md:blur-[60px] rounded-full"></div>
            
            {/* Artifact Wrapper */}
            <div ref={handRef} className="z-20 relative flex justify-center w-full mb-12 md:mb-20">
                <div className="relative group">
                     {/* Main Cookie Bowl Image */}
                     <div className="w-56 h-72 md:w-80 md:h-[420px] bg-[#1C1C1C] rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10 -rotate-2 group-hover:rotate-0 transition-transform duration-1000">
                        <img 
                            src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop" 
                            className="w-full h-full object-cover" 
                            alt="Signature Bowl" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                     </div>
                </div>

                {/* Cupcake Notice on a Pin Stick */}
                <div ref={noticeRef} className="absolute -right-2 md:right-[5%] top-[10%] md:top-[15%] flex flex-col items-center z-30">
                    <div className="w-28 h-28 md:w-48 md:h-48 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl md:rounded-[2.5rem] p-1.5 md:p-2.5 border border-black/5 rotate-[8deg]">
                        <img 
                            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop" 
                            className="w-full h-full object-cover rounded-xl md:rounded-[2rem]" 
                            alt="Speciality" 
                        />
                    </div>
                    {/* The Pin Stick */}
                    <div className="w-[1px] h-40 md:h-80 bg-black/10 -mt-1 origin-top"></div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full text-center z-40">
                <h2 ref={textRef} className="font-display text-[14vw] md:text-[11vw] font-black uppercase text-[#1C1C1C] leading-[0.75] tracking-[-0.07em] select-none">
                    GRAV<span className="text-[#D4AF37]">ITY</span>
                </h2>
                
                <div className="flex justify-center mt-10 md:mt-16">
                  <button className="bg-[#1C1C1C] text-[#FDFCFB] flex items-center gap-6 px-12 md:px-20 py-5 md:py-7 rounded-full font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] hover:bg-[#D4AF37] hover:text-[#1C1C1C] transition-all group active:scale-95">
                      VISIT STUDIO
                      <svg className="group-hover:translate-x-2 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
                  </button>
                </div>
            </div>
        </div>
    </section>
  );
};

export default HandStory;
