import React, { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ReactDOM from 'react-dom';
import { supabase } from '../supabaseClient';
import { X, Share2, Printer, Check, ShoppingBag, Clock, Truck, Package } from 'lucide-react';

interface SuccessProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
}

type OrderPhase = 'confirmed' | 'processing' | 'ready' | 'dispatched' | 'delivered';

const OrderSuccessOverlay: React.FC<SuccessProps> = ({ isOpen, order, onClose }) => {
  const [phase, setPhase] = useState<OrderPhase>('processing');
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasPrintedRef = useRef(false);

  // Live status from Kitchen Dashboard
  const [liveStatus, setLiveStatus] = useState<string>('pending');

  const mapStatusToPhase = useCallback((status: string): OrderPhase => {
    switch (status) {
      case 'confirmed': return 'confirmed';
      case 'cooking': return 'processing'; // Mapped 'cooking' -> 'processing'
      case 'ready': return 'ready';
      case 'dispatched': return 'dispatched';
      case 'delivered': return 'delivered';
      default: return 'processing';
    }
  }, []);

  // Fetch live status
  const fetchLiveData = useCallback(async () => {
    if (!order?.id) return;
    const { data: orderData } = await supabase
      .from('orders')
      .select('status')
      .eq('order_number', order.id)
      .single();

    if (orderData?.status) {
      setLiveStatus(orderData.status);
      setPhase(mapStatusToPhase(orderData.status));
    }
  }, [order?.id, mapStatusToPhase]);

  // Auto-print logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldAutoPrint = params.get('autoPrint') === '1';

    if (shouldAutoPrint && !hasPrintedRef.current && isOpen) {
      const printTimer = setTimeout(() => {
        window.print();
        hasPrintedRef.current = true;
      }, 1500);
      return () => clearTimeout(printTimer);
    }
  }, [isOpen, order?.id]);

  useEffect(() => {
    if (order?.id) {
      hasPrintedRef.current = false;
    }
  }, [order?.id]);

  // Real-time subscription
  useEffect(() => {
    if (!isOpen || !order?.id) return;
    fetchLiveData();
    const pollInterval = setInterval(fetchLiveData, 5000);

    let channel: any = null;
    const setupRealtimeSub = async () => {
      const { data: dbOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', order.id)
        .single();

      if (dbOrder?.id) {
        channel = supabase
          .channel(`order-updates-${dbOrder.id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${dbOrder.id}` }, () => {
            fetchLiveData();
          })
          .subscribe();
      }
    };
    setupRealtimeSub();

    return () => {
      clearInterval(pollInterval);
      if (channel) supabase.removeChannel(channel);
    };
  }, [isOpen, order?.id, fetchLiveData]);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(containerRef.current, { y: 0, duration: 1, ease: "expo.out" });
    } else {
      gsap.to(containerRef.current, { y: '100%', duration: 0.6, ease: "power4.in" });
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'THREADA Receipt',
          text: `Order #${order.id} from THREADA.`,
          url: window.location.href,
        });
      } catch (err) { console.log('Error sharing:', err); }
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Use a portal to render the thermal receipt separately
  const ThermalReceiptPortal = () => {
    return ReactDOM.createPortal(
      <div className="thermal-receipt font-mono">
        <h1 className="text-center font-bold text-xl mb-4">THREADA</h1>
        <div className="text-xs text-center mb-4">
          OFFICIAL RECEIPT<br />
          ORDER #{order.id}
        </div>

        <div className="separator border-b border-black border-dashed my-2"></div>
        <div className="flex justify-between text-xs">
          <span>DATE: {currentDate}</span>
          <span>TIME: {currentTime}</span>
        </div>
        <div className="separator border-b border-black border-dashed my-2"></div>

        <div className="text-left mb-4">
          {order.items.map((item: any, idx: number) => (
            <div key={`${item.id}-${idx}`} className="flex justify-between text-xs mb-1">
              <span>{item.quantity}x {item.name} ({item.size})</span>
              <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="separator border-b border-black border-dashed my-2"></div>
        <div className="flex justify-between font-bold text-sm">
          <span>TOTAL</span>
          <span>Rs.{order.total}</span>
        </div>

        <div className="separator border-b border-black border-dashed my-2"></div>

        <div className="text-left text-xs space-y-2">
          <div>
            <span className="font-bold">CUSTOMER:</span><br />
            {order.customer.name}<br />
            {order.customer.phone}
          </div>
          <div>
            <span className="font-bold">ADDRESS:</span><br />
            {order.customer.address}
          </div>
          <div>
            <span className="font-bold">PAYMENT:</span><br />
            {order.paymentMethod === 'digital' ? 'PAID (DIGITAL)' : 'CASH ON DELIVERY'}
          </div>
        </div>

        <div className="text-center text-[10px] mt-8">
          THANK YOU FOR SHOPPING WITH THREADA.<br />
          NO RETURNS OR EXCHANGES WITHOUT RECEIPT.
        </div>
      </div>,
      document.body
    );
  };

  const steps = [
    { id: 'confirmed', label: 'Order Placed', icon: Check },
    { id: 'processing', label: 'Processing', icon: ShoppingBag },
    { id: 'dispatched', label: 'Dispatched', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Package },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === phase) === -1 ? 1 : steps.findIndex(s => s.id === phase);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[400] bg-white transform translate-y-full flex flex-col h-[100dvh] w-screen overflow-hidden overscroll-none"
      id="order-success-overlay"
    >
      <ThermalReceiptPortal />

      <div className="px-6 py-6 md:px-12 md:py-8 flex justify-between items-center border-b border-black flex-shrink-0 bg-white z-20">
        <h2 className="font-heading text-xl md:text-3xl font-black uppercase tracking-tighter text-black">Order <span className="text-gray-400">Status</span></h2>
        <button onClick={onClose} className="p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden bg-white p-6 md:px-12 scrollbar-hide touch-pan-y no-scrollbar no-print"
        data-lenis-prevent
      >
        <div className="max-w-2xl mx-auto w-full space-y-12 pb-20">

          {/* STATUS TIMELINE */}
          <div className="py-8">
            <div className="flex justify-between items-center mb-8 relative">
              {/* Progress Bar background */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-gray-200 -z-10"></div>
              {/* Progress Bar foreground */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-black -z-10 transition-all duration-1000"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>

              {steps.map((s, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={s.id} className="flex flex-col items-center gap-3 bg-white px-2">
                    <div className={`w-8 h-8 md:w-10 md:h-10 border flex items-center justify-center transition-all duration-500 ${isCompleted ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-300'}`}>
                      <s.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${isCurrent ? 'text-black' : 'text-gray-300'}`}>{s.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="font-heading text-4xl md:text-6xl uppercase tracking-tighter">
                {phase === 'confirmed' ? 'Order Confirmed' :
                  phase === 'processing' ? 'Processing Order' :
                    phase === 'ready' ? 'Ready to Ship' :
                      phase === 'dispatched' ? 'On The Way' : 'Delivered'}
              </h1>
              <p className="font-mono text-xs md:text-sm text-gray-500 uppercase">
                Estimated Arrival: {phase === 'delivered' ? 'ARRIVED' : '2-4 BUSINESS DAYS'}
              </p>
            </div>
          </div>

          {/* DIGITAL RECEIPT CARD */}
          <div className="border border-black p-6 md:p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-black/5">
              <div className="h-full bg-black w-[20%] animate-scan-receipt"></div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Receipt No.</p>
                <p className="font-mono text-lg">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Paid</p>
                <p className="font-heading text-xl md:text-2xl font-black">Rs. {order.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              {order.items.map((item: any, idx: number) => (
                <div key={`${item.id}-${idx}`} className="flex justify-between items-center text-sm">
                  <span className="font-mono uppercase">{item.quantity}x {item.name} <span className="text-gray-400">({item.size})</span></span>
                  <span className="font-mono">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono text-gray-500">
                <span>SUBTOTAL</span>
                <span>Rs. {order.total}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-gray-500">
                <span>SHIPPING</span>
                <span>FREE</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => window.print()}
              className="flex-1 border border-black py-4 font-heading text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-3"
            >
              <Printer className="w-4 h-4" />
              Print Confirmation
            </button>
            <button
              onClick={shareReceipt}
              className="flex-1 bg-black text-white py-4 font-heading text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
            >
              <Share2 className="w-4 h-4" />
              Share Details
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            Back to Store
          </button>

        </div>
      </div>

      <style>{`
        @keyframes scan-receipt {
            0% { left: 0; width: 0; }
            50% { width: 100%; }
            100% { left: 100%; width: 0; }
        }
        .animate-scan-receipt {
            animation: scan-receipt 2s infinite linear;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media print {
          .no-print { display: none !important; }
          .thermal-receipt { display: block !important; }
        }
        .thermal-receipt { display: none; }
      `}</style>
    </div>
  );
};

export default OrderSuccessOverlay;