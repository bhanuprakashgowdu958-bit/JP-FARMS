'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { RoosterCatalog } from '@/components/RoosterCatalog';
import { BreedsGuide } from '@/components/BreedsGuide';
import { FarmBioSecurity } from '@/components/FarmBioSecurity';
import { DeliveryProcess } from '@/components/DeliveryProcess';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import { RoosterDetailModal } from '@/components/RoosterDetailModal';
import { RoosterReelsModal } from '@/components/RoosterReelsModal';
import { BookingModal } from '@/components/BookingModal';
import { useRoosters } from '@/lib/roosterStore';
import { Rooster } from '@/types/rooster';
import { PlayCircle, MessageCircle } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

export default function HomePage() {
  const { roosters, isLoaded } = useRoosters();

  const [selectedRooster, setSelectedRooster] = useState<Rooster | null>(null);
  const [inquiryRooster, setInquiryRooster] = useState<Rooster | null>(null);
  const [isReelsOpen, setIsReelsOpen] = useState(false);
  const [reelsInitialId, setReelsInitialId] = useState<string | undefined>(undefined);

  const birdsCount = roosters.length;

  const handleOpenVideo = (rooster: Rooster) => {
    setReelsInitialId(rooster.id);
    setIsReelsOpen(true);
  };

  const handleInquire = (rooster: Rooster) => {
    setSelectedRooster(null); // close detail modal if open
    setInquiryRooster(rooster);
  };

  const whatsAppFloatingUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: 'Hello JP Farms! I am browsing your website and want to inquire about visiting your farm and seeing your desi roosters.',
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfa]">
      
      {/* Main Header */}
      <Header 
        onOpenReels={() => setIsReelsOpen(true)} 
        birdsCount={birdsCount} 
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          onOpenReels={() => setIsReelsOpen(true)} 
          birdsCount={birdsCount} 
        />

        {/* Heritage Rooster Living Gallery */}
        <RoosterCatalog
          roosters={roosters}
          onSelectRooster={(rooster) => setSelectedRooster(rooster)}
          onOpenVideo={handleOpenVideo}
          onInquire={handleInquire}
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

      {/* Floating Action Buttons (Mobile / Quick Access) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col space-y-2.5">
        
        {/* Watch Reels Floating Trigger */}
        <button
          onClick={() => setIsReelsOpen(true)}
          className="flex items-center space-x-2 bg-stone-900/90 hover:bg-stone-900 text-amber-400 font-bold px-3.5 py-2.5 rounded-full shadow-2xl border border-amber-500/40 backdrop-blur-md transition hover:scale-105 group"
          title="Watch Rooster Videos"
        >
          <PlayCircle className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
          <span className="text-xs hidden sm:inline">Rooster TV</span>
          <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
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

    </div>
  );
}
