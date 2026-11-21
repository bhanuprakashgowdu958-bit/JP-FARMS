'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Leaf, Sun, Award, Syringe } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const PILLARS = [
  {
    icon: Leaf,
    iconBg: 'bg-emerald-500',
    label: 'Zero Steroids',
    stat: '0%',
    statLabel: 'Artificial Additives',
    title: 'Traditional High-Energy Nutrition',
    desc: 'Fed with soaked Bajra (Pearl Millet), sprouted pulses, crushed almond paste, garlic greens, and calcium oyster shells. Zero commercial steroids or artificial growth promoters.',
    badge: '100% Chemical-Free Growth',
    side: 'left',
  },
  {
    icon: Syringe,
    iconBg: 'bg-amber-500',
    label: 'Fully Vaccinated',
    stat: '4',
    statLabel: 'Vaccine Stages',
    title: 'Verified 4-Stage Vaccination',
    desc: 'Timely vaccinated against Ranikhet (ND Lasota & R2B), Fowl Pox, Gumboro (IBD), and systematic internal deworming every 45 days. Every rooster gets an individualized health record.',
    badge: 'Full Veterinary Clearance',
    side: 'right',
  },
  {
    icon: Sun,
    iconBg: 'bg-sky-500',
    label: 'Open Pasture',
    stat: '6h+',
    statLabel: 'Daily Outdoor Time',
    title: 'Natural Roaming & Bone Density',
    desc: 'Birds get minimum 6 hours of outdoor foraging on pasture daily. Natural perching on wooden poles and sunlight exposure develops dense bone structure and heavy leg shanks.',
    badge: 'High Stamina & Toughness',
    side: 'left',
  },
  {
    icon: Award,
    iconBg: 'bg-purple-500',
    label: 'Pure Genetics',
    stat: '6',
    statLabel: 'Generations Tracked',
    title: 'Zero In-Breeding Genetic Purity',
    desc: 'We track maternal and paternal lineage records over 6 generations. No close sibling mating ensures peak reproductive fertility, disease immunity, and breed conformation standards.',
    badge: 'Heritage Stud Authentication',
    side: 'right',
  },
];

export const FarmBioSecurity: React.FC = () => {
  const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;
  return (
    <section ref={sectionRef} id="biosecurity" className="py-16 sm:py-24 bg-[#141210] text-white border-b border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="reveal reveal-scale inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/40 border border-emerald-700/50 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Farm Standards &amp; Health Guarantee</span>
          </div>
          <h2 className="reveal heading-serif text-3xl sm:text-4xl lg:text-5xl text-white">
            Raised the <em className="text-emerald-400">Traditional Way,</em><br />
            Certified the Modern Way
          </h2>
          <p className="reveal text-white/60 text-sm sm:text-base leading-relaxed">
            Our birds are never raised in cramped battery cages. They run on sprawling open grassy yards,
            soak natural morning sunlight, and thrive on high-energy Ayurvedic diets.
          </p>

          {/* Top stats bar */}
          <div className="reveal flex flex-wrap justify-center gap-6 pt-4">
            {[['0%', 'Steroids'], ['0%', 'Antibiotics'], ['100%', 'Pasture Raised'], ['100%', 'Natural Feed']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <p className="text-2xl font-black text-emerald-400">{val}</p>
                <p className="text-xs text-white/50 font-medium">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Apple-style alternating feature rows */}
        <div className="space-y-20 sm:space-y-28">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            const isLeft = pillar.side === 'left';
            return (
              <div
                key={i}
                className={`reveal flex flex-col ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-center gap-10 sm:gap-16`}
              >
                {/* Visual side */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    {/* Big stat circle */}
                    <div className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full ${pillar.iconBg}/10 border border-white/10 flex flex-col items-center justify-center shadow-2xl`}>
                      <div className={`w-16 h-16 rounded-2xl ${pillar.iconBg} flex items-center justify-center mb-3 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-4xl font-black text-white">{pillar.stat}</p>
                      <p className="text-xs text-white/50 text-center px-6 leading-tight mt-1">{pillar.statLabel}</p>
                    </div>
                    {/* Glow */}
                    <div className={`absolute inset-0 rounded-full ${pillar.iconBg}/5 blur-3xl -z-10`} />
                  </div>
                </div>

                {/* Text side */}
                <div className="flex-1 space-y-5">
                  <span className={`inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${pillar.iconBg}/20 border border-white/10`} style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {pillar.label}
                  </span>
                  <h3 className="heading-serif text-2xl sm:text-3xl text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                    {pillar.desc}
                  </p>
                  <div className="flex items-center space-x-2 text-emerald-400 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{pillar.badge}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
