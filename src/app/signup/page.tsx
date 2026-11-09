'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Feather, 
  CheckCircle2, 
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/lib/authStore';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function SignUpPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect directly to home
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20 mb-4 animate-pulse flex items-center justify-center">
          <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center">
            <Feather className="w-8 h-8 text-amber-500 transform -rotate-12" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">JP FARMS</h1>
        <p className="text-xs text-amber-400/90 mt-1 font-semibold uppercase tracking-wider">
          Entering Farm Showcase...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Visual — Positioned on the left side below JP Farms on desktop, full on mobile */}
      <div className="absolute inset-0 lg:right-auto lg:w-[64vw] pointer-events-none overflow-hidden flex items-center justify-start lg:pl-12 xl:pl-16">
        <img
          src="/banners/signup_roosters_battle.jpg"
          alt="JP Farms Heritage Roosters"
          className="w-full h-full lg:h-auto lg:max-h-[82vh] object-cover lg:object-contain object-center lg:object-left scale-100 transition-transform duration-700"
        />

        {/* Soft horizontal fade on the right (desktop) to blend smoke into dark background */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-36 bg-gradient-to-r from-transparent via-stone-950/60 to-stone-950"></div>
        {/* Top and bottom subtle vignettes */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent"></div>
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-transparent"></div>
        {/* Mobile dark overlay for contrast */}
        <div className="lg:hidden absolute inset-0 bg-stone-950/60"></div>
      </div>

      {/* Top Navigation Bar — aligned to the left edge */}
      <header className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center">
              <Feather className="w-5 h-5 text-amber-400 transform -rotate-12" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-black text-white tracking-tight drop-shadow-md">JP FARMS</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Est. 2016
              </span>
            </div>
            <p className="text-[11px] text-stone-300 font-medium drop-shadow-sm">Heritage Desi Rooster Conservation Estate</p>
          </div>
        </Link>

        <div className="hidden sm:flex items-center space-x-3">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-stone-950/60 hover:bg-stone-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700/50 transition shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Farm Helpline: +91 98765 43210</span>
          </a>
        </div>
      </header>

      {/* Main Content Area — Picture on Left, Login Details on Right */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 relative z-10 flex items-center justify-center lg:justify-end">
        <div className="w-full max-w-md relative group lg:mr-2 xl:mr-8 2xl:mr-16">

          {/* Animated Glow Behind Card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-600/30 rounded-[28px] blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>

          {/* Glass Card */}
          <div className="relative bg-stone-950/40 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl shadow-stone-950/60 overflow-hidden">

            {/* Top Amber Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"></div>

            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent rounded-3xl pointer-events-none"></div>

            <div className="relative space-y-6">
              
              {/* Farm Crest & Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 mx-auto shadow-lg shadow-amber-500/30 flex items-center justify-center">
                  <div className="w-full h-full bg-stone-950/60 rounded-[14px] flex items-center justify-center">
                    <Feather className="w-7 h-7 text-amber-400 transform -rotate-12" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center space-x-2">
                    <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-md">JP FARMS</h1>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      Est. 2016
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Heritage Desi Rooster Conservation & Breeder Community
                  </p>
                </div>
              </div>

              {/* Headline & Value Pitch */}
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Welcome to JP Farms
                </h2>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Please sign in with your Google account to enter our live rooster catalog, breeding stock, and farm guides.
                </p>
              </div>

              {/* Google Sign-In Button */}
              <div className="space-y-3 pt-1">
                <GoogleSignInButton variant="page" />
                
                <div className="flex items-center justify-center space-x-4 text-[11px] text-stone-400">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Instant Access</span>
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>No Password Needed</span>
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>100% Free</span>
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 text-center lg:text-right text-xs text-stone-400/70 relative z-10 drop-shadow-sm">
        © {new Date().getFullYear()} JP Farms Heritage Estate, Hoskote, Bengaluru • Dedicated to Heritage Poultry Conservation.
      </footer>

    </div>
  );
}
