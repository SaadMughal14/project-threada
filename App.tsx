
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
import { PIZZAS, PizzaProductExtended } from './constants';

gsap.registerPlugin(ScrollTrigger);

interface CartItem extends PizzaProductExtended {
  quantity: number;
}

const CATEGORIES = [
  { name: 'Cookies', icon: '🍪' },
  { name: 'Brownies', icon: '🍫' },
  { name: 'Cakes', icon: '🍰' },
  { name: 'Coffee & Tea', icon: '☕' },
  { name: 'Sides', icon: '🧂' }
] as const;

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Cookies');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true 
    });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    lenis.on('scroll', (e: any) => {
      setScrolled(e.scroll > 60);
      
      CATEGORIES.forEach(cat => {
        const el = document.getElementById(`category-${cat.name.toLowerCase().replace(/\s/g, '-')}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < 300 && rect.bottom > 300) {
            setActiveCategory(cat.name);
          }
        }
      });
    });

    return () => { lenis.destroy(); };
  }, []);

  // Auto-scroll mobile navbar to active category
  useEffect(() => {
    const activeBtn = categoryRefs.current[activeCategory];
    const nav = categoryNavRef.current;
    if (activeBtn && nav) {
      const navWidth = nav.offsetWidth;
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      
      const scrollPos = btnLeft - (navWidth / 2) + (btnWidth / 2);
      nav.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    setTotalPrice(cart.reduce((acc, item) => acc + (parseInt(item.price.replace('$', '')) * item.quantity), 0));
  }, [cart]);

  const addToCart = (pizza: PizzaProductExtended) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === pizza.id);
      if (existing) return prev.map(item => item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...pizza, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const scrollToCategory = (cat: string) => {
    const el = document.getElementById(`category-${cat.toLowerCase().replace(/\s/g, '-')}`);
    if (el) {
      const offset = window.innerWidth < 768 ? 80 : 100;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const CookieLogo = () => (
    <div className="logo-spin-wrapper w-6 h-6 md:w-9 md:h-9">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        <circle cx="50" cy="50" r="45" fill="#D4AF37" />
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
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-4 md:px-12 py-2 flex justify-between items-center ${scrolled ? 'bg-[#FDFCFB]/95 backdrop-blur-xl border-b border-black/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <CookieLogo />
          <span className="font-display font-black text-lg md:text-2xl tracking-tighter uppercase transition-colors">
            <span className={scrolled ? "text-[#1C1C1C]" : "text-[#FDFCFB]"}>GRAV</span><span className="text-[#D4AF37]">ITY</span>
          </span>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)} 
          className={`bg-[#D4AF37] text-[#1C1C1C] px-4 md:px-6 py-1.5 rounded-full font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 ${totalItems > 0 ? 'animate-wiggle' : ''}`}
        >
          {window.innerWidth > 768 ? 'YOUR CART' : 'CART'} {totalItems > 0 && <span className="bg-[#1C1C1C] text-white px-1.5 rounded-full text-[8px] font-black">{totalItems}</span>}
        </button>
      </header>

      {/* Ultra Thinner Slider Bar */}
      <nav className={`fixed top-[44px] md:top-[56px] left-0 w-full z-[90] transition-all duration-500 border-b border-black/5 ${scrolled ? 'bg-[#FDFCFB] translate-y-0' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div 
          ref={categoryNavRef}
          className="max-w-7xl mx-auto px-2 py-1.5 category-scrollbar flex items-center justify-start md:justify-center gap-2 md:gap-4 overflow-x-auto"
        >
           {CATEGORIES.map(cat => (
             <button 
               key={cat.name} 
               ref={(el) => { categoryRefs.current[cat.name] = el; }}
               onClick={() => scrollToCategory(cat.name)}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-widest transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeCategory === cat.name ? 'bg-[#1C1C1C] text-[#D4AF37] shadow-sm scale-105' : 'text-[#1C1C1C]/40 hover:text-[#1C1C1C] hover:bg-black/5'}`}
             >
               <span className="text-sm md:text-base">{cat.icon}</span>
               {cat.name}
             </button>
           ))}
        </div>
      </nav>

      <CheckoutOverlay isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cart} totalPrice={totalPrice} onOrderSuccess={() => {setCart([]); setIsCheckoutOpen(false);}} orderNotes="" />

      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-[200] transition-opacity duration-600 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-[#1C1C1C] transform transition-transform duration-700 ease-expo-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-6 md:p-10 flex justify-between items-center border-b border-white/5">
            <h2 className="font-display text-xl text-white font-black uppercase tracking-tighter">Cart Details</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-white/20 p-2 hover:text-[#D4AF37] transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
             {cart.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full opacity-20 text-white space-y-4 text-center">
                 <span className="text-6xl">🛒</span>
                 <p className="font-black uppercase tracking-[0.4em] text-[10px]">Your cart is empty.</p>
               </div>
             ) : (
               cart.map(item => (
                 <div key={item.id} className="flex gap-4 items-center group">
                   <img src={item.image} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                   <div className="flex-1 text-white font-black uppercase text-[10px] tracking-widest leading-tight">{item.name}</div>
                   <div className="flex items-center gap-3 text-[#D4AF37] font-black">
                     <button onClick={() => updateQuantity(item.id, -1)} className="hover:scale-125 transition-transform">-</button>
                     <span className="text-[11px] text-white bg-white/5 px-2 py-1 rounded-lg">{item.quantity}</span>
                     <button onClick={() => updateQuantity(item.id, 1)} className="hover:scale-125 transition-transform">+</button>
                   </div>
                 </div>
               ))
             )}
          </div>
          <div className="p-6 md:p-10 border-t border-white/5 bg-black/40 space-y-6">
             <div className="flex justify-between items-end text-white/40 font-black uppercase text-[10px] tracking-[0.5em]">
               <span>Total Price</span>
               <span className="text-3xl text-[#D4AF37] tracking-tighter font-display leading-none">${totalPrice}</span>
             </div>
             <button disabled={cart.length === 0} onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-[#D4AF37] text-[#1C1C1C] py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.4em] shadow-xl disabled:opacity-20 active:scale-95 transition-all">Checkout</button>
          </div>
        </div>
      </div>

      <main>
        <Hero />
        
        <section className="bg-[#1C1C1C] py-8 md:py-16 text-center border-b border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none"></div>
           <div className="px-6 md:px-12">
             <h2 className="font-display text-[7vw] md:text-[4vw] text-white uppercase font-black tracking-tighter leading-none relative z-10">
                SCULPTED BY HEAT.<br/><span className="text-[#D4AF37]">DEFINED BY GRAVITY.</span>
             </h2>
           </div>
        </section>

        {CATEGORIES.map(cat => (
          <div key={cat.name} id={`category-${cat.name.toLowerCase().replace(/\s/g, '-')}`}>
            <GustoRotator onAddToCart={addToCart} category={cat.name} />
          </div>
        ))}

        <MenuGrid />
        <TickerMarquee />
        <HandStory />

        <footer className="bg-[#1C1C1C] text-[#FDFCFB] pt-16 pb-10 px-6 md:px-24 overflow-hidden border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-24">
              <div className="space-y-4">
                <p className="font-bold text-[8px] uppercase tracking-[0.6em] text-[#D4AF37]">Coordinates</p>
                <p className="font-black text-base lg:text-xl leading-tight opacity-90">102 S Bronough St,<br/>Tallahassee, FL 32301</p>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-[8px] uppercase tracking-[0.6em] text-[#D4AF37]">Connect</p>
                <div className="flex flex-col gap-2 font-black text-base md:text-lg">
                  <a href="#" className="hover:text-[#D4AF37] transition-all underline underline-offset-4 decoration-[#D4AF37]/20">Instagram</a>
                  <a href="#" className="hover:text-[#D4AF37] transition-all underline underline-offset-4 decoration-[#D4AF37]/20">Facebook</a>
                </div>
              </div>
              <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                <p className="font-bold text-[8px] uppercase tracking-[0.6em] text-[#D4AF37]">Studio</p>
                <p className="text-[12px] font-bold opacity-30 leading-relaxed max-w-xs italic">
                  "Every batch is a sculpture. Every selection is an event. Perfected by time."
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[7px] uppercase font-black tracking-[0.6em]">
              <p className="opacity-15">©2025 GRAVITY STUDIO</p>
              <a href="https://saad-mughal-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-black border border-[#D4AF37]/30 px-6 py-2.5 rounded-full text-[#D4AF37] text-[7px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-[#1C1C1C] transition-all">
                 Curated by Saad
              </a>
              <p className="opacity-15">Tallahassee, FL</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
