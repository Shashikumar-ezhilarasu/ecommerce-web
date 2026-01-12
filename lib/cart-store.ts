import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from './types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => { wei: bigint; tokens: bigint };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        set((state: CartStore) => {
          const existingItem = state.items.find(
            (item: CartItem) => item.product.id === product.id
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item: CartItem) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        });
      },
      
      removeItem: (productId: number) => {
        set((state: CartStore) => ({
          items: state.items.filter((item: CartItem) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state: CartStore) => ({
          items: state.items.map((item: CartItem) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const items = get().items;
        return items.reduce(
          (total: { wei: bigint; tokens: bigint }, item: CartItem) => ({
            wei: total.wei + (item.product.priceInWei * BigInt(item.quantity)),
            tokens: total.tokens + (item.product.priceInTokens * BigInt(item.quantity)),
          }),
          { wei: BigInt(0), tokens: BigInt(0) }
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
