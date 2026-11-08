'use client';

import React from 'react';
import { ShieldCheck, Heart, Sparkles, Activity, CheckCircle2, Leaf, Sun, Award } from 'lucide-react';

export const FarmBioSecurity: React.FC = () => {
  return (
    <section id="biosecurity" className="py-16 sm:py-24 bg-gradient-to-b from-sky-50/60 via-white to-sky-50/40 text-slate-800 border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 border border-sky-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Farm Standards & Health Guarantee</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How JP Farms Raises Champion Roosters
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Our birds are never raised in cramped battery cages. They run on sprawling open grassy yards, soak natural morning sunlight, and thrive on high-energy Ayurvedic and nutrient-dense traditional diets.
          </p>
        </div>

        {/* 4 Pillars Grid (Light Sky Blue Card Elegance) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 space-y-4 hover:border-sky-300 hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
              Traditional High-Energy Nutrition
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fed with soaked Bajra (Pearl Millet), sprouted pulses, crushed almond paste, garlic greens, and calcium oyster shells. Zero commercial steroids or artificial growth promoters.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 pt-2 border-t border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Chemical-Free Growth</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 space-y-4 hover:border-sky-300 hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition">
              Verified 4-Stage Vaccination
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Timely vaccinated against Ranikhet (ND Lasota & R2B), Fowl Pox, Gumboro (IBD), and systematic internal deworming every 45 days. Every rooster gets an individualized health record.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 pt-2 border-t border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Veterinary Clearance</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 space-y-4 hover:border-sky-300 hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-110 transition">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition">
              Natural Roaming & Bone Density
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Birds get minimum 6 hours of outdoor foraging on pasture daily. Natural perching on wooden poles and sunlight exposure develops dense bone structure and heavy leg shanks.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 pt-2 border-t border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>High Stamina & Toughness</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 space-y-4 hover:border-sky-300 hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition">
              Zero In-Breeding Genetic Purity
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We track maternal and paternal lineage records over 6 generations. No close sibling mating ensures peak reproductive fertility, disease immunity, and breed conformation standards.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 pt-2 border-t border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Heritage Stud Authentication</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
