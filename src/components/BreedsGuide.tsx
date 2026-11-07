'use client';

import React from 'react';
import { Award, Feather, ShieldCheck, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';

const BREEDS_INFO = [
  {
    name: 'Pure Aseel (Peela)',
    hindiName: 'पीला असील',
    tagline: 'The Ancient Royal Warrior of India',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
    origin: 'Andhra Pradesh & Punjab Royal Avian Heritage',
    traits: ['Compact Pea Comb', 'Golden-Red Plumage', 'High Bone Density', 'Fearless Upright Stance'],
    weight: '3.5 - 4.5 Kg',
    bestFor: 'Championship breeding studs, bloodline preservation, collectors',
  },
  {
    name: 'Pure Kadaknath (Kali Masi)',
    hindiName: 'कड़कनाथ',
    tagline: 'High-Protein Jet Black Medicinal Breed',
    image: 'https://images.unsplash.com/photo-1589332278453-611a91e5e04d?auto=format&fit=crop&w=600&q=80',
    origin: 'Jhabua / Dhar District, Madhya Pradesh',
    traits: ['100% Melanin Black Skin, Bones & Flesh', 'Zero Chemical Raised', 'Low Cholesterol, High Iron', 'Cold & Heat Resistant'],
    weight: '2.0 - 2.6 Kg',
    bestFor: 'Medicinal poultry farming, immune boosting nutrition, organic backyard flocks',
  },
  {
    name: 'Aseel Kagar (Green Sheen)',
    hindiName: 'कागर असील',
    tagline: 'Heavyweight Glossy Metallic Plumage',
    image: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=600&q=80',
    origin: 'Historic Deccan Plateau Stud Farms',
    traits: ['Tight Walnut Comb', 'Metallic Emerald Green Sheen', 'Wide Stance & Heavy Thighs', 'Natural Aggressive Alertness'],
    weight: '3.8 - 4.8 Kg',
    bestFor: 'Stud rooster for upgrading flock genetics, heavy size breeding',
  },
  {
    name: 'Sindhi Longneck Aseel',
    hindiName: 'सिंधी असील',
    tagline: 'Towering Height & Majestic Presence',
    image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=600&q=80',
    origin: 'Sindh & Western Border Valleys',
    traits: ['26 to 29 Inches Standing Height', 'Pearl White Eyes', 'Elongated Muscular Neck', 'Deep Low Crowing Sound'],
    weight: '4.2 - 5.2 Kg',
    bestFor: 'Exhibition show birds, large estate aviaries, heritage enthusiasts',
  },
];

export const BreedsGuide: React.FC = () => {
  return (
    <section id="breeds" className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>Preserving Indian Avian Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Our Pure Heritage Breeds
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            At <strong>JP Farms</strong>, we do not cross-breed commercial broilers. We maintain pure genetic lines of indigenous Indian gamefowl and country roosters, carefully selecting for bone density, disease immunity, temperament, and plumage fidelity.
          </p>
        </div>

        {/* 4-Column Breeds Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BREEDS_INFO.map((breed, index) => (
            <div
              key={index}
              className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden flex flex-col hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden bg-stone-900">
                <img
                  src={breed.image}
                  alt={breed.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-xs font-bold text-amber-400 bg-stone-900/80 px-2 py-0.5 rounded">
                    {breed.hindiName}
                  </span>
                  <span className="text-[11px] font-mono text-stone-300 bg-stone-950/80 px-2 py-0.5 rounded">
                    {breed.weight}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition">
                    {breed.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-700 mt-0.5">
                    {breed.tagline}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Origin: {breed.origin}
                  </p>

                  <div className="mt-3 space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-stone-400">Key Pure Traits:</p>
                    <ul className="text-xs text-stone-700 space-y-1">
                      {breed.traits.map((trait, tIdx) => (
                        <li key={tIdx} className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200">
                  <p className="text-[11px] text-stone-600">
                    <strong className="text-stone-800">Ideal For:</strong> {breed.bestFor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
