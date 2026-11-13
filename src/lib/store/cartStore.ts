import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/types';

interface AppliedPromo {
  code: string;
  discountPercent: number;
  discountAmount: number;
  description?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  appliedPromo: AppliedPromo | null;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (promo: AppliedPromo) => void;
  removePromo: () => void;

  // Computations
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: (orderType: 'DELIVERY' | 'PICKUP') => number;
  getTax: () => number;
  getTotal: (orderType: 'DELIVERY' | 'PICKUP') => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedPromo: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item) => {
        set((state) => {
          // If not custom and already in cart, increment quantity
          if (!item.isCustom && item.menuItemId) {
            const existingIndex = state.items.findIndex(
              (i) => !i.isCustom && i.menuItemId === item.menuItemId
            );
            if (existingIndex > -1) {
              const updatedItems = [...state.items];
              updatedItems[existingIndex].quantity += item.quantity || 1;
              return { items: updatedItems, isOpen: true };
            }
          }

          // Otherwise add as new unique item
          const newItemId = item.id || `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          return {
            items: [...state.items, { ...item, id: newItemId, quantity: item.quantity || 1 }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedPromo: null });
      },

      applyPromo: (promo) => {
        set({ appliedPromo: promo });
      },

      removePromo: () => {
        set({ appliedPromo: null });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        const sub = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return Math.round(sub * 100) / 100;
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;
        if (!promo || subtotal === 0) return 0;

        let discount = 0;
        if (promo.discountPercent > 0) {
          discount = (subtotal * promo.discountPercent) / 100;
        } else if (promo.discountAmount > 0) {
          discount = promo.discountAmount;
        }

        // Discount cannot exceed subtotal
        return Math.min(Math.round(discount * 100) / 100, subtotal);
      },

      getDeliveryFee: (orderType: 'DELIVERY' | 'PICKUP') => {
        if (orderType === 'PICKUP') return 0;
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        // Free delivery on orders $25+
        return subtotal >= 25.0 ? 0 : 3.99;
      },

      getTax: () => {
        const taxable = Math.max(0, get().getSubtotal() - get().getDiscount());
        // 8% tax rate
        return Math.round(taxable * 0.08 * 100) / 100;
      },

      getTotal: (orderType: 'DELIVERY' | 'PICKUP') => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const deliveryFee = get().getDeliveryFee(orderType);
        const tax = get().getTax();
        return Math.max(0, Math.round((subtotal - discount + deliveryFee + tax) * 100) / 100);
      },
    }),
    {
      name: 'crust-and-ember-cart',
      partialize: (state) => ({
        items: state.items,
        appliedPromo: state.appliedPromo,
      }),
    }
  )
);

