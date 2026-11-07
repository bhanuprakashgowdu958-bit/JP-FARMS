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
  Truck, 
  Feather, 
  Scale, 
  Clock, 
  Ruler, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';
import { formatPrice, generateWhatsAppLink } from '@/lib/utils';

interface RoosterDetailModalProps {
  rooster: Rooster | null;
  onClose: () => void;
  onBookNow: (rooster: Rooster) => void;
}

export const RoosterDetailModal: React.FC<RoosterDetailModalProps> = ({
  rooster,
  onClose,
  onBookNow,
}) => {
  const [activeMedia, setActiveMedia] = useState<'photo' | 'video'>('photo');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!rooster) return null;

  const whatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    tagId: rooster.tagId,
    roosterName: rooster.name,
    breed: rooster.breed,
    price: rooster.price,
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isSold = rooster.status === 'sold';
  const isReserved = rooster.status === 'reserved';
  const isAvailable = rooster.status === 'available';

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
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Watch Walking Video</span>
                  </button>
                )}
              </div>

              {/* Status Badge */}
              <div>
                {isAvailable && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>READY FOR IMMEDIATE DISPATCH</span>
                  </span>
                )}
                {isReserved && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    TOKEN RESERVED (HELD)
                  </span>
                )}
                {isSold && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-200 text-stone-700">
                    SOLD OUT
                  </span>
                )}
              </div>
            </div>

            {/* Main Media Display Viewport */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-inner flex items-center justify-center">
              {activeMedia === 'video' && rooster.videoUrl ? (
                <div className="w-full h-full flex flex-col justify-center items-center bg-black">
                  <video
                    src={rooster.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                </div>
              ) : (
                <img
                  src={rooster.images[selectedPhotoIndex] || rooster.images[0]}
                  alt={`${rooster.name} view`}
                  className="w-full h-full object-cover object-center"
                />
              )}
            </div>

            {/* Thumbnail Gallery (Photos) */}
            {activeMedia === 'photo' && rooster.images.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto py-1">
                {rooster.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedPhotoIndex === idx
                        ? 'border-amber-500 scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Summary Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {rooster.breed}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {rooster.name}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Physical Leg Tag: <strong className="text-stone-800 font-mono">{rooster.tagId}</strong>
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-semibold text-stone-400 uppercase">Farm Direct Price</p>
              <div className="flex items-baseline sm:justify-end space-x-2">
                <span className="text-3xl font-black text-stone-900">
                  {formatPrice(rooster.price)}
                </span>
                {rooster.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(rooster.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                Live Animal Pet Transit Crate included
              </p>
            </div>
          </div>

          {/* Key Biological Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="flex items-center space-x-2 text-stone-500 text-xs font-semibold mb-1">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Live Weight</span>
              </div>
              <p className="text-lg font-bold text-stone-900">{rooster.weight}</p>
              <p className="text-[11px] text-stone-400">Muscular Bone Density</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="flex items-center space-x-2 text-stone-500 text-xs font-semibold mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Age</span>
              </div>
              <p className="text-lg font-bold text-stone-900">{rooster.age}</p>
              <p className="text-[11px] text-stone-400">Prime Breeding Maturity</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="flex items-center space-x-2 text-stone-500 text-xs font-semibold mb-1">
                <Ruler className="w-4 h-4 text-amber-600" />
                <span>Standing Height</span>
              </div>
              <p className="text-lg font-bold text-stone-900">{rooster.height}</p>
              <p className="text-[11px] text-stone-400">Upright Stance</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="flex items-center space-x-2 text-stone-500 text-xs font-semibold mb-1">
                <Feather className="w-4 h-4 text-amber-600" />
                <span>Comb Structure</span>
              </div>
              <p className="text-lg font-bold text-stone-900">{rooster.combType}</p>
              <p className="text-[11px] text-stone-400">Pure Heritage Trait</p>
            </div>
          </div>

          {/* Description & Temperament */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center">
                <Eye className="w-4 h-4 text-amber-600 mr-2" />
                Bird Characteristics & Lineage
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed bg-stone-50/70 p-4 rounded-xl border border-stone-200">
                {rooster.description}
              </p>
            </div>

            {/* Bloodline Ancestry */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm mb-1">
                <Award className="w-4 h-4 text-amber-700" />
                <span>Pedigree & Bloodline Ancestry</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                {rooster.lineage}
              </p>
            </div>

            {/* Color & Stance Detailed Specs Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-stone-200">
                  <tr className="bg-stone-50">
                    <th className="py-2.5 px-4 font-semibold text-stone-600 w-1/3">Color & Plumage</th>
                    <td className="py-2.5 px-4 text-stone-900 font-medium">{rooster.colorPattern}</td>
                  </tr>
                  <tr>
                    <th className="py-2.5 px-4 font-semibold text-stone-600">Temperament / Stance</th>
                    <td className="py-2.5 px-4 text-stone-900 font-medium">{rooster.temperament}</td>
                  </tr>
                  <tr className="bg-stone-50">
                    <th className="py-2.5 px-4 font-semibold text-stone-600">Nutrition & Daily Diet</th>
                    <td className="py-2.5 px-4 text-stone-900 font-medium">{rooster.diet}</td>
                  </tr>
                  <tr>
                    <th className="py-2.5 px-4 font-semibold text-stone-600">Health Warranty</th>
                    <td className="py-2.5 px-4 text-stone-900 font-medium text-emerald-800">{rooster.healthWarranty}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Vaccination Certificate Records */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 mr-1.5" />
                  Verified Veterinary Vaccination Card
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {rooster.vaccinationStatus}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
                {rooster.vaccines.map((vax, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{vax}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Delivery Promise */}
            <div className="bg-stone-100 rounded-xl p-4 flex items-start space-x-3 text-stone-700 text-xs">
              <Truck className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">Safe All-India Live Animal Pet Transit</p>
                <p className="text-stone-600 mt-0.5">
                  Shipped in customized ventilated travel crates equipped with water gel, fresh cut cucumbers/apples, and grain bedding. Available via direct express road routes, express trains, or direct farm pickup.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 z-20 bg-stone-950 text-white p-4 sm:p-5 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400">Total Price</p>
              <p className="text-2xl font-black text-amber-400">{formatPrice(rooster.price)}</p>
            </div>
            <div className="border-l border-stone-800 pl-3">
              <p className="text-xs text-stone-300 font-medium">Tag: {rooster.tagId}</p>
              <p className="text-[11px] text-stone-500">Live Health Guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Book Now Button */}
            {isAvailable && (
              <button
                type="button"
                onClick={() => onBookNow(rooster)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-amber-950"
              >
                Book This Bird Now
              </button>
            )}

            {/* Direct WhatsApp Button */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl text-sm shadow-lg transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Farm</span>
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

    </div>
  );
};

