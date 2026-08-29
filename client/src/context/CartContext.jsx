import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CART_KEY = "ecom_cart";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((productId, qty = 1) => {
    const amount = Math.max(1, Number(qty) || 1);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (existing) {
        return prev.map((i) => (i.id === productId ? { ...i, qty: i.qty + amount } : i));
      }
      return [...prev, { id: productId, qty: amount }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const setCartQty = useCallback((productId, qty) => {
    const next = Math.max(1, Number(qty) || 1);
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, qty: next } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, count, addToCart, removeFromCart, setCartQty, clearCart }),
    [items, count, addToCart, removeFromCart, setCartQty, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
