import React, { useState, useEffect } from 'react';

const StatusBar: React.FC<{ activeOrder: any | null; onShowReceipt?: () => void }> = ({ activeOrder, onShowReceipt }) => {
  const [status, setStatus] = useState("Baking your order");
  const [timeLeft, setTimeLeft] = useState(5); // Minutes
  
  useEffect(() => {
    if (!activeOrder) return;
    
    // Status updates based on the 5-minute lifecycle
    const timer1 = setTimeout(() => setStatus("Cooling down"), 120000); // After Phase 1 (2 mins)
    const timer2 = setTimeout(() => setStatus("Out for delivery"), 130000); // Start of Phase 2
    const timer3 = setTimeout(() => setStatus("Order Delivered"), 300000); // Total 5 mins

    // Simple 1-minute interval for ETA update
    const etaInterval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 60000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(etaInterval);
    };
  }, [activeOrder]);

  if (!activeOrder) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-8 md:h-10 bg-[#1C1C1C] z-[110] flex items-center justify-between px-4 md:px-12 overflow-hidden border-b border-[#D97B8D]/30 shadow-2xl">
      <div className="flex items-center gap-2 md:gap-4">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D97B8D] animate-pulse"></span>
          <span className="text-[#FDFCFB] font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] truncate max-w-[100px] md:max-w-none">
            {status} <span className="opacity-40 ml-1 md:ml-2">#{activeOrder.id}</span>
          </span>
        </span>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] md:text-[14px] animate-bounce">🛵</span>
          <span className="text-[#FDFCFB] font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] whitespace-nowrap">ETA: {timeLeft} MIN</span>
        </div>
        
        <button 
          onClick={onShowReceipt}
          className="bg-[#D97B8D] text-[#1C1C1C] px-2 md:px-4 py-0.5 md:py-1 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          {window.innerWidth < 768 ? 'REC' : 'RECEIPT'}
        </button>

        <div className="hidden lg:block h-4 w-[1px] bg-[#FDFCFB]/10"></div>
        <div className="hidden lg:block">
           <span className="text-[#D97B8D] font-black uppercase text-[8px] tracking-[0.3em]">LIVE STATUS</span>
        </div>
      </div>
      
      {/* Decorative scanline */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D97B8D]/5 to-transparent -translate-x-full animate-scan pointer-events-none"></div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StatusBar;