'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, 
  ArrowLeft,
  PlayCircle, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Share2, 
  Award, 
  Activity, 
  Feather, 
  Scale, 
  Clock, 
  Ruler, 
  Eye, 
  Calendar,
  MapPin,
  ShoppingCart, 
  Check,
  Star,
  Truck,
  Banknote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Camera,
  Film
} from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { BreedCertificateModal } from './BreedCertificateModal';
import { useCart } from '@/lib/cartStore';

interface RoosterDetailModalProps {
  rooster: Rooster | null;
  onClose: () => void;
  onInquire?: (rooster: Rooster) => void;
  onBuyNow?: (rooster: Rooster) => void;
}

type MediaItem = 
  | { type: 'image'; url: string; label: string }
  | { type: 'video'; url: string; label: string };

export const RoosterDetailModal: React.FC<RoosterDetailModalProps> = ({
  rooster,
  onClose,
  onInquire,
  onBuyNow,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [modalJustAdded, setModalJustAdded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Touch swipe refs for mobile Flipkart carousel
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const { addToCart, isInCart, openCart, cartCount } = useCart();

  // Reset active media when rooster changes
  useEffect(() => {
    setActiveMediaIndex(0);
    setCopiedLink(false);
  }, [rooster?.id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!rooster) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [rooster]);

  // Combined media items: all photos + video if available
  const mediaItems: MediaItem[] = useMemo(() => {
    if (!rooster) return [];
    const list: MediaItem[] = rooster.images.map((img, i) => ({
      type: 'image',
      url: img,
      label: `Photo ${i + 1}`,
    }));
    if (rooster.videoUrl) {
      list.push({
        type: 'video',
        url: rooster.videoUrl,
        label: 'HD Stance Video',
      });
    }
    return list;
  }, [rooster]);

  if (!rooster) return null;

  const inCart = isInCart(rooster.id);
  const price = rooster.price || 9500;
  const originalPrice = rooster.originalPrice || Math.round(price * 1.25);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  const rating = rooster.rating || 4.9;
  const reviewsCount = rooster.reviewsCount || 38;

  const handleModalAddToCart = () => {
    addToCart(rooster, false);
    setModalJustAdded(true);
    setTimeout(() => setModalJustAdded(false), 2200);
  };

  const handleNextMedia = () => {
    if (activeMediaIndex < mediaItems.length - 1) {
      setActiveMediaIndex((prev) => prev + 1);
    } else {
      setActiveMediaIndex(0);
    }
  };

  const handlePrevMedia = () => {
    if (activeMediaIndex > 0) {
      setActiveMediaIndex((prev) => prev - 1);
    } else {
      setActiveMediaIndex(mediaItems.length - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    if (diffX > 45) {
      handleNextMedia();
    } else if (diffX < -45) {
      handlePrevMedia();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const whatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hello JP Farms! 🐓 I am viewing Rooster #${rooster.tagId} (${rooster.name}, ${rooster.breed}) on your website. I would like to inquire about its lineage and schedule a visit to your farm.`,
  });

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Modal / Full-Screen Container (Flipkart Product View Style) */}
      <div className="relative bg-white w-full h-full sm:h-auto sm:max-h-[94vh] sm:max-w-4xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:my-auto border border-slate-200">
        
        {/* 1. Flipkart App Style Top Bar */}
        <div className="sticky top-0 z-30 bg-slate-900 text-white px-3.5 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0 shadow-md">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Back Button (Flipkart Mobile Standard) */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 text-amber-400 hover:text-white rounded-xl hover:bg-white/10 transition active:scale-95 cursor-pointer shrink-0"
              aria-label="Back"
              title="Back to Catalog"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <span className="font-mono text-[11px] sm:text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              #{rooster.tagId}
            </span>

            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[180px] sm:max-w-sm">
              {rooster.name}
            </h2>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-slate-300 hover:text-amber-400 hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="Share Bird Link"
              aria-label="Share"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              type="button"
              onClick={() => {
                onClose();
                openCart();
              }}
              className="relative p-2 text-slate-300 hover:text-amber-400 hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="View Cart"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              aria-label="Close"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Link Copied Toast Banner */}
        {copiedLink && (
          <div className="bg-emerald-600 text-white text-xs font-bold text-center py-2 px-4 shrink-0 animate-in slide-in-from-top flex items-center justify-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>Rooster link copied to clipboard! Share directly on WhatsApp.</span>
          </div>
        )}

        {/* 2. Scrollable Body Content (Flipkart Model) */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          
          {/* ============================================================ */}
          {/* SECTION A: FLIPKART STYLE SWIPEABLE PHOTO & VIDEO CAROUSEL   */}
          {/* ============================================================ */}
          <div className="bg-slate-950 relative border-b border-slate-200 select-none">
            
            {/* Main Stage (Swipeable) */}
            <div 
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-stone-950 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {currentMedia?.type === 'video' ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    src={currentMedia.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>Live 4K Stance Reel</span>
                  </div>
                </div>
              ) : (
                <img
                  src={currentMedia?.url}
                  alt={`${rooster.name} - ${currentMedia?.label}`}
                  className="w-full h-full object-contain filter contrast-[1.02]"
                />
              )}

              {/* Left/Right Desktop Navigation Arrows */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevMedia();
                    }}
                    className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white items-center justify-center border border-white/20 transition active:scale-90"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextMedia();
                    }}
                    className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white items-center justify-center border border-white/20 transition active:scale-90"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Flipkart Style Floating Counter Pill (e.g. 📸 1 / 4) */}
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/20 shadow-lg flex items-center space-x-1.5">
                {currentMedia?.type === 'video' ? (
                  <>
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    <span>Video</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeMediaIndex + 1} / {mediaItems.length}</span>
                  </>
                )}
              </div>

              {/* Strain Badge */}
              <div className="absolute top-3 right-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 shadow-md">
                  {rooster.badge}
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {mediaItems.length > 1 && (
              <div className="bg-slate-900 p-2 sm:p-2.5 flex items-center space-x-2 overflow-x-auto scrollbar-none">
                {mediaItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      activeMediaIndex === idx
                        ? 'border-amber-400 scale-102 ring-2 ring-amber-400/40'
                        : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-amber-400 relative">
                        <PlayCircle className="w-6 h-6" />
                        <span className="text-[9px] font-black uppercase tracking-tight mt-0.5">Video</span>
                      </div>
                    ) : (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* ============================================================ */}
          {/* SECTION B: FLIPKART STYLE PRODUCT INFO & PRICING             */}
          {/* ============================================================ */}
          <div className="p-4 sm:p-6 space-y-5 bg-white">
            
            {/* Title & Brand Header */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-700">
                <span className="uppercase tracking-wider">JP Farms Heritage Bloodline</span>
                <span>•</span>
                <span className="font-mono text-slate-500">TAG: #{rooster.tagId}</span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {rooster.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                {rooster.breed} • {rooster.lineage}
              </p>

              {/* Flipkart Green Rating Pill */}
              <div className="flex items-center space-x-2 pt-1.5 flex-wrap gap-y-1">
                <span className="bg-emerald-600 text-white font-black text-xs px-2 py-0.5 rounded flex items-center space-x-1 shadow-xs">
                  <span>{rating}</span>
                  <Star className="w-3 h-3 fill-current" />
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {reviewsCount} Ratings & Verified Reviews
                </span>
                <span className="text-[10px] uppercase font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  ⚡ JP Farms Assured
                </span>
              </div>
            </div>

            {/* Flipkart Price Block */}
            <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-slate-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 uppercase tracking-wide">
                  Special Online Farm Price
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Direct Breeder Rate</span>
              </div>

              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-4xl font-black text-slate-950">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm sm:text-base font-black text-emerald-600">
                  {discountPercent}% off
                </span>
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Climate-Crate Delivery (within 20 km of Farm Estate)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700 font-medium">
                  <Banknote className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Cash on Delivery (Pay at Unboxing) Available</span>
                </div>
              </div>
            </div>

            {/* Value Highlights Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <Scale className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Weight</span>
                <span className="text-sm font-black text-slate-900">{rooster.weight}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <Clock className="w-4 h-4 mx-auto text-sky-600 mb-1" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Age</span>
                <span className="text-sm font-black text-slate-900">{rooster.age}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <Ruler className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Height</span>
                <span className="text-sm font-black text-slate-900">{rooster.height}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <Award className="w-4 h-4 mx-auto text-purple-600 mb-1" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Comb</span>
                <span className="text-sm font-black text-slate-900 truncate block" title={rooster.combType}>
                  {rooster.combType.split('(')[0].trim()}
                </span>
              </div>
            </div>

            {/* Description Snippet */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Breeder Stance & Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                {rooster.description}
              </p>
            </div>

            {/* ============================================================ */}
            {/* SECTION C: FLIPKART STYLE PRODUCT SPECIFICATIONS TABLE       */}
            {/* ============================================================ */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Product Specifications & Biological Traits</span>
              </h3>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                <div className="grid grid-cols-3 p-3 bg-slate-50/60">
                  <span className="font-bold text-slate-500">Heritage Breed</span>
                  <span className="col-span-2 font-bold text-slate-900">{rooster.breed}</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-bold text-slate-500">Official Tag ID</span>
                  <span className="col-span-2 font-mono font-bold text-amber-800">#{rooster.tagId}</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-slate-50/60">
                  <span className="font-bold text-slate-500">Standing Height</span>
                  <span className="col-span-2 font-semibold text-slate-800">{rooster.height} (Upright fighting stance)</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-bold text-slate-500">Body Weight</span>
                  <span className="col-span-2 font-semibold text-slate-800">{rooster.weight} (Scale verified)</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-slate-50/60">
                  <span className="font-bold text-slate-500">Age / Maturity</span>
                  <span className="col-span-2 font-semibold text-slate-800">{rooster.age}</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-bold text-slate-500">Comb Anatomy</span>
                  <span className="col-span-2 font-semibold text-slate-800">{rooster.combType}</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-slate-50/60">
                  <span className="font-bold text-slate-500">Plumage & Tail</span>
                  <span className="col-span-2 font-semibold text-slate-800">{rooster.colorPattern}</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-bold text-slate-500">Temperament</span>
                  <span className="col-span-2 font-semibold text-slate-800">{rooster.temperament}</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-slate-50/60">
                  <span className="font-bold text-slate-500">Lineage & Sire</span>
                  <span className="col-span-2 font-semibold text-slate-800">{rooster.lineage}</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-bold text-slate-500">Traditional Diet</span>
                  <span className="col-span-2 font-semibold text-slate-800">{rooster.diet}</span>
                </div>

                <div className="grid grid-cols-3 p-3 bg-slate-50/60">
                  <span className="font-bold text-slate-500">Health Certification</span>
                  <span className="col-span-2 font-extrabold text-emerald-700">{rooster.vaccinationStatus}</span>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* SECTION D: DEDICATED 4K STANCE VIDEO SHOWCASE                */}
            {/* ============================================================ */}
            {rooster.videoUrl && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PlayCircle className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-black text-white">4K Stance & Crowing Video</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded">
                    HD 60FPS
                  </span>
                </div>

                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-700">
                  <video
                    src={rooster.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-slate-300">
                  Real video captured in open paddocks at JP Farms Estate. Verify walking stance, leg spurs, and crowing vigor.
                </p>
              </div>
            )}

            {/* Pedigree & Vaccine Certificate Action Box */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/80 border border-amber-300 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-700 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    Official Pedigree & Health Certificate
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    Authenticated bloodline seal, leg-tag registry, and full veterinary stamps.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCertificate(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View & Print Certificate</span>
              </button>
            </div>

            {/* Farm Visit Welcome Box */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-start space-x-3 text-slate-700 text-xs border border-slate-200">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Farm Visits & Paddock Tours Welcome</p>
                <p className="text-slate-600 mt-0.5">
                  Visit JP Farms at Kurapalli, Vutuvanka to inspect this rooster in person. Open 7:00 AM – 7:00 PM daily. Contact our curator to schedule.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* 3. FLIPKART CLASSIC 2-BUTTON STICKY BOTTOM BAR               */}
        {/* ============================================================ */}
        <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 sm:px-6 py-3 pb-safe shadow-2xl flex items-center justify-between gap-2.5 shrink-0">
          
          {/* Quick Price preview on desktop */}
          <div className="hidden md:block">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Payable</span>
            <span className="text-xl font-black text-slate-950">₹{price.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto flex-1 md:flex-initial justify-end">
            
            {/* WhatsApp Direct Inquire */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition active:scale-95 shrink-0 flex items-center justify-center"
              title="Inquire on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </a>

            {/* Left Button: ADD TO CART (Flipkart Style White/Slate Button) */}
            <button
              type="button"
              onClick={inCart ? () => { onClose(); openCart(); } : handleModalAddToCart}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center space-x-1.5 py-3 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-black transition active:scale-95 cursor-pointer shadow-xs border ${
                inCart
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {modalJustAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span className="text-emerald-700">✓ Added!</span>
                </>
              ) : inCart ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Go to Cart →</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 text-slate-900" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Right Button: BUY NOW (Flipkart Style High-Contrast Orange/Amber) */}
            {onBuyNow && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBuyNow(rooster);
                }}
                className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 px-5 sm:px-8 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95 cursor-pointer"
              >
                <span>⚡ Buy Now</span>
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Official Printable Pedigree & Vaccine Certificate Modal */}
      <BreedCertificateModal
        rooster={rooster}
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
      />

    </div>
  );
};
