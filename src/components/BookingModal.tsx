'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';
import { formatPrice, generateWhatsAppLink } from '@/lib/utils';
import { useInquiries } from '@/lib/roosterStore';

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

  const [bookingType, setBookingType] = useState<'token' | 'full' | 'visit'>('token');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
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
        message: `${bookingType.toUpperCase()} BOOKING: ${message || 'Interested in booking this bird with safe live transit.'}`,
        inquiryType: bookingType === 'token' ? 'booking_token' : bookingType === 'visit' ? 'farm_visit' : 'whatsapp',
        status: 'new',
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
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
    tagId: rooster.tagId,
    roosterName: rooster.name,
    breed: rooster.breed,
    price: rooster.price,
    customMessage: `Hello JP Farms! 🐓\n\nI have booked Rooster #${rooster.tagId} (${rooster.name}) on your website.\n- My Name: ${name}\n- Phone: ${phone}\n- Delivery City: ${city}\n- Option: ${bookingType.toUpperCase()}\n\nPlease verify availability and share UPI / payment details to lock this booking. Thank you!`,
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
        
        {/* Header */}
        <div className="bg-stone-950 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isSubmitted ? 'Booking Confirmed!' : 'Book Your Rooster'}</span>
            </h2>
            <p className="text-xs text-stone-400">
              JP Farms Heritage Desi & Aseel Registry
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
                Booking Request Received!
              </h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Your request for <strong>{rooster.name}</strong> (Tag: <span className="font-mono text-amber-800 font-bold">{rooster.tagId}</span>) has been logged in our farm registry.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Customer:</span>
                <span className="font-bold text-stone-900">{name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Phone:</span>
                <span className="font-bold text-stone-900">{phone}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Transit Destination:</span>
                <span className="font-bold text-stone-900">{city}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold pt-1">
                <span className="text-stone-800">Total Bird Price:</span>
                <span className="text-amber-700">{formatPrice(rooster.price)}</span>
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
                <span>Confirm on WhatsApp to Lock Booking</span>
              </a>

              <button
                onClick={onClose}
                className="w-full text-xs text-stone-500 hover:text-stone-800 py-2"
              >
                Close and return to catalog
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
                    {rooster.tagId}
                  </span>
                  <span className="text-[11px] text-stone-500 truncate">{rooster.breed}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 truncate">{rooster.name}</h4>
                <p className="text-xs font-black text-amber-700">{formatPrice(rooster.price)}</p>
              </div>
            </div>

            {/* Booking Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                Select Booking Method:
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBookingType('token')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    bookingType === 'token'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1 text-amber-600" />
                  <span className="text-xs">Hold Token</span>
                  <span className="text-[10px] text-stone-500">₹500 / 48 hrs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType('full')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    bookingType === 'full'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <Truck className="w-4 h-4 mb-1 text-emerald-600" />
                  <span className="text-xs">Full Purchase</span>
                  <span className="text-[10px] text-stone-500">Immediate dispatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType('visit')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    bookingType === 'visit'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <Calendar className="w-4 h-4 mb-1 text-amber-700" />
                  <span className="text-xs">Farm Visit</span>
                  <span className="text-[10px] text-stone-500">Self Pickup</span>
                </button>
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery City & State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad / Chennai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Special Notes or Transit Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please share video of feet spurs, prefer express train transit on Saturday..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>
            </div>

            {/* Trust Assurance */}
            <div className="flex items-center space-x-2 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>We never share your contact details. Live health warranty applies to every delivery.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-amber-950/20 transition active:scale-95"
            >
              {isSubmitting ? 'Processing...' : 'Submit Booking & Connect with Farm'}
            </button>

          </form>
        )}

      </div>

    </div>
  );
};
