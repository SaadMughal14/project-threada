import { ProductVariant } from './types';

export interface FashionProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  color: string;
  materials: string[];
  image: string;
  videoBackground: string; // Keeping for hero sections
  category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Accessories' | 'Footwear';
  variants?: ProductVariant[]; // Using new schema if possible
}

// Keeping legacy support for now but renaming export to avoid "Pizza"
export const PRODUCTS: FashionProduct[] = [
  {
    id: 'obsidian-tee',
    name: "Obsidian Heavyweight Tee",
    category: 'Tops',
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
    tagline: "Utility Evolved",
    description: "Technical nylon blend cargos with articulated knees and magnetic closure pockets.",
    price: "$280",
    color: "#64748B",
    materials: ["Nylon Blend", "Water Resistant", "YKK Zippers"],
    image: "https://images.unsplash.com/photo-1517445312882-68393557e5b5?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'nebula-jacket',
    name: "Nebula Shell Jacket",
    category: 'Outerwear',
    tagline: "Atmospheric Protection",
    description: "3-layer waterproof shell with taped seams and an iridescent finish.",
    price: "$450",
    color: "#0F172A",
    materials: ["Gore-Tex", "Waterproof", "Windproof"],
    image: "https://images.unsplash.com/photo-1551488852-080175865e57?auto=format&fit=crop&q=80&w=800",
    videoBackground: "",
  },
  {
    id: 'kinetic-runners',
    name: "Kinetic Runners",
    category: 'Footwear',
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
    tagline: "Carry Everything",
    description: "Oversized leather tote with structured base and minimal branding.",
    price: "$180",
    color: "#000000",
    materials: ["Full Grain Leather", "Suede Lining"],
    image: "https://images.unsplash.com/photo-1590874103328-3603713054e2?auto=format&fit=crop&q=80&w=800",
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