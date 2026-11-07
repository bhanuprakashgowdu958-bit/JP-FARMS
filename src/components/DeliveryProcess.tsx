'use client';

import React from 'react';
import { Truck, Box, ShieldCheck, MapPin, CheckCircle2, Clock, Phone, AlertCircle } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';

const TRANSIT_STEPS = [
  {
    step: '01',
    title: 'Pre-Transit Health & Hydration Check',
    desc: '24 hours prior to travel, the rooster is fed electrolyte hydration water and examined by our avian health specialist.',
    icon: ShieldCheck,
  },
  {
    step: '02',
    title: 'Customized Ventilated Travel Crate',
    desc: 'Each bird is placed in an individual ventilated crate layered with clean wood shavings, high-moisture fruits (apple/cucumber), and dry grain mix.',
    icon: Box,
  },
  {
    step: '03',
    title: 'Direct Express Transit Route',
    desc: 'Dispatched via authorized pet transit sleeper road network or express train parcel with live-bird handling tags.',
    icon: Truck,
  },
  {
    step: '04',
    title: 'Live Arrival Guarantee & Verification',
    desc: 'We provide full live-arrival guarantee. Customer inspects bird upon receiving and shares arrival video on WhatsApp.',
    icon: CheckCircle2,
  },
];

const REGIONS = [
  { name: 'Andhra Pradesh & Telangana', time: '12 - 24 Hours', note: 'Direct van delivery & bus courier' },
  { name: 'Karnataka & Bangalore', time: '24 Hours', note: 'Daily direct routes' },
  { name: 'Tamil Nadu & Chennai', time: '24 - 36 Hours', note: 'Express train & pet bus' },
  { name: 'Maharashtra & Mumbai/Pune', time: '24 - 40 Hours', note: 'Express train & road transit' },
  { name: 'Odisha, Kerala & Central Hubs', time: '36 - 48 Hours', note: 'Special ventilated crate' },
];

export const DeliveryProcess: React.FC = () => {
  return (
    <section id="transit" className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Safe All-India Live Animal Logistics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            How We Safely Deliver Living Birds
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Shipping live heritage birds requires utmost care and specialized packaging. Over 9 years, JP Farms has perfected a zero-injury transit system ensuring your rooster arrives alert, healthy, and stress-free.
          </p>
        </div>

        {/* 4 Steps Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {TRANSIT_STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition"
              >
                <div className="text-4xl font-black text-stone-100 absolute top-3 right-4 select-none group-hover:text-amber-100 transition">
                  {s.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Coverage Table & Farm Visit Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coverage List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Standard Transit Times by Region</span>
            </h3>

            <div className="divide-y divide-stone-100">
              {REGIONS.map((region, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <p className="font-semibold text-stone-900">{region.name}</p>
                    <p className="text-[11px] text-stone-500">{region.note}</p>
                  </div>
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                    {region.time}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-500 mt-4 pt-3 border-t border-stone-100">
              * Live transit dispatch days: Every Monday, Wednesday, and Saturday to avoid weekend bottlenecks.
            </p>
          </div>

          {/* Direct Farm Visit Option */}
          <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/30">
              Direct Farm Pickup Welcome
            </span>
            <h3 className="text-xl font-bold text-white">
              Prefer Hand-Picking Your Rooster in Person?
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              You are welcome to visit <strong>JP Farms</strong> in person. Inspect our stud pens, observe birds in open daylight, test stances, and carry your chosen rooster directly in a complimentary travel box.
            </p>

            <div className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
              <p>📍 <strong>Location:</strong> {FARM_INFO.address}</p>
              <p>⏰ <strong>Visiting Hours:</strong> {FARM_INFO.hours}</p>
            </div>

            <div className="pt-2">
              <a
                href={`tel:${FARM_INFO.phone}`}
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call to Schedule Visit ({FARM_INFO.phone})</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
