
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
import AuthOverlay from './components/AuthOverlay';
import AdminDashboard from './components/AdminDashboard';
import StatusBar from './components/StatusBar';
import { PIZZAS, PizzaProductExtended, SizeOption } from './constants';
import { supabase } from './lib/supabase';

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

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Cookies');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const fetchDbProducts = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('is_visible', true);
      if (!error && data && data.length > 0) {
        // Hydrate DB products into standard format
        const hydrated = data.map(p => ({
          ...p,
          tagline: "FORGED BY GRAVITY",
          videoBackground: "",
          ingredients: p.ingredients || ["Handmade", "Fresh"],
          sizeOptions: p.size_options || [
            { name: "STANDARD", price: `Rs. ${p.price}` }
          ],
          image: p.image_url
        }));
        setDbProducts(hydrated);
      }
    };
    fetchDbProducts();
  }, [isAdminOpen]); // Refetch when admin closes in case of edits

  useEffect(() => {
    if (isCartOpen || isCheckoutOpen || showSuccess || isAuthOpen || isAdminOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isCartOpen, isCheckoutOpen, showSuccess, isAuthOpen, isAdminOpen]);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setUser({ ...session.user, profile });
      }
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setUser({ ...session.user, profile });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const receiptData = params.get('receipt');
    if (receiptData) {
      try {
        const decodedStr = decodeURIComponent(escape(atob(decodeURIComponent(receiptData))));
        const slim = JSON.parse(decodedStr);
        
        const hydratedItems = slim.items.map((item: any) => {
          const product = [...PIZZAS, ...dbProducts].find(p => p.id === item.id);
          if (!product) return null;
          return {
            ...product,
            quantity: item.q,
            selectedSize: product.sizeOptions.find(s => s.name === item.s) || product.sizeOptions[0]
          };
        }).filter(Boolean) as CartItem[];

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
        console.error("Failed receipt hydration", e);
      }
    }

    const lenis = new Lenis({ duration: 1.5, smoothWheel: true });
    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const checkScroll = () => {
      setScrolled(window.pageYOffset > 100);
      CATEGORIES.forEach(cat => {
        const el = document.getElementById(`category-${cat.name.toLowerCase().replace(/\s/g, '-')}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < 300 && rect.bottom > 300) setActiveCategory(cat.name);
        }
      });
    };

    lenis.on('scroll', checkScroll);
    setIsMounted(true);
    return () => lenis.destroy();
  }, [dbProducts.length]);

  const addToCart = (pizza: PizzaProductExtended, size: SizeOption) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === pizza.id && item.selectedSize.name === size.name);
      if (existing) return prev.map(item => (item.id === pizza.id && item.selectedSize.name === size.name) ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...pizza, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, sizeName: string, delta: number) => {
    setCart(prev => prev.map(item => (item.id === id && item.selectedSize.name === sizeName) ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const handleAccountClick = () => {
    if (user?.profile?.role === 'admin') {
      setIsAdminOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative w-full min-h-screen">
      <StatusBar activeOrder={activeOrder} onShowReceipt={() => setShowSuccess(true)} />
      
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-4 md:px-12 py-2 flex justify-between items-center ${activeOrder ? 'mt-8 md:mt-10' : ''} ${scrolled ? 'bg-[#FDFCFB]/95 backdrop-blur-xl border-b border-black/5 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="logo-spin-wrapper w-6 h-6 md:w-9 md:h-9">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm"><circle cx="50" cy="50" r="45" fill="#D97B8D" /><circle cx="35" cy="35" r="5" fill="#4A3728" /></svg>
          </div>
          <span className="font-display font-black text-lg md:text-2xl tracking-tighter uppercase">
            <span className="text-[#1C1C1C]">GRAV</span><span className="text-[#D97B8D]">ITY</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={handleAccountClick}
            className={`font-black uppercase text-[9px] md:text-[10px] tracking-widest px-4 py-2 rounded-full border-2 border-[#1C1C1C] transition-all hover:bg-[#1C1C1C] hover:text-white ${user ? 'bg-[#1C1C1C] text-white' : 'bg-transparent text-[#1C1C1C]'}`}
          >
            {user?.profile?.role === 'admin' ? 'ADMIN PANEL' : user ? 'MY ACCOUNT' : 'LOGIN'}
          </button>
          
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="bg-[#D97B8D] text-[#1C1C1C] px-4 md:px-6 py-1.5 rounded-full font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"
          >
            {window.innerWidth > 768 ? 'YOUR CART' : 'CART'} {totalItems > 0 && <span className="bg-[#1C1C1C] text-white px-1.5 rounded-full text-[8px] font-black">{totalItems}</span>}
          </button>
        </div>
      </header>

      {isMounted && (
        <>
          <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={() => {}} />
          <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
          <CheckoutOverlay isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cart} totalPrice={totalPrice} onOrderSuccess={(o) => { setActiveOrder(o); setCart([]); setIsCheckoutOpen(false); setShowSuccess(true); }} orderNotes={kitchenNotes} />
          <OrderSuccessOverlay isOpen={showSuccess} order={activeOrder} onClose={() => setShowSuccess(false)} />

          <div className={`fixed inset-0 z-[200] transition-all duration-500 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
            <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-[#1C1C1C] transform transition-transform duration-700 ease-expo-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]`}>
              <div className="p-6 md:p-10 flex justify-between items-center border-b border-white/5">
                <h2 className="font-display text-xl text-white font-black uppercase tracking-tighter">My Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-white/20 p-2 hover:text-[#D97B8D] transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 flex flex-col no-scrollbar">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 opacity-20 text-white space-y-4 text-center">
                    <p className="font-black uppercase tracking-[0.4em] text-[10px]">Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center group">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                      <div className="flex-1">
                        <div className="text-white font-black uppercase text-[10px] tracking-widest">{item.name}</div>
                        <div className="text-[#D97B8D] font-black uppercase text-[7px] tracking-[0.2em] mt-1">{item.selectedSize.name}</div>
                      </div>
                      <div className="flex items-center gap-3 text-[#D97B8D] font-black">
                        <button onClick={() => updateQuantity(item.id, item.selectedSize.name, -1)}>-</button>
                        <span className="text-[11px] text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedSize.name, 1)}>+</button>
                      </div>
                    </div>
                  ))
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
        {CATEGORIES.map(cat => (
          <div key={cat.name} id={`category-${cat.name.toLowerCase().replace(/\s/g, '-')}`}>
            <GustoRotator 
              onAddToCart={addToCart} 
              category={cat.name} 
              products={dbProducts.filter(p => p.category === cat.name).length > 0 ? dbProducts.filter(p => p.category === cat.name) : PIZZAS.filter(p => p.category === cat.name)} 
            />
          </div>
        ))}
        <MenuGrid />
        <TickerMarquee />
        <HandStory />
      </main>
    </div>
  );
};

export default App;
