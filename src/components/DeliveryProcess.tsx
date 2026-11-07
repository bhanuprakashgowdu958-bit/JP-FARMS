'use client';

import React, { useState } from 'react';
import { Truck, Box, ShieldCheck, MapPin, CheckCircle2, Clock, Phone, AlertCircle, Calculator, MessageCircle, Sparkles } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

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

const DESTINATIONS = [
  {
    id: 'hyd',
    city: 'Hyderabad & Secunderabad, Telangana',
    time: '8 - 14 Hours',
    route: 'Direct Overnight Express Sleeper Bus / Van',
    hub: 'MGBS / Uppal / Shamshabad / Lakdikapul Handover',
    crate: 'Single Deluxe Ventilated Crate with Electrolyte Gel & Sliced Cucumbers',
    costEstimate: '₹400 - ₹600',
  },
  {
    id: 'vja',
    city: 'Vijayawada, Guntur & Amaravati, AP',
    time: '4 - 8 Hours',
    route: 'Same-Day Direct Highway Pet Courier',
    hub: 'PNBS Central / Auto Nagar / Benz Circle Pickup',
    crate: 'Standard High-Airflow Crate with Fresh Greens & Grains',
    costEstimate: '₹300 - ₹450',
  },
  {
    id: 'vizag',
    city: 'Visakhapatnam, Rajahmundry & Kakinada, AP',
    time: '12 - 16 Hours',
    route: 'Express Coastal Route / Train Pet Parcel',
    hub: 'Vizag Central Railway Parcel Hub / Maddilapalem',
    crate: 'Reinforced Multi-Vent Wooden Crate with Long-Transit Nutrition',
    costEstimate: '₹500 - ₹750',
  },
  {
    id: 'blr',
    city: 'Bengaluru & Karnataka Hubs',
    time: '14 - 20 Hours',
    route: 'Direct Inter-State Sleeper Bus Pet Courier',
    hub: 'Majestic / Anand Rao Circle / Madiwala / Electronic City',
    crate: 'High-Strength Eco Timber Crate with Dual Hydration Slices',
    costEstimate: '₹600 - ₹900',
  },
  {
    id: 'che',
    city: 'Chennai, Coimbatore & Tamil Nadu Hubs',
    time: '16 - 22 Hours',
    route: 'Direct Express Road Network / Express Train',
    hub: 'Koyambedu CMBT / Chennai Central Parcel Office',
    crate: 'Climate-Guarded Ventilated Travel Crate',
    costEstimate: '₹650 - ₹950',
  },
  {
    id: 'pun',
    city: 'Pune & Mumbai, Maharashtra',
    time: '20 - 28 Hours',
    route: 'Direct Superfast Train Express Pet Parcel',
    hub: 'Pune Junction / Kalyan / Dadar Railway Parcel Office',
    crate: 'Long-Distance Heavy Armor Crate with 48h Moisture Reserves',
    costEstimate: '₹800 - ₹1,200',
  },
  {
    id: 'bbs',
    city: 'Bhubaneswar & Odisha Hubs',
    time: '24 - 32 Hours',
    route: 'Direct Superfast Train Live Animal Parcel',
    hub: 'Bhubaneswar Central Railway Parcel Office',
    crate: 'Full-Perch Heavy Crate with Fortified Grain Bedding',
    costEstimate: '₹850 - ₹1,300',
  },
  {
    id: 'del',
    city: 'Delhi NCR, Punjab & North India',
    time: '32 - 42 Hours',
    route: 'Direct Rajdhani / Express Train Pet Luggage Coach',
    hub: 'New Delhi / Hazrat Nizamuddin Railway Parcel Terminal',
    crate: 'Premium Extended-Journey Climate Protected Crate with Double Water Cups',
    costEstimate: '₹1,200 - ₹1,800',
  },
];

export const DeliveryProcess: React.FC = () => {
  const [selectedDestId, setSelectedDestId] = useState<string>('hyd');

  const selectedDestination = DESTINATIONS.find(d => d.id === selectedDestId) || DESTINATIONS[0];

  const destinationWhatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hi JP Farms! 🐓 I would like to inquire about live rooster delivery to ${selectedDestination.city}. What is the upcoming dispatch schedule and transit cost?`,
  });

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

        {/* Interactive Transit Calculator & Farm Visit Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Transit Calculator */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Live Animal Transit Calculator
                  </h3>
                  <p className="text-xs text-stone-500">
                    Select your city to check travel hours, crate specifications, and delivery hubs.
                  </p>
                </div>
              </div>
            </div>

            {/* City Dropdown Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                Select Your Delivery City / Region:
              </label>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full p-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-900 focus:ring-2 focus:ring-amber-500"
              >
                {DESTINATIONS.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    📍 {dest.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Results Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <span className="text-stone-500 font-medium">Estimated Travel Duration:</span>
                <span className="font-mono font-black text-sm text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded">
                  ⏱️ {selectedDestination.time}
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-stone-200 pb-2.5">
                <span className="text-stone-500 font-medium w-1/3">Transit Route Mode:</span>
                <span className="font-bold text-stone-900 text-right w-2/3">{selectedDestination.route}</span>
              </div>

              <div className="flex items-start justify-between border-b border-stone-200 pb-2.5">
                <span className="text-stone-500 font-medium w-1/3">Nearest Pickup Hub:</span>
                <span className="font-semibold text-stone-900 text-right w-2/3 text-emerald-800">
                  {selectedDestination.hub}
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-stone-200 pb-2.5">
                <span className="text-stone-500 font-medium w-1/3">Travel Crate Specs:</span>
                <span className="font-medium text-stone-700 text-right w-2/3">{selectedDestination.crate}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-stone-500 font-medium">Approx. Transit Charges:</span>
                <span className="font-extrabold text-stone-900">{selectedDestination.costEstimate}</span>
              </div>
            </div>

            {/* Direct WhatsApp Action for Selected Route */}
            <a
              href={destinationWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm Delivery Schedule for {selectedDestination.city.split(',')[0]}</span>
            </a>

            <p className="text-[11px] text-stone-500 text-center">
              * Live bird dispatches operate on <strong>Monday, Wednesday & Saturday</strong> to ensure weekend arrival with zero transit halts.
            </p>
          </div>

          {/* Direct Farm Visit Option */}
          <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-4">
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
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg"
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
