
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PizzaProductExtended } from '../constants';

interface CheckoutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: (PizzaProductExtended & { quantity: number })[];
  totalPrice: number;
  onOrderSuccess: (orderData: any) => void;
  orderNotes: string;
}

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
    { id: 'easypaisa', name: 'Easypaisa', icon: '💎', acc: '0321-0000000', title: 'Saad Mughal' },
    { id: 'jazzcash', name: 'JazzCash', icon: '🔥', acc: '0321-1111111', title: 'Saad Mughal' },
    { id: 'nayapay', name: 'NayaPay', icon: '🚀', acc: '0321-2222222', title: 'Saad Mughal' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', acc: '0000-1111-2222-3333', title: 'Gravity Studio' }
  ];

  // Updated Webhook URL as per request
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
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitOrder = async () => {
    setIsSubmitting(true);
    const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderData = {
      id: orderId,
      items: cartItems,
      total: totalPrice,
      customer: formData,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const providerInfo = PROVIDERS.find(p => p.id === selectedProvider);

    const payload = {
      content: `### 🚨 NEW ARTIFACT ORDER: #${orderId}`,
      embeds: [{
        title: "🌡️ Studio Ticket - Ready to Forge",
        description: `**ID:** #${orderId}\n**Customer:** ${formData.name}\n**Phone:** ${formData.phone}`,
        color: 13938487, 
        fields: [
          { name: "📍 Delivery Address", value: `\`\`\`\n${formData.address}\n\`\`\`` },
          { name: "🍪 Items Selected", value: cartItems.map(i => `• ${i.quantity}x ${i.name}`).join('\n') },
          { name: "💰 Amount & Method", value: `**Total:** Rs. ${totalPrice}\n**Method:** ${paymentMethod === 'cash' ? 'CASH ON DELIVERY' : `DIGITAL (${providerInfo?.name})`}`, inline: true }
        ],
        footer: { text: "GRAVITY | Sculpted by Heat. Defined by Gravity." },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      await fetch(DISCORD_WEBHOOK, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      onOrderSuccess(orderData);
    } catch (e) {
      onOrderSuccess(orderData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[300] bg-[#FDFCFB] transform translate-y-full flex flex-col h-[100dvh] w-screen overflow-hidden overscroll-none">
      <div className="px-6 py-6 md:px-12 md:py-8 flex justify-between items-center border-b border-black/5 flex-shrink-0 bg-[#FDFCFB] z-20">
        <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1C1C1C]">Check<span className="text-[#D4AF37]">out</span></h2>
        <button onClick={onClose} className="p-3 bg-black text-white rounded-full hover:bg-[#D4AF37] transition-colors shadow-xl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div 
        ref={scrollAreaRef}
        data-lenis-prevent
        className="flex-1 overflow-y-auto bg-[#FDFCFB] px-6 py-10 md:px-12 relative touch-pan-y no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="max-w-2xl mx-auto space-y-10 md:space-y-12 pb-32">
          {/* STEP 01: INFO */}
          <div className={`space-y-6 md:space-y-8 transition-opacity duration-300 ${step === 'info' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <h3 className="font-black uppercase text-[10px] tracking-[0.6em] text-black/30 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px]">01</span> Info
            </h3>
            <div className="grid gap-4 md:gap-6">
              <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-black/10 p-3 md:p-4 font-black uppercase tracking-widest text-lg md:text-xl focus:border-[#D4AF37] transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="PHONE" className="w-full bg-transparent border-b border-black/10 p-3 md:p-4 font-black uppercase tracking-widest text-lg md:text-xl focus:border-[#D4AF37] transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <textarea placeholder="ADDRESS" rows={2} className="w-full bg-transparent border-b border-black/10 p-3 md:p-4 font-black uppercase tracking-widest text-lg md:text-xl focus:border-[#D4AF37] transition-colors resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            {step === 'info' && (
              <button 
                onClick={() => { setStep('payment'); scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                disabled={!formData.name || !formData.phone || !formData.address} 
                className="w-full bg-black text-[#D4AF37] py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] md:text-[12px] shadow-2xl disabled:opacity-20 active:scale-95 transition-all"
              >
                Next Step
              </button>
            )}
          </div>

          {/* STEP 02: METHOD */}
          <div className={`space-y-6 md:space-y-8 transition-opacity duration-300 ${step === 'payment' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <h3 className="font-black uppercase text-[10px] tracking-[0.6em] text-black/30 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px]">02</span> Method
            </h3>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button onClick={() => setPaymentMethod('cash')} className={`p-4 md:p-6 border-2 rounded-3xl flex flex-col items-center gap-3 transition-all ${paymentMethod === 'cash' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-black/5 opacity-50'}`}>
                <span className="text-2xl md:text-3xl">💵</span>
                <span className="font-black uppercase text-[9px] md:text-[10px] tracking-widest text-center">Cash on Delivery</span>
              </button>
              <button onClick={() => setPaymentMethod('digital')} className={`p-4 md:p-6 border-2 rounded-3xl flex flex-col items-center gap-3 transition-all ${paymentMethod === 'digital' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-black/5 opacity-50'}`}>
                <span className="text-2xl md:text-3xl">📱</span>
                <span className="font-black uppercase text-[9px] md:text-[10px] tracking-widest text-center">Digital Transfer</span>
              </button>
            </div>

            {paymentMethod === 'digital' && (
              <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="font-black uppercase text-[9px] tracking-[0.4em] text-black/30 text-center">Select Provider</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {PROVIDERS.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => { setSelectedProvider(p.id); setScreenshot(null); }}
                      className={`p-3 md:p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${selectedProvider === p.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-black/5 opacity-60'}`}
                    >
                      <span className="text-lg md:text-xl">{p.icon}</span>
                      <span className="font-black uppercase text-[7px] md:text-[8px] tracking-widest text-center leading-tight">{p.name}</span>
                    </button>
                  ))}
                </div>

                {selectedProvider && (
                  <div className="bg-black text-white p-5 md:p-6 rounded-3xl space-y-4 shadow-xl border border-[#D4AF37]/20">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-[7px] uppercase tracking-[0.4em] text-[#D4AF37] mb-1">Account Title</p>
                        <p className="font-black text-xs md:text-sm uppercase tracking-widest">{PROVIDERS.find(p => p.id === selectedProvider)?.title}</p>
                      </div>
                      <div>
                        <p className="text-[7px] uppercase tracking-[0.4em] text-[#D4AF37] mb-1">Account No.</p>
                        <div className="flex justify-between items-center">
                          <p className="font-black text-xs md:text-sm uppercase tracking-widest">{PROVIDERS.find(p => p.id === selectedProvider)?.acc}</p>
                          <button onClick={() => navigator.clipboard.writeText(PROVIDERS.find(p => p.id === selectedProvider)?.acc || '')} className="text-[8px] text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-1 rounded">COPY</button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[8px] uppercase tracking-[0.3em] text-white/40 mb-3 italic">Attach transaction screenshot below</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full py-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-3 transition-all ${screenshot ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 hover:border-white/30'}`}
                      >
                        {screenshot ? (
                          <div className="flex items-center gap-3">
                            <span className="text-lg">✅</span>
                            <span className="font-black uppercase text-[9px] tracking-widest text-[#D4AF37]">Proof Added</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-lg">📸</span>
                            <span className="font-black uppercase text-[9px] tracking-widest">Attach Receipt</span>
                          </div>
                        )}
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'payment' && (
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button onClick={() => setStep('info')} className="flex-1 border-2 border-black py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest active:bg-black/5 transition-colors">Back</button>
                <button 
                  onClick={submitOrder} 
                  disabled={isSubmitting || (paymentMethod === 'digital' && (!selectedProvider || !screenshot))} 
                  className="flex-[2] bg-[#D4AF37] text-black py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl disabled:opacity-50 active:scale-95 transition-all"
                >
                  {isSubmitting ? 'Forging Order...' : 'Place My Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 md:px-12 md:py-8 border-t border-black/5 bg-[#FDFCFB] flex justify-between items-center flex-shrink-0 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div>
          <p className="font-black uppercase text-[7px] md:text-[8px] tracking-[0.6em] text-black/30 mb-1">Total Amount</p>
          <p className="font-display text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#D4AF37] leading-none">Rs. {totalPrice}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-black uppercase text-[9px] md:text-[10px] tracking-[0.4em] text-black/20">GRAVITY</p>
          <p className="font-black uppercase text-[9px] md:text-[10px] tracking-[0.4em] text-black/20">STUDIO</p>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CheckoutOverlay;
