
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
  const [step, setStep] = useState<'info' | 'payment' | 'confirm'>('info');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'digital'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', deliveryNotes: '' });

  const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1465951576081563680/N5bnKcJ48EphqBNunpNHLMrsoWhS-XqYXxP65v5ee98N2wSf0WhS-XqYXxP65v5ee98N2wSf0WuH40rgghusrtOYO3e9"; 

  useGSAP(() => {
    if (isOpen) {
      gsap.to(containerRef.current, { y: 0, duration: 0.8, ease: "expo.out" });
    } else {
      gsap.to(containerRef.current, { y: '100%', duration: 0.6, ease: "power4.in" });
    }
  }, [isOpen]);

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

    const payload = {
      content: `### 🚨 NEW ORDER: #${orderId}`,
      embeds: [{
        title: "🌡️ Studio Ticket - Ready to Forge",
        description: `**ID:** #${orderId}\n**Customer:** ${formData.name}\n**Phone:** ${formData.phone}`,
        color: 13938487, 
        fields: [
          { name: "📍 Delivery Address", value: `\`\`\`\n${formData.address}\n\`\`\`` },
          { name: "🍪 Items Selected", value: cartItems.map(i => `• ${i.quantity}x ${i.name}`).join('\n') },
          { name: "💰 Amount & Method", value: `**Total:** Rs. ${totalPrice}\n**Method:** ${paymentMethod.toUpperCase()}`, inline: true }
        ],
        footer: { text: "GRAVITY | Sculpted by Heat. Defined by Gravity." },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      await fetch(DISCORD_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      onOrderSuccess(orderData);
    } catch (e) {
      onOrderSuccess(orderData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[300] bg-[#FDFCFB] transform translate-y-full flex flex-col h-[100dvh] w-screen overflow-hidden">
      <div className="px-6 py-6 md:px-12 md:py-8 flex justify-between items-center border-b border-black/5 flex-shrink-0 bg-[#FDFCFB] z-10">
        <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1C1C1C]">Check<span className="text-[#D4AF37]">out</span></h2>
        <button onClick={onClose} className="p-3 bg-black text-white rounded-full hover:bg-[#D4AF37] transition-colors shadow-xl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#FDFCFB] scrollbar-hide px-6 py-10 md:px-12">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className={`space-y-8 ${step === 'info' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <h3 className="font-black uppercase text-[10px] tracking-[0.6em] text-black/30 flex items-center gap-4"><span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px]">01</span> Info</h3>
            <div className="grid gap-6">
              <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-black/10 p-4 font-black uppercase tracking-widest text-xl focus:border-[#D4AF37] transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="PHONE" className="w-full bg-transparent border-b border-black/10 p-4 font-black uppercase tracking-widest text-xl focus:border-[#D4AF37] transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <textarea placeholder="ADDRESS" rows={2} className="w-full bg-transparent border-b border-black/10 p-4 font-black uppercase tracking-widest text-xl focus:border-[#D4AF37] transition-colors resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            {step === 'info' && <button onClick={() => setStep('payment')} disabled={!formData.name || !formData.phone || !formData.address} className="w-full bg-black text-[#D4AF37] py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[12px] shadow-2xl disabled:opacity-20 active:scale-95 transition-all">Next</button>}
          </div>

          <div className={`space-y-8 ${step === 'payment' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <h3 className="font-black uppercase text-[10px] tracking-[0.6em] text-black/30 flex items-center gap-4"><span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px]">02</span> Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPaymentMethod('cash')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-3 transition-all ${paymentMethod === 'cash' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-black/5 opacity-50'}`}><span className="text-3xl">💵</span><span className="font-black uppercase text-[10px] tracking-widest">Cash</span></button>
              <button onClick={() => setPaymentMethod('digital')} className={`p-6 border-2 rounded-3xl flex flex-col items-center gap-3 transition-all ${paymentMethod === 'digital' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-black/5 opacity-50'}`}><span className="text-3xl">📱</span><span className="font-black uppercase text-[10px] tracking-widest">Digital</span></button>
            </div>
            {step === 'payment' && (
              <div className="flex gap-4 pt-6">
                <button onClick={() => setStep('info')} className="flex-1 border-2 border-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">Back</button>
                <button onClick={submitOrder} disabled={isSubmitting} className="flex-[2] bg-[#D4AF37] text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl disabled:opacity-50">{isSubmitting ? 'Processing...' : 'Place Order'}</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 md:px-12 md:py-10 border-t border-black/5 bg-[#FDFCFB] flex justify-between items-center flex-shrink-0">
        <div>
          <p className="font-black uppercase text-[8px] tracking-[0.6em] text-black/30 mb-1">Total Amount</p>
          <p className="font-display text-4xl md:text-6xl font-black tracking-tighter text-[#D4AF37] leading-none">Rs. {totalPrice}</p>
        </div>
        <div className="text-right">
          <p className="font-black uppercase text-[10px] tracking-[0.4em] text-black/20">GRAVITY</p>
          <p className="font-black uppercase text-[10px] tracking-[0.4em] text-black/20">STUDIO</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOverlay;
