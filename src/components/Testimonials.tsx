'use client';

import React from 'react';
import { Star, CheckCircle2, Quote, UserCheck } from 'lucide-react';

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
  return (
    <section id="reviews" className="py-16 sm:py-24 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/30 border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 border border-sky-200 px-3 py-1 rounded-full">
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Visitor & Breeder Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recognized by Avian Breeders Nationwide
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Visited by poultry conservationists, avian veterinarians, and desi rooster enthusiasts from across India.
          </p>
        </div>

        {/* 3 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-sky-300 hover:shadow-md transition"
            >
              <div className="space-y-3">
                {/* Star rating */}
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-sky-200" />

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-sky-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.location}</p>
                  </div>
                  <span title="Verified Visitor">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-semibold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded inline-block">
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
