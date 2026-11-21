'use client';

import React, { useState } from 'react';
import { Award, ArrowRight, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const BREEDS_INFO = [
  {
    name: 'Pure Aseel (Peela)',
    hindiName: 'पीला असील',
    teluguName: 'పీల అసీల్',
    tagline: 'The Ancient Royal Warrior of India',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    origin: 'Andhra Pradesh & Punjab Royal Avian Heritage',
    originShort: 'Andhra Pradesh • Ancient',
    accentColor: 'from-amber-600 to-amber-800',
    accentText: 'text-amber-600',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    traits: ['Compact Pea Comb', 'Golden-Red Plumage', 'High Bone Density', 'Fearless Upright Stance'],
    weight: '3.5–4.5 Kg',
    height: '24–26 in',
    bestFor: 'Championship breeding studs, bloodline preservation, collectors',
  },
  {
    name: 'Pure Kadaknath',
    hindiName: 'कड़कनाथ',
    teluguName: 'కడకనాథ్',
    tagline: 'High-Protein Jet Black Medicinal Breed',
    image: 'https://images.unsplash.com/photo-1589332278453-611a91e5e04d?auto=format&fit=crop&w=800&q=80',
    origin: 'Jhabua / Dhar District, Madhya Pradesh',
    originShort: 'Madhya Pradesh • Jhabua',
    accentColor: 'from-slate-700 to-slate-900',
    accentText: 'text-slate-700',
    accentBg: 'bg-slate-50',
    accentBorder: 'border-slate-200',
    traits: ['100% Melanin Black', 'Zero Chemical Raised', 'Low Cholesterol', 'Cold & Heat Resistant'],
    weight: '2.0–2.6 Kg',
    height: '18–20 in',
    bestFor: 'Medicinal farming, immune-boosting nutrition, organic flocks',
  },
  {
    name: 'Aseel Kagar',
    hindiName: 'कागर असील',
    teluguName: 'కాగర్ అసీల్',
    tagline: 'Heavyweight Glossy Metallic Plumage',
    image: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=800&q=80',
    origin: 'Historic Deccan Plateau Stud Farms',
    originShort: 'Deccan Plateau • Historic',
    accentColor: 'from-emerald-600 to-emerald-800',
    accentText: 'text-emerald-700',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    traits: ['Walnut Comb', 'Metallic Emerald Sheen', 'Wide Stance', 'Aggressive Alertness'],
    weight: '3.8–4.8 Kg',
    height: '23–25 in',
    bestFor: 'Stud rooster for upgrading flock genetics, heavy size breeding',
  },
  {
    name: 'Sindhi Longneck Aseel',
    hindiName: 'सिंधी असील',
    teluguName: 'సింధీ అసీల్',
    tagline: 'Towering Height & Majestic Presence',
    image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80',
    origin: 'Sindh & Western Border Valleys',
    originShort: 'Sindh • Border Valleys',
    accentColor: 'from-sky-600 to-sky-800',
    accentText: 'text-sky-700',
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-200',
    traits: ['26–29 Inch Height', 'Pearl White Eyes', 'Muscular Long Neck', 'Deep Low Crow'],
    weight: '4.2–5.2 Kg',
    height: '26–29 in',
    bestFor: 'Exhibition show birds, large estate aviaries, heritage enthusiasts',
  },
];

export const BreedsGuide: React.FC = () => {
  const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;
  const [activeBreed, setActiveBreed] = useState(0);
  const breed = BREEDS_INFO[activeBreed];

  return (
    <section ref={sectionRef} id="breeds" className="py-16 sm:py-24 bg-[#faf8f4] border-b border-amber-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="reveal reveal-scale inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Preserving Indian Avian Heritage</span>
          </div>
          <h2 className="reveal heading-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900">
            Four Bloodlines,<br />
            <em className="text-amber-700">One Ancient Legacy</em>
          </h2>
          <p className="reveal text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            At <strong>JP Farms</strong>, we maintain pure genetic lines of indigenous Indian gamefowl, carefully selecting for bone density, disease immunity, temperament, and plumage fidelity.
          </p>
        </div>

        {/* Breed Selector Tabs */}
        <div className="reveal flex flex-wrap justify-center gap-2 mb-10">
          {BREEDS_INFO.map((b, i) => (
            <button
              key={i}
              onClick={() => setActiveBreed(i)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
                activeBreed === i
                  ? 'bg-[#1c1410] text-amber-400 border-amber-600/40 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Museum Showcase — Full Bleed Card */}
        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-amber-100/60">

          {/* Left: Full-Bleed Photo */}
          <div className="relative h-72 sm:h-96 lg:h-auto lg:min-h-[480px] overflow-hidden bg-slate-900">
            <img
              key={breed.image}
              src={breed.image}
              alt={breed.name}
              className="w-full h-full object-cover object-center transition-all duration-700"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Origin stamp — top right */}
            <div className="absolute top-4 right-4 text-right">
              <span className="inline-block bg-black/60 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/30 tracking-widest uppercase">
                {breed.originShort}
              </span>
            </div>

            {/* Bilingual name — bottom left */}
            <div className="absolute bottom-5 left-5">
              <p className="text-white/60 text-xs font-medium mb-0.5">Also known as</p>
              <p className="text-amber-300 font-bold text-xl leading-tight">{breed.hindiName}</p>
              <p className="text-amber-200/70 text-sm">{breed.teluguName}</p>
            </div>
          </div>

          {/* Right: Breed Profile */}
          <div className="bg-white p-8 sm:p-10 flex flex-col justify-between space-y-6">

            {/* Name & tagline */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Heritage Bloodline Profile</p>
              <h3 className="heading-serif text-3xl sm:text-4xl text-slate-900 mb-1">{breed.name}</h3>
              <p className={`text-sm font-semibold italic ${breed.accentText}`}>{breed.tagline}</p>
              <p className="text-xs text-slate-500 mt-2">📍 Origin: {breed.origin}</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`${breed.accentBg} ${breed.accentBorder} border rounded-xl p-3 text-center`}>
                <p className="text-xs text-slate-500 font-semibold uppercase">Weight</p>
                <p className={`text-lg font-black ${breed.accentText}`}>{breed.weight}</p>
              </div>
              <div className={`${breed.accentBg} ${breed.accentBorder} border rounded-xl p-3 text-center`}>
                <p className="text-xs text-slate-500 font-semibold uppercase">Height</p>
                <p className={`text-lg font-black ${breed.accentText}`}>{breed.height}</p>
              </div>
            </div>

            {/* Pure Traits */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Defining Pure Traits</p>
              <div className="flex flex-wrap gap-2">
                {breed.traits.map((trait, i) => (
                  <span
                    key={i}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${breed.accentBg} ${breed.accentBorder} ${breed.accentText}`}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div className="bg-[#faf8f4] rounded-xl p-4 border border-amber-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ideal For</p>
              <p className="text-sm text-slate-700 leading-relaxed">{breed.bestFor}</p>
            </div>

            {/* Nav arrows */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                {BREEDS_INFO.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBreed(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeBreed ? 'bg-amber-500 w-5' : 'bg-slate-200 hover:bg-amber-300'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveBreed((activeBreed + 1) % BREEDS_INFO.length)}
                className="flex items-center space-x-1 text-xs font-bold text-amber-700 hover:text-amber-900 transition"
              >
                <span>Next Breed</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
