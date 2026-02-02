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
    return () => { if (interval) clearInterval(interval); };
  }, [isOpen]);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(containerRef.current, { y: 0, duration: 1, ease: "expo.out" });
    } else {
      gsap.to(containerRef.current, { y: '100%', duration: 0.6, ease: "power4.in" });
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

  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GRAVITY Receipt',
          text: `Check out my order #${order.id} from GRAVITY Studio!`,
          url: window.location.href,
        });
      } catch (err) { console.log('Error sharing:', err); }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[400] bg-[#F2DCE0] transform translate-y-full flex flex-col h-[100dvh] w-screen overflow-hidden overscroll-none"
      id="order-success-overlay"
    >
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-12 scrollbar-hide touch-pan-y no-scrollbar"
        data-lenis-prevent
      >
        <div className="max-w-lg mx-auto w-full space-y-4 md:space-y-6 flex flex-col min-h-full pb-20">
          
          {/* Header */}
          <div className="flex justify-between items-center flex-shrink-0 pt-2">
            <div className="space-y-0">
              <p className="font-black text-[#D97B8D] text-[9px] tracking-[0.3em] uppercase">Order Confirmed</p>
              <h1 className="font-display text-2xl md:text-5xl font-black text-[#1C1C1C] leading-none tracking-tighter uppercase">
                GRAVITY <span className="text-[#D97B8D]">RECEIPT</span>
              </h1>
            </div>
            <button 
              onClick={onClose} 
              className="p-2.5 bg-[#1C1C1C] text-white rounded-full hover:bg-[#D97B8D] transition-colors shadow-lg active:scale-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Card 1: Status (White Card) */}
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm relative overflow-hidden flex flex-col items-center justify-between min-h-[280px] md:min-h-[420px]">
             <div className="w-full flex justify-end mb-2">
                <span className="text-[8px] font-black tracking-widest text-black/20 uppercase">Status</span>
             </div>
             
             <div className="flex flex-col items-center gap-6 text-center flex-1 justify-center">
                <h3 className="font-display text-xl md:text-3xl font-black text-[#1C1C1C] uppercase tracking-tighter">
                  {phase === 'baking' ? 'BAKING YOUR ORDER' : phase === 'delivering' ? 'GRAVITY IS PULLING' : 'DELIVERED TO YOU'}
                </h3>
                
                <div className="relative w-32 h-32 md:w-56 md:h-56 flex items-center justify-center">
                  {phase === 'baking' ? (
                     <div className="w-full h-full relative group">
                        <img src="https://i.imgur.com/PxuIhOT.gif" className="w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-700" />
                        <div className="absolute inset-0 bg-[#D97B8D]/5 rounded-3xl"></div>
                     </div>
                  ) : phase === 'delivering' ? (
                     <span className="text-7xl animate-wiggle">🛵</span>
                  ) : (
                     <span className="text-7xl">🏠</span>
                  )}
                </div>
             </div>

             <div className="w-full h-1.5 bg-black/5 rounded-full mt-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-[#D97B8D] transition-all duration-700 shadow-[0_0_10px_#D97B8D]" style={{ width: `${progress}%` }}></div>
             </div>
          </div>

          {/* Card 2: Selection (Dark Card) */}
          <div className="bg-[#1C1C1C] rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white space-y-6 shadow-2xl">
             <div className="space-y-1">
                <p className="text-[8px] font-black tracking-[0.3em] text-[#D97B8D] uppercase">Your Selection</p>
                <div className="space-y-4 pt-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                           <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-display text-xs md:text-lg font-black uppercase tracking-tighter leading-none">{item.name}</h4>
                          <p className="text-[7px] font-black text-[#D97B8D] uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-display text-sm md:text-2xl font-black tracking-tighter">Rs. {parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-end">
                   <p className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase">Total</p>
                   <h4 className="font-display text-2xl md:text-6xl font-black tracking-tighter leading-none text-white">Rs. {order.total}</h4>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase">Payment Status</p>
                   <span className="bg-white/10 text-white/60 text-[7px] font-black px-3 py-1.5 rounded uppercase tracking-widest">Cash on Delivery</span>
                </div>
             </div>
          </div>

          {/* Time Display */}
          <div className="flex flex-col items-start pt-2 px-2">
             <p className="text-[8px] font-black tracking-[0.3em] text-black/40 uppercase mb-1">Status</p>
             <h2 className="font-display text-4xl md:text-7xl font-black text-[#1C1C1C] tracking-tighter leading-none uppercase">
                - {getETAText()}
             </h2>
          </div>

          {/* Note Section */}
          <div className="bg-white/40 border border-black/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 space-y-2">
             <p className="text-[7px] font-black tracking-[0.4em] text-black/20 uppercase">Note</p>
             <p className="italic text-[#1C1C1C]/60 font-black text-[10px] md:text-sm leading-relaxed tracking-tight">
               "Gravity is pulling your cookie toward your doorstep."
             </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 no-print flex-shrink-0">
            <div className="flex gap-3">
              <button 
                onClick={() => window.print()} 
                className="flex-1 bg-[#D97B8D] text-white py-4 md:py-5 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-2 4H8v-4h8v4z"/></svg>
                Print Receipt
              </button>
              <button 
                onClick={shareReceipt} 
                className="flex-1 bg-[#1C1C1C] text-white py-4 md:py-5 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#D97B8D] transition-colors shadow-xl active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v13"/></svg>
                Share Receipt
              </button>
            </div>
            
            <button 
              onClick={onClose} 
              className="w-full bg-[#1C1C1C] text-white py-4 md:py-5 rounded-2xl font-black uppercase text-[9px] tracking-[0.3em] flex items-center justify-center hover:bg-[#D97B8D] transition-colors active:scale-95 shadow-lg"
            >
              Back to Studio
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default OrderSuccessOverlay;