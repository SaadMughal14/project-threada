
import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PizzaProductExtended, SizeOption } from '../constants';
import { supabase } from '../lib/supabase';

interface CartItem extends PizzaProductExtended {
  quantity: number;
  selectedSize: SizeOption;
}

interface CheckoutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  onOrderSuccess: (orderData: any) => void;
  orderNotes: string;
}

const EasypaisaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#1EB055"/>
    <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const JazzCashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#ED1C24"/>
    <path d="M12 7V17M12 7L9 10M12 7L15 10M8 17H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NayaPayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#8B2CF5"/>
    <path d="M12 6L7 11H17L12 6Z" fill="white"/>
    <path d="M7 13H17L12 18L7 13Z" fill="white"/>
  </svg>
);

const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#1C1C1C"/>
    <path d="M4 20H20M5 10V17M19 10V17M12 10V17M3 10L12 4L21 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckoutOverlay: React.FC<CheckoutOverlayProps> = ({ isOpen, onClose, cartItems, totalPrice, onOrderSuccess, orderNotes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'info' | 'payment' | 'confirm'>('info');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'digital'>('cash');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', deliveryNotes: '' });

  const PROVIDERS = [
    { id: 'easypaisa', name: 'Easypaisa', icon: <EasypaisaIcon />, color: '#1EB055', acc: '0321-0000000', title: 'Saad Mughal' },
    { id: 'jazzcash', name: 'JazzCash', icon: <JazzCashIcon />, color: '#ED1C24', acc: '0321-1111111', title: 'Saad Mughal' },
    { id: 'nayapay', name: 'NayaPay', icon: <NayaPayIcon />, color: '#8B2CF5', acc: '0321-2222222', title: 'Saad Mughal' },
    { id: 'bank', name: 'Bank Transfer', icon: <BankIcon />, color: '#1C1C1C', acc: '0000-1111-2222-3333', title: 'Gravity Studio' }
  ];

  const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1467847765630521424/eK6KWuC9z9KY2ZfTSwCrrvL8L6SKQk8Ck1-agIKw8mZOQoW1W4l8x75ythTWpGLpiTi6"; 

  useGSAP(() => {
    if (isOpen) {
      gsap.to(containerRef.current, { y: 0, duration: 0.8, ease: "expo.out" });
    } else {
      gsap.to(containerRef.current, { y: '100%', duration: 0.6, ease: "power4.in" });
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submitOrder = async () => {
    setIsSubmitting(true);
    const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const placedAt = Date.now();
    const orderTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Save to Supabase 'orders' table
    try {
      const { error: dbError } = await supabase.from('orders').insert([{
        order_number: orderId,
        customer_name: formData.name,
        customer_phone: formData.phone,
        address: formData.address,
        items: cartItems.map(i => ({ name: i.name, qty: i.quantity, size: i.selectedSize.name })),
        total_price: totalPrice,
        payment_method: paymentMethod,
        status: 'pending'
      }]);
      
      if (dbError) console.error("Database save failed:", dbError);
    } catch (e) {
      console.error("Supabase order error:", e);
    }

    // Send to Discord
    const providerInfo = PROVIDERS.find(p => p.id === selectedProvider);
    const payload = {
      content: `### 🚨 NEW ORDER RECEIVED: #${orderId}`,
      embeds: [{
        title: "👨‍🍳 Kitchen Copy - #" + orderId,
        description: `**Customer:** ${formData.name}\n**Phone:** ${formData.phone}`,
        color: 14252941,
        fields: [
          { name: "📍 Address", value: `\`\`\`\n${formData.address}\n\`\`\`` },
          { name: "🛒 Items", value: cartItems.map(i => `• ${i.quantity}x ${i.name} (${i.selectedSize.name})`).join('\n') },
          { name: "💰 Total", value: `**Rs. ${totalPrice}** via **${paymentMethod.toUpperCase()}**`, inline: true }
        ],
        footer: { text: "GRAVITY STUDIO" },
        timestamp: new Date().toISOString()
      }]
    };

    await fetch(DISCORD_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    onOrderSuccess({
      id: orderId,
      items: cartItems,
      total: totalPrice,
      customer: formData,
      kitchenInstructions: orderNotes,
      paymentMethod: paymentMethod,
      timestamp: orderTimestamp,
      placedAt: placedAt
    });
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[300] bg-[#FDFCFB] transform translate-y-full flex flex-col h-[100dvh] w-screen overflow-hidden overscroll-none">
      <div className="px-6 py-6 md:px-12 md:py-8 flex justify-between items-center border-b border-black/5 flex-shrink-0 bg-[#FDFCFB] z-20">
        <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1C1C1C]">Check<span className="text-[#D97B8D]">out</span></h2>
        <button onClick={onClose} className="p-3 bg-black text-white rounded-full hover:bg-[#D97B8D] transition-colors shadow-xl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div 
        ref={scrollAreaRef}
        data-lenis-prevent
        className="flex-1 overflow-y-auto bg-[#FDFCFB] px-6 py-10 md:px-12 relative touch-pan-y no-scrollbar"
      >
        <div className="max-w-2xl mx-auto space-y-10 md:space-y-12 pb-32">
          {/* Information Section */}
          <div className={`space-y-6 md:space-y-8 transition-opacity duration-300 ${step === 'info' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <h3 className="font-black uppercase text-[10px] tracking-[0.6em] text-black/30 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px]">01</span> Delivery Details
            </h3>
            <div className="grid gap-4 md:gap-6">
              <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-black/10 p-3 md:p-4 font-black uppercase tracking-widest text-lg md:text-xl focus:border-[#D97B8D] transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="PHONE" className="w-full bg-transparent border-b border-black/10 p-3 md:p-4 font-black uppercase tracking-widest text-lg md:text-xl focus:border-[#D97B8D] transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <textarea placeholder="FULL ADDRESS" rows={2} className="w-full bg-transparent border-b border-black/10 p-3 md:p-4 font-black uppercase tracking-widest text-lg md:text-xl focus:border-[#D97B8D] transition-colors resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            {step === 'info' && (
              <button onClick={() => setStep('payment')} disabled={!formData.name || !formData.phone || !formData.address} className="w-full bg-black text-[#D97B8D] py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl disabled:opacity-20 active:scale-95 transition-all">
                Continue
              </button>
            )}
          </div>

          {/* Payment Section */}
          <div className={`space-y-6 md:space-y-8 transition-opacity duration-300 ${step === 'payment' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <h3 className="font-black uppercase text-[10px] tracking-[0.6em] text-black/30 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px]">02</span> Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPaymentMethod('cash')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-3 transition-all ${paymentMethod === 'cash' ? 'border-[#D97B8D] bg-[#F2DCE0]' : 'border-black/5 opacity-50'}`}>
                <span className="text-3xl">💵</span>
                <span className="font-black uppercase text-[9px] tracking-widest">Cash</span>
              </button>
              <button onClick={() => setPaymentMethod('digital')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-3 transition-all ${paymentMethod === 'digital' ? 'border-[#D97B8D] bg-[#F2DCE0]' : 'border-black/5 opacity-50'}`}>
                <span className="text-3xl">📱</span>
                <span className="font-black uppercase text-[9px] tracking-widest">Digital</span>
              </button>
            </div>
            {paymentMethod === 'digital' && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PROVIDERS.map(p => (
                    <button key={p.id} onClick={() => setSelectedProvider(p.id)} className={`p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${selectedProvider === p.id ? 'border-[#D97B8D] bg-white' : 'border-black/5 opacity-50'}`}>
                      {p.icon}
                      <span className="text-[7px] font-black uppercase tracking-widest">{p.name}</span>
                    </button>
                  ))}
                </div>
                {selectedProvider && (
                  <div className="bg-[#1C1C1C] text-white p-6 rounded-3xl border border-[#D97B8D]/20">
                    <p className="text-[7px] uppercase tracking-[0.4em] text-[#D97B8D] mb-1">Account Holder</p>
                    <p className="font-black text-sm uppercase mb-4">{PROVIDERS.find(p => p.id === selectedProvider)?.title}</p>
                    <p className="text-[7px] uppercase tracking-[0.4em] text-[#D97B8D] mb-1">Account Number</p>
                    <p className="font-black text-lg mb-6">{PROVIDERS.find(p => p.id === selectedProvider)?.acc}</p>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center gap-3 font-black text-[9px] uppercase tracking-widest">
                       {screenshot ? 'REPLACE RECEIPT' : 'UPLOAD RECEIPT'}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                )}
              </div>
            )}
            {step === 'payment' && (
              <button onClick={submitOrder} disabled={isSubmitting || (paymentMethod === 'digital' && !screenshot)} className="w-full bg-[#D97B8D] text-black py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl disabled:opacity-20 active:scale-95 transition-all">
                {isSubmitting ? 'WORKING...' : 'PLACE ORDER'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 md:px-12 md:py-8 border-t border-black/5 bg-[#FDFCFB] flex justify-between items-center flex-shrink-0 z-30">
        <div>
          <p className="font-black uppercase text-[8px] tracking-[0.6em] text-black/30 mb-1">Total</p>
          <p className="font-display text-4xl md:text-6xl font-black tracking-tighter text-[#D97B8D] leading-none">Rs. {totalPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOverlay;
