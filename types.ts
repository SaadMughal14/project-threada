
export interface PizzaProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  color: string;
  ingredients: string[];
  image: string;
}

export interface Ingredient {
  id: string;
  src: string;
  top: string;
  left: string;
  scale: number;
  rotation: number;
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'digital';
  walletType?: 'venmo' | 'cashapp' | 'zelle';
  screenshot?: string; // base64
}
