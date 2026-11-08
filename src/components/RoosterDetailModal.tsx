'use client';

import React, { useState } from 'react';
import { 
  X, 
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
  ShoppingCart
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

export const RoosterDetailModal: React.FC<RoosterDetailModalProps> = ({
  rooster,
  onClose,
  onInquire,
  onBuyNow,
}) => {
  const [activeMedia, setActiveMedia] = useState<'photo' | 'video'>('photo');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const { addToCart, isInCart, openCart } = useCart();

  if (!rooster) return null;

  const price = rooster.price || 9500;
  const originalPrice = rooster.originalPrice || Math.round(price * 1.25);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

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

  const getBadgeStyle = (badge: Rooster['badge']) => {
    switch (badge) {
      case 'Champion Line':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md border border-amber-300';
      case 'Farm Stud':
        return 'bg-stone-900 text-amber-400 font-bold border border-amber-500/40 shadow-sm';
      case 'Heritage Pure':
        return 'bg-emerald-600 text-white font-bold shadow-sm';
      case 'Breeding Flock':
        return 'bg-blue-600 text-white font-bold shadow-sm';
      case 'Young Star':
        return 'bg-purple-600 text-white font-bold shadow-sm';
      default:
        return 'bg-stone-800 text-stone-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              TAG: {rooster.tagId}
            </span>
            <span className="text-stone-300 text-sm hidden sm:inline">•</span>
            <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
              {rooster.name}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition"
              title="Copy link"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {copiedLink && (
          <div className="bg-emerald-600 text-white text-xs text-center py-1.5 font-medium transition">
            Rooster link copied to clipboard! Share on WhatsApp.
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* Top Section: Media Showcase (Photo vs Video) */}
          <div className="space-y-3">
            
            {/* Media Mode Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveMedia('photo')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeMedia === 'photo'
                      ? 'bg-stone-900 text-white shadow'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  HD Photos ({rooster.images.length})
                </button>

                {rooster.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setActiveMedia('video')}
                    className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeMedia === 'video'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-amber-800 hover:text-amber-900'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Watch Stance Reel</span>
                  </button>
                )}
              </div>

              {/* Badge */}
              <span className={`text-xs px-3 py-1 rounded-full flex items-center space-x-1 ${getBadgeStyle(rooster.badge)}`}>
                <Award className="w-3.5 h-3.5" />
                <span>{rooster.badge}</span>
              </span>
            </div>

            {/* Media Display Area */}
            <div className="relative aspect-video sm:aspect-[16/9] w-full bg-stone-950 rounded-2xl overflow-hidden shadow-inner border border-stone-200">
              {activeMedia === 'photo' ? (
                <img
                  src={rooster.images[selectedPhotoIndex] || rooster.images[0]}
                  alt={rooster.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={rooster.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Photo Thumbnail Strip */}
            {activeMedia === 'photo' && rooster.images.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {rooster.images.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedPhotoIndex === index
                        ? 'border-amber-500 scale-95'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Information Grid */}
          <div className="space-y-6">
            
            {/* Title, Breed & Heritage Tag */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700 mb-1">
                <Feather className="w-3.5 h-3.5" />
                <span>{rooster.breed}</span>
                <span>•</span>
                <span className="font-mono text-stone-600">ID: {rooster.tagId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {rooster.name}
              </h1>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                {rooster.description}
              </p>
            </div>

            {/* E-Commerce Price Bar (Amazon/Flipkart Style) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wide block">
                  Online Farm Purchase Price
                </span>
                <div className="flex items-baseline space-x-2.5 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-stone-950">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  ✓ Free Climate Crate • GPS Live-Bird Transit • Veterinary Health Pass
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(rooster);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center space-x-1.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-extrabold px-4 py-3 rounded-xl text-xs sm:text-sm shadow-xs transition active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4 text-stone-900" />
                  <span>Add to Cart</span>
                </button>

                {onBuyNow && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBuyNow(rooster);
                    }}
                    className="inline-flex items-center justify-center space-x-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition active:scale-95"
                  >
                    <span>⚡ Buy Now</span>
                  </button>
                )}
              </div>
            </div>

            {/* Biological Specifications Matrix */}
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-400 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-1.5 text-stone-700" />
                Biological Traits & Measured Specifications
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center space-x-1.5 text-stone-400 text-xs mb-1">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Weight</span>
                  </div>
                  <p className="text-base font-bold text-stone-900">{rooster.weight}</p>
                  <p className="text-[10px] text-stone-500">Live scale verified</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center space-x-1.5 text-stone-400 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Age</span>
                  </div>
                  <p className="text-base font-bold text-stone-900">{rooster.age}</p>
                  <p className="text-[10px] text-stone-500">Hatch date documented</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center space-x-1.5 text-stone-400 text-xs mb-1">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Height / Stance</span>
                  </div>
                  <p className="text-base font-bold text-stone-900">{rooster.height}</p>
                  <p className="text-[10px] text-stone-500">Standing upright height</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center space-x-1.5 text-stone-400 text-xs mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Comb Anatomy</span>
                  </div>
                  <p className="text-base font-bold text-stone-900 truncate" title={rooster.combType}>
                    {rooster.combType.split('(')[0].trim()}
                  </p>
                  <p className="text-[10px] text-stone-500">Pure breed trait</p>
                </div>
              </div>
            </div>

            {/* Color, Plumage & Temperament */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">
                  Color Pattern & Plumage
                </h4>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {rooster.colorPattern}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Temperament & Behavior
                </h4>
                <p className="text-xs text-stone-800 font-medium leading-relaxed">
                  {rooster.temperament}
                </p>
              </div>
            </div>

            {/* Lineage & Organic Diet */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-1">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Authenticated Bloodline & Lineage</span>
                </div>
                <p className="text-sm font-semibold text-stone-200">
                  {rooster.lineage}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                  Traditional Organic Diet & Conditioning
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {rooster.diet}
                </p>
              </div>
            </div>

            {/* Veterinary Vaccine & Health Records */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold">Veterinary & Vaccination Records</h4>
                </div>
                <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-full shadow-sm">
                  {rooster.vaccinationStatus}
                </span>
              </div>

              <p className="text-xs text-emerald-900/80">
                Strict bio-security protocol followed. This bird is quarantined, dewormed, and immunized under avian veterinary supervision.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {rooster.vaccines.map((vaccine, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-emerald-950 font-medium bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{vaccine}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Certificate Trigger Banner */}
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
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View & Print Certificate</span>
              </button>
            </div>

            {/* Farm Visitation & Conservation Notice */}
            <div className="bg-stone-100 rounded-xl p-4 flex items-start space-x-3 text-stone-700 text-xs">
              <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">Farm Visits & Conservation Enthusiasts Welcome</p>
                <p className="text-stone-600 mt-0.5">
                  Plan a visit to JP Farms to observe these magnificent birds in open natural paddocks. Open 7:00 AM - 7:00 PM daily. Contact our farm manager to schedule your visit.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 z-20 bg-stone-950 text-white p-4 sm:p-5 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div>
              <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${getBadgeStyle(rooster.badge)}`}>
                {rooster.badge}
              </span>
              <p className="text-base font-black text-amber-400 mt-1">₹{price.toLocaleString('en-IN')}</p>
            </div>
            <div className="border-l border-stone-800 pl-3">
              <p className="text-xs text-white font-extrabold">#{rooster.tagId}</p>
              <p className="text-[11px] text-emerald-400">In Stock • Ready to Ship</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* BUY NOW BUTTON (Amazon/Flipkart Style) */}
            {onBuyNow && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBuyNow(rooster);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-6 py-3 rounded-xl text-sm shadow-xl shadow-amber-500/25 transition active:scale-95"
              >
                <span>⚡ Buy Now</span>
              </button>
            )}

            {/* Schedule Visit Button */}
            {onInquire && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onInquire(rooster);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-stone-800 hover:bg-stone-750 text-stone-200 font-bold px-4 py-3 rounded-xl text-sm transition"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Visit Farm</span>
              </button>
            )}

            {/* Direct WhatsApp Button */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl text-sm shadow-lg transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Direct Call Button */}
            <a
              href={`tel:${FARM_INFO.phone}`}
              className="p-3 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl transition border border-stone-700"
              title="Call Farm Manager"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
            </a>
          </div>

        </div>

      </div>

      {/* Official Printable Pedigree & Vaccine Certificate */}
      <BreedCertificateModal
        rooster={rooster}
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
      />

    </div>
  );
};
