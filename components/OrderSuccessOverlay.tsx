
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
  const [progress, setProgress] = useState(0); 
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Timings: 2m Baking + 3m Delivery = 5m total
  const BAKING_DURATION = 120000; 
  const DELIVERY_DURATION = 180000; 
  const TOTAL_DURATION = BAKING_DURATION + DELIVERY_DURATION;

  useEffect(() => {
    let interval: number;
    if (isOpen) {
      const startTime = Date.now();
      
      interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed < BAKING_DURATION) {
          setPhase('baking');
          setProgress((elapsed / BAKING_DURATION) * 100);
        } else if (elapsed < TOTAL_DURATION) {
          setPhase('delivering');
          const deliveryElapsed = elapsed - BAKING_DURATION;
          setProgress((deliveryElapsed / DELIVERY_DURATION) * 100);
        } else {
          setPhase('completed');
          setProgress(100);
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(containerRef.current, { y: 0, duration: 1, ease: "expo.out" });
    } else {
      gsap.to(containerRef.current, { y: '100%', duration: 0.6, ease: "power4.in" });
      setTimeout(() => {
        setPhase('baking');
        setProgress(0);
      }, 600);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const getETAText = () => {
    if (phase === 'baking') return "5 MINS";
    if (phase === 'delivering') {
      const minsLeft = Math.ceil((DELIVERY_DURATION - (progress / 100 * DELIVERY_DURATION)) / 60000);
      return `${minsLeft} MINS`;
    }
    return "ARRIVED";
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[400] bg-[#FDFCFB] transform translate-y-full flex flex-col h-[100dvh] w-screen overflow-hidden"
    >
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 scrollbar-hide touch-pan-y"
        data-lenis-prevent
      >
        <div className="max-w-4xl mx-auto w-full space-y-6 md:space-y-10 pb-24">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-black text-[#D4AF37] text-[9px] md:text-[10px] tracking-[0.4em] uppercase">Order Confirmed</p>
              <h1 className="font-display text-4xl md:text-8xl font-black text-[#1C1C1C] leading-[0.85] tracking-tighter">
                GUS<span className="text-[#D4AF37]">TO</span><br/>RECEIPT
              </h1>
            </div>
            <button 
              onClick={onClose} 
              className="p-2.5 md:p-4 bg-[#1C1C1C] text-white rounded-full hover:bg-[#D4AF37] hover:text-[#1C1C1C] transition-all shadow-xl active:scale-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Status Animation Card */}
          <div className="bg-[#1C1C1C] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden min-h-[400px] md:min-h-[550px] flex flex-col items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] animate-pulse pointer-events-none"></div>
            
            <div className="absolute top-6 right-8 md:top-10 md:right-12 text-right z-10">
               <p className="text-[7px] md:text-[8px] font-black tracking-widest text-white/20 uppercase mb-1">Status</p>
               <h3 className="font-display text-lg md:text-3xl font-black text-[#D4AF37] uppercase tracking-tighter italic leading-none">
                 {phase === 'baking' ? 'BAKING YOUR ORDER' : phase === 'delivering' ? 'OUT FOR DELIVERY' : 'ORDER DELIVERED'}
               </h3>
            </div>

            {/* Animation Core */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 w-full relative">
              {phase === 'baking' && (
                <div className="flex flex-col items-center gap-10 md:gap-14 relative w-full animate-in fade-in duration-700 pt-16 md:pt-20">
                   {/* Elegant GIF Frame for Baking Phase */}
                   <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border-4 border-[#D4AF37] shadow-[0_30px_70px_rgba(212,175,55,0.25)] bg-black/20">
                      <img 
                        src="https://i.imgur.com/PxuIhOT.gif" 
                        alt="Baking your order" 
                        className="w-full h-full object-cover grayscale-0 scale-110"
                      />
                      {/* Glass Overlay Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                      <div className="absolute inset-0 ring-1 ring-white/10 rounded-[inherit] pointer-events-none"></div>
                   </div>

                   <div className="space-y-4 text-center">
                     <p className="font-black text-[11px] md:text-[13px] tracking-[0.5em] text-[#D4AF37] uppercase animate-pulse">FRESH FROM THE OVEN</p>
                     <div className="flex flex-col items-center gap-2">
                        <p className="text-white/30 font-black text-[9px] uppercase tracking-[0.4em]">Heat Factor: {Math.round(progress)}%</p>
                        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-[#D4AF37] transition-all duration-500 shadow-[0_0_10px_#D4AF37]" style={{ width: `${progress}%` }}></div>
                        </div>
                     </div>
                   </div>
                </div>
              )}

              {phase === 'delivering' && (
                <div className="flex flex-col items-center gap-6">
                   <div className="relative">
                      <span className="text-8xl md:text-9xl animate-wiggle block select-none drop-shadow-[0_20px_40px_rgba(212,175,55,0.2)]">🛵</span>
                      <div className="absolute -top-4 -right-4 bg-[#D4AF37] text-[#1C1C1C] font-black text-[9px] px-3 py-1 rounded-full animate-bounce shadow-xl">DRIVING</div>
                   </div>
                   <div className="flex items-center gap-3 md:gap-4 w-full max-w-[280px] md:max-w-sm px-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></div>
                      <div className="flex-1 h-1 bg-white/5 relative rounded-full overflow-hidden">
                         <div className="absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-[#D4AF37]"></div>
                   </div>
                   <p className="font-black text-[9px] md:text-[10px] tracking-[0.4em] text-white/40 uppercase">On the way to you</p>
                </div>
              )}

              {phase === 'completed' && (
                <div className="flex flex-col items-center gap-6 animate-in zoom-in fade-in duration-700">
                   <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border-4 border-[#D4AF37] shadow-[0_0_80px_rgba(212,175,55,0.2)]">
                      <span className="text-7xl md:text-9xl">🏠</span>
                   </div>
                   <div className="bg-[#D4AF37] text-[#1C1C1C] text-[10px] md:text-[12px] font-black px-10 py-4 rounded-full uppercase tracking-[0.4em] shadow-xl">ORDER ARRIVED</div>
                </div>
              )}
            </div>

            {/* Overall Progress Bar Bottom */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-white/5">
               <div className="h-full bg-[#D4AF37] transition-all duration-1000 shadow-[0_0_20px_#D4AF37]" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Dashboard Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
            <div className="md:col-span-3 bg-[#1C1C1C] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 text-white space-y-8 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/5">
              <div className="space-y-6">
                <p className="text-[9px] font-black tracking-[0.5em] text-[#D4AF37] uppercase">Your Selection</p>
                <div className="space-y-5">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center group border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-white/10">
                           <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <div>
                          <h4 className="font-display text-base md:text-xl font-black uppercase tracking-tighter leading-none">{item.name}</h4>
                          <p className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-widest mt-1.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-display text-xl md:text-2xl font-black tracking-tighter">Rs. {parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
                <div className="space-y-1">
                  <p className="text-[9px] font-black tracking-[0.5em] text-[#D4AF37] uppercase mb-1">Order Total</p>
                  <h4 className="font-display text-5xl md:text-7xl font-black tracking-tighter leading-none text-white">Rs. {order.total}</h4>
                </div>
                <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-2">
                   <p className="text-[9px] font-black tracking-[0.5em] text-white/20 uppercase">Method</p>
                   <span className="bg-[#D4AF37] text-[#1C1C1C] text-[8px] md:text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg">CASH ON DELIVERY</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 md:space-y-8">
              <div className="space-y-2">
                <p className="text-[9px] font-black tracking-[0.5em] text-[#1C1C1C]/20 uppercase">Estimated Arrival</p>
                <h2 className="font-display text-5xl md:text-8xl font-black text-[#1C1C1C] italic tracking-tighter leading-none flex items-center gap-4">
                  - {getETAText()}
                </h2>
              </div>

              <div className="bg-[#1C1C1C]/5 rounded-[2rem] md:rounded-[2.5rem] p-8 border border-black/5 flex flex-col justify-center gap-4">
                <p className="text-[9px] font-black tracking-[0.5em] text-[#1C1C1C]/30 uppercase">Bakery Note</p>
                <p className="italic text-[#1C1C1C]/60 font-black text-xs md:text-base leading-relaxed uppercase tracking-tighter">
                  "Your cookies are on the way! We're making sure they reach you warm and fresh."
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6 no-print">
            <button 
              onClick={() => window.print()} 
              className="flex-1 bg-[#1C1C1C] text-[#FDFCFB] py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-[#D4AF37] hover:text-[#1C1C1C] active:scale-95 transition-all shadow-xl"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-2 4H8v-4h8v4z"/></svg>
              Print Receipt
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 bg-[#D4AF37] text-[#1C1C1C] py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default OrderSuccessOverlay;
