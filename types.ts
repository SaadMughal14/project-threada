
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

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  full_name?: string;
  address?: string;
  phone?: string;
}

export interface DbCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size_name: string;
  created_at: string;
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'digital';
  walletType?: 'venmo' | 'cashapp' | 'zelle';
  screenshot?: string; // base64
}
