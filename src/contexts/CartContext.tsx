"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { toNombre } from "@/lib/boutique";

export interface CartItem {
  id: string | number;
  name: string;
  /** Toujours un nombre en FCFA — la mise en forme se fait à l'affichage. */
  price: number;
  category: string;
  image: string;
  quantity: number;
}

/** Ce qu'une page transmet : la quantité et le format du prix sont normalisés ici. */
export type CartInput = Omit<CartItem, "quantity" | "price"> & {
  price: number | string;
  quantity?: number;
};

interface CartContextType {
  cartItems: CartItem[];
  /** Nombre d'articles quantités comprises, pour le badge de navigation. */
  totalArticles: number;
  totalFCFA: number;
  addToCart: (item: CartInput) => void;
  removeFromCart: (id: CartItem["id"]) => void;
  setQuantity: (id: CartItem["id"], quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "ks-mobile:panier";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Lecture après le montage : le serveur ne connaît pas localStorage, lire
  // pendant le rendu provoquerait une divergence d'hydratation.
  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(STORAGE_KEY);
      if (!brut) return;
      const parse = JSON.parse(brut);
      if (Array.isArray(parse)) setCartItems(parse.filter(estArticleValide));
    } catch {
      // Stockage indisponible (navigation privée, cookies bloqués) : le panier
      // reste en mémoire pour la session.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // idem
    }
  }, [cartItems]);

  const addToCart = (item: CartInput) => {
    const prix = toNombre(item.price) ?? 0;
    const ajout = Math.max(1, item.quantity ?? 1);

    setCartItems((articles) => {
      const existant = articles.find((a) => a.id === item.id);
      if (existant) {
        return articles.map((a) =>
          a.id === item.id ? { ...a, quantity: a.quantity + ajout } : a
        );
      }
      return [...articles, { ...item, price: prix, quantity: ajout }];
    });
  };

  const removeFromCart = (id: CartItem["id"]) => {
    setCartItems((articles) => articles.filter((a) => a.id !== id));
  };

  const setQuantity = (id: CartItem["id"], quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((articles) =>
      articles.map((a) => (a.id === id ? { ...a, quantity } : a))
    );
  };

  const clearCart = () => setCartItems([]);

  const { totalArticles, totalFCFA } = useMemo(
    () => ({
      totalArticles: cartItems.reduce((n, a) => n + a.quantity, 0),
      totalFCFA: cartItems.reduce((n, a) => n + a.price * a.quantity, 0),
    }),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalArticles,
        totalFCFA,
        addToCart,
        removeFromCart,
        setQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function estArticleValide(a: unknown): a is CartItem {
  if (typeof a !== "object" || a === null) return false;
  const c = a as Record<string, unknown>;
  return (
    (typeof c.id === "string" || typeof c.id === "number") &&
    typeof c.name === "string" &&
    typeof c.price === "number" &&
    typeof c.quantity === "number"
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
