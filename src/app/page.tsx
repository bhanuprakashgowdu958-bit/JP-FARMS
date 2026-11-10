'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authStore';
import { Header } from '@/components/Header';
import { ZomatoBannerCarousel } from '@/components/ZomatoBannerCarousel';
import { RoosterCatalog } from '@/components/RoosterCatalog';
import { BreedsGuide } from '@/components/BreedsGuide';
import { FarmBioSecurity } from '@/components/FarmBioSecurity';
import { DeliveryProcess } from '@/components/DeliveryProcess';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import { RoosterDetailModal } from '@/components/RoosterDetailModal';
import { RoosterReelsModal } from '@/components/RoosterReelsModal';
import { BookingModal } from '@/components/BookingModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { CartSlideOver } from '@/components/CartSlideOver';
import { OrdersTrackingDrawer } from '@/components/OrdersTrackingDrawer';
import { CartToast } from '@/components/CartToast';
import { useRoosters } from '@/lib/roosterStore';
import { useCart } from '@/lib/cartStore';
import { Rooster } from '@/types/rooster';
import { ArrowRight } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // If user is not signed up / signed in, take them to the signup page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/signup');
    }
  }, [isLoading, isAuthenticated, router]);

  const { roosters, isLoaded } = useRoosters();
  const { cartCount, cartTotal, openCart } = useCart();

  const [selectedRooster, setSelectedRooster] = useState<Rooster | null>(null);
  const [inquiryRooster, setInquiryRooster] = useState<Rooster | null>(null);
  const [checkoutRooster, setCheckoutRooster] = useState<Rooster | null>(null);
  const [isReelsOpen, setIsReelsOpen] = useState(false);
  const [reelsInitialId, setReelsInitialId] = useState<string | undefined>(undefined);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  useEffect(() => {
    const handleOpenOrders = () => setIsOrdersOpen(true);
    window.addEventListener('open-orders-drawer', handleOpenOrders);
    return () => window.removeEventListener('open-orders-drawer', handleOpenOrders);
  }, []);

  const birdsCount = roosters.length;

  const handleOpenVideo = (rooster: Rooster) => {
    setReelsInitialId(rooster.id);
    setIsReelsOpen(true);
  };

  const handleInquire = (rooster: Rooster) => {
    setSelectedRooster(null); // close detail modal if open
    setInquiryRooster(rooster);
  };

  const handleBuyNow = (rooster: Rooster) => {
    setSelectedRooster(null); // close detail modal if open
    setCheckoutRooster(rooster);
  };

  // Splash screen while checking auth or redirecting unauthenticated users to /signup
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20 mb-4 animate-pulse flex items-center justify-center">
          <div className="w-full h-full bg-stone-900 rounded-[14px] overflow-hidden flex items-center justify-center">
            <img src="/logo-square.png" alt="JP Farms Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">JP FARMS</h1>
        <p className="text-xs text-amber-400/90 mt-1 font-semibold uppercase tracking-wider">
          Connecting to Heritage Estate...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f9fd]">
      
      {/* Main Header */}
      <Header 
        onOpenReels={() => setIsReelsOpen(true)} 
        onOpenOrders={() => setIsOrdersOpen(true)}
        birdsCount={birdsCount} 
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Zomato-Style Featured Banner Carousel & Fast Feature Strip */}
        <ZomatoBannerCarousel 
          roosters={roosters}
          onOpenReels={() => setIsReelsOpen(true)}
          onScheduleVisit={() => setInquiryRooster(roosters[0] || null)}
          onSelectRooster={(rooster) => setSelectedRooster(rooster)}
        />

        {/* Heritage Rooster Living Gallery */}
        <RoosterCatalog
          roosters={roosters}
          onSelectRooster={(rooster) => setSelectedRooster(rooster)}
          onOpenVideo={handleOpenVideo}
          onInquire={handleInquire}
          onBuyNow={handleBuyNow}
        />

        {/* Heritage Breeds Educational Guide */}
        <BreedsGuide />

        {/* Farm Bio-Security, Organic Diet & Vaccination Standards */}
        <FarmBioSecurity />

        {/* Safe Farm Logistics & Visitor Guidelines */}
        <DeliveryProcess />

        {/* Avian Enthusiast Proof & Breeder Testimonials */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {/* 1. Full Rooster Biological & Specs Inspection Modal */}
      <RoosterDetailModal
        rooster={selectedRooster}
        onClose={() => setSelectedRooster(null)}
        onInquire={handleInquire}
        onBuyNow={handleBuyNow}
      />

      {/* 2. Interactive Rooster Reels TV Shorts Player */}
      <RoosterReelsModal
        isOpen={isReelsOpen}
        onClose={() => setIsReelsOpen(false)}
        roosters={roosters}
        initialRoosterId={reelsInitialId}
        onSelectRooster={(rooster) => {
          setIsReelsOpen(false);
          setSelectedRooster(rooster);
        }}
        onInquire={handleInquire}
      />

      {/* 3. Farm Visit & Breed Inquiry Dialog */}
      <BookingModal
        rooster={inquiryRooster}
        onClose={() => setInquiryRooster(null)}
      />

      {/* 4. Express Rooster E-Commerce Checkout Modal (Amazon/Flipkart Style) */}
      <CheckoutModal
        rooster={checkoutRooster}
        isOpen={!!checkoutRooster}
        onClose={() => setCheckoutRooster(null)}
      />

      {/* 5. Amazon/Flipkart Slide-Over Shopping Cart & Multi-Item Checkout Drawer */}
      <CartSlideOver />

      {/* 6. Amazon/Flipkart Returns & Orders Live Transit Tracker Drawer */}
      <OrdersTrackingDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        onBack={() => {
          setIsOrdersOpen(false);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-side-menu'));
          }, 50);
        }}
        onExploreCatalog={() => {
          setIsOrdersOpen(false);
          const el = document.getElementById('showcase');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 7. Non-Intrusive Cart Floating Toast Notification */}
      <CartToast />

      {/* Mobile Sticky Bottom Cart Banner */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200 px-4 py-2.5 pb-safe shadow-2xl flex items-center justify-between sm:hidden">
          <div>
            <span className="text-[11px] text-slate-500 font-bold block">
              {cartCount} {cartCount === 1 ? 'Rooster' : 'Roosters'} in Cart
            </span>
            <span className="text-base font-black text-slate-900">
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={openCart}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black px-4 py-2 rounded-xl text-xs shadow-md active:scale-95"
          >
            <span>View Cart & Buy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
