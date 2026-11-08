'use client';

import { useState, useEffect, useCallback } from 'react';
import { Rooster } from '@/types/rooster';

const CART_STORAGE_KEY = 'jp_farms_cart_v1';

export interface CartItem {
  rooster: Rooster;
  quantity: number;
  addedAt: number;
}

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse cart', e);
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
}

// Global open/close state for slide-over drawer
let globalCartOpen = false;
const listeners = new Set<(open: boolean) => void>();

export function toggleCartDrawer(open?: boolean): void {
  globalCartOpen = open !== undefined ? open : !globalCartOpen;
  listeners.forEach((listener) => listener(globalCartOpen));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(globalCartOpen);

  useEffect(() => {
    setItems(getStoredCart());
    setIsLoaded(true);

    const handleCartUpdate = () => {
      setItems(getStoredCart());
    };

    const handleDrawerChange = (openState: boolean) => {
      setIsOpen(openState);
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    listeners.add(handleDrawerChange);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      listeners.delete(handleDrawerChange);
    };
  }, []);

  const addToCart = useCallback((rooster: Rooster, openDrawerImmediately: boolean = true) => {
    const current = getStoredCart();
    const existingIndex = current.findIndex((item) => item.rooster.id === rooster.id);

    let updated: CartItem[];
    if (existingIndex > -1) {
      // Already in cart - increment quantity
      updated = current.map((item, idx) => 
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // New addition
      updated = [
        ...current,
        {
          rooster,
          quantity: 1,
          addedAt: Date.now(),
        },
      ];
    }

    saveStoredCart(updated);
    setItems(updated);

    if (openDrawerImmediately) {
      toggleCartDrawer(true);
    }
  }, []);

  const removeFromCart = useCallback((roosterId: string) => {
    const current = getStoredCart();
    const updated = current.filter((item) => item.rooster.id !== roosterId);
    saveStoredCart(updated);
    setItems(updated);
  }, []);

  const updateQuantity = useCallback((roosterId: string, quantity: number) => {
    const current = getStoredCart();
    if (quantity <= 0) {
      const updated = current.filter((item) => item.rooster.id !== roosterId);
      saveStoredCart(updated);
      setItems(updated);
      return;
    }

    const updated = current.map((item) =>
      item.rooster.id === roosterId ? { ...item, quantity } : item
    );
    saveStoredCart(updated);
    setItems(updated);
  }, []);

  const clearCart = useCallback(() => {
    saveStoredCart([]);
    setItems([]);
  }, []);

  const isInCart = useCallback((roosterId: string) => {
    return items.some((item) => item.rooster.id === roosterId);
  }, [items]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = items.reduce((sum, item) => {
    const price = item.rooster.price || 9500;
    return sum + price * item.quantity;
  }, 0);

  const cartOriginalTotal = items.reduce((sum, item) => {
    const price = item.rooster.price || 9500;
    const orig = item.rooster.originalPrice || Math.round(price * 1.25);
    return sum + orig * item.quantity;
  }, 0);

  const cartDiscount = cartOriginalTotal - cartTotal;

  return {
    items,
    isLoaded,
    isOpen,
    openCart: () => toggleCartDrawer(true),
    closeCart: () => toggleCartDrawer(false),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    cartCount,
    cartTotal,
    cartOriginalTotal,
    cartDiscount,
  };
}
