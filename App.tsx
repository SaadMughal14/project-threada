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
import { Footer } from './components/Footer';

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
    <main className="px-4 md:px-6 max-w-[1920px] mx-auto pb-20">

      {/* Editorial Hero: Text Top / Image Bottom */}
      <section className="mb-16">
        <div className="flex justify-between items-start pt-4 pb-2 mb-2">
          <p className="w-1/3 text-xs md:text-sm font-bold leading-snug">
            In the whole summer show, this <br /> is the designer's best look yet. //
          </p>
          <p className="text-xs md:text-sm font-bold uppercase text-right leading-snug">
            05.11 <br /> 2026
          </p>
        </div>

        <div className="w-full h-[60vh] md:h-[85vh] overflow-hidden relative group">
          <img
            src="https://images.unsplash.com/photo-1523396870124-25b410e6a06c?q=80&w=2670&auto=format&fit=crop"
            className="w-full h-full object-cover grayscale transition-transform duration-[2s] group-hover:scale-105 group-hover:grayscale-0"
            alt="Hero Campaign"
          />
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="mb-20">
        <div className="border-t border-black mb-6"></div> {/* Heavy Line */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading text-4xl md:text-5xl uppercase font-black tracking-tighter">Best Seller</h2>
          <Link to="/" className="text-[10px] font-bold uppercase hover:underline flex items-center gap-2">
            See All <span className="text-xs">↗</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PIZZAS.slice(0, 3).map((product: any) => (
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
        <div className="border-b border-black mt-12"></div> {/* Heavy Line */}
      </section>

      {/* Latest Arrivals Section */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading text-4xl md:text-5xl uppercase font-black tracking-tighter">Latest Arrivals</h2>
          <Link to="/" className="text-[10px] font-bold uppercase hover:underline flex items-center gap-2">
            See All <span className="text-xs">↗</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PIZZAS.slice(3, 5).map((product: any) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="bg-[#F4F4F4] mb-4 aspect-[4/3] overflow-hidden relative">
                <img
                  src={product.image}
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold uppercase border-b border-gray-300 pb-2">
                <span>{product.name}</span>
                <span>{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fashion Category - Asymmetrical Grid */}
      <section className="mb-20">
        <div className="border-t border-black mb-6"></div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading text-4xl md:text-5xl uppercase font-black tracking-tighter">Fashion Category</h2>
          <div className="text-[10px] font-bold uppercase border border-gray-300 px-3 py-1 rounded-full cursor-pointer hover:border-black transition-colors flex items-center gap-2">
            Men's Fashion <span className="text-[8px]">▼</span>
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 mb-8 border-b border-gray-200 pb-8">
          {/* Card 1 */}
          <div className="relative group overflow-hidden h-[450px]">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-white p-4 flex justify-between items-center border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400">01</span>
                <span className="text-sm font-bold uppercase">Summer Style</span>
              </div>
              <span className="text-xs font-bold uppercase">Explore ↗</span>
            </div>
          </div>
          {/* Card 2 */}
          <div className="relative group overflow-hidden h-[450px]">
            <img src="https://images.unsplash.com/photo-1529139574466-a302c27e3844?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-white p-4 flex justify-between items-center border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400">02</span>
                <span className="text-sm font-bold uppercase">Art of Beat</span>
              </div>
              <span className="text-xs font-bold uppercase">Explore ↗</span>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 3 */}
          <div className="relative group overflow-hidden h-[350px]">
            <img src="https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur p-4 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500">03</span>
                <span className="text-sm font-bold uppercase">Street Style</span>
              </div>
              <span className="text-xs font-bold uppercase">Explore ↗</span>
            </div>
          </div>
          {/* Card 4 */}
          <div className="relative group overflow-hidden h-[350px]">
            <img src="https://images.unsplash.com/photo-1485230948943-b26a8d626ef9?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur p-4 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500">04</span>
                <span className="text-sm font-bold uppercase">Classic Elegant</span>
              </div>
              <span className="text-xs font-bold uppercase">Explore ↗</span>
            </div>
          </div>
        </div>
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
    <div className="bg-white min-h-screen text-black font-body selection:bg-black selection:text-white">
      <Routes>
        <Route path="/" element={<><Header /><Homepage /><Footer /></>} />
        <Route path="/products/:id" element={<><Header /><ProductDetail /><Footer /></>} />

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