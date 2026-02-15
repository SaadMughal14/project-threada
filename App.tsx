import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './pages/ProductDetail';
import CheckoutOverlay from './components/CheckoutOverlay';
import OrderSuccessOverlay from './components/OrderSuccessOverlay';

// Store & Data
import { useCartStore } from './src/store/cartStore';
import { PIZZAS } from './constants';

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

const Homepage = () => {
  return (
    <main>
      {/* Immersive Hero Section */}
      <section className="h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-black">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
            alt="Editorial Campaign"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="font-heading text-[12vw] leading-[0.85] mb-6 drop-shadow-xl">
            THREADA
            <br />
            ARCHIVE
          </h2>
          <Link to="/products/obsidian-tee" className="inline-block mt-8 bg-white text-black border border-white px-12 py-4 font-body text-sm font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-xl">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="py-24 px-4 md:px-6 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black/10 pb-6">
          <h3 className="font-heading text-4xl md:text-5xl">New Arrivals</h3>
          <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mt-4 md:mt-0">SS / 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
          {(!PIZZAS || PIZZAS.length === 0) && (
            <div className="col-span-full py-20 text-center text-xl text-gray-400 font-light">
              Archive Empty.
            </div>
          )}
          {PIZZAS && PIZZAS.map((product: any) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: parseInt(product.price.replace(/[^0-9]/g, '')),
                image: product.image,
                category: product.category
              }}
            />
          ))}
        </div>
      </section>

      {/* Footer / Statement */}
      <section className="py-32 bg-black text-white text-center px-4">
        <h2 className="font-heading text-4xl md:text-6xl mb-8">Defined by Void.</h2>
        <p className="font-body text-sm uppercase tracking-[0.3em] opacity-50">Est. 2026 • Global Shipping</p>
      </section>
    </main>
  );
};

const App: React.FC = () => {
  const { isOpen, items, getCartTotal, toggleCart, clearCart } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-[var(--cream-vanilla)] min-h-screen text-[var(--deep-basil)] font-body selection:bg-black selection:text-white">
      <Routes>
        <Route path="/" element={<><Header /><Homepage /></>} />
        <Route path="/products/:id" element={<><Header /><ProductDetail /></>} />

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

      {/* Cart Drawer - Minimalist */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div onClick={toggleCart} className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-8 flex justify-between items-center border-b border-gray-100">
            <h2 className="font-heading text-3xl">Cart ({items.length})</h2>
            <button onClick={toggleCart} className="text-xl hover:rotate-90 transition-transform">×</button>
          </div>
          <div className="flex-1 overflow-auto p-8 space-y-8">
            {items.length === 0 && (
              <p className="text-center text-gray-400 mt-20 font-light">Your bag is empty.</p>
            )}
            {items.map(item => (
              <div key={item.id} className="flex gap-6">
                <img src={item.image} className="w-24 h-32 object-cover bg-gray-100" style={{ aspectRatio: '4/5' }} />
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.size} — {item.color}</p>
                  </div>
                  <p className="font-bold text-lg">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
          {items.length > 0 && (
            <div className="p-8 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between mb-6 font-heading text-2xl">
                <span>Total</span>
                <span>${getCartTotal()}</span>
              </div>
              <button
                onClick={() => { toggleCart(); setIsCheckoutOpen(true); }}
                className="btn-primary w-full"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      <CheckoutOverlay
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={items}
        totalPrice={getCartTotal()}
        onOrderSuccess={() => { setIsCheckoutOpen(false); setShowSuccess(true); clearCart(); }}
        orderNotes=""
      />
      <OrderSuccessOverlay isOpen={showSuccess} onClose={() => setShowSuccess(false)} order={null} />
    </div>
  );
};

export default App;