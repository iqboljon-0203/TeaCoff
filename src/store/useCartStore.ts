import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/database';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface PromoDiscount {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedPromo: PromoDiscount | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;

  // Selectors / Helpers
  getTotalItems: () => number;
  getTotalCapsuleBoxes: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedPromo: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated, isOpen: true };
          }
          return {
            items: [...state.items, { product, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], appliedPromo: null }),

      applyPromo: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'TEACOFF10' || clean === 'TASTETASHT') {
          const promo: PromoDiscount = {
            code: clean,
            type: 'percent',
            value: 10,
          };
          set({ appliedPromo: promo });
          return { success: true, message: 'Промокод на 10% применен!' };
        }
        if (clean === 'WELCOME50K') {
          const promo: PromoDiscount = {
            code: clean,
            type: 'fixed',
            value: 50000,
          };
          set({ appliedPromo: promo });
          return { success: true, message: 'Скидка 50 000 сум применена!' };
        }
        return { success: false, message: 'Неверный промокод' };
      },

      removePromo: () => set({ appliedPromo: null }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalCapsuleBoxes: () => {
        return get().items.reduce((sum, item) => {
          if (
            item.product.category_slug === 'kapsuly' ||
            item.product.title.ru.toLowerCase().includes('капсул')
          ) {
            return sum + item.quantity;
          }
          return sum;
        }, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;
        if (!promo) return 0;
        if (promo.type === 'percent') {
          return Math.round((subtotal * promo.value) / 100);
        }
        return Math.min(promo.value, subtotal);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        const capsules = get().getTotalCapsuleBoxes();
        // Free delivery in Tashkent if subtotal >= 300,000 UZS or capsules >= 4
        if (subtotal >= 300000 || capsules >= 4 || subtotal === 0) {
          return 0;
        }
        return 25000; // Standard 25,000 UZS delivery within Tashkent
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const delivery = get().getDeliveryFee();
        return Math.max(0, subtotal - discount + delivery);
      },
    }),
    {
      name: 'teacoff-cart-storage',
      partialize: (state) => ({
        items: state.items,
        appliedPromo: state.appliedPromo,
      }),
    }
  )
);
