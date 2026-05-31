import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CreateProductDto } from '@/types/product';
import type { CartItem } from '@/types/public';

interface CartState {
  items: CartItem[];
  addItem: (product: CreateProductDto, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product_id === product.id.toString(),
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product_id === product.id.toString()
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: Math.random().toString(36).substr(2, 9),
                cart_id: Math.random().toString(36).substr(2, 9), // Add cart_id
                product_id: product.id.toString(), // Convert product.id to string
                quantity,
                product,
              } as CartItem,
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + (item.product?.base_price || 0) * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
