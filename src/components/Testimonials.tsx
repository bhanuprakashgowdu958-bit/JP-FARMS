'use client';

import React from 'react';
import { Star, CheckCircle2, Quote, UserCheck } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Venkatesh Naidu',
    location: 'Guntur, Andhra Pradesh',
    breedBought: 'Pure Peela Aseel (Tag: JP-AS-88)',
    rating: 5,
    text: 'Received the bird via safe travel crate in Vijayawada within 18 hours of booking. The rooster was 100% active upon unboxing. Bone thickness and pea comb were exactly as shown in the live video. Highly trustworthy farm.',
    date: 'October 2026',
  },
  {
    name: 'Abdul Rehman',
    location: 'Bangalore Rural, Karnataka',
    breedBought: 'Sindhi Heavy Aseel (4.2 Kg)',
    rating: 5,
    text: 'Best Aseel bloodline I have acquired in 7 years of breeding. The rooster produced 14 fertile eggs in our first clutch.JP Farms shares genuine unedited walking videos so you know exactly what you are purchasing.',
    date: 'September 2026',
  },
  {
    name: 'Dr. Sandeep Kulkarni',
    location: 'Kolhapur, Maharashtra',
    breedBought: 'Original Kadaknath Breeding Trio',
    rating: 5,
    text: 'Ordered Kadaknath rooster and two hens for organic free-range farming. Shipped to Pune hub with zero stress. Full vaccination card was stamped and attached to crate. Will buy again.',
    date: 'November 2026',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Verified Customer Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Trusted by Serious Breeders Nationwide
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Over 3,450 roosters safely delivered to breeders, poultry farms, and enthusiasts across India.
          </p>
        </div>

        {/* 3 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-500/50 hover:shadow-md transition"
            >
              <div className="space-y-3">
                {/* Star rating */}
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-stone-300" />

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{review.name}</h4>
                    <p className="text-xs text-stone-500">{review.location}</p>
                  </div>
                  <span title="Verified Purchaser">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded inline-block">
                  {review.breedBought}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
