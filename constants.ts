import { PizzaProduct } from './types';

export interface SizeOption {
  name: string;
  price: string;
}

export interface PizzaProductExtended extends PizzaProduct {
  videoBackground: string;
  category: 'Cookies' | 'Brownies' | 'Cakes' | 'Coffee & Tea' | 'Sides';
  sizeOptions: SizeOption[];
}

export const PIZZAS: PizzaProductExtended[] = [
  {
    id: 'molten',
    name: "Molten Artifact",
    category: 'Cookies',
    tagline: "The Thermal Core",
    description: "Deep valrhona dark chocolate base with a liquid center, finished with fleur de sel and scorched hazelnut.",
    price: "Rs. 1200",
    color: "#1C1C1C", 
    ingredients: ["Dark Cacao", "Sea Salt", "Hazelnut", "Liquid Ganache"],
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800",
    videoBackground: "https://player.vimeo.com/external/494248848.sd.mp4?s=91480c5e648f572111756570c91550c82270923e&profile_id=164&oauth2_token_id=57447761",
    sizeOptions: [
      { name: "1 PIECE", price: "Rs. 1200" },
      { name: "PACK OF 6", price: "Rs. 6500" },
      { name: "PACK OF 12", price: "Rs. 12000" }
    ]
  },
  {
    id: 'blackout',
    name: "Obsidian Slab",
    category: 'Brownies',
    tagline: "Gravity Defying",
    description: "A dense, charcoal-infused brownie slab topped with espresso-soaked fudge and gold leaf shavings.",
    price: "Rs. 1800",
    color: "#111111", 
    ingredients: ["Espresso", "Fudge", "Gold Leaf", "Charcoal Cacao"],
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800",
    videoBackground: "https://player.vimeo.com/external/517409405.sd.mp4?s=07693d22b6b06361a99540c111c19d7d130e525a&profile_id=164&oauth2_token_id=57447761",
    sizeOptions: [
      { name: "1 SLAB", price: "Rs. 1800" },
      { name: "PACK OF 4", price: "Rs. 6800" },
      { name: "PACK OF 8", price: "Rs. 13000" }
    ]
  },
  {
    id: 'velvet-cake',
    name: "Velvet Forge",
    category: 'Cakes',
    tagline: "Structured Heat",
    description: "Crimson cocoa layers with whipped mascarpone and a torched marshmallow exterior.",
    price: "Rs. 3500",
    color: "#4A0E0E", 
    ingredients: ["Crimson Cocoa", "Mascarpone", "Marshmallow", "Vanilla Root"],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    videoBackground: "https://player.vimeo.com/external/435674739.sd.mp4?s=94d4a82173163351239c878988636f78f9f7596a&profile_id=164&oauth2_token_id=57447761",
    sizeOptions: [
      { name: "SLICE", price: "Rs. 3500" },
      { name: "HALF KG", price: "Rs. 8500" },
      { name: "1 KG", price: "Rs. 15000" }
    ]
  },
  {
    id: 'burnt-bean',
    name: "Burnt Bean Press",
    category: 'Coffee & Tea',
    tagline: "Liquid Energy",
    description: "Double-extracted espresso over frozen charcoal spheres, finished with a dash of smoked maple.",
    price: "Rs. 850",
    color: "#241F1C", 
    ingredients: ["Espresso", "Smoked Maple", "Charcoal Ice", "Oat Cream"],
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    videoBackground: "https://player.vimeo.com/external/384737151.sd.mp4?s=d74b62f43709b119159d332d7331f47d51963059&profile_id=164&oauth2_token_id=57447761",
    sizeOptions: [
      { name: "HOT", price: "Rs. 850" },
      { name: "ICED", price: "Rs. 950" }
    ]
  },
  {
    id: 'sea-salt-crusts',
    name: "Salted Crusts",
    category: 'Sides',
    tagline: "The Foundation",
    description: "Crispy, hand-shredded cookie ends tossed in crystalline sea salt and dark sugar.",
    price: "Rs. 600",
    color: "#D9D0C7", 
    ingredients: ["Cookie Ends", "Sea Salt", "Dark Sugar", "Butter Dust"],
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800",
    videoBackground: "https://player.vimeo.com/external/384737229.sd.mp4?s=d0061e858079a49931086256f10c663a8323865c&profile_id=164&oauth2_token_id=57447761",
    sizeOptions: [
      { name: "SMALL", price: "Rs. 600" },
      { name: "REGULAR", price: "Rs. 1000" },
      { name: "LARGE", price: "Rs. 1800" }
    ]
  }
];

export const COLORS = {
  brandPrimary: '#D97B8D', 
  brandLight: '#F2DCE0',
  deepBasil: '#1C1C1C',    
  creamVanilla: '#FDFCFB', 
};