'use client';

import React, { useState, useEffect } from 'react';
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
import { PlayCircle, MessageCircle, ShoppingBag, ArrowRight, Feather } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

export default function HomePage() {
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

  const whatsAppFloatingUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: 'Hello JP Farms! I am browsing your website and want to inquire about visiting your farm and seeing your desi roosters.',
  });

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

      {/* Floating Action Buttons (Mobile / Quick Access) - auto-lifts on mobile when cart banner appears */}
      <div className={`fixed right-3.5 sm:right-5 z-40 flex flex-col space-y-2.5 transition-all duration-300 ${cartCount > 0 ? 'bottom-20 sm:bottom-5' : 'bottom-4 sm:bottom-5'}`}>
        
        {/* Watch Reels Floating Trigger */}
        <button
          onClick={() => setIsReelsOpen(true)}
          className="flex items-center space-x-2 bg-white/95 hover:bg-white text-sky-800 font-bold px-3.5 py-2.5 rounded-full shadow-2xl border border-sky-300 backdrop-blur-md transition hover:scale-105 group"
          title="Watch Rooster Videos"
        >
          <PlayCircle className="w-5 h-5 text-sky-600 group-hover:scale-110 transition" />
          <span className="text-xs hidden sm:inline">Rooster TV</span>
          <span className="bg-sky-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
            Live
          </span>
        </button>

        {/* WhatsApp Direct Floating Button */}
        <a
          href={whatsAppFloatingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl transition hover:scale-105 active:scale-95 border-2 border-white"
          title="Chat with JP Farms on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </a>

      </div>

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
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200 px-4 py-2.5 shadow-2xl flex items-center justify-between sm:hidden">
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
