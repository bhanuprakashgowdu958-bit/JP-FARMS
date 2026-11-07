'use client';

import React from 'react';
import { ShieldCheck, Heart, Sparkles, Activity, CheckCircle2, Leaf, Sun, Award } from 'lucide-react';

export const FarmBioSecurity: React.FC = () => {
  return (
    <section id="biosecurity" className="py-16 sm:py-24 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Farm Standards & Health Guarantee</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How JP Farms Raises Champion Roosters
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Our birds are not raised in cramped battery cages. They run on sprawling open grassy yards, soak natural morning sunlight, and eat high-energy Ayurvedic and nutrient-dense traditional diets.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-6 space-y-4 hover:border-emerald-600/40 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Traditional High-Energy Nutrition</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Fed with soaked Bajra (Pearl Millet), sprouted pulses, crushed almond paste, garlic greens, and calcium oyster shells. Zero commercial steroids or artificial growth promoters.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Chemical-Free Growth</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-6 space-y-4 hover:border-emerald-600/40 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Verified 4-Stage Vaccination</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Timely vaccinated against Ranikhet (ND Lasota & R2B), Fowl Pox, Gumboro (IBD), and systematic internal deworming every 45 days. Every rooster gets an individualized health record.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Veterinary Clearance</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-6 space-y-4 hover:border-emerald-600/40 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Natural Roaming & Bone Density</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Birds get minimum 6 hours of outdoor foraging on pasture daily. Natural perching on wooden poles and sunlight exposure develops dense bone structure and heavy leg shanks.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>High Stamina & Toughness</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-6 space-y-4 hover:border-emerald-600/40 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Zero In-Breeding Genetic Purity</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              We track maternal and paternal lineage records over 6 generations. No close sibling mating ensures peak reproductive fertility, disease immunity, and breed conformation standards.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Heritage Stud Authentication</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

