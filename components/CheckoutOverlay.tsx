import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { supabase } from '../supabaseClient';
import { CartItem } from '../src/store/cartStore';
import { X, ChevronRight, CreditCard, Banknote, Upload, Check, Copy } from 'lucide-react';

interface CheckoutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  onOrderSuccess: (orderData: any) => void;
  orderNotes: string; // Passed from App.tsx as kitchen instructions
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
    { id: 'easypaisa', name: 'Easypaisa', color: '#1EB055', acc: '0321-0000000', title: 'Saad Mughal' },
    { id: 'jazzcash', name: 'JazzCash', color: '#ED1C24', acc: '0321-1111111', title: 'Saad Mughal' },
    { id: 'nayapay', name: 'NayaPay', color: '#8B2CF5', acc: '0321-2222222', title: 'Saad Mughal' },
    { id: 'bank', name: 'Bank Transfer', color: '#1C1C1C', acc: '0000-1111-2222-3333', title: 'Threada Corp' }
  ];

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
    const placedAt = Date.now();
    const orderTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Full order data for app state
    const orderData: any = {
      id: orderId,
      items: cartItems,
      total: totalPrice,
      customer: formData,
      kitchenInstructions: orderNotes,
      paymentMethod: paymentMethod,
      timestamp: orderTimestamp,
      placedAt: placedAt
    };

    // Slimmed data for URL (further reduced to save space)
    const slimOrder = {
      id: orderId,
      items: cartItems.map(i => ({ id: i.id, n: i.name, q: i.quantity, s: i.size, pr: i.price })),
      p: totalPrice,
      c: { n: formData.name, p: formData.phone, a: formData.address, d: formData.deliveryNotes },
      kn: orderNotes,
      pm: paymentMethod,
      t: orderTimestamp,
      at: placedAt
    };

    const providerInfo = PROVIDERS.find(p => p.id === selectedProvider);

    try {
      // 1. Upload payment screenshot if digital payment
      let screenshotUrl: string | null = null;
      if (paymentMethod === 'digital' && screenshot) {
        try {
          // Convert base64 to blob
          const base64Data = screenshot.split(',')[1];
          const byteString = atob(base64Data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: 'image/jpeg' });
          const fileName = `${orderId}-${Date.now()}.jpg`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('payment-screenshots')
            .upload(fileName, blob);

          if (uploadError) {
            console.error('Screenshot upload error:', uploadError);
          } else if (uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('payment-screenshots')
              .getPublicUrl(fileName);
            screenshotUrl = publicUrl;
          }
        } catch (uploadErr) {
          console.error('Screenshot upload failed:', uploadErr);
        }
      }

      // 2. Save order to Supabase
      console.log('Attempting to save order to Supabase:', orderId);

      const { data: insertedOrder, error: dbError } = await supabase.from('orders').insert({
        order_number: orderId,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        delivery_notes: formData.deliveryNotes,
        kitchen_instructions: orderNotes,
        items: slimOrder.items,
        total: totalPrice,
        payment_method: paymentMethod,
        payment_screenshot: screenshotUrl,
        status: 'pending'
      }).select();

      if (dbError) {
        console.error('Order DB insert failed:', dbError);
        alert(`Order placed! Note: Notification may be delayed. Error: ${dbError.message}`);
      }

      onOrderSuccess(orderData);
    } catch (e) {
      console.error("Order submission critical error:", e);
      onOrderSuccess(orderData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[300] bg-white transform translate-y-full flex flex-col h-[100dvh] w-screen overflow-hidden overscroll-none">
      {/* HEADER */}
      <div className="px-6 py-6 md:px-12 md:py-8 flex justify-between items-center border-b border-black flex-shrink-0 bg-white z-20">
        <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">CHECKOUT</h2>
        <button onClick={onClose} className="p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={scrollAreaRef}
        data-lenis-prevent
        className="flex-1 overflow-y-auto bg-white px-6 py-10 md:px-12 relative touch-pan-y no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="max-w-2xl mx-auto space-y-16 pb-32">

          {/* STEP 01: SHIPPING */}
          <div className={`space-y-8 transition-opacity duration-500 ${step === 'info' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <div className="flex items-center gap-4 border-b border-black pb-2">
              <span className="font-mono text-xs bg-black text-white px-2 py-1">01</span>
              <h3 className="font-heading text-xl uppercase tracking-widest">Shipping Details</h3>
            </div>

            <div className="grid gap-8">
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-gray-200 py-2 font-heading text-xl md:text-2xl uppercase tracking-wide focus:outline-none focus:border-black transition-colors rounded-none placeholder-gray-200"
                  placeholder="ENTER NAME"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">Contact Number</label>
                <input
                  type="tel"
                  className="w-full bg-transparent border-b border-gray-200 py-2 font-heading text-xl md:text-2xl uppercase tracking-wide focus:outline-none focus:border-black transition-colors rounded-none placeholder-gray-200"
                  placeholder="ENTER PHONE"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">Delivery Address</label>
                <textarea
                  rows={2}
                  className="w-full bg-transparent border-b border-gray-200 py-2 font-heading text-xl md:text-2xl uppercase tracking-wide focus:outline-none focus:border-black transition-colors rounded-none placeholder-gray-200 resize-none"
                  placeholder="FULL ADDRESS"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">Delivery Notes (Optional)</label>
                <textarea
                  rows={2}
                  className="w-full bg-transparent border-b border-gray-200 py-2 font-sans text-sm md:text-base uppercase focus:outline-none focus:border-black transition-colors rounded-none placeholder-gray-200 resize-none"
                  placeholder="Gate code, landmarks, etc."
                  value={formData.deliveryNotes}
                  onChange={e => setFormData({ ...formData, deliveryNotes: e.target.value })}
                />
              </div>
            </div>

            {step === 'info' && (
              <button
                onClick={() => { setStep('payment'); scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={!formData.name || !formData.phone || !formData.address}
                className="w-full bg-black text-white py-6 mt-8 font-heading text-lg uppercase tracking-widest hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 group"
              >
                Proceed to Payment
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* STEP 02: PAYMENT */}
          <div className={`space-y-8 transition-opacity duration-500 ${step === 'payment' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <div className="flex items-center gap-4 border-b border-black pb-2">
              <span className="font-mono text-xs bg-black text-white px-2 py-1">02</span>
              <h3 className="font-heading text-xl uppercase tracking-widest">Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-6 border flex flex-col items-start gap-4 transition-all text-left group ${paymentMethod === 'cash' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black/50'}`}
              >
                <Banknote className="w-8 h-8 stroke-1" />
                <div>
                  <h4 className="font-heading text-lg uppercase tracking-tight">Cash on Delivery</h4>
                  <p className="text-xs text-gray-500 font-mono mt-1">Pay when you receive.</p>
                </div>
                <div className={`w-4 h-4 rounded-full border border-black ml-auto mt-auto flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-black' : ''}`}>
                  {paymentMethod === 'cash' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('digital')}
                className={`p-6 border flex flex-col items-start gap-4 transition-all text-left group ${paymentMethod === 'digital' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black/50'}`}
              >
                <CreditCard className="w-8 h-8 stroke-1" />
                <div>
                  <h4 className="font-heading text-lg uppercase tracking-tight">Bank Transfer</h4>
                  <p className="text-xs text-gray-500 font-mono mt-1">Direct deposit or wallet.</p>
                </div>
                <div className={`w-4 h-4 rounded-full border border-black ml-auto mt-auto flex items-center justify-center ${paymentMethod === 'digital' ? 'bg-black' : ''}`}>
                  {paymentMethod === 'digital' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>
            </div>

            {paymentMethod === 'digital' && (
              <div className="space-y-8 pt-4 animate-fade-in">
                <div>
                  <p className="font-heading text-sm uppercase tracking-widest mb-4">Select Provider</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PROVIDERS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedProvider(p.id); setScreenshot(null); }}
                        className={`p-4 border transition-all text-center flex flex-col items-center justify-center gap-2 ${selectedProvider === p.id ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                      >
                        <span className="font-heading text-xs uppercase tracking-wider">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedProvider && (
                  <div className="bg-gray-50 p-6 border border-gray-200 space-y-6">
                    <div className="grid gap-4">
                      <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account Title</span>
                        <span className="font-mono text-sm uppercase">{PROVIDERS.find(p => p.id === selectedProvider)?.title}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm md:text-base font-bold tracking-wider">{PROVIDERS.find(p => p.id === selectedProvider)?.acc}</span>
                          <button onClick={() => navigator.clipboard.writeText(PROVIDERS.find(p => p.id === selectedProvider)?.acc || '')} className="text-gray-400 hover:text-black">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Proof of Payment</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full py-8 border border-dashed transition-all flex flex-col items-center justify-center gap-3 group ${screenshot ? 'border-black bg-white' : 'border-gray-300 hover:border-black hover:bg-white'}`}
                      >
                        {screenshot ? (
                          <div className="flex items-center gap-4 w-full px-6">
                            <img src={screenshot} alt="Receipt" className="w-12 h-12 object-cover border border-gray-200" />
                            <div className="text-left">
                              <span className="block font-heading text-sm uppercase">Receipt Attached</span>
                              <span className="block text-xs text-gray-400">Click to change</span>
                            </div>
                            <Check className="ml-auto w-5 h-5 text-black" />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                            <span className="font-heading text-xs uppercase tracking-widest text-gray-500 group-hover:text-black">Upload Screenshot</span>
                          </>
                        )}
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'payment' && (
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <button onClick={() => setStep('info')} className="flex-1 py-4 font-heading text-sm uppercase tracking-widest hover:underline text-gray-500 hover:text-black text-center">Back</button>
                <button
                  onClick={submitOrder}
                  disabled={isSubmitting || (paymentMethod === 'digital' && (!selectedProvider || !screenshot))}
                  className="flex-[2] bg-black text-white py-5 font-heading text-lg uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : `Pay Rs. ${totalPrice.toLocaleString()}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 md:px-12 md:py-8 border-t border-black bg-white flex justify-between items-center flex-shrink-0 z-30">
        <div>
          <p className="font-bold uppercase text-[9px] tracking-[0.2em] text-gray-400 mb-1">Total Amount</p>
          <p className="font-heading text-4xl md:text-5xl font-black tracking-tighter text-black leading-none">Rs. {totalPrice.toLocaleString()}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-bold uppercase text-[9px] tracking-[0.2em] text-gray-300">SECURE CHECKOUT</p>
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