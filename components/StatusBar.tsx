
import React from 'react';

const StatusBar: React.FC<{ activeOrder: any | null }> = ({ activeOrder }) => {
  if (!activeOrder) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-8 md:h-10 bg-[#1C1C1C] z-[110] flex items-center justify-between px-4 md:px-12 overflow-hidden border-b border-[#D4AF37]/30">
      <div className="flex items-center gap-2">
        <span className="animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
          <span className="text-[#FDFCFB] font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em]">Forging Batch #{activeOrder.id}</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] md:text-[14px]">🛵</span>
          <span className="text-[#FDFCFB] font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em]">ETA: 25 MIN</span>
        </div>
        <div className="hidden md:flex h-4 w-[1px] bg-[#FDFCFB]/10"></div>
        <div className="hidden md:block">
           <span className="text-[#D4AF37] font-black uppercase text-[8px] tracking-[0.3em]">Karachi Studio Live</span>
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
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StatusBar;
