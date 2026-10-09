import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/database';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        if (!items.some((i) => i.id === product.id)) {
          set({ items: [...items, product] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
      },

      toggleItem: (product) => {
        const { items } = get();
        const exists = items.some((i) => i.id === product.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.some((i) => i.id === product.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: 'teacoff-wishlist-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as any))),
    }
  )
);
