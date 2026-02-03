import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PIZZAS, PizzaProductExtended, SizeOption } from '../constants';

const getIngredientEmoji = (name: string) => {
  const map: Record<string, string> = {
    "Dark Cacao": "🍫", "Sea Salt": "🧂", "Hazelnut": "🌰", "Liquid Ganache": "💧",
    "Pistachio": "🥜", "Browned Butter": "🧈", "White Chocolate": "🥛",
    "Espresso": "☕", "Fudge": "🍮", "Gold Leaf": "✨", "Charcoal Cacao": "🌑",
    "Vanilla Bean": "🌸", "Macadamia": "🌰", "Cane Sugar": "🍬", "Molasses": "🍯",
    "Ginger": "🫚", "Caramel": "🍮", "Spiced Honey": "🍯", "Lemon Curd": "🍋",
    "Butter": "🧈", "Sugar Shell": "🐚", "Citrus Zest": "🍊", "Crimson Cocoa": "🍰",
    "Mascarpone": "🥛", "Marshmallow": "🍡", "Vanilla Root": "🌱", "Oat Cream": "🥛",
    "Smoked Maple": "🍁", "Charcoal Ice": "🧊", "Cookie Ends": "🍪", "Butter Dust": "🧈",
    "Dark Sugar": "🍬"
  };
  return map[name] || "✨";
};

const PizzaSection: React.FC<{ 
  pizza: PizzaProductExtended, 
  index: number,
  onAddToCart: (p: PizzaProductExtended, s: SizeOption) => void 
}> = ({ pizza, index, onAddToCart }) => {
  const container = useRef<HTMLDivElement>(null);
  const pizzaRef = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(pizza.sizeOptions[0]);
  const isEven = index % 2 === 0;

  const isLightBg = ['vanilla', 'lemon', 'sea-salt-crusts'].includes(pizza.id);
  const textColor = isLightBg ? 'text-[#1C1C1C]' : 'text-[#FDFCFB]';

  useGSAP(() => {
    gsap.to(pizzaRef.current, {
      rotation: isEven ? 10 : -10,
      scale: 1.02,
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      }
    });
  }, { scope: container });

  return (
    <section 
      ref={container} 
      className="min-h-[50dvh] md:min-h-[70vh] w-full flex items-center justify-center px-4 md:px-24 py-8 md:py-16 relative overflow-hidden"
      style={{ backgroundColor: pizza.color }}
    >
      <div className={`flex flex-col w-full max-w-5xl items-center gap-6 md:gap-16 z-10 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        <div className="flex-1 flex justify-center w-full">
          <div 
            ref={pizzaRef}
            className="w-[50vw] h-[50vw] md:w-[25vw] md:h-[25vw] max-w-[260px] max-h-[260px] rounded-xl md:rounded-[2.5rem] shadow-xl border-[6px] md:border-[10px] border-white/5 overflow-hidden will-change-transform"
          >
            <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover scale-[1.1]" />
          </div>
        </div>

        <div className={`flex-1 ${textColor} space-y-3 md:space-y-6 text-center ${isEven ? 'md:text-left' : 'md:text-right'}`}>
          <div className="space-y-1.5">
            <span className="inline-block px-2 py-0.5 bg-black/10 text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] rounded-full">{pizza.tagline}</span>
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.85]">{pizza.name}</h2>
          </div>
          
          <p className="text-xs md:text-base opacity-70 max-w-sm mx-auto md:mx-0 font-medium leading-relaxed">{pizza.description}</p>
          
          <div className={`flex flex-wrap gap-1 md:gap-2 justify-center ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
            {pizza.ingredients.map(ing => (
              <span key={ing} className="px-2 py-1 md:px-3 md:py-2 bg-white/5 border border-white/10 rounded-lg text-[7px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1 backdrop-blur-sm">
                {getIngredientEmoji(ing)} {ing}
              </span>
            ))}
          </div>

          <div className={`space-y-3 pt-2 ${isEven ? 'md:items-start' : 'md:items-end'} flex flex-col items-center`}>
            <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] opacity-40">Select Serving</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {pizza.sizeOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => setSelectedSize(option)}
                  className={`px-3 md:px-5 py-2 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                    selectedSize.name === option.name
                      ? 'bg-[#D97B8D] border-[#D97B8D] text-[#1C1C1C] shadow-lg scale-105'
                      : 'bg-white/5 border-white/10 hover:border-white/30 text-white opacity-60'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          <div className={`flex items-center gap-4 pt-4 justify-center ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
            <span className="text-4xl md:text-6xl font-display font-black text-[#D97B8D] tracking-tighter leading-none">{selectedSize.price}</span>
            <button onClick={() => onAddToCart(pizza, selectedSize)} className="bg-[#D97B8D] text-[#1C1C1C] px-6 md:px-10 py-2.5 md:py-4 rounded-full font-black uppercase text-[9px] md:text-[11px] tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-md">Add to Cart</button>
          </div>
        </div>
      </div>
    </section>
  );
};

const GustoRotator: React.FC<{ 
  onAddToCart: (p: PizzaProductExtended, s: SizeOption) => void, 
  category: string 
}> = ({ onAddToCart, category }) => {
  const filteredProducts = PIZZAS.filter(p => p.category === category);
  if (filteredProducts.length === 0) return null;

  return (
    <div className="w-full bg-[#1C1C1C]">
      <div className="py-8 md:py-16 bg-black/40 text-center border-y border-white/5 relative overflow-hidden">
         <h3 className="font-display text-[10vw] md:text-[8vw] text-white font-black uppercase tracking-tighter opacity-[0.015] leading-none absolute inset-0 flex items-center justify-center select-none pointer-events-none">{category}</h3>
         <div className="relative z-10 px-6">
            <h4 className="font-display text-2xl md:text-4xl text-[#D97B8D] font-black uppercase tracking-tighter">{category} Collection</h4>
            <p className="font-black text-white/10 uppercase text-[7px] tracking-0.4em mt-1.5">GRAVITY CORE STUDIO</p>
         </div>
      </div>
      {filteredProducts.map((pizza, i) => (
        <PizzaSection key={pizza.id} pizza={pizza} index={i} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default GustoRotator;