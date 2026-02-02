
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
  const [progress, setProgress] = useState(0); // 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const furnaceRef = useRef<HTMLDivElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Constants for timings (in milliseconds)
  const BAKING_DURATION = 120000; // 2 minutes
  const DELIVERY_DURATION = 180000; // 3 minutes

  useEffect(() => {
    let interval: number;
    if (isOpen) {
      const startTime = Date.now();
      
      interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        if (phase === 'baking') {
          const p = Math.min((elapsed / BAKING_DURATION) * 100, 100);
          setProgress(p);
          if (p >= 100) {
            setPhase('delivering');
            setProgress(0);
          }
        } else if (phase === 'delivering') {
          // Calculate elapsed since delivery started
          const deliveryElapsed = elapsed - BAKING_DURATION;
          const p = Math.min((deliveryElapsed / DELIVERY_DURATION) * 100, 100);
          setProgress(p);
          if (p >= 100) {
            setPhase('completed');
          }
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, phase]);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(containerRef.current, { x: 0, duration: 0.8, ease: "expo.out" });

      if (phase === 'baking') {
        gsap.fromTo(furnaceRef.current, 
          { scale: 0.9, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
        );
        
        gsap.to(".heat-glow", {
          opacity: 0.4,
          scale: 1.2,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      if (phase === 'delivering') {
        gsap.fromTo(riderRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1, ease: "expo.out" }
        );
      }

      if (phase === 'completed') {
        gsap.fromTo(receiptRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "expo.out" }
        );
      }
    } else {
      gsap.to(containerRef.current, { x: '100%', duration: 0.6, ease: "power4.in" });
      setTimeout(() => {
        setPhase('baking');
        setProgress(0);
      }, 600);
    }
  }, [isOpen, phase]);

  if (!isOpen || !order) return null;

  // Cookie color interpolation logic: pale dough to dark baked brown
  // #E6C9A2 (230, 201, 162) to #4A3728 (74, 55, 40)
  const getBakedColor = (p: number) => {
    const r = Math.round(230 - (230 - 74) * (p / 100));
    const g = Math.round(201 - (201 - 55) * (p / 100));
    const b = Math.round(162 - (162 - 40) * (p / 100));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            <span className="font-black uppercase text-[10px] tracking-[0.5em] text-[#1C1C1C]">
              {phase === 'baking' ? 'THERMAL CORE ACTIVATED' : phase === 'delivering' ? 'TRANSIT PROTOCOL' : 'PROTOCOL COMPLETE'}: #{order.id}
            </span>
         </div>
         <button onClick={onClose} className="p-2 md:p-3 bg-black text-white rounded-full hover:bg-[#D4AF37] transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
         </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        {/* STAGE 1: THE FURNACE (2 MINUTES) */}
        {phase === 'baking' && (
          <div ref={furnaceRef} className="space-y-8 max-w-lg w-full">
            <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto">
               <div className="heat-glow absolute inset-0 bg-[#D4AF37] rounded-full blur-[60px] opacity-20 scale-75"></div>
               <div className="w-full h-full bg-[#1C1C1C] rounded-[3.5rem] border-8 border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                  {/* Furnace Bars */}
                  <div className="absolute top-1/4 w-full h-[1px] bg-white/5"></div>
                  <div className="absolute top-2/4 w-full h-[1px] bg-white/5"></div>
                  <div className="absolute top-3/4 w-full h-[1px] bg-white/5"></div>
                  
                  {/* Dynamic Cookie */}
                  <div className="relative flex flex-col items-center gap-6">
                     <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40 drop-shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                        <circle cx="50" cy="50" r="45" fill={getBakedColor(progress)} className="transition-colors duration-500" />
                        <circle cx="35" cy="35" r="5" fill="#2B1B10" opacity={0.3 + (progress/100) * 0.7} />
                        <circle cx="65" cy="40" r="6" fill="#2B1B10" opacity={0.3 + (progress/100) * 0.7} />
                        <circle cx="45" cy="65" r="7" fill="#2B1B10" opacity={0.3 + (progress/100) * 0.7} />
                        <circle cx="70" cy="70" r="4" fill="#2B1B10" opacity={0.3 + (progress/100) * 0.7} />
                     </svg>
                     <div className="w-12 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_15px_#D4AF37]"></div>
                  </div>
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                 <h3 className="font-display text-4xl md:text-6xl text-[#1C1C1C] font-black uppercase tracking-tighter leading-none">FORGING<br/>ARTIFACTS</h3>
                 <p className="font-black text-[#1C1C1C]/40 uppercase text-[10px] tracking-[0.5em]">Phase 1: Thermal Sculpting</p>
               </div>
               
               <div className="w-full max-w-xs mx-auto space-y-3">
                 <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4AF37] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                 </div>
                 <div className="flex justify-between font-black text-[9px] tracking-widest text-[#1C1C1C]/60 uppercase">
                    <span>{Math.round(progress)}% CORED</span>
                    <span>{formatTime(BAKING_DURATION - (progress/100 * BAKING_DURATION))} LEFT</span>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* STAGE 2: THE TRANSPORT (3 MINUTES) */}
        {phase === 'delivering' && (
          <div ref={riderRef} className="space-y-12 w-full max-w-2xl relative">
            <div className="relative h-64 md:h-80 flex flex-col items-center justify-center">
               {/* Background Map Path */}
               <div className="absolute inset-0 flex items-center px-10">
                  <div className="w-full h-1 bg-black/5 rounded-full relative">
                     {/* Nodes */}
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black flex items-center justify-center text-[8px] text-white font-bold">A</div>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center text-[8px] text-black font-bold">B</div>
                     
                     {/* Progress Line */}
                     <div className="absolute left-0 top-0 h-full bg-[#D4AF37]" style={{ width: `${progress}%` }}></div>
                     
                     {/* Animated Rider */}
                     <div className="absolute top-1/2 -translate-y-[120%] transition-all duration-300" style={{ left: `${progress}%` }}>
                        <div className="relative -translate-x-1/2">
                           <span className="text-6xl md:text-8xl block animate-wiggle">🛵</span>
                           <div className="absolute -top-4 -right-4 bg-[#D4AF37] text-black font-black text-[8px] px-2 py-0.5 rounded-full animate-bounce">RUSHING</div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="mt-40 space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display text-4xl md:text-6xl text-[#1C1C1C] font-black uppercase tracking-tighter leading-none">DEFIYING<br/>GRAVITY</h3>
                    <p className="font-black text-[#1C1C1C]/40 uppercase text-[10px] tracking-[0.5em]">Phase 2: High-Velocity Transit</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-black text-xl tracking-tighter text-[#D4AF37]">{Math.round(progress)}% JOURNEY COMPLETE</span>
                    <span className="font-black text-[#1C1C1C]/30 text-[9px] tracking-widest uppercase">ARRIVAL IN {formatTime(DELIVERY_DURATION - (progress/100 * DELIVERY_DURATION))}</span>
                  </div>
               </div>
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
                    <div className="text-4xl mb-4">🏠</div>
                    <h4 className="font-black text-xl mb-1">GRAVITY STUDIO</h4>
                    <p className="opacity-60 text-[10px] uppercase font-bold text-[#25D366]">ORDER DELIVERED</p>
                  </div>

                  <div className="space-y-2 mb-6 text-[11px]">
                     <div className="flex justify-between"><span>TICKET ID:</span><span className="font-bold">#{order.id}</span></div>
                     <div className="flex justify-between"><span>TIMESTAMP:</span><span>{new Date().toLocaleTimeString()}</span></div>
                     <div className="flex justify-between"><span>CUSTOMER:</span><span className="uppercase font-bold">{order.customer.name}</span></div>
                  </div>

                  <div className="border-y-2 border-black border-dashed py-4 mb-6 space-y-3">
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

                  <div className="flex justify-between font-black text-lg mb-8">
                    <span>TOTAL</span>
                    <span>Rs. {order.total}</span>
                  </div>

                  <div className="text-center space-y-4">
                    <p className="font-bold tracking-widest text-[9px] uppercase">ARTIFACTS IN CUSTODY</p>
                    <div className="flex justify-center py-2 opacity-30 grayscale">
                       <svg width="100" height="20" viewBox="0 0 100 20">
                          {[...Array(20)].map((_, i) => (
                            <rect key={i} x={i*5} y="0" width={1 + Math.random()*3} height="20" fill="black" />
                          ))}
                       </svg>
                    </div>
                  </div>
                  
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
                  <h4 className="font-display text-3xl font-black uppercase text-[#1C1C1C]">MISSION<br/>ACCOMPLISHED.</h4>
                  <p className="font-black text-[#1C1C1C]/40 uppercase text-[9px] tracking-[0.4em]">Gravity has been defied. Your artifacts have reached the destination.</p>
               </div>

               <div className="grid gap-3 no-print">
                  <button onClick={() => window.print()} className="w-full bg-[#1C1C1C] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:scale-[1.02] transition-all">Download Ticket</button>
                  <div className="grid grid-cols-2 gap-3">
                     <button onClick={() => handleShare('wa')} className="bg-[#25D366]/10 text-[#25D366] py-4 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 border border-[#25D366]/20">
                        WhatsApp
                     </button>
                     <button onClick={() => handleShare('ig')} className="bg-pink-500/10 text-pink-600 py-4 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 border border-pink-500/10">
                        IG Share
                     </button>
                  </div>
                  <button onClick={onClose} className="w-full border-2 border-[#1C1C1C] text-[#1C1C1C] py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.4em] mt-4 hover:bg-[#1C1C1C] hover:text-white transition-all">Studio Home</button>
               </div>
            </div>

          </div>
        )}

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default OrderSuccessOverlay;
