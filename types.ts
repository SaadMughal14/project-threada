
export interface PizzaProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  color: string;
  ingredients: string[];
  image: string;
  size: string; // This might conflict with variant selection logic later, but keeping for now as base product info
  // NEW: variants will handle true size logic
}

export interface Ingredient {
  id: string;
  src: string;
  top: string;
  left: string;
  scale: number;
  rotation: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'digital';
  walletType?: 'venmo' | 'cashapp' | 'zelle';
  screenshot?: string; // base64
}

// Renaming legacy OrderDetails to CustomerDetails to avoid confusion, 
// keeping OrderDetails alias for backward compatibility if needed, 
// but primarily defining the full Order shape.
export type OrderDetails = CustomerDetails;

export interface Order {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_notes?: string;
  kitchen_instructions?: string;
  items: any[]; // JSONB
  total: number;
  payment_method: string;
  status: string;
  placed_at: string;
}

// NEW INTERFACES FOR THREADA

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  sku?: string;
  price_adjustment: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface StoreSettings {
  id: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  hero_image_url?: string;
  hero_headline: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
  maxStock: number;
}
