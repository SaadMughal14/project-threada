
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

  // Realistic Bake Colors: Pale Dough to Warm Golden Brown
  const getBakedColor = (p: number) => {
    const r = Math.round(245 - (245 - 139) * (p / 100));
    const g = Math.round(230 - (230 - 90) * (p / 100));
    const b = Math.round(200 - (200 - 43) * (p / 100));
    return `rgb(${r}, ${g}, ${b})`;
  };

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
          <div className="bg-[#1C1C1C] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden min-h-[350px] md:min-h-[450px] flex flex-col items-center justify-center">
            {/* Warm Oven Glow */}
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
                <div className="flex flex-col items-center gap-8 md:gap-12 relative w-full">
                   {/* Oven Visual */}
                   <div className="relative w-44 h-44 md:w-64 md:h-64 flex items-center justify-center">
                      <div 
                        className="absolute inset-0 rounded-full blur-[40px] opacity-40 transition-colors duration-1000" 
                        style={{ backgroundColor: progress > 50 ? '#E67E22' : '#D4AF37' }}
                      ></div>
                      
                      <div 
                        className="relative z-10 transition-transform duration-1000 ease-out"
                        style={{ transform: `scale(${0.9 + (progress/100) * 0.15})` }}
                      >
                         <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <circle 
                              cx="50" cy="50" r="45" 
                              fill={getBakedColor(progress)} 
                              className="transition-colors duration-1000" 
                            />
                            <path 
                              d="M30 40 Q40 45 35 55 M60 30 Q65 40 75 35 M45 75 Q55 70 65 80" 
                              fill="none" 
                              stroke="rgba(0,0,0,0.15)" 
                              strokeWidth="1.5" 
                              strokeLinecap="round"
                              style={{ opacity: progress / 100 }}
                            />
                            <g style={{ filter: `blur(${Math.max(0, (progress - 60) / 20)}px)` }}>
                               <circle cx="35" cy="35" r="5" fill="#2B1B10" />
                               <circle cx="65" cy="40" r="6" fill="#2B1B10" />
                               <circle cx="45" cy="65" r="7" fill="#2B1B10" />
                               <circle cx="70" cy="70" r="4" fill="#2B1B10" />
                            </g>
                         </svg>
                      </div>

                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                         {[...Array(6)].map((_, i) => (
                           <div 
                             key={i}
                             className="absolute bottom-0 w-1 h-8 bg-gradient-to-t from-white/10 to-transparent blur-md animate-steam"
                             style={{ 
                               left: `${20 + i * 15}%`, 
                               animationDelay: `${i * 0.5}s`,
                               opacity: progress / 100 * 0.5 
                             }}
                           ></div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-2 text-center">
                     <p className="font-black text-[10px] md:text-[12px] tracking-[0.5em] text-[#D4AF37] uppercase animate-pulse">FRESH FROM THE OVEN</p>
                     <p className="text-white/20 font-black text-[8px] uppercase tracking-[0.3em]">Baking Progress: {Math.round(progress)}%</p>
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
                <div className="flex flex-col items-center gap-4">
                   <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border-4 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-in zoom-in duration-700">
                      <span className="text-7xl md:text-8xl">🏠</span>
                   </div>
                   <div className="bg-[#D4AF37] text-[#1C1C1C] text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.4em] shadow-xl">ORDER ARRIVED</div>
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
        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        .animate-steam { animation: steam 2s ease-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default OrderSuccessOverlay;
