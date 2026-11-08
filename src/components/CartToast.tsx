'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { useCart } from '@/lib/cartStore';

export const CartToast: React.FC = () => {
  const [toastRooster, setToastRooster] = useState<Rooster | null>(null);
  const [visible, setVisible] = useState(false);
  const { openCart, cartCount } = useCart();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleItemAdded = (event: Event) => {
      const customEvent = event as CustomEvent<{ rooster: Rooster }>;
      if (customEvent.detail?.rooster) {
        setToastRooster(customEvent.detail.rooster);
        setVisible(true);

        clearTimeout(timer);
        timer = setTimeout(() => {
          setVisible(false);
        }, 3500);
      }
    };

    window.addEventListener('cart-item-added', handleItemAdded);
    return () => {
      window.removeEventListener('cart-item-added', handleItemAdded);
      clearTimeout(timer);
    };
  }, []);

  if (!visible || !toastRooster) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl rounded-2xl p-3 flex items-center space-x-3.5 max-w-sm">
        
        {/* Thumbnail */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
          <img
            src={toastRooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80'}
            alt={toastRooster.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Added to Cart!</span>
          </div>
          <p className="text-xs font-bold text-slate-100 truncate mt-0.5">
            {toastRooster.name}
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            ₹{(toastRooster.price || 9500).toLocaleString('en-IN')} • #{toastRooster.tagId}
          </p>
        </div>

        {/* View Cart Button */}
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            openCart();
          }}
          className="shrink-0 flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs px-3 py-2 rounded-xl shadow-md transition active:scale-95"
        >
          <span>Cart ({cartCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white p-1 transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

