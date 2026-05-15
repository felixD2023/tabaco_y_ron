"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/lib/data";

type CartItem = { id: string; qty: number; name: string; price: number };

type SiteContextValue = {
  cart: CartItem[];
  cartCount: number;
  addToCart: (p: Product, qty?: number) => void;
  product: Product | null;
  openProduct: (p: Product) => void;
  closeProduct: () => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

export default function SiteProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const addToCart = (p: Product, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { id: p.id, qty, name: p.name, price: p.price }];
    });
  };

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  return (
    <SiteContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        product,
        openProduct: setProduct,
        closeProduct: () => setProduct(null),
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}
