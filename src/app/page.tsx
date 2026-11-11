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
import { PhoneCaptureModal } from '@/components/PhoneCaptureModal';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useRoosters } from '@/lib/roosterStore';
import { useCart } from '@/lib/cartStore';
import { Rooster } from '@/types/rooster';
import { ArrowRight } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
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
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // As soon as users login, check if phone number is blank and notify them to add it
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const cleanDigits = (user.phoneNumber || '').replace(/\D/g, '');
      const isMissingPhone = cleanDigits.length < 10;
      const dismissed = typeof window !== 'undefined' ? sessionStorage.getItem('dismissed_phone_prompt') : null;

      if (isMissingPhone && !dismissed) {
        const timer = setTimeout(() => {
          setIsPhoneModalOpen(true);
        }, 900);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, isAuthenticated, user]);

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
    <div className="min-h-screen flex flex-col bg-[#f4f9fd] pb-24 sm:pb-0">
      
      {/* Main Header */}
      <Header 
        onOpenReels={() => setIsReelsOpen(true)} 
        onOpenOrders={() => setIsOrdersOpen(true)}
        birdsCount={birdsCount} 
      />

      {/* Action Notification Banner: Prompt user to update phone number if blank */}
      {isAuthenticated && user && (!user.phoneNumber || user.phoneNumber.replace(/\D/g, '').length < 10) && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-stone-950 px-4 py-2.5 text-xs font-bold flex items-center justify-between border-b border-amber-600/20 shadow-xs">
          <div className="flex items-center space-x-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-950 animate-ping shrink-0" />
            <span className="truncate">
              ⚡ Action Required: Please update your mobile number to enable live transit tracking & order updates.
            </span>
          </div>
          <button
            onClick={() => setIsPhoneModalOpen(true)}
            className="ml-3 shrink-0 bg-stone-950 hover:bg-stone-850 text-amber-300 font-extrabold px-3 py-1 rounded-lg text-[11px] shadow-sm active:scale-95 transition cursor-pointer"
          >
            + Update Mobile
          </button>
        </div>
      )}

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

      {/* Mobile App Navigation Dock (Picture 2 E-Commerce Style) */}
      <MobileBottomNav
        onOpenReels={() => setIsReelsOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* 8. Phone Number Capture & Update Modal */}
      <PhoneCaptureModal
        isOpen={isPhoneModalOpen}
        onClose={() => {
          setIsPhoneModalOpen(false);
          sessionStorage.setItem('dismissed_phone_prompt', 'true');
        }}
        title="Update Your Mobile Number"
        subtitle="Please provide your 10-digit mobile number for live animal transit tracking & order dispatch updates."
      />

    </div>
  );
}
