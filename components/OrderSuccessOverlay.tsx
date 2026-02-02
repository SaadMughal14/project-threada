
import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface SuccessProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
}

type OrderPhase = 'baking' | 'delivering' | 'completed';

const OrderSuccessOverlay: React.FC<SuccessProps> = ({ isOpen, order, onClose }) => {
  const [phase, setPhase] = useState<OrderPhase>('baking');
  const containerRef = useRef<HTMLDivElement>(null);
  const furnaceRef = useRef<HTMLDivElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(containerRef.current, { x: 0, duration: 0.8, ease: "expo.out" });

      // PHASE 1: BAKING / FORGING
      if (phase === 'baking') {
        const tl = gsap.timeline();
        tl.fromTo(furnaceRef.current, 
          { scale: 0.8, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
        );
        
        // Heat flicker
        gsap.to(".heat-glow", {
          opacity: 0.4,
          scale: 1.2,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        // Transition to delivering after a delay
        setTimeout(() => setPhase('delivering'), 4000);
      }

      // PHASE 2: DELIVERING
      if (phase === 'delivering') {
        gsap.fromTo(riderRef.current,
          { x: -200, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "back.out(1.2)" }
        );

        // Speed lines animation
        gsap.to(".speed-line", {
          x: 400,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          repeat: -1,
          ease: "none"
        });

        // Transition to completed after a delay
        setTimeout(() => setPhase('completed'), 4000);
      }

      // PHASE 3: COMPLETED
      if (phase === 'completed') {
        gsap.fromTo(receiptRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "expo.out" }
        );
      }

    } else {
      gsap.to(containerRef.current, { x: '100%', duration: 0.6, ease: "power4.in" });
      // Reset phase when closing
      setTimeout(() => setPhase('baking'), 600);
    }
  }, [isOpen, phase]);

  if (!isOpen || !order) return null;

  const handleShare = (platform: 'wa' | 'ig') => {
    const text = `My artifacts from GRAVITY Studio are forged and en route! Batch #${order.id} 🍪✨`;
    if (platform === 'wa') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    } else {
      alert("Screenshot your digital receipt and tag @GravityStudio!");
    }
  };

  return (
    <div ref={containerRef} id="order-success-overlay" className="fixed inset-0 z-[400] bg-[#FDFCFB] transform translate-x-full flex flex-col h-screen w-screen overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-[50]">
         <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span className="font-black uppercase text-[10px] tracking-[0.5em] text-[#1C1C1C]">LIVE TRACKING: #{order.id}</span>
         </div>
         <button onClick={onClose} className="p-2 md:p-3 bg-black text-white rounded-full hover:bg-[#D4AF37] transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
         </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
        
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        {/* STAGE 1: THE FURNACE (BAKING) */}
        {phase === 'baking' && (
          <div ref={furnaceRef} className="space-y-8 max-w-lg">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
               <div className="heat-glow absolute inset-0 bg-[#D4AF37] rounded-full blur-[60px] opacity-20 scale-75"></div>
               <div className="w-full h-full bg-[#1C1C1C] rounded-[3rem] border-8 border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                  {/* Stylized Oven Bars */}
                  <div className="absolute top-1/4 w-full h-[2px] bg-white/10"></div>
                  <div className="absolute top-2/4 w-full h-[2px] bg-white/10"></div>
                  <div className="absolute top-3/4 w-full h-[2px] bg-white/10"></div>
                  
                  {/* Floating Cookies */}
                  <div className="animate-bounce flex flex-col items-center gap-4">
                     <span className="text-6xl md:text-8xl filter drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">🍪</span>
                     <div className="w-16 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></div>
                  </div>
               </div>
            </div>
            <div className="space-y-4">
               <h3 className="font-display text-4xl md:text-6xl text-[#1C1C1C] font-black uppercase tracking-tighter leading-none">FORGING<br/>ARTIFACTS</h3>
               <p className="font-black text-[#1C1C1C]/40 uppercase text-[10px] tracking-[0.5em] max-w-xs mx-auto">Sculpting the dough in the thermal core. Estimated completion: 2 min.</p>
            </div>
          </div>
        )}

        {/* STAGE 2: THE TRANSPORT (DELIVERY) */}
        {phase === 'delivering' && (
          <div ref={riderRef} className="space-y-12 w-full max-w-2xl relative">
            <div className="relative h-40 md:h-64 flex items-center justify-center">
               {/* Speed Lines */}
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="speed-line absolute left-0 w-20 h-[2px] bg-[#D4AF37]/30" style={{ top: `${15 + i*15}%` }}></div>
               ))}
               
               <div className="relative z-10 flex flex-col items-center gap-6">
                  <span className="text-8xl md:text-[10rem] animate-wiggle inline-block">🛵</span>
                  <div className="h-2 w-32 md:w-48 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4AF37] w-1/2 animate-progress"></div>
                  </div>
               </div>
            </div>
            <div className="space-y-4">
               <h3 className="font-display text-4xl md:text-6xl text-[#1C1C1C] font-black uppercase tracking-tighter leading-none">DEFIYING<br/>GRAVITY</h3>
               <p className="font-black text-[#1C1C1C]/40 uppercase text-[10px] tracking-[0.5em]">Rider is pushing the limits to deliver your artifacts.</p>
            </div>
          </div>
        )}

        {/* STAGE 3: COMPLETED / RECEIPT */}
        {phase === 'completed' && (
          <div ref={receiptRef} className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-start justify-center overflow-y-auto pt-20 pb-10 px-4 scrollbar-hide">
            
            {/* Left Col: Receipt */}
            <div className="w-full max-w-sm mx-auto md:mx-0">
               <div className="thermal-receipt bg-white shadow-[0_30px_90px_rgba(0,0,0,0.06)] p-8 font-mono border border-black/5 text-[12px] relative text-left">
                  <div className="text-center mb-8 border-b-2 border-black border-dashed pb-6">
                    <h4 className="font-black text-xl mb-1">GRAVITY STUDIO</h4>
                    <p className="opacity-60 text-[10px] uppercase">Phase 6, DHA, Karachi</p>
                    <p className="opacity-60 text-[10px] uppercase">Tel: +92 321 000 000</p>
                  </div>

                  <div className="space-y-2 mb-6 text-[11px]">
                     <div className="flex justify-between"><span>TICKET ID:</span><span className="font-bold">#{order.id}</span></div>
                     <div className="flex justify-between"><span>DATE:</span><span>{new Date().toLocaleDateString()}</span></div>
                     <div className="flex justify-between"><span>STATUS:</span><span className="text-[#D4AF37] font-bold">DELIVERED</span></div>
                     <div className="flex justify-between"><span>NAME:</span><span className="uppercase">{order.customer.name}</span></div>
                  </div>

                  <div className="border-y-2 border-black border-dashed py-4 mb-6 space-y-4">
                     {order.items.map((item: any) => (
                       <div key={item.id} className="flex justify-between items-start">
                         <div className="flex-1 pr-4">
                           <p className="font-bold uppercase leading-tight">{item.name}</p>
                           <p className="text-[10px] opacity-60">QTY: {item.quantity}</p>
                         </div>
                         <span className="font-bold">Rs. {parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity}</span>
                       </div>
                     ))}
                  </div>

                  <div className="space-y-1 mb-8">
                     <div className="flex justify-between font-black text-lg">
                       <span>TOTAL</span>
                       <span>Rs. {order.total}</span>
                     </div>
                  </div>

                  <div className="text-center space-y-4">
                    <p className="font-bold tracking-widest text-[9px] uppercase">THANK YOU FOR YOUR PATIENCE</p>
                    <div className="flex justify-center py-2 opacity-30 grayscale">
                       <svg width="100" height="20" viewBox="0 0 100 20">
                          {[...Array(20)].map((_, i) => (
                            <rect key={i} x={i*5} y="0" width={1 + Math.random()*3} height="20" fill="black" />
                          ))}
                       </svg>
                    </div>
                  </div>
                  
                  {/* Decorative jagged edge bottom */}
                  <div className="absolute left-0 bottom-[-8px] w-full h-4 overflow-hidden flex">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-[5%] aspect-square bg-[#FDFCFB] rotate-45 translate-y-[-50%] border-t border-l border-black/5"></div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Right Col: Sharing & Home */}
            <div className="flex-1 max-w-sm mx-auto md:mx-0 flex flex-col gap-6 pt-4">
               <div className="text-left space-y-2">
                  <h4 className="font-display text-3xl font-black uppercase text-[#1C1C1C]">ARTIFACTS<br/>COLLECTED.</h4>
                  <p className="font-black text-[#1C1C1C]/40 uppercase text-[9px] tracking-[0.4em]">Each piece is a sculpture of time and heat.</p>
               </div>

               <div className="grid gap-3 no-print">
                  <button onClick={() => window.print()} className="w-full bg-[#1C1C1C] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:scale-[1.02] transition-all">Download Ticket</button>
                  <div className="grid grid-cols-2 gap-3">
                     <button onClick={() => handleShare('wa')} className="bg-[#25D366]/10 text-[#25D366] py-4 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 border border-[#25D366]/20">
                        💬 WhatsApp
                     </button>
                     <button onClick={() => handleShare('ig')} className="bg-pink-500/10 text-pink-600 py-4 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 border border-pink-500/10">
                        📸 Share
                     </button>
                  </div>
                  <button onClick={onClose} className="w-full border-2 border-[#1C1C1C] text-[#1C1C1C] py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.4em] mt-4 hover:bg-[#1C1C1C] hover:text-white transition-all">Back to Home</button>
               </div>
            </div>

          </div>
        )}

      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-progress {
          animation: progress 2s infinite linear;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default OrderSuccessOverlay;
