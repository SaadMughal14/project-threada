
import React, { useState, useEffect } from 'react';

const StatusBar: React.FC<{ activeOrder: any | null }> = ({ activeOrder }) => {
  const [status, setStatus] = useState("Forging Artifacts");
  const [timeLeft, setTimeLeft] = useState(5); // Minutes
  
  useEffect(() => {
    if (!activeOrder) return;
    
    // Status updates based on the 5-minute lifecycle
    const timer1 = setTimeout(() => setStatus("Batch Cooling"), 120000); // After Phase 1 (2 mins)
    const timer2 = setTimeout(() => setStatus("Rider En Route"), 130000); // Start of Phase 2
    const timer3 = setTimeout(() => setStatus("Delivered"), 300000); // Total 5 mins

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
    <div className="fixed top-0 left-0 w-full h-8 md:h-10 bg-[#1C1C1C] z-[110] flex items-center justify-between px-4 md:px-12 overflow-hidden border-b border-[#D4AF37]/30 shadow-2xl">
      <div className="flex items-center gap-2 md:gap-4">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <span className="text-[#FDFCFB] font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em]">{status} <span className="opacity-40 ml-2">#{activeOrder.id}</span></span>
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] md:text-[14px] animate-bounce">🛵</span>
          <span className="text-[#FDFCFB] font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em]">ETA: {timeLeft} MIN</span>
        </div>
        <div className="hidden sm:block h-4 w-[1px] bg-[#FDFCFB]/10"></div>
        <div className="hidden sm:block">
           <span className="text-[#D4AF37] font-black uppercase text-[8px] tracking-[0.3em]">Studio LIVE</span>
        </div>
      </div>
      
      {/* Decorative scanline */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent -translate-x-full animate-scan pointer-events-none"></div>
      
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
