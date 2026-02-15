import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './components/Hero';
import MenuGrid from './components/MenuGrid';
import TickerMarquee from './components/TickerMarquee';
import HandStory from './components/HandStory';
import GustoRotator from './components/GustoRotator';
import CheckoutOverlay from './components/CheckoutOverlay';
import OrderSuccessOverlay from './components/OrderSuccessOverlay';
import StatusBar from './components/StatusBar';
import { PIZZAS, PizzaProductExtended, SizeOption } from './constants';
import { useProducts } from './hooks/useProducts';

gsap.registerPlugin(ScrollTrigger);

interface CartItem extends PizzaProductExtended {
  quantity: number;
  selectedSize: SizeOption;
}

interface OrderDetails {
  id: string;
  items: CartItem[];
  total: number;
  customer: { name: string; phone: string; address: string; deliveryNotes: string };
  kitchenInstructions: string;
  paymentMethod: 'cash' | 'digital';
  timestamp: string;
  placedAt: number;
}

const CATEGORIES = [
  { name: 'Cookies', icon: '🍪', type: 'emoji' },
  { name: 'Brownies', icon: 'https://i.imgur.com/n39ZKfy.png', type: 'image' },
  { name: 'Cakes', icon: '🍰', type: 'emoji' },
  { name: 'Coffee & Tea', icon: '☕', type: 'emoji' },
  { name: 'Sides', icon: 'https://i.imgur.com/5weD7SB.png', type: 'image' }
] as const;

const CartVisualCookie = () => (
  <div className="relative w-24 h-24 mx-auto mb-4 animate-bounce-slow">
    <div className="absolute inset-0 bg-[#D97B8D]/20 blur-2xl rounded-full animate-pulse"></div>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl logo-spin-wrapper">
      <circle cx="50" cy="50" r="45" fill="#D97B8D" />
      <circle cx="30" cy="30" r="6" fill="#4A3728" />
      <circle cx="70" cy="35" r="7" fill="#4A3728" />
      <circle cx="45" cy="70" r="8" fill="#4A3728" />
      <circle cx="75" cy="75" r="5" fill="#4A3728" />
      <circle cx="20" cy="60" r="4" fill="#4A3728" />
    </svg>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/20 blur-md rounded-full"></div>
  </div>
);

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Cookies');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Fetch products from Supabase (falls back to mock data)
  const { products } = useProducts();

  const categoryNavRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (isCartOpen || isCheckoutOpen || showSuccess) {
      // Robust mobile scroll lock
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      // Also lock html
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Retrieve scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      // Restore scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [isCartOpen, isCheckoutOpen, showSuccess]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const receiptData = params.get('receipt');
    if (receiptData) {
      try {
        const decodedStr = decodeURIComponent(escape(atob(decodeURIComponent(receiptData))));
        const slim = JSON.parse(decodedStr);

        const hydratedItems = slim.items.map((item: any) => {
          // Try to find product for extra details (image/category), but rely on URL data for core info
          const product = PIZZAS.find(p => p.id === item.id) || products.find(p => p.id === item.id);

          return {
            id: item.id,
            name: item.n || product?.name || 'Unknown Item', // Use embedded name first
            quantity: item.q,
            selectedSize: { name: item.s, price: '0' }, // Price is aggregate in slim.p, size name is preserved
            // Optional/Fallback fields
            tagline: product?.tagline || '',
            description: product?.description || '',
            price: '0', // Not used in receipt view (total is used)
            color: product?.color || '#1C1C1C',
            ingredients: product?.ingredients || [],
            image: product?.image || '',
            videoBackground: '',
            category: product?.category || 'Custom',
            sizeOptions: []
          } as CartItem;
        });

        const hydratedOrder: OrderDetails = {
          id: slim.id,
          items: hydratedItems,
          total: slim.p,
          customer: {
            name: slim.c.n,
            phone: slim.c.p,
            address: slim.c.a,
            deliveryNotes: slim.c.d
          },
          kitchenInstructions: slim.kn,
          paymentMethod: slim.pm,
          timestamp: slim.t,
          placedAt: slim.at || Date.now()
        };

        setActiveOrder(hydratedOrder);
        setShowSuccess(true);
      } catch (e) {
        console.error("Failed to load/hydrate receipt from URL", e);
      }
    }

    // High performance smooth scroll initialization
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Synchronize ScrollTrigger with Lenis raf loop for maximum smoothness
    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update(); // Force recalculation every frame
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const checkScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(currentScroll > 100); // Increased threshold slightly for better hero exit

      CATEGORIES.forEach(cat => {
        const el = document.getElementById(`category-${cat.name.toLowerCase().replace(/\s/g, '-')}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < 300 && rect.bottom > 300) {
            setActiveCategory(cat.name);
          }
        }
      });
    };

    lenis.on('scroll', checkScroll);
    checkScroll();

    setIsMounted(true);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const activeBtn = categoryRefs.current[activeCategory];
    const nav = categoryNavRef.current;
    if (activeBtn && nav) {
      const navWidth = nav.offsetWidth;
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const scrollPos = btnLeft - (navWidth / 2) + (btnWidth / 2);
      nav.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [activeCategory]);

  useEffect(() => {
    setTotalPrice(cart.reduce((acc, item) => {
      const numericPrice = parseInt(item.selectedSize.price.replace(/[^\d]/g, ''));
      return acc + (numericPrice * item.quantity);
    }, 0));
  }, [cart]);

  const addToCart = (pizza: PizzaProductExtended, size: SizeOption) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === pizza.id && item.selectedSize.name === size.name);
      if (existing) {
        return prev.map(item =>
          (item.id === pizza.id && item.selectedSize.name === size.name)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...pizza, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, sizeName: string, delta: number) => {
    setCart(prev => prev.map(item =>
      (item.id === id && item.selectedSize.name === sizeName)
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const handleOrderComplete = (orderData: OrderDetails) => {
    setActiveOrder(orderData);
    setCart([]);
    setKitchenNotes('');
    setIsCheckoutOpen(false);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    if (window.location.search.includes('receipt')) {
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  };

  const scrollToCategory = (cat: string) => {
    const el = document.getElementById(`category-${cat.toLowerCase().replace(/\s/g, '-')}`);
    if (el) {
      const offset = window.innerWidth < 768 ? 120 : 140;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const CookieLogo = () => (
    <div className="logo-spin-wrapper w-6 h-6 md:w-9 md:h-9">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        <circle cx="50" cy="50" r="45" fill="#D97B8D" />
        <circle cx="35" cy="35" r="5" fill="#4A3728" />
        <circle cx="65" cy="40" r="6" fill="#4A3728" />
        <circle cx="45" cy="65" r="7" fill="#4A3728" />
        <circle cx="70" cy="70" r="4" fill="#4A3728" />
        <circle cx="25" cy="60" r="4" fill="#4A3728" />
      </svg>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen">
      <StatusBar activeOrder={activeOrder} onShowReceipt={() => setShowSuccess(true)} />

      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-4 md:px-12 h-[52px] md:h-auto md:py-2 flex justify-between items-center ${activeOrder ? 'mt-8 md:mt-10' : ''} ${scrolled ? 'bg-[#FDFCFB]/95 backdrop-blur-xl border-b border-black/5 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <CookieLogo />
          <span className="font-display font-black text-lg md:text-2xl tracking-tighter uppercase transition-colors">
            <span className={scrolled ? "text-[#1C1C1C]" : "text-[#1C1C1C]"}>GRAV</span><span className="text-[#D97B8D]">ITY</span>
          </span>
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className={`bg-[#D97B8D] text-[#1C1C1C] px-4 md:px-6 py-1.5 rounded-full font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 ${totalItems > 0 ? 'animate-wiggle' : ''}`}
        >
          {window.innerWidth > 768 ? 'YOUR CART' : 'CART'} {totalItems > 0 && <span className="bg-[#1C1C1C] text-white px-1.5 rounded-full text-[8px] font-black">{totalItems}</span>}
        </button>
      </header>

      {/* Category Nav - Strict conditional rendering and positioning to prevent flicker */}
      {isMounted && (
        <nav
          style={{ display: scrolled ? 'block' : 'none' }}
          className={`fixed top-[44px] md:top-[56px] left-0 w-full z-[90] border-b border-black/5 ${activeOrder ? 'mt-8 md:mt-10' : ''} 
            ${scrolled
              ? 'bg-[#FDFCFB] translate-y-0 opacity-100 visible transition-all duration-500'
              : '-translate-y-full opacity-0 invisible pointer-events-none'
            }`}
        >
          <div
            ref={categoryNavRef}
            className="max-w-7xl mx-auto px-2 py-1.5 category-scrollbar flex items-center justify-start md:justify-center gap-2 md:gap-4 overflow-x-auto"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                ref={(el) => { categoryRefs.current[cat.name] = el; }}
                onClick={() => scrollToCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-widest transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeCategory === cat.name ? 'bg-[#1C1C1C] text-[#D97B8D] shadow-sm scale-105' : 'text-[#1C1C1C]/40 hover:text-[#1C1C1C] hover:bg-black/5'}`}
              >
                {cat.type === 'image' ? (
                  <img src={cat.icon} alt={cat.name} className="w-4 h-4 md:w-6 md:h-6 object-contain" />
                ) : (
                  <span className="text-sm md:text-base">{cat.icon}</span>
                )}
                {cat.name}
              </button>
            ))}
          </div>
        </nav>
      )}

      {isMounted && (
        <>
          <CheckoutOverlay
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cart}
            totalPrice={totalPrice}
            onOrderSuccess={(orderData) => handleOrderComplete(orderData)}
            orderNotes={kitchenNotes}
          />

          <OrderSuccessOverlay
            isOpen={showSuccess}
            order={activeOrder}
            onClose={handleCloseSuccess}
          />

          <div className={`fixed inset-0 z-[200] transition-all duration-500 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
            <div
              className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-600 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setIsCartOpen(false)}
            ></div>

            <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-[#1C1C1C] transform transition-transform duration-700 ease-expo-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]`}>
              <div className="p-6 md:p-10 flex justify-between items-center border-b border-white/5">
                <h2 className="font-display text-xl text-white font-black uppercase tracking-tighter">My Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-white/20 p-2 hover:text-[#D97B8D] transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 flex flex-col no-scrollbar">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 opacity-20 text-white space-y-4 text-center">
                    <CartVisualCookie />
                    <p className="font-black uppercase tracking-[0.4em] text-[10px]">Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <CartVisualCookie />
                    {cart.map((item, idx) => (
                      <div key={`${item.id}-${item.selectedSize.name}-${idx}`} className="flex gap-4 items-center group animate-in slide-in-from-right duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                        <img src={item.image} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <div className="flex-1">
                          <div className="text-white font-black uppercase text-[10px] tracking-widest leading-tight">{item.name}</div>
                          <div className="text-[#D97B8D] font-black uppercase text-[7px] tracking-[0.2em] mt-1 opacity-70">{item.selectedSize.name}</div>
                        </div>
                        <div className="flex items-center gap-3 text-[#D97B8D] font-black">
                          <button onClick={() => updateQuantity(item.id, item.selectedSize.name, -1)} className="hover:scale-125 transition-transform">-</button>
                          <span className="text-[11px] text-white bg-white/5 px-2 py-1 rounded-lg">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.selectedSize.name, 1)} className="hover:scale-125 transition-transform">+</button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-6 border-t border-white/5 space-y-3">
                      <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/40">Kitchen Instructions</p>
                      <textarea
                        value={kitchenNotes}
                        onChange={(e) => setKitchenNotes(e.target.value)}
                        placeholder="ANY SPECIAL REQUESTS FOR THE CHEF?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-black uppercase text-[10px] tracking-widest focus:border-[#D97B8D] transition-colors resize-none h-24"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-10 border-t border-white/5 bg-black/40 space-y-6">
                <div className="flex justify-between items-end text-white/40 font-black uppercase text-[10px] tracking-[0.5em]">
                  <span>Total</span>
                  <span className="text-2xl text-[#D97B8D] tracking-tighter font-display leading-none">Rs. {totalPrice}</span>
                </div>
                <button disabled={cart.length === 0} onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-[#D97B8D] text-[#1C1C1C] py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.4em] shadow-xl disabled:opacity-20 active:scale-95 transition-all">Checkout</button>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="will-change-transform">
        <Hero />
        <section className="bg-[#1C1C1C] py-8 md:py-16 text-center border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,123,141,0.05)_0%,transparent_70%)] pointer-events-none"></div>
          <div className="px-6 md:px-12">
            <h2 className="font-display text-[7vw] md:text-[4vw] text-white uppercase font-black tracking-tighter leading-none relative z-10">
              FRESH COOKIES.<br /><span className="text-[#D97B8D]">BAKED DAILY.</span>
            </h2>
          </div>
        </section>
        {CATEGORIES.map(cat => (
          <div key={cat.name} id={`category-${cat.name.toLowerCase().replace(/\s/g, '-')}`}>
            <GustoRotator onAddToCart={addToCart} category={cat.name} products={products} />
          </div>
        ))}
        <MenuGrid />
        <TickerMarquee />
        <HandStory />
        <footer className="bg-[#1C1C1C] text-[#FDFCFB] pt-16 pb-10 px-6 md:px-24 overflow-hidden border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-24">
              <div className="space-y-4">
                <p className="font-bold text-[8px] uppercase tracking-[0.6em] text-[#D97B8D]">Location</p>
                <p className="font-black text-base lg:text-xl leading-tight opacity-90">Phase 6, DHA,<br />Karachi, Pakistan</p>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-[8px] uppercase tracking-[0.6em] text-[#D97B8D]">Socials</p>
                <div className="flex flex-col gap-2 font-black text-base md:text-lg">
                  <a href="#" className="hover:text-[#D97B8D] transition-all underline underline-offset-4 decoration-[#D97B8D]/20">Instagram</a>
                  <a href="#" className="hover:text-[#D97B8D] transition-all underline underline-offset-4 decoration-[#D97B8D]/20">Facebook</a>
                </div>
              </div>
              <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                <p className="font-bold text-[8px] uppercase tracking-[0.6em] text-[#D97B8D]">Studio</p>
                <p className="text-[12px] font-bold opacity-30 leading-relaxed max-w-xs italic">
                  "Every batch is handmade. Fresh products baked daily."
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[7px] uppercase font-black tracking-[0.6em]">
              <p className="opacity-15">©2025 GRAVITY STUDIO</p>
              <a
                href="https://saadmughal.space"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 px-6 py-3 rounded-full text-white/60 text-[8px] font-black uppercase tracking-[0.2em] hover:border-[#D97B8D]/50 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(217,123,141,0.2)]"
              >
                Developed with <span className="text-red-500 animate-pulse">❤️</span> by Saad
              </a>
              <p className="opacity-15">Karachi, PK</p>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;