import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import { Header } from './components/Header';
import { ProductDetail } from './pages/ProductDetail';
import CheckoutOverlay from './components/CheckoutOverlay';
import OrderSuccessOverlay from './components/OrderSuccessOverlay';
import { Footer } from './components/Footer';

// Pages
import { Homepage } from './pages/Homepage';
import { CategoryPage } from './pages/CategoryPage';
import { LoginPage } from './pages/LoginPage';

// Store & Data
import { useCartStore } from './src/store/cartStore';

// Backend Pages
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductList from './admin/ProductList';
import ProductForm from './admin/ProductForm';
import FulfillmentLogin from './fulfillment/FulfillmentLogin';
import FulfillmentLayout from './fulfillment/FulfillmentLayout';
import FulfillmentDashboard from './fulfillment/FulfillmentDashboard';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const { isOpen, items, getCartTotal, toggleCart, clearCart, removeItem, updateQuantity } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  // Scroll lock — position:fixed on body prevents background scroll.
  // Cart drawer is position:fixed itself, so its overflow-y-auto still works.
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [isOpen]);

  return (
    <div className="bg-white min-h-screen text-black font-body selection:bg-black selection:text-white">
      <Routes>
        <Route path="/" element={<><Header /><Homepage /><Footer /></>} />
        <Route path="/products/:id" element={<><Header /><ProductDetail /><Footer /></>} />

        {/* New Pages */}
        <Route path="/category/:category" element={<><Header /><CategoryPage /><Footer /></>} />
        <Route path="/login" element={<><Header /><LoginPage /><Footer /></>} />
        <Route path="/register" element={<><Header /><LoginPage /><Footer /></>} />

        <Route path="/admin-panel0/login" element={<AdminLogin />} />
        <Route path="/admin-panel0" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
        </Route>
        <Route path="/fulfillment" element={<FulfillmentLogin />} />
        <Route path="/fulfillment" element={<FulfillmentLayout />}>
          <Route path="dashboard" element={<FulfillmentDashboard />} />
        </Route>
      </Routes>

      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div onClick={toggleCart} className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

        {/* TEXTURE UPDATE: Changed bg-white to bg-[#FAFAFA] */}
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#FAFAFA] shadow-2xl transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

          {/* Header */}
          <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-200/60 flex-shrink-0 bg-white/50 backdrop-blur-sm">
            <h2 className="font-heading text-2xl md:text-3xl">Cart ({items.length})</h2>
            <button onClick={toggleCart} className="w-8 h-8 flex items-center justify-center text-xl hover:rotate-90 transition-transform text-black/60 hover:text-black">×</button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6" data-lenis-prevent>
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-500 font-medium text-lg mb-2">Your bag is empty.</p>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Add items to get started</p>
              </div>
            )}
            {items.map(item => (
              <div key={item.id} className="flex gap-4 md:gap-6 group">
                {/* Product Image */}
                <div className="w-20 h-24 md:w-24 md:h-28 bg-white flex-shrink-0 overflow-hidden shadow-sm border border-black/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm uppercase tracking-wide leading-tight truncate">{item.name}</h4>
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 text-lg leading-none opacity-0 group-hover:opacity-100 duration-200"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white border border-black/5 px-2 py-1 text-black/70 rounded-sm">Size: {item.size}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white border border-black/5 px-2 py-1 text-black/70 rounded-sm">Color: {item.color}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-black/10 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors text-black/60"
                      >
                        −
                      </button>
                      <span className="w-8 h-7 flex items-center justify-center text-xs font-bold border-x border-black/10">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors text-black/60"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-sm">${item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Order Notes (Darker Labels) */}
            {items.length > 0 && (
              <div className="pt-6 border-t border-black/5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 block mb-3">
                  Order Notes
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Special requests, gift wrapping, delivery instructions..."
                  rows={3}
                  className="w-full bg-white border border-black/10 p-3 text-sm font-medium resize-none focus:outline-none focus:border-black transition-colors placeholder:text-gray-400"
                />
              </div>
            )}

            {/* Clear Cart (Darker Link) */}
            {items.length > 0 && (
              <div className="mt-8 flex justify-center pb-2">
                {!showClearConfirm ? (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-0.5"
                  >
                    Clear Bag
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-white border border-red-100 shadow-sm px-4 py-2 rounded-md animate-fade-in">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-800">Clear all?</span>
                    <div className="flex gap-3 border-l border-red-100 pl-3">
                      <button
                        onClick={() => { clearCart(); setShowClearConfirm(false); }}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-black transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 md:p-8 border-t border-black/5 bg-white flex-shrink-0">
              <div className="flex justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Subtotal</span>
                <span className="font-heading text-2xl">${getCartTotal()}</span>
              </div>
              <button
                onClick={() => { toggleCart(); setIsCheckoutOpen(true); }}
                className="w-full bg-black text-white py-4 font-heading uppercase text-sm tracking-[0.2em] hover:bg-black/90 transition-all group flex items-center justify-between px-6"
              >
                <span>Checkout</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-medium">
                Shipping calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>

      <CheckoutOverlay
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={items}
        totalPrice={getCartTotal()}
        onOrderSuccess={(data) => { setIsCheckoutOpen(false); setLastOrder(data); setShowSuccess(true); clearCart(); setOrderNotes(''); }}
        orderNotes={orderNotes}
      />
      <OrderSuccessOverlay isOpen={showSuccess} onClose={() => setShowSuccess(false)} order={lastOrder} />


    </div>
  );
};

export default App;