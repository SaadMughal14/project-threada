import React, { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ReactDOM from 'react-dom';
import { supabase } from '../supabaseClient';

interface SuccessProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
}

type OrderPhase = 'confirmed' | 'baking' | 'ready' | 'dispatched' | 'delivered';

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

// Confirmed Tick Animation
const ConfirmedTick = () => (
  <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
    <div className="animate-bounce">
      <div className="relative">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-green-500 flex items-center justify-center shadow-2xl animate-pulse">
          <svg className="w-16 h-16 md:w-24 md:h-24 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" className="animate-[draw_0.5s_ease-out_forwards]" />
          </svg>
        </div>
        <div className="absolute -top-2 -right-2 text-4xl animate-bounce">🎉</div>
        <div className="absolute -bottom-2 -left-2 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
      </div>
    </div>
  </div>
);

// Waiting for Rider Animation - Man checking watch (Premium)
const WaitingForRider = () => (
  <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
      {/* Ground shadow */}
      <ellipse cx="100" cy="175" rx="40" ry="8" fill="rgba(0,0,0,0.1)" />

      {/* Person Standing */}
      <circle cx="100" cy="45" r="22" fill="#E8B9A7" /> {/* Head */}
      <ellipse cx="100" cy="40" rx="18" ry="12" fill="#1C1C1C" /> {/* Hair */}

      {/* Eyes */}
      <circle cx="94" cy="48" r="2" fill="#1C1C1C" />
      <circle cx="106" cy="48" r="2" fill="#1C1C1C" />

      {/* Body - Polo Shirt */}
      <path d="M80 68 L85 95 L85 125 L115 125 L115 95 L120 68 Q100 60 80 68" fill="#D97B8D" />
      <path d="M85 68 L90 68 L90 78 L85 78" fill="#C46B7D" /> {/* Collar detail */}
      <path d="M110 68 L115 68 L115 78 L110 78" fill="#C46B7D" />

      {/* Left Arm - Raised checking watch */}
      <path d="M80 75 Q65 85 60 110 Q55 125 58 130" stroke="#E8B9A7" strokeWidth="10" strokeLinecap="round" fill="none" />

      {/* Watch ON the wrist - properly attached */}
      <g transform="rotate(-20, 58, 125)">
        <rect x="50" y="120" width="16" height="12" rx="3" fill="#2D2D2D" stroke="#1C1C1C" strokeWidth="1" />
        <rect x="52" y="122" width="12" height="8" rx="2" fill="#1C1C1C" />
        <circle cx="58" cy="126" r="4" fill="#0a0a0a" stroke="#333" strokeWidth="0.5" />
        {/* Watch face with time */}
        <circle cx="58" cy="126" r="3" fill="#111" />
        <line x1="58" y1="126" x2="58" y2="124" stroke="#7BD98D" strokeWidth="0.8" className="animate-pulse" />
        <line x1="58" y1="126" x2="60" y2="127" stroke="#D97B8D" strokeWidth="0.5" />
        {/* Watch glow */}
        <circle cx="58" cy="126" r="5" fill="none" stroke="#7BD98D" strokeWidth="1" className="animate-ping" style={{ animationDuration: '2s', opacity: 0.5 }} />
      </g>

      {/* Right Arm - Holding package */}
      <path d="M120 75 Q135 85 140 95 Q145 105 142 110" stroke="#E8B9A7" strokeWidth="10" strokeLinecap="round" fill="none" />

      {/* Package in right hand */}
      <g transform="rotate(10, 150, 105)">
        <rect x="138" y="95" width="28" height="28" rx="4" fill="#FDFCFB" stroke="#1C1C1C" strokeWidth="2" />
        {/* Cookie logo on box */}
        <circle cx="152" cy="109" r="8" fill="#D97B8D" />
        <circle cx="148" cy="105" r="2" fill="#4A3728" />
        <circle cx="156" cy="107" r="2.5" fill="#4A3728" />
        <circle cx="150" cy="113" r="2" fill="#4A3728" />
      </g>

      {/* Legs */}
      <rect x="88" y="123" width="11" height="38" rx="3" fill="#2D2D2D" />
      <rect x="101" y="123" width="11" height="38" rx="3" fill="#2D2D2D" />

      {/* Shoes */}
      <ellipse cx="93" cy="163" rx="10" ry="6" fill="#1C1C1C" />
      <ellipse cx="107" cy="163" rx="10" ry="6" fill="#1C1C1C" />

      {/* Thought bubble with clock */}
      <g className="animate-bounce" style={{ animationDuration: '3s' }}>
        <circle cx="45" cy="55" r="18" fill="white" stroke="#E0E0E0" strokeWidth="1" />
        <circle cx="58" cy="72" r="5" fill="white" />
        <circle cx="65" cy="80" r="3" fill="white" />
        {/* Clock inside bubble */}
        <circle cx="45" cy="55" r="12" fill="#F5F5F5" stroke="#1C1C1C" strokeWidth="1.5" />
        <line x1="45" y1="55" x2="45" y2="48" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="55" x2="51" y2="58" stroke="#D97B8D" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="45" cy="55" r="1.5" fill="#1C1C1C" />
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Live status from Kitchen Dashboard
  const [liveStatus, setLiveStatus] = useState<string>('pending');
  const [storeMessages, setStoreMessages] = useState<{ sender: string; message: string; created_at: string; id?: string }[]>([]);

  // Initialize unread count from localStorage if available
  const [unreadCount, setUnreadCount] = useState(() => {
    if (typeof window !== 'undefined' && order?.id) {
      const saved = localStorage.getItem(`unread_${order.id}`);
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

  const [customerReply, setCustomerReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [messagePopup, setMessagePopup] = useState<{ message: string } | null>(null);

  // Floating messenger
  const [showMessenger, setShowMessenger] = useState(false);
  const [messengerPos, setMessengerPos] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  const BAKING_DURATION = 120000;
  const DELIVERY_DURATION = 180000;
  const TOTAL_DURATION = BAKING_DURATION + DELIVERY_DURATION;

  // Map Kitchen status to display phase - 1:1 mapping
  const mapStatusToPhase = useCallback((status: string): OrderPhase => {
    switch (status) {
      case 'confirmed': return 'confirmed';
      case 'cooking': return 'baking';
      case 'ready': return 'ready';
      case 'dispatched': return 'dispatched';
      case 'delivered': return 'delivered';
      default: return 'baking'; // pending
    }
  }, []);

  // Fetch live status and messages from Supabase
  const fetchLiveData = useCallback(async () => {
    if (!order?.id) return;

    // Fetch order status by order_number
    const { data: orderData } = await supabase
      .from('orders')
      .select('status')
      .eq('order_number', order.id)
      .single();

    if (orderData?.status) {
      setLiveStatus(orderData.status);

      // Update progress bar based on status
      const progressValue =
        orderData.status === 'confirmed' ? 20 :
          orderData.status === 'cooking' ? 50 :
            orderData.status === 'ready' ? 70 :
              orderData.status === 'dispatched' ? 90 :
                orderData.status === 'delivered' ? 100 : 10;

      setProgress(progressValue);

      // Phase is fully controlled by live status
      setPhase(mapStatusToPhase(orderData.status));
    }

    // Fetch messages for this order
    const { data: dbOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', order.id)
      .single();

    if (dbOrder?.id) {
      const { data: messages } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', dbOrder.id)
        .order('created_at', { ascending: true });

      if (messages) setStoreMessages(messages);
    }
  }, [order?.id, mapStatusToPhase]);

  // Send customer reply
  const sendReply = async () => {
    if (!customerReply.trim() || !order?.id) return;

    // Optimistic update
    const tempId = 'temp-' + Date.now();
    const msgContent = customerReply.trim();

    setStoreMessages(prev => [...prev, {
      sender: 'customer',
      message: msgContent,
      created_at: new Date().toISOString(),
      id: tempId // Temporary ID
    }]);

    setCustomerReply('');
    setSendingReply(true);

    // Get the actual order UUID first
    const { data: dbOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', order.id)
      .single();

    if (dbOrder?.id) {
      const { error } = await supabase.from('order_messages').insert({
        order_id: dbOrder.id,
        sender: 'customer',
        message: msgContent
      });

      if (error) {
        setStoreMessages(prev => prev.filter(m => m.id !== tempId));
      } else {
        fetchLiveData(); // Refresh to get real ID
      }
    }
    setSendingReply(false);
  };

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

  // Real-time subscription for order status and messages
  useEffect(() => {
    if (!isOpen || !order?.id) return;

    // Initial fetch
    fetchLiveData();

    // Poll every 5 seconds for updates (backup for real-time)
    const pollInterval = setInterval(fetchLiveData, 5000);

    let channel: any = null;

    // Get order UUID for real-time subscription
    const setupRealtimeSub = async () => {
      const { data: dbOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', order.id)
        .single();

      if (dbOrder?.id) {
        channel = supabase
          .channel(`customer-messages-${dbOrder.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_messages', filter: `order_id=eq.${dbOrder.id}` }, (payload: any) => {
            // Only show popup for store messages
            if (payload.new?.sender === 'store') {
              setMessagePopup({ message: payload.new.message });
              setUnreadCount(prev => {
                const newCount = prev + 1;
                localStorage.setItem(`unread_${order.id}`, newCount.toString());
                return newCount;
              });
              audioRef.current?.play().catch(e => console.log('Audio play failed', e));
              // Auto-dismiss after 8 seconds
              setTimeout(() => setMessagePopup(null), 8000);
            }
            // Refetch all messages
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

  const getETAText = () => {
    const totalElapsed = Date.now() - (order.placedAt || Date.now());
    if (totalElapsed >= TOTAL_DURATION) return "ARRIVED";

    const remainingMs = TOTAL_DURATION - totalElapsed;
    const remainingMins = Math.ceil(remainingMs / 60000);
    return `${remainingMins} ${remainingMins === 1 ? 'MIN' : 'MINS'}`;
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

  // Use a portal to render the thermal receipt separately to avoid CSS nesting issues during print
  const ThermalReceiptPortal = () => {
    return ReactDOM.createPortal(
      <div className="thermal-receipt">
        <h1>Receipt</h1>

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
        <div style={{ fontSize: '10pt' }}>Phase 6, DHA, Karachi</div>
        <div style={{ fontSize: '10pt' }}>Tel: (850) GRAVITY-STUDIO</div>

        <div className="separator"></div>
        <div className="flex-row">
          <span>Date: {currentDate}</span>
          <span>{currentTime}</span>
        </div>
        <div className="separator"></div>

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
          <div className="bold" style={{ marginBottom: '1.5mm' }}>DELIVER TO:</div>
          <div className="bold" style={{ fontSize: '11pt' }}>{order.customer.name}</div>
          <div style={{ fontSize: '10pt' }}>{order.customer.address}</div>
          <div style={{ fontSize: '10pt' }}>Contact: {order.customer.phone}</div>
        </div>

        <div style={{ marginTop: '10mm' }}>
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
      </div>,
      document.body
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[400] bg-[#F2DCE0] transform translate-y-full flex flex-col h-[100dvh] w-screen overflow-hidden overscroll-none"
      id="order-success-overlay"
    >
      {/* Thermal Receipt Portal for Print-Only Rendering */}
      <ThermalReceiptPortal />

      {/* Screen Interactive UI (Hidden during print via .no-print class) */}
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Card 1: Status */}
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 shadow-sm relative overflow-hidden flex flex-col items-center justify-between min-h-[280px] md:min-h-[400px]">
            <div className="w-full flex justify-between items-center mb-1">
              {/* Removed redundant status badge as requested */}
              <div></div>
              <span className="text-[8px] font-black tracking-widest text-black/20 uppercase">Live</span>
            </div>

            <div className="flex flex-col items-center gap-6 text-center flex-1 justify-center w-full">
              <h3 className="font-display text-xl md:text-3xl font-black text-[#1C1C1C] uppercase tracking-tighter">
                {phase === 'confirmed' ? 'ORDER CONFIRMED!' :
                  phase === 'baking' ? 'BAKING YOUR ORDER' :
                    phase === 'ready' ? 'WAITING FOR RIDER' :
                      phase === 'dispatched' ? 'ON THE WAY' : 'ORDER DELIVERED'}
              </h3>

              <div className="relative w-40 h-40 md:w-64 md:h-64 flex items-center justify-center">
                {phase === 'confirmed' ? (
                  <ConfirmedTick />
                ) : phase === 'baking' ? (
                  <div className="w-full h-full relative group">
                    <img
                      src="https://i.imgur.com/PxuIhOT.gif"
                      className="w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-700"
                      alt="Baking Animation"
                    />
                    <div className="absolute inset-0 bg-[#D97B8D]/5 rounded-3xl"></div>
                  </div>
                ) : phase === 'ready' ? (
                  <WaitingForRider />
                ) : phase === 'dispatched' ? (
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><path d="M20 6L9 17l-5-5" /></svg>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-2 4H8v-4h8v4z" /></svg>
                Print Receipt
              </button>
              <button
                onClick={shareReceipt}
                className="flex-1 bg-[#1C1C1C] text-white py-4 md:py-5 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#D97B8D] transition-colors shadow-xl active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v13" /></svg>
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
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bell-ring {
          0%, 100% { transform: rotate(0); }
          15% { transform: rotate(15deg); }
          30% { transform: rotate(-15deg); }
          45% { transform: rotate(15deg); }
          60% { transform: rotate(-15deg); }
          75% { transform: rotate(0); }
        }
        
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Floating Messenger Icon */}
      <div
        className="fixed z-[450] cursor-pointer"
        style={{
          right: `${messengerPos.x}px`,
          top: `${messengerPos.y}px`,
          touchAction: 'none'
        }}
        onClick={() => {
          if (!isDragging) {
            setShowMessenger(!showMessenger);
            if (!showMessenger) {
              setUnreadCount(0); // Clear on open
              if (order?.id) localStorage.setItem(`unread_${order.id}`, '0');
            }
          }
        }}
        onMouseDown={(e) => {
          dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: messengerPos.x, startPosY: messengerPos.y };
          setIsDragging(false);
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1 && dragRef.current) {
            const dx = dragRef.current.startX - e.clientX;
            const dy = e.clientY - dragRef.current.startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) setIsDragging(true);
            setMessengerPos({
              x: Math.max(10, dragRef.current.startPosX + dx),
              y: Math.max(50, Math.min(window.innerHeight - 100, dragRef.current.startPosY + dy))
            });
          }
        }}
        onMouseUp={() => { dragRef.current = null; setTimeout(() => setIsDragging(false), 100); }}
      >
        <div className={`w-14 h-14 md:w-16 md:h-16 bg-[#D97B8D] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform ${unreadCount > 0 ? 'animate-[bell-ring_0.5s_ease-in-out_infinite]' : ''}`}>
          <span className="text-2xl md:text-3xl">💬</span>
        </div>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white text-[#D97B8D] rounded-full flex items-center justify-center text-xs font-black border-2 border-[#D97B8D] animate-bounce">
            {unreadCount}
          </div>
        )}
      </div>

      {/* Floating Messenger Chat Modal */}
      {showMessenger && (
        <div
          className="fixed z-[460] bg-[#1C1C1C] rounded-2xl shadow-2xl border border-white/10 w-80 md:w-96 max-h-[60vh] flex flex-col"
          style={{ right: `${messengerPos.x}px`, top: `${messengerPos.y + 70}px` }}
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <span className="text-sm font-bold text-white uppercase tracking-widest">Store Chat</span>
            <button onClick={() => setShowMessenger(false)} className="text-white/40 hover:text-white">✕</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {storeMessages.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No messages yet</p>
            ) : (
              storeMessages.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-xl text-sm max-w-[85%] relative ${msg.sender === 'store' ? 'bg-[#D97B8D]/20 text-[#D97B8D] ml-0' : 'bg-blue-500/20 text-blue-400 ml-auto'}`}>
                  <p className="text-[8px] uppercase tracking-widest opacity-60 mb-1 font-bold">{msg.sender === 'store' ? '🏪 Store' : '👤 You'}</p>
                  <p className="font-medium">{msg.message}</p>
                  {(msg as any).id?.startsWith('temp-') && (
                    <span className="absolute -bottom-2 right-1 text-[8px] opacity-70">⏳ Sending...</span>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={customerReply}
              onChange={(e) => setCustomerReply(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D97B8D]"
              onKeyDown={(e) => e.key === 'Enter' && sendReply()}
            />
            <button
              onClick={sendReply}
              disabled={sendingReply}
              className="bg-[#D97B8D] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-[#D97B8D]/90 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Store Message Popup Notification */}
      {
        messagePopup && (
          <div className="fixed bottom-4 right-4 left-4 md:left-auto md:right-4 md:w-80 z-[500] animate-[slide-up_0.3s_ease-out]">
            <div
              className="bg-[#1C1C1C] border-2 border-[#D97B8D] rounded-2xl p-4 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => setMessagePopup(null)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D97B8D]/30 flex items-center justify-center text-lg shrink-0">
                  🏪
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D97B8D]">
                      Store Message
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setMessagePopup(null); }}
                      className="text-white/30 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-white text-sm font-medium">{messagePopup.message}</p>
                  <p className="text-white/40 text-[10px] mt-1">Tap to dismiss</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {/* Audio for notifications */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />
    </div>
  );
};

export default OrderSuccessOverlay;