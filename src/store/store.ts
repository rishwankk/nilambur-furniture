import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartState {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (cart: CartItem[]) => void;
  toggleWishlist: (id: string) => void;
}

// Custom storage interface using js-cookie
const cookieStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 7, path: '/' }); 
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

export const useStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity }] });
        }
      },
      removeFromCart: (id) => {
        set({ cart: get().cart.filter(item => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        set({
          cart: get().cart.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      setCart: (cart) => set({ cart }),
      toggleWishlist: (id) => {
        const { wishlist } = get();
        if (wishlist.includes(id)) {
          set({ wishlist: wishlist.filter(wId => wId !== id) });
        } else {
          set({ wishlist: [...wishlist, id] });
        }
      }
    }),
    {
      name: 'nilambur-storage', // Key for cookies
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
