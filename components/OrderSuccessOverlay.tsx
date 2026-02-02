
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface SuccessProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
}

const OrderSuccessOverlay: React.FC<SuccessProps> = ({ isOpen, order, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cookieRef = useRef<HTMLDivElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(containerRef.current, { x: 0, duration: 0.8, ease: "expo.out" });

      // Baking Animation
      gsap.fromTo(cookieRef.current, 
        { scale: 0.5, opacity: 0, rotation: -20 },
        { scale: 1, opacity: 1, rotation: 10, duration: 1.5, ease: "elastic.out(1, 0.3)" }
      );
      
      // Floating rider animation
      gsap.fromTo(riderRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, delay: 0.5, ease: "back.out(1.7)" }
      );
      
      gsap.to(riderRef.current, {
        y: -10,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    } else {
      gsap.to(containerRef.current, { x: '100%', duration: 0.6, ease: "power4.in" });
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleShare = (platform: 'wa' | 'ig') => {
    const text = `Forging my artifacts at GRAVITY Studio! Order #${order.id} is in the furnace. 🍪✨`;
    if (platform === 'wa') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    } else {
      // Instagram sharing usually requires the app or mobile intent
      alert("Ready for the Gram? Screenshot your receipt and tag @GravityStudio!");
    }
  };

  return (
    <div ref={containerRef} id="order-success-overlay" className="fixed inset-0 z-[400] bg-[#FDFCFB] transform translate-x-full flex flex-col md:flex-row h-screen w-screen overflow-hidden overflow-y-auto">
      
      {/* Left side: Visuals */}
      <div className="flex-1 bg-[#1C1C1C] p-8 md:p-20 flex flex-col items-center justify-center relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]"></div>
        
        <div className="relative z-10 space-y-8">
           <div ref={cookieRef} className="w-32 h-32 md:w-56 md:h-56 mx-auto drop-shadow-[0_20px_50px_rgba(212,175,55,0.4)]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="#D4AF37" />
                <path d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5 Z" fill="#4A3728" fillOpacity="0.1" />
                <circle cx="35" cy="35" r="5" fill="#4A3728" />
                <circle cx="65" cy="40" r="6" fill="#4A3728" />
                <circle cx="45" cy="65" r="7" fill="#4A3728" />
                <circle cx="70" cy="70" r="4" fill="#4A3728" />
              </svg>
           </div>
           
           <div className="space-y-3">
             <h3 className="font-display text-4xl md:text-6xl text-white font-black uppercase tracking-tighter leading-none">ORDER<br/><span className="text-[#D4AF37]">FORGED.</span></h3>
             <p className="text-[#FDFCFB]/40 font-black uppercase text-[10px] tracking-[0.5em]">TICKET ID: #{order.id}</p>
           </div>

           <div ref={riderRef} className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center gap-4 max-w-xs mx-auto">
              <span className="text-3xl">🛵</span>
              <div className="text-left">
                <p className="text-[#FDFCFB] font-black uppercase text-[9px] tracking-widest">Rider Assigned</p>
                <p className="text-[#D4AF37] font-black uppercase text-[8px] opacity-60">Status: En Route</p>
              </div>
           </div>
        </div>

        <button onClick={onClose} className="mt-12 text-[#FDFCFB]/20 font-black uppercase text-[10px] tracking-[0.4em] hover:text-[#D4AF37] transition-all flex items-center gap-4 group">
          <svg className="group-hover:-translate-x-2 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
          Back to Studio
        </button>
      </div>

      {/* Right side: Receipt */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#FDFCFB] flex flex-col items-center">
        
        {/* Thermal Receipt */}
        <div className="thermal-receipt max-w-sm w-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-8 font-mono border border-black/5 text-[12px] relative">
          <div className="text-center mb-8 border-b-2 border-black border-dashed pb-6">
            <h4 className="font-black text-xl mb-1">GRAVITY STUDIO</h4>
            <p className="opacity-60 text-[10px] uppercase">Phase 6, DHA, Karachi</p>
            <p className="opacity-60 text-[10px] uppercase">Tel: +92 321 000 000</p>
          </div>

          <div className="space-y-2 mb-6 text-[11px]">
             <div className="flex justify-between"><span>ORDER ID:</span><span>#{order.id}</span></div>
             <div className="flex justify-between"><span>DATE:</span><span>{new Date().toLocaleDateString()}</span></div>
             <div className="flex justify-between"><span>TIME:</span><span>{order.timestamp}</span></div>
             <div className="flex justify-between"><span>NAME:</span><span>{order.customer.name}</span></div>
          </div>

          <div className="border-y-2 border-black border-dashed py-4 mb-6 space-y-4">
             {order.items.map((item: any) => (
               <div key={item.id} className="flex justify-between items-start">
                 <div className="flex-1 pr-4">
                   <p className="font-bold">{item.name}</p>
                   <p className="text-[10px] opacity-60">Qty: {item.quantity}</p>
                 </div>
                 <span>Rs. {parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity}</span>
               </div>
             ))}
          </div>

          <div className="space-y-1 mb-8">
             <div className="flex justify-between font-black text-lg">
               <span>TOTAL</span>
               <span>Rs. {order.total}</span>
             </div>
             <p className="text-[9px] opacity-40 italic mt-2">Prices inclusive of artifact taxes.</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-full h-[1px] bg-black/5"></div>
            <p className="font-bold tracking-widest text-[10px]">THANK YOU FOR YOUR PATIENCE</p>
            <div className="flex justify-center py-2 opacity-30 grayscale">
               <svg width="60" height="20" viewBox="0 0 60 20"><rect x="0" y="0" width="2" height="20" fill="black"/><rect x="4" y="0" width="1" height="20" fill="black"/><rect x="7" y="0" width="3" height="20" fill="black"/><rect x="12" y="0" width="1" height="20" fill="black"/><rect x="15" y="0" width="4" height="20" fill="black"/><rect x="22" y="0" width="1" height="20" fill="black"/><rect x="25" y="0" width="2" height="20" fill="black"/><rect x="30" y="0" width="5" height="20" fill="black"/><rect x="37" y="0" width="1" height="20" fill="black"/><rect x="40" y="0" width="3" height="20" fill="black"/><rect x="45" y="0" width="1" height="20" fill="black"/><rect x="48" y="0" width="2" height="20" fill="black"/><rect x="52" y="0" width="8" height="20" fill="black"/></svg>
            </div>
            <p className="text-[8px] opacity-40">GRAVITY | Sculpted by Heat. Defined by Gravity.</p>
          </div>
          
          {/* Decorative jagged edge bottom */}
          <div className="absolute left-0 bottom-[-8px] w-full h-4 overflow-hidden flex">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-[5%] aspect-square bg-[#FDFCFB] rotate-45 translate-y-[-50%] border-t border-l border-black/5"></div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 w-full max-w-sm flex flex-col gap-4 no-print">
           <button onClick={() => window.print()} className="w-full bg-black text-[#FDFCFB] py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Download Receipt</button>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleShare('wa')} className="bg-[#25D366]/10 text-[#25D366] py-4 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-3 border border-[#25D366]/20">
                <span className="text-lg">💬</span> WhatsApp
              </button>
              <button onClick={() => handleShare('ig')} className="bg-gradient-to-tr from-purple-500/10 to-pink-500/10 text-pink-600 py-4 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-3 border border-pink-500/10">
                <span className="text-lg">📸</span> Share
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessOverlay;
