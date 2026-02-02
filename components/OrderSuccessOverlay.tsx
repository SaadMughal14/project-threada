import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface SuccessProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
}

type OrderPhase = 'baking' | 'delivering' | 'completed';

const DeliveryRider = () => (
  <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center overflow-hidden">
    {/* Motion Lines (Air moving backward) */}
    <div className="absolute left-0 w-full h-full pointer-events-none">
      <div className="motion-line line-1 absolute top-[45%] left-4 w-8 h-1 bg-[#1C1C1C]/10 rounded-full"></div>
      <div className="motion-line line-2 absolute top-[55%] left-0 w-12 h-1 bg-[#1C1C1C]/10 rounded-full"></div>
      <div className="motion-line line-3 absolute top-[50%] left-8 w-6 h-1 bg-[#1C1C1C]/10 rounded-full"></div>
    </div>

    {/* The Rider Vehicle */}
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl animate-drive-bounce">
      {/* Wheels */}
      <circle cx="65" cy="155" r="18" fill="#FDFCFB" stroke="#1C1C1C" strokeWidth="4" />
      <circle cx="65" cy="155" r="10" fill="#1C1C1C" />
      
      <circle cx="135" cy="155" r="18" fill="#FDFCFB" stroke="#1C1C1C" strokeWidth="4" />
      <circle cx="135" cy="155" r="10" fill="#1C1C1C" />

      {/* Main Body (The Scooter/Vehicle) */}
      <path 
        d="M50 135 Q50 85 100 85 L140 85 Q150 85 150 100 L150 135 Z" 
        fill="#D97B8D" 
        stroke="#1C1C1C" 
        strokeWidth="4" 
      />

      {/* Handlebar */}
      <path d="M65 85 L55 65 L65 60" fill="none" stroke="#1C1C1C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

      {/* Rider Head & Cap */}
      <circle cx="105" cy="65" r="15" fill="#E8B9A7" /> {/* Skin Tone */}
      <path d="M90 65 A15 15 0 0 1 120 65 Z" fill="#1C1C1C" /> {/* Cap */}

      {/* Delivery Box */}
      <rect x="120" y="55" r="4" width="35" height="30" fill="#FDFCFB" stroke="#1C1C1C" strokeWidth="3" />
      
      {/* Cookie Logo on Box */}
      <g transform="translate(125, 60) scale(0.25)">
        <circle cx="50" cy="50" r="45" fill="#D97B8D" />
        <circle cx="35" cy="35" r="5" fill="#4A3728" />
        <circle cx="65" cy="40" r="6" fill="#4A3728" />
        <circle cx="45" cy="65" r="7" fill="#4A3728" />
      </g>
    </svg>
  </div>
);

const OrderSuccessOverlay: React.FC<SuccessProps> = ({ isOpen, order, onClose }) => {
  const [phase, setPhase] = useState<OrderPhase>('baking');
  const [progress, setProgress] = useState(0); 
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasPrintedRef = useRef(false);
  
  const BAKING_DURATION = 120000; 
  const DELIVERY_DURATION = 180000; 
  const TOTAL_DURATION = BAKING_DURATION + DELIVERY_DURATION;

  useEffect(() => {
    let interval: number;
    if (isOpen && order?.placedAt) {
      const updateProgress = () => {
        const elapsed = Date.now() - order.placedAt;
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
      };

      updateProgress();
      interval = window.setInterval(updateProgress, 500);

      // AUTOMATIC PRINT TRIGGER: Only for kitchen staff clicking a Discord link
      const params = new URLSearchParams(window.location.search);
      const shouldAutoPrint = params.get('autoPrint') === '1';
      
      if (shouldAutoPrint && !hasPrintedRef.current) {
        const printTimer = setTimeout(() => {
          window.print();
          hasPrintedRef.current = true;
        }, 1500);
        return () => clearTimeout(printTimer);
      }
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isOpen, order?.placedAt, order?.id]);

  useEffect(() => {
    if (order?.id) {
      hasPrintedRef.current = false;
    }
  }, [order?.id]);

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
      const totalElapsed = Date.now() - (order.placedAt || Date.now());
      const minsLeft = Math.ceil((TOTAL_DURATION - totalElapsed) / 60000);
      return minsLeft > 0 ? `${minsLeft} MINS` : "1 MIN";
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

  const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[400] bg-[#F2DCE0] transform translate-y-full flex flex-col h-[100dvh] w-screen overflow-hidden overscroll-none"
      id="order-success-overlay"
    >
      {/* Screen Interactive UI */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-12 scrollbar-hide touch-pan-y no-scrollbar no-print"
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

          {/* Card 1: Status */}
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm relative overflow-hidden flex flex-col items-center justify-between min-h-[300px] md:min-h-[450px]">
             <div className="w-full flex justify-end mb-2">
                <span className="text-[8px] font-black tracking-widest text-black/20 uppercase">Status</span>
             </div>
             
             <div className="flex flex-col items-center gap-6 text-center flex-1 justify-center w-full">
                <h3 className="font-display text-xl md:text-3xl font-black text-[#1C1C1C] uppercase tracking-tighter">
                  {phase === 'baking' ? 'BAKING YOUR ORDER' : phase === 'delivering' ? 'OUT FOR DELIVERY' : 'ORDER DELIVERED'}
                </h3>
                
                <div className="relative w-40 h-40 md:w-64 md:h-64 flex items-center justify-center">
                  {phase === 'baking' ? (
                     <div className="w-full h-full relative group">
                        <img 
                          src="https://i.imgur.com/PxuIhOT.gif" 
                          className="w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-700" 
                          alt="Baking Animation"
                        />
                        <div className="absolute inset-0 bg-[#D97B8D]/5 rounded-3xl"></div>
                     </div>
                  ) : phase === 'delivering' ? (
                     <DeliveryRider />
                  ) : (
                     <div className="relative flex flex-col items-center justify-center">
                        <div className="relative flex items-center justify-center">
                          {/* House Icon */}
                          <span className="text-8xl md:text-9xl">🏠</span>
                          
                          {/* Cookie Logo "Inside" the house area */}
                          <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 logo-spin-wrapper">
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                              <circle cx="50" cy="50" r="45" fill="#D97B8D" />
                              <circle cx="35" cy="35" r="5" fill="#4A3728" />
                              <circle cx="65" cy="40" r="6" fill="#4A3728" />
                              <circle cx="45" cy="65" r="7" fill="#4A3728" />
                            </svg>
                          </div>

                          {/* Checkmark Circle on top right of house */}
                          <div className="absolute -top-2 -right-2 bg-[#D97B8D] text-white find-house-ping w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><path d="M20 6L9 17l-5-5"/></svg>
                          </div>
                        </div>
                     </div>
                  )}
                </div>
             </div>

             <div className="w-full h-2 bg-black/5 rounded-full mt-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-[#D97B8D] transition-all duration-700 shadow-[0_0_15px_#D97B8D]" style={{ width: `${progress}%` }}></div>
             </div>
          </div>

          {/* Card 2: Selection */}
          <div className="bg-[#1C1C1C] rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white space-y-6 shadow-2xl">
             <div className="space-y-1">
                <p className="text-[8px] font-black tracking-[0.3em] text-[#D97B8D] uppercase">Your Selection</p>
                <div className="space-y-4 pt-2">
                  {order.items.map((item: any, idx: number) => (
                    <div key={`${item.id}-${idx}`} className="flex justify-between items-center group">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                           <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-display text-xs md:text-lg font-black uppercase tracking-tighter leading-none">{item.name}</h4>
                          <p className="text-[7px] font-black text-[#D97B8D] uppercase tracking-widest mt-1">QTY: {item.quantity} • {item.selectedSize.name}</p>
                        </div>
                      </div>
                      <span className="font-display text-sm md:text-2xl font-black tracking-tighter">Rs. {parseInt(item.selectedSize.price.replace(/[^\d]/g, '')) * item.quantity}</span>
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
                   <span className="bg-white/10 text-white/60 text-[7px] font-black px-3 py-1.5 rounded uppercase tracking-widest">
                     {order.paymentMethod === 'digital' ? 'Digital Payment Received' : 'Cash on Delivery'}
                   </span>
                </div>
             </div>
          </div>

          {/* Note Section (Updated to show User Notes) */}
          <div className="bg-white/40 border border-black/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 space-y-6">
             <div className="space-y-2">
               <p className="text-[7px] font-black tracking-[0.4em] text-black/20 uppercase">Kitchen Instructions</p>
               <p className="italic text-[#1C1C1C]/60 font-black text-[10px] md:text-sm leading-relaxed tracking-tight">
                 {order.kitchenInstructions || '"No special requests for the chefs."'}
               </p>
             </div>
             
             <div className="space-y-2">
               <p className="text-[7px] font-black tracking-[0.4em] text-black/20 uppercase">Delivery Notes</p>
               <p className="italic text-[#1C1C1C]/60 font-black text-[10px] md:text-sm leading-relaxed tracking-tight">
                 {order.customer.deliveryNotes || '"Gravity is pulling your cookie toward your doorstep."'}
               </p>
             </div>
          </div>

          {/* Time Display */}
          <div className="flex flex-col items-start pt-2 px-2">
             <p className="text-[8px] font-black tracking-[0.3em] text-black/40 uppercase mb-1">Status</p>
             <h2 className="font-display text-4xl md:text-7xl font-black text-[#1C1C1C] tracking-tighter leading-none uppercase">
                - {getETAText()}
             </h2>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 flex-shrink-0">
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

      {/* THERMAL RECEIPT (Print Only) */}
      <div className="thermal-receipt">
        <h1>Receipt</h1>
        
        {/* Black & White Brand Logo */}
        <div className="logo-bw">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="black" />
            <circle cx="35" cy="35" r="5" fill="white" />
            <circle cx="65" cy="40" r="6" fill="white" />
            <circle cx="45" cy="65" r="7" fill="white" />
            <circle cx="70" cy="70" r="4" fill="white" />
            <circle cx="25" cy="60" r="4" fill="white" />
          </svg>
        </div>

        <div className="bold" style={{ fontSize: '16pt', letterSpacing: '2px', marginBottom: '1mm' }}>GRAVITY STUDIO</div>
        <div style={{ fontSize: '10pt' }}>Phase 6, DHA</div>
        <div style={{ fontSize: '10pt' }}>Tel: (850) GRAVITY-STUDIO</div>

        <div className="separator"></div>
        <div className="flex-row">
          <span>Date: {currentDate}</span>
          <span>{currentTime}</span>
        </div>
        <div className="separator"></div>

        {/* Item List */}
        <div style={{ textAlign: 'left', marginBottom: '2mm' }}>
          {order.items.map((item: any, idx: number) => (
            <div key={`${item.id}-${idx}`} className="flex-row" style={{ marginBottom: '1.5mm' }}>
              <span>{item.quantity}x {item.name} ({item.selectedSize.name})</span>
              <span>Rs.{parseInt(item.selectedSize.price.replace(/[^\d]/g, '')) * item.quantity}.00</span>
            </div>
          ))}
        </div>

        <div className="separator"></div>
        <div className="flex-row bold" style={{ fontSize: '12pt' }}>
          <span>{order.paymentMethod === 'digital' ? 'TOTAL PAID' : 'TOTAL DUE'}</span>
          <span>Rs.{order.total}.00</span>
        </div>
        <div className="flex-row" style={{ marginTop: '2mm' }}>
          <span>Sub-total</span>
          <span>Rs.{order.total}.00</span>
        </div>
        <div className="flex-row">
          <span>Amount Paid</span>
          <span>Rs.{order.paymentMethod === 'digital' ? `${order.total}.00` : '0.00'}</span>
        </div>
        <div className="flex-row">
          <span>Balance Due</span>
          <span>Rs.{order.paymentMethod === 'digital' ? '0.00' : `${order.total}.00`}</span>
        </div>
        
        {/* Notes in Thermal Receipt */}
        {(order.kitchenInstructions || order.customer.deliveryNotes) && (
          <>
            <div className="separator"></div>
            <div style={{ textAlign: 'left', fontSize: '10pt' }}>
              {order.kitchenInstructions && (
                <div style={{ marginBottom: '2mm' }}>
                  <div className="bold">KITCHEN NOTE:</div>
                  <div>{order.kitchenInstructions}</div>
                </div>
              )}
              {order.customer.deliveryNotes && (
                <div>
                  <div className="bold">DELIVERY NOTE:</div>
                  <div>{order.customer.deliveryNotes}</div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="separator"></div>

        <div style={{ textAlign: 'left' }}>
          <div className="bold" style={{ marginBottom: '1.5mm' }}>DELIVERY TO:</div>
          <div className="bold" style={{ fontSize: '11pt' }}>{order.customer.name}</div>
          <div style={{ fontSize: '10pt' }}>{order.customer.address}</div>
          <div style={{ fontSize: '10pt' }}>Contact: {order.customer.phone}</div>
        </div>

        <div style={{ marginTop: '10mm' }}>
          {/* Barcode SVG matching the reference exactly */}
          <svg width="100%" height="45" viewBox="0 0 200 45" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" width="2" height="45" fill="black" />
            <rect x="4" width="1" height="45" fill="black" />
            <rect x="7" width="3" height="45" fill="black" />
            <rect x="12" width="1" height="45" fill="black" />
            <rect x="15" width="2" height="45" fill="black" />
            <rect x="20" width="1" height="45" fill="black" />
            <rect x="23" width="4" height="45" fill="black" />
            <rect x="29" width="1" height="45" fill="black" />
            <rect x="32" width="2" height="45" fill="black" />
            <rect x="36" width="3" height="45" fill="black" />
            <rect x="41" width="1" height="45" fill="black" />
            <rect x="44" width="2" height="45" fill="black" />
            <rect x="48" width="1" height="45" fill="black" />
            <rect x="51" width="4" height="45" fill="black" />
            <rect x="57" width="1" height="45" fill="black" />
            <rect x="60" width="2" height="45" fill="black" />
            <rect x="64" width="3" height="45" fill="black" />
            <rect x="69" width="1" height="45" fill="black" />
            <rect x="72" width="2" height="45" fill="black" />
            <rect x="76" width="1" height="45" fill="black" />
            <rect x="79" width="4" height="45" fill="black" />
            <rect x="85" width="1" height="45" fill="black" />
            <rect x="88" width="2" height="45" fill="black" />
            <rect x="92" width="3" height="45" fill="black" />
            <rect x="97" width="1" height="45" fill="black" />
            <rect x="100" width="2" height="45" fill="black" />
            <rect x="104" width="1" height="45" fill="black" />
            <rect x="107" width="4" height="45" fill="black" />
            <rect x="113" width="1" height="45" fill="black" />
            <rect x="116" width="2" height="45" fill="black" />
            <rect x="120" width="3" height="45" fill="black" />
            <rect x="125" width="1" height="45" fill="black" />
            <rect x="128" width="2" height="45" fill="black" />
            <rect x="132" width="1" height="45" fill="black" />
            <rect x="135" width="4" height="45" fill="black" />
            <rect x="141" width="1" height="45" fill="black" />
            <rect x="144" width="2" height="45" fill="black" />
            <rect x="148" width="3" height="45" fill="black" />
            <rect x="153" width="1" height="45" fill="black" />
            <rect x="156" width="2" height="45" fill="black" />
            <rect x="160" width="1" height="45" fill="black" />
            <rect x="163" width="4" height="45" fill="black" />
            <rect x="169" width="1" height="45" fill="black" />
            <rect x="172" width="2" height="45" fill="black" />
            <rect x="176" width="3" height="45" fill="black" />
            <rect x="181" width="1" height="45" fill="black" />
            <rect x="184" width="2" height="45" fill="black" />
            <rect x="188" width="1" height="45" fill="black" />
            <rect x="191" width="4" height="45" fill="black" />
            <rect x="197" width="3" height="45" fill="black" />
          </svg>
          <div style={{ fontSize: '8pt', marginTop: '1.5mm', fontStyle: 'italic' }}>https://saadmughal-gravity.vercel.app/</div>
          <div style={{ fontSize: '9pt', marginTop: '1mm', fontWeight: 'bold' }}>SCAN FOR STUDIO MENU</div>
          <div className="footer-text">© GRAVITY STUDIO</div>
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes drive-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes motion-move {
          0% { transform: translateX(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateX(-100px); opacity: 0; }
        }
        .animate-drive-bounce { animation: drive-bounce 0.3s ease-in-out infinite; }
        .motion-line { animation: motion-move 0.6s linear infinite; }
        .line-1 { animation-delay: 0.1s; }
        .line-2 { animation-delay: 0.3s; }
        .line-3 { animation-delay: 0.5s; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default OrderSuccessOverlay;