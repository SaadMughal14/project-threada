import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Phase 3 Components
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './pages/ProductDetail';
import CheckoutOverlay from './components/CheckoutOverlay'; // Keeping existing checkout for now
import OrderSuccessOverlay from './components/OrderSuccessOverlay';
import StatusBar from './components/StatusBar';

// Hooks/Store
import { useCartStore } from './src/store/cartStore';
import { PIZZAS } from './constants'; // Mock data

// Admin/Kitchen (Legacy routes kept intact)
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
    <main className="pt-24 px-4 md:px-6 max-w-[1600px] mx-auto">
      {/* Hero Section */}
      <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[60vh] md:h-[80vh] bg-gray-200 relative overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2788&auto=format&fit=crop"
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
            alt="Hero 1"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="font-heading text-6xl text-white mix-blend-difference">ESSENTIALS</h2>
          </div>
        </div>
        <div className="h-[60vh] md:h-[80vh] bg-gray-300 relative overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2787&auto=format&fit=crop"
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
            alt="Hero 2"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="font-heading text-6xl text-white mix-blend-difference">AVANT-GARDE</h2>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h3 className="font-heading text-3xl">Latest Drops</h3>
          <span className="font-body text-xs font-bold uppercase tracking-widest border-b border-black pb-1">View All</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 gap-y-12">
          {PIZZAS.slice(0, 8).map((product) => (
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

      {/* Footer Space */}
      <div className="h-40" />
    </main>
  );
};

const App: React.FC = () => {
  const { isOpen, items, getCartTotal, toggleCart, clearCart } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-[var(--cream-vanilla)] min-h-screen text-[var(--deep-basil)] font-body">
      <Routes>
        {/* Main Storefront Routes */}
        <Route path="/" element={
          <>
            <Header />
            <Homepage />
          </>
        } />
        <Route path="/products/:id" element={
          <>
            <Header />
            <ProductDetail />
          </>
        } />

        {/* Admin & Fulfillment (Legacy/Refactored) */}
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

      {/* Global Overlays */}
      <div className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {/* Cart Drawer */}
        <div className={`pointer-events-auto absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="font-heading text-2xl">Cart ({items.length})</h2>
            <button onClick={toggleCart} className="text-xl">×</button>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 mb-6">
                <img src={item.image} className="w-20 h-24 object-cover bg-gray-100" />
                <div>
                  <h4 className="font-bold text-sm uppercase">{item.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{item.size} / {item.color}</p>
                  <p className="font-bold">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>Total</span>
              <span>${getCartTotal()}</span>
            </div>
            <button
              onClick={() => { toggleCart(); setIsCheckoutOpen(true); }}
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest"
            >
              Checkout
            </button>
          </div>
        </div>
        {/* Backdrop */}
        <div onClick={toggleCart} className={`pointer-events-auto absolute inset-0 bg-black/20 -z-10 ${isOpen ? 'block' : 'hidden'}`} />
      </div>

      <CheckoutOverlay
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={items}
        totalPrice={getCartTotal()}
        onOrderSuccess={() => { setIsCheckoutOpen(false); setShowSuccess(true); clearCart(); }}
        orderNotes=""
      />

      <OrderSuccessOverlay
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        order={null}
      />

    </div>
  );
};

export default App;