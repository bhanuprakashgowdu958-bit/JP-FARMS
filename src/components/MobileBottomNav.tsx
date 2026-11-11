'use client';

import React from 'react';
import { Home, Play, LayoutGrid, User, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cartStore';

interface MobileBottomNavProps {
  onOpenReels?: () => void;
  onOpenOrders?: () => void;
  onOpenProfile?: () => void;
  activeTab?: 'home' | 'reels' | 'breeds' | 'account' | 'cart';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenReels,
  onOpenOrders,
  onOpenProfile,
  activeTab = 'home',
}) => {
  const { cartCount, cartTotal, openCart } = useCart();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Slim Cart Strip right above Bottom Nav when items are in cart (Flipkart/Blinkit style) */}
      {cartCount > 0 && (
        <div className="fixed bottom-[60px] inset-x-0 z-40 px-3 py-1.5 sm:hidden">
          <div 
            onClick={() => openCart()}
            className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-xl px-4 py-2 shadow-xl border border-amber-500/30 flex items-center justify-between cursor-pointer active:scale-98 transition"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <p className="text-[11px] text-stone-300 font-medium">
                  {cartCount} {cartCount === 1 ? 'Rooster' : 'Roosters'} in Cart
                </p>
                <p className="text-xs font-black text-amber-400">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black px-3 py-1.5 rounded-lg text-xs shadow-sm">
              <span>View Cart & Buy</span>
              <span className="text-sm leading-none">→</span>
            </div>
          </div>
        </div>
      )}

      {/* Picture 2 Style Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 pb-safe sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 text-sky-700 active:scale-95 transition"
          >
            <div className="p-1 rounded-full bg-sky-100 text-sky-700">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 text-sky-900">Home</span>
          </button>

          {/* 2. Reels / Play (HD Video Shorts) */}
          <button
            type="button"
            onClick={() => onOpenReels?.()}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-amber-600 active:scale-95 transition"
          >
            <div className="relative p-1 rounded-full text-slate-600 hover:bg-amber-50">
              <Play className="w-4 h-4 fill-current" />
              <span className="absolute -top-1 -right-1 text-[8px] font-black bg-rose-500 text-white px-1 rounded-full">
                HD
              </span>
            </div>
            <span className="text-[10px] font-medium mt-0.5 text-slate-600">Reels</span>
          </button>

          {/* 3. Categories / Breeds Gallery */}
          <button
            type="button"
            onClick={() => scrollToSection('showcase')}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-sky-700 active:scale-95 transition"
          >
            <div className="p-1 rounded-full text-slate-600 hover:bg-sky-50">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium mt-0.5 text-slate-600">Categories</span>
          </button>

          {/* 4. Account / Orders */}
          <button
            type="button"
            onClick={() => {
              if (onOpenOrders) onOpenOrders();
              else if (onOpenProfile) onOpenProfile();
              else window.dispatchEvent(new CustomEvent('open-orders-drawer'));
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-sky-700 active:scale-95 transition"
          >
            <div className="p-1 rounded-full text-slate-600 hover:bg-slate-100">
              <User className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium mt-0.5 text-slate-600">Account</span>
          </button>

          {/* 5. Cart with live counter badge */}
          <button
            type="button"
            onClick={() => openCart()}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-amber-600 active:scale-95 transition"
          >
            <div className="relative p-1 rounded-full text-slate-600 hover:bg-amber-50">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[9px] font-black bg-rose-500 text-white w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium mt-0.5 text-slate-600">Cart</span>
          </button>

        </div>
      </nav>
    </>
  );
};

