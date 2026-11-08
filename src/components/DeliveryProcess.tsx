'use client';

import React, { useState } from 'react';
import { MapPin, Compass, ShieldCheck, CheckCircle2, Clock, Phone, Navigation, MessageCircle, Sparkles, Sun, Eye, Award } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

const VISIT_HIGHLIGHTS = [
  {
    step: '01',
    title: 'Open-Sunlight Pasture Stroll',
    desc: 'Witness pure Aseel, Kadaknath, and desi roosters roaming freely in natural sunlit paddocks with authentic dominant postures.',
    icon: Sun,
  },
  {
    step: '02',
    title: 'Physical & Stance Inspection',
    desc: 'Examine standing height, dense bone structures, compact pea combs, curved beaks, and vivid plumage iridescence up close.',
    icon: Eye,
  },
  {
    step: '03',
    title: 'Traditional Nutrition Tour',
    desc: 'Discover our daily organic conditioning formulas: sprouted pearl millet (bajra), crushed almond paste, boiled eggs, and herbal decoctions.',
    icon: ShieldCheck,
  },
  {
    step: '04',
    title: 'Pedigree & Lineage Discussion',
    desc: 'Meet our master breeder to explore genealogical charts, champion sire bloodlines, and scientific indigenous preservation practices.',
    icon: Award,
  },
];

const ROUTES = [
  {
    id: 'hyd',
    city: 'Hyderabad & Secunderabad, Telangana',
    time: 'Approx. 3.5 - 4.5 Hours',
    highway: 'NH 65 (Hyderabad - Vijayawada Highway)',
    directions: 'Take the Outer Ring Road towards NH 65 East. Continue past Suryapet towards the state border. Farm entrance is clearly signposted on the valley service lane.',
    tip: 'Ideal for weekend morning day trips. Early morning visits (7:30 AM - 10:30 AM) let you hear the sunrise crowing chorus.',
  },
  {
    id: 'vja',
    city: 'Vijayawada & Guntur, Andhra Pradesh',
    time: 'Approx. 1.5 - 2 Hours',
    highway: 'NH 65 Westbound Corridor',
    directions: 'Head westbound out of Vijayawada via Ibrahimpatnam on NH 65. Follow the scenic rural valley stretch to our farm estate gate.',
    tip: 'A quick and smooth highway drive. Best visited in the late afternoon (3:30 PM - 6:00 PM) during outdoor exercise time.',
  },
  {
    id: 'vizag',
    city: 'Visakhapatnam & Coastal Andhra Hubs',
    time: 'Approx. 6.5 - 7.5 Hours (or Overnight Train)',
    highway: 'NH 16 to NH 65 Interchange',
    directions: 'Take NH 16 south through Rajahmundry to Vijayawada, then merge onto NH 65 westbound towards our estate.',
    tip: 'Many enthusiasts travel via the evening Janmabhoomi or Godavari Express trains to Vijayawada, followed by a short morning cab ride to the farm.',
  },
  {
    id: 'blr',
    city: 'Bengaluru, Karnataka',
    time: 'Approx. 8 - 9 Hours (or Direct Overnight Sleeper)',
    highway: 'NH 44 to Kurnool / Highway Connection',
    directions: 'Drive via NH 44 through Anantapur and Kurnool, or travel via comfortable direct overnight sleeper coach service to the nearest junction.',
    tip: 'We recommend scheduling your visit on Saturday morning and spending a peaceful weekend afternoon surrounded by rural nature.',
  },
  {
    id: 'che',
    city: 'Chennai, Tamil Nadu',
    time: 'Approx. 7.5 - 8.5 Hours',
    highway: 'NH 16 Northbound to Vijayawada',
    directions: 'Take the Grand Southern Trunk / NH 16 route through Nellore and Ongole towards the NH 65 intersection.',
    tip: 'Advance notification helps us prepare a dedicated guided tour of our Aseel Peela and Kagar breeding paddocks.',
  },
];

export const DeliveryProcess: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('hyd');

  const selectedRoute = ROUTES.find(r => r.id === selectedRouteId) || ROUTES[0];

  const visitWhatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hello JP Farms! 🐓 I am planning to visit your farm traveling from ${selectedRoute.city}. Could you share your location pin on Google Maps and confirm visiting availability?`,
  });

  return (
    <section id="visit-guide" className="py-16 sm:py-24 bg-gradient-to-b from-white via-sky-50/30 to-white border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 border border-sky-200 px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Farm Visitation & Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visit JP Farms & Experience Living Heritage
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We welcome avian enthusiasts, breeders, and families to visit our open pastures. Discover how pure Indian gamefowl genetics are preserved in a stress-free, natural environment.
          </p>
        </div>

        {/* 4 Highlights Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {VISIT_HIGHLIGHTS.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm relative overflow-hidden group hover:border-sky-300 transition"
              >
                <div className="text-4xl font-black text-sky-100 absolute top-3 right-4 select-none group-hover:text-sky-200 transition">
                  {h.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {h.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Travel Guide & Farm Location Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Route Planner */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-sky-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Travel & Highway Directions Guide
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select your starting city to see highway routes, estimated drive time, and visit advice.
                  </p>
                </div>
              </div>
            </div>

            {/* City Dropdown Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Starting Location:
              </label>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="w-full p-3.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
              >
                {ROUTES.map((route) => (
                  <option key={route.id} value={route.id}>
                    📍 {route.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Results Card */}
            <div className="bg-sky-50/40 border border-sky-100 rounded-2xl p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-sky-100 pb-2.5">
                <span className="text-slate-500 font-medium">Estimated Travel Time:</span>
                <span className="font-mono font-black text-sm text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded">
                  ⏱️ {selectedRoute.time}
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-sky-100 pb-2.5">
                <span className="text-slate-500 font-medium w-1/3">Highway Corridor:</span>
                <span className="font-bold text-slate-900 text-right w-2/3">{selectedRoute.highway}</span>
              </div>

              <div className="flex items-start justify-between border-b border-sky-100 pb-2.5">
                <span className="text-slate-500 font-medium w-1/3">Driving Route:</span>
                <span className="font-medium text-slate-700 text-right w-2/3 leading-relaxed">
                  {selectedRoute.directions}
                </span>
              </div>

              <div className="flex items-start justify-between pt-1">
                <span className="text-slate-500 font-medium w-1/3">Best Time to Visit:</span>
                <span className="font-semibold text-emerald-800 text-right w-2/3">{selectedRoute.tip}</span>
              </div>
            </div>

            {/* Direct WhatsApp Action for Location Pin */}
            <a
              href={visitWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-md shadow-sky-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get WhatsApp Live Location Pin & Confirm Visit</span>
            </a>

            <p className="text-[11px] text-slate-500 text-center">
              * Visiting hours are <strong>7:00 AM to 7:00 PM daily</strong>. Advance notice ensures our farm curator is available to guide you.
            </p>
          </div>

          {/* Direct Farm Information Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-sky-800/40 shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300 bg-sky-500/20 px-2.5 py-1 rounded-md border border-sky-400/30">
              Visitors & Breeders Welcome
            </span>
            <h3 className="text-xl font-bold text-white">
              Plan Your Visit to JP Farms Estate
            </h3>
            <p className="text-xs text-sky-200 leading-relaxed">
              Experience the strength, vitality, and proud crowing of indigenous Indian gamefowl. Walk through our naturally landscaped open paddocks and interact directly with our breeding team.
            </p>

            <div className="space-y-2 text-xs text-sky-200 pt-2 border-t border-sky-800/50">
              <p>📍 <strong>Location:</strong> {FARM_INFO.address}</p>
              <p>⏰ <strong>Visiting Hours:</strong> {FARM_INFO.hours}</p>
              <p>🌱 <strong>Bio-Security:</strong> Footwear sanitization station provided at entrance</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`tel:${FARM_INFO.phone}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg"
              >
                <Phone className="w-4 h-4" />
                <span>Call Farm ({FARM_INFO.phone})</span>
              </a>

              <a
                href={visitWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-slate-800/90 hover:bg-slate-800 text-emerald-400 font-semibold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Map</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
