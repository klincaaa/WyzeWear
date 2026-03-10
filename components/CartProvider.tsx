"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  priceCents: number;
  currency: string;
  size: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  removeItem: (productId: number, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "wyzewear-cart-v1";

function readInitialCart(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] });

  useEffect(() => {
    setState(readInitialCart());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = state.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalCents = state.items.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0,
    );

    function addItem(
      item: Omit<CartItem, "quantity">,
      quantity: number = 1,
    ) {
      setState((prev) => {
        const existingIndex = prev.items.findIndex(
          (it) => it.productId === item.productId && it.size === item.size,
        );
        if (existingIndex >= 0) {
          const next = [...prev.items];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + quantity,
          };
          return { items: next };
        }
        return {
          items: [...prev.items, { ...item, quantity }],
        };
      });
    }

    function updateQuantity(productId: number, size: string, quantity: number) {
      setState((prev) => {
        if (quantity <= 0) {
          return {
            items: prev.items.filter(
              (it) => !(it.productId === productId && it.size === size),
            ),
          };
        }
        return {
          items: prev.items.map((it) =>
            it.productId === productId && it.size === size
              ? { ...it, quantity }
              : it,
          ),
        };
      });
    }

    function removeItem(productId: number, size: string) {
      setState((prev) => ({
        items: prev.items.filter(
          (it) => !(it.productId === productId && it.size === size),
        ),
      }));
    }

    function clear() {
      setState({ items: [] });
    }

    return {
      items: state.items,
      totalQuantity,
      totalCents,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

