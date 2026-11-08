'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Calendar,
  Sparkles,
  Award,
  Clock
} from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { useInquiries } from '@/lib/roosterStore';
import { useAuth } from '@/lib/authStore';

interface BookingModalProps {
  rooster: Rooster | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  rooster,
  onClose,
  onSuccess,
}) => {
  const { addInquiry } = useInquiries();
  const { user, updatePhone } = useAuth();

  const [inquiryType, setInquiryType] = useState<'farm_visit' | 'breed_info' | 'general'>('farm_visit');
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [city, setCity] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!rooster) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) {
      alert('Please fill in your name, contact phone number, and city.');
      return;
    }

    setIsSubmitting(true);

    try {
      addInquiry({
        roosterId: rooster.id,
        roosterTag: rooster.tagId,
        roosterName: rooster.name,
        customerName: name,
        phoneNumber: phone,
        cityState: city,
        message: `${inquiryType.toUpperCase()}: Date: ${preferredDate || 'Flexible'}. ${message || 'Interested in visiting JP Farms to witness this rooster.'}`,
        inquiryType: inquiryType === 'farm_visit' ? 'farm_visit' : 'breed_info',
        status: 'new',
      });

      if (phone.trim()) {
        try {
          updatePhone(phone.trim());
        } catch (e) {}
      }

      // Celebratory confetti
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
      });

      setIsSubmitted(true);
      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppFinalUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hello JP Farms! 🐓\n\nI would like to schedule a farm visit / breed inquiry for Rooster #${rooster.tagId} (${rooster.name}, ${rooster.breed}).\n- My Name: ${name}\n- Phone: ${phone}\n- City: ${city}\n- Preferred Date: ${preferredDate || 'Flexible'}\n- Message: ${message || 'Looking forward to meeting you and seeing the roosters.'}`,
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
        
        {/* Header */}
        <div className="bg-stone-950 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isSubmitted ? 'Visit Request Received!' : 'Schedule Farm Visit & Inquire'}</span>
            </h2>
            <p className="text-xs text-stone-400">
              JP Farms Heritage Desi & Aseel Conservation Estate
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-stone-900">
                Thank You, {name}!
              </h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Your visit request to witness <strong>{rooster.name}</strong> (Tag: <span className="font-mono text-amber-800 font-bold">{rooster.tagId}</span>) has been scheduled.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Visitor:</span>
                <span className="font-bold text-stone-900">{name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Phone:</span>
                <span className="font-bold text-stone-900">{phone}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">City / Location:</span>
                <span className="font-bold text-stone-900">{city}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">Visiting Hours:</span>
                <span className="font-bold text-emerald-700">7:00 AM - 7:00 PM Daily</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={whatsAppFinalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition active:scale-95 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Notify Farm on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full text-xs text-stone-500 hover:text-stone-800 py-2"
              >
                Close and return to showcase
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Selected Rooster Summary Card */}
            <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <img
                src={rooster.images[0]}
                alt={rooster.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono text-[10px] font-bold bg-amber-500/20 text-amber-800 px-1.5 py-0.5 rounded">
                    TAG: {rooster.tagId}
                  </span>
                  <span className="text-[11px] text-stone-500 truncate">{rooster.breed}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 truncate">{rooster.name}</h4>
                <p className="text-xs font-semibold text-amber-700">{rooster.badge} • {rooster.weight}</p>
              </div>
            </div>

            {/* Inquiry Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                Purpose of Contact:
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInquiryType('farm_visit')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    inquiryType === 'farm_visit'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <Calendar className="w-4 h-4 mb-1 text-amber-700" />
                  <span className="text-xs">Schedule Farm Visit</span>
                  <span className="text-[10px] text-stone-500">Witness roosters in person</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryType('breed_info')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    inquiryType === 'breed_info'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <Award className="w-4 h-4 mb-1 text-amber-700" />
                  <span className="text-xs">Breed & Lineage Info</span>
                  <span className="text-[10px] text-stone-500">Ask genetics questions</span>
                </button>
              </div>
            </div>

            {/* Visitor Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad, Vijayawada, Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Preferred Visit Date (Optional)
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Questions or Note for the Breeder
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us what you would like to know or discuss during your visit..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Farm Visiting Hours Info */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-stone-600">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Farm is open for visitors 7:00 AM to 7:00 PM daily. Visitors are requested to schedule in advance.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-extrabold shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Visit Request'}
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};

export const FarmVisitModal = BookingModal;
