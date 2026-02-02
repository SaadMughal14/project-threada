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
      id="order-success-overlay"
    >
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto md:overflow-y-auto overflow-x-hidden p-4 md:p-12 scrollbar-hide touch-pan-y"
        data-lenis-prevent
      >
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full md:block space-y-4 md:space-y-10 pb-4 md:pb-24">
          
          {/* Header */}
          <div className="flex justify-between items-start flex-shrink-0">
            <div className="space-y-0.5 md:space-y-1">
              <p className="font-black text-[#D97B8D] text-[8px] md:text-[10px] tracking-[0.4em] uppercase">Order Confirmed</p>
              <h1 className="font-display text-2xl md:text-8xl font-black text-[#1C1C1C] leading-[0.85] tracking-tighter">
                GRAV<span className="text-[#D97B8D]">ITY</span><br/><span className="text-xl md:text-7xl">RECEIPT</span>
              </h1>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 md:p-4 bg-[#1C1C1C] text-white rounded-full hover:bg-[#D97B8D] hover:text-[#1C1C1C] transition-all shadow-xl active:scale-90"
            >
              <svg width="16" height="16" md:width="20" md:height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Status Animation Card - Compact on mobile */}
          <div className="bg-[#1C1C1C] rounded-[1.5rem] md:rounded-[3.5rem] p-4 md:p-16 shadow-2xl relative overflow-hidden min-h-[160px] md:min-h-[550px] flex flex-col items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,123,141,0.08)_0%,transparent_70%)] animate-pulse pointer-events-none"></div>
            
            <div className="absolute top-3 right-4 md:top-10 md:right-12 text-right z-10">
               <p className="text-[6px] md:text-[8px] font-black tracking-widest text-white/20 uppercase">Status</p>
               <h3 className="font-display text-[10px] md:text-3xl font-black text-[#D97B8D] uppercase tracking-tighter italic leading-none">
                 {phase === 'baking' ? 'BAKING' : phase === 'delivering' ? 'OUT FOR DELIVERY' : 'DELIVERED'}
               </h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-2 md:py-6 w-full relative">
              {phase === 'baking' && (
                <div className="flex flex-col items-center gap-4 md:gap-14 relative w-full animate-in fade-in duration-700">
                   <div className="relative w-24 h-24 md:w-64 md:h-64 rounded-[1.5rem] md:rounded-[4rem] overflow-hidden border-2 md:border-4 border-[#D97B8D] shadow-[0_15px_30px_rgba(217,123,141,0.25)] bg-black/20">
                      <img 
                        src="https://i.imgur.com/PxuIhOT.gif" 
                        alt="Baking" 
                        className="w-full h-full object-cover grayscale-0 scale-110"
                      />
                   </div>

                   <div className="space-y-1 md:space-y-4 text-center">
                     <p className="font-black text-[8px] md:text-[13px] tracking-[0.3em] text-[#D97B8D] uppercase">FRESH FROM THE OVEN</p>
                     <div className="flex flex-col items-center gap-1 md:gap-2">
                        <p className="text-white/30 font-black text-[6px] md:text-[9px] uppercase tracking-[0.4em]">Heat: {Math.round(progress)}%</p>
                        <div className="w-24 md:w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-[#D97B8D] transition-all duration-500 shadow-[0_0_10px_#D97B8D]" style={{ width: `${progress}%` }}></div>
                        </div>
                     </div>
                   </div>
                </div>
              )}

              {phase === 'delivering' && (
                <div className="flex flex-col items-center gap-2 md:gap-6">
                   <div className="relative">
                      <span className="text-4xl md:text-9xl animate-wiggle block select-none">🛵</span>
                   </div>
                   <div className="flex items-center gap-2 md:gap-4 w-full max-w-[120px] md:max-w-sm px-2">
                      <div className="w-1 md:w-2.5 h-1 md:h-2.5 rounded-full bg-[#D97B8D]"></div>
                      <div className="flex-1 h-0.5 md:h-1 bg-white/5 relative rounded-full overflow-hidden">
                         <div className="absolute top-0 left-0 h-full bg-[#D97B8D] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="w-1 md:w-2.5 h-1 md:h-2.5 rounded-full border border-[#D97B8D]"></div>
                   </div>
                </div>
              )}

              {phase === 'completed' && (
                <div className="flex flex-col items-center gap-2 md:gap-6 animate-in zoom-in fade-in duration-700">
                   <div className="w-16 h-16 md:w-48 md:h-48 rounded-full bg-[#D97B8D]/10 flex items-center justify-center border-2 md:border-4 border-[#D97B8D] shadow-[0_0_40px_rgba(217,123,141,0.2)]">
                      <span className="text-3xl md:text-9xl">🏠</span>
                   </div>
                   <div className="bg-[#D97B8D] text-[#1C1C1C] text-[8px] md:text-[12px] font-black px-4 md:px-10 py-2 md:py-4 rounded-full uppercase tracking-[0.2em] shadow-xl">ARRIVED</div>
                </div>
              )}
            </div>
          </div>

          {/* Info Grid - Single column on mobile, simplified selection */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-8 flex-1">
            <div className="md:col-span-3 bg-[#1C1C1C] rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-10 text-white space-y-4 md:space-y-8 flex flex-col justify-between border border-white/5 shadow-xl">
              <div className="space-y-3 md:space-y-6">
                <p className="text-[7px] md:text-[9px] font-black tracking-[0.3em] text-[#D97B8D] uppercase">Selection</p>
                <div className="space-y-2 md:space-y-5">
                  {order.items.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center group border-b border-white/5 pb-2 md:pb-4 last:border-0">
                      <div className="flex gap-2 md:gap-4 items-center">
                        <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg overflow-hidden border border-white/10">
                           <img src={item.image} className="w-full h-full object-cover grayscale" />
                        </div>
                        <div>
                          <h4 className="font-display text-[10px] md:text-xl font-black uppercase tracking-tighter leading-none">{item.name}</h4>
                          <p className="text-[6px] md:text-[9px] font-black text-white/30 uppercase mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-display text-[10px] md:text-2xl font-black tracking-tighter">Rs. {parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-[6px] text-white/30 uppercase font-black">+ {order.items.length - 3} more items</p>
                  )}
                </div>
              </div>

              <div className="pt-2 md:pt-8 border-t border-white/5 flex justify-between items-end">
                <div className="space-y-0.5">
                  <p className="text-[7px] md:text-[9px] font-black tracking-[0.3em] text-[#D97B8D] uppercase">Total</p>
                  <h4 className="font-display text-2xl md:text-7xl font-black tracking-tighter leading-none text-white">Rs. {order.total}</h4>
                </div>
                <div className="text-right">
                   <span className="bg-[#D97B8D] text-[#1C1C1C] text-[6px] md:text-[9px] font-black px-2 md:px-4 py-1 md:py-2 rounded uppercase tracking-widest shadow-lg">COD</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3 md:space-y-8 flex flex-col justify-center">
              <div className="flex justify-between md:block items-center">
                <p className="text-[7px] md:text-[9px] font-black tracking-[0.3em] text-[#1C1C1C]/20 uppercase">ETA</p>
                <h2 className="font-display text-2xl md:text-8xl font-black text-[#1C1C1C] italic tracking-tighter leading-none">
                  {getETAText()}
                </h2>
              </div>

              <div className="hidden md:flex bg-[#1C1C1C]/5 rounded-[2.5rem] p-8 border border-black/5 flex-col justify-center gap-4">
                <p className="italic text-[#1C1C1C]/60 font-black text-xs md:text-base leading-relaxed uppercase tracking-tighter">
                  "Baked fresh, defined by gravity."
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Sticky or flex-end on mobile */}
          <div className="flex gap-2 pt-2 md:pt-6 no-print flex-shrink-0">
            <button 
              onClick={() => window.print()} 
              className="flex-1 bg-[#1C1C1C] text-[#FDFCFB] py-3 md:py-5 rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#D97B8D] hover:text-[#1C1C1C] transition-all shadow-xl"
            >
              Print
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 bg-[#D97B8D] text-[#1C1C1C] py-3 md:py-5 rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Done
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