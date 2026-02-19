import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string; // unique ID (product_id + variant_id usually)
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
    color: string;
    maxStock: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (newItem) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex((item) => item.id === newItem.id);
                    const shouldOpen = state.items.length === 0; // Only open if it was empty

                    if (existingItemIndex > -1) {
                        // Item exists, update quantity
                        const newItems = [...state.items];
                        const existingItem = newItems[existingItemIndex];
                        const newQuantity = Math.min(
                            existingItem.quantity + newItem.quantity,
                            existingItem.maxStock
                        );

                        newItems[existingItemIndex] = {
                            ...existingItem,
                            quantity: newQuantity,
                        };

                        return { items: newItems, isOpen: state.isOpen || shouldOpen };
                    } else {
                        // New item
                        return { items: [...state.items, newItem], isOpen: state.isOpen || shouldOpen };
                    }
                });
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));
            },

            updateQuantity: (id, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        return { items: state.items.filter((item) => item.id !== id) };
                    }

                    return {
                        items: state.items.map((item) =>
                            item.id === id ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item
                        ),
                    };
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            toggleCart: () => {
                set((state) => ({ isOpen: !state.isOpen }));
            },

            getCartTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'threada-cart-storage', // unique name for localStorage key
            storage: createJSONStorage(() => localStorage), // explicitly use localStorage
        }
    )
);
