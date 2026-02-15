import { ProductVariant } from './types';

// ... (previous products)

export interface FashionProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  color: string;
  materials: string[];
  image: string;
  videoBackground: string;
  category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Accessories' | 'Footwear';
  gender: 'Man' | 'Woman' | 'Kids' | 'Unisex'; // New field
  variants?: ProductVariant[];
}

export const PRODUCTS: FashionProduct[] = [
  // EXISTING (Updated with Gender)
  {
    id: 'obsidian-tee',
    name: "Obsidian Heavyweight Tee",
    category: 'Tops',
    gender: 'Man',
    tagline: "Structure & Void",
    description: "A 280gsm heavyweight cotton t-shirt with a boxy fit and drop shoulders. Garment dyed in deep obsidian.",
    price: "$120",
    color: "#1C1C1C",
    materials: ["100% Cotton", "Pre-shrunk", "Garment Dyed"],
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'slate-cargo',
    name: "Tactical Slate Cargo",
    category: 'Bottoms',
    gender: 'Man',
    tagline: "Utility Evolved",
    description: "Technical nylon blend cargos with articulated knees and magnetic closure pockets.",
    price: "$280",
    color: "#64748B",
    materials: ["Nylon Blend", "Water Resistant", "YKK Zippers"],
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'nebula-jacket',
    name: "Nebula Shell Jacket",
    category: 'Outerwear',
    gender: 'Unisex',
    tagline: "Atmospheric Protection",
    description: "3-layer waterproof shell with taped seams and an iridescent finish.",
    price: "$450",
    color: "#0F172A",
    materials: ["Gore-Tex", "Waterproof", "Windproof"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'kinetic-runners',
    name: "Kinetic Runners",
    category: 'Footwear',
    gender: 'Unisex',
    tagline: "Forward Motion",
    description: "Sculpted foam sole with a knit upper for sock-like fit and energy return.",
    price: "$320",
    color: "#F8FAFC",
    materials: ["Knit Blend", "EVA Foam", "Rubber"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'void-tote',
    name: "Void Tote Bag",
    category: 'Accessories',
    gender: 'Unisex',
    tagline: "Carry Everything",
    description: "Oversized leather tote with structured base and minimal branding.",
    price: "$180",
    color: "#000000",
    materials: ["Full Grain Leather", "Suede Lining"],
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },

  // WOMAN
  {
    id: 'silk-slip',
    name: "Ethereal Silk Slip",
    category: 'Tops',
    gender: 'Woman',
    tagline: "Fluid Elegance",
    description: "100% Mulberry silk slip dress cut on the bias for a liquid drape.",
    price: "$350",
    color: "#E2E8F0",
    materials: ["Mulberry Silk", "Bias Cut"],
    image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'structured-blazer',
    name: "Architectural Blazer",
    category: 'Outerwear',
    gender: 'Woman',
    tagline: "Power Silhouette",
    description: "Oversized wool blazer with exaggerated shoulders and nipped waist.",
    price: "$420",
    color: "#18181B",
    materials: ["Virgin Wool", "Silk Lining"],
    image: "https://images.unsplash.com/photo-1548624149-f321d4d649c2?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'pleated-skirt',
    name: "Asymmetric Pleat Skirt",
    category: 'Bottoms',
    gender: 'Woman',
    tagline: "Dynamic Movement",
    description: "Sun-ray pleated midi skirt with an asymmetric hemline.",
    price: "$240",
    color: "#94A3B8",
    materials: ["Polyester Blend", "Permanent Pleat"],
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },

  // KIDS
  {
    id: 'mini-bomber',
    name: "Mini Aviator Bomber",
    category: 'Outerwear',
    gender: 'Kids',
    tagline: "Little Pilot",
    description: "Classic nylon bomber jacket scaled down for the next generation.",
    price: "$110",
    color: "#475569",
    materials: ["Nylon", "Cotton Ribbing"],
    image: "https://images.unsplash.com/photo-1519238263496-63536758428a?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'essential-hoodie-kids',
    name: "Cloud Soft Hoodie",
    category: 'Tops',
    gender: 'Kids',
    tagline: "Play All Day",
    description: "Ultra-soft organic cotton hoodie with reinforced stitching.",
    price: "$65",
    color: "#F1F5F9",
    materials: ["Organic Cotton", "Fleece Lined"],
    image: "https://images.unsplash.com/photo-1503919545889-aef6d7e5341c?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'denim-overalls-kids',
    name: "Utility Overalls",
    category: 'Bottoms',
    gender: 'Kids',
    tagline: "Ready for Adventure",
    description: "Durable denim overalls with adjustable straps and plenty of pockets.",
    price: "$85",
    color: "#334155",
    materials: ["Denim", "Brass Hardware"],
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  }
];

export const PIZZAS = PRODUCTS as any; // Backward compatibility alias to prevent breaking imports temporarily

export const COLORS = {
  brandPrimary: '#D97B8D', // Still keeping for now as requested accent
  brandLight: '#F2DCE0',
  deepBasil: '#1C1C1C',
  creamVanilla: '#FDFCFB',
};