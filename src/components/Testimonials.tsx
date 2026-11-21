'use client';

import React from 'react';
import { Star, CheckCircle2, Quote, UserCheck, MapPin, Award } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const REVIEWS = [
  {
    name: 'Venkatesh Naidu',
    location: 'Guntur, Andhra Pradesh',
    strainObserved: 'Pure Peela Aseel (Tag: JP-AS-88)',
    rating: 5,
    text: 'Visited JP Farms directly near the highway border. The roosters are raised in open, unpolluted natural paddocks. Bone thickness, pea comb, and upright stance match the unedited walking videos perfectly. Truly an exceptional indigenous breeding estate.',
    date: 'October 2026',
  },
  {
    name: 'Abdul Rehman',
    location: 'Bangalore Rural, Karnataka',
    strainObserved: 'Sindhi Heavy Aseel (4.2 Kg)',
    rating: 5,
    text: 'Purest Aseel bloodlines I have seen in 9 years of gamefowl research. The farm team is deeply knowledgeable about indigenous genetics, traditional bajra diets, and selective line breeding. Their video reels give complete transparency.',
    date: 'September 2026',
  },
  {
    name: 'Dr. Sandeep Kulkarni',
    location: 'Kolhapur, Maharashtra',
    strainObserved: 'Original Kadaknath Heritage Line',
    rating: 5,
    text: 'Inspected their Kadaknath flock and farm bio-security protocols during my visit. 100% natural feed with zero antibiotics, thorough veterinary records, and verified melanin purity. A model facility for native avian conservation.',
    date: 'November 2026',
  },
];

export const Testimonials: React.FC = () => {
  const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;
  return (
    <section ref={sectionRef} id="reviews" className="py-16 sm:py-24 bg-[#1c1410] border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="reveal reveal-scale inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-900/40 border border-amber-700/50 px-3 py-1 rounded-full">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Visitor &amp; Breeder Experiences</span>
          </div>

          {/* Google Maps Trust Badge */}
          <div className="reveal flex items-center justify-center pt-1">
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white">
              <span className="flex items-center text-amber-400 font-black">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                4.9 / 5.0
              </span>
              <span className="text-white/30">•</span>
              <span className="text-amber-200/90 font-medium">120+ Verified Farm Visitors</span>
              <span className="text-white/30">•</span>
              <span className="inline-flex items-center text-emerald-400 font-semibold">
                <MapPin className="w-3 h-3 mr-1" />
                Google Verified
              </span>
            </div>
          </div>

          <h2 className="reveal heading-serif text-3xl sm:text-4xl lg:text-5xl text-white">
            Words from the<br />
            <em className="text-amber-400">Avian Brotherhood</em>
          </h2>
          <p className="reveal text-amber-200/70 text-sm sm:text-base">
            Visited by poultry conservationists, avian veterinarians, and desi rooster enthusiasts from across India.
          </p>
        </div>

        {/* 3 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className={`reveal reveal-delay-${idx + 1} relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition`}
            >
              {/* Giant quote watermark */}
              <div className="absolute top-4 right-5 text-[80px] leading-none text-amber-500/10 font-serif select-none pointer-events-none">&ldquo;</div>

              <div className="space-y-3 relative">
                {/* Star rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/80 leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{review.name}</h4>
                    <p className="text-xs text-amber-200/60">{review.location}</p>
                  </div>
                  <span title="Verified Visitor">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-semibold text-amber-400 bg-amber-900/40 border border-amber-700/40 px-2 py-0.5 rounded inline-block">
                  {review.strainObserved}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
