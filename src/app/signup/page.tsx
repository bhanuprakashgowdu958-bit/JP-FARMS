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
      
      {/* Full-bleed Atmospheric Background — Roosters on the left, dramatic smoke extending across the entire screen */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/banners/signup_roosters_battle.jpg"
          alt="JP Farms Heritage Roosters"
          className="absolute inset-0 w-full h-full object-cover object-center lg:w-[128vw] lg:max-w-none lg:-translate-x-[16vw] transition-transform duration-[3000ms]"
        />

        {/* Ambient atmospheric gradients — seamless blend across the entire viewport */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/60"></div>
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-stone-950/20 to-stone-950/50"></div>
        <div className="lg:hidden absolute inset-0 bg-stone-950/50"></div>
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

      {/* Main Content Area — Sign-In Details Blended Seamlessly with the Background */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 relative z-10 flex items-center justify-center lg:justify-end">
        <div className="w-full max-w-md relative group lg:mr-4 xl:mr-12">

          {/* Soft ambient back-glow that melts into the smoky background */}
          <div className="absolute -inset-6 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent rounded-[36px] blur-2xl pointer-events-none"></div>

          {/* Seamless Content Block — Borderless & Glassy, Blending Naturally into the Scene */}
          <div className="relative bg-stone-950/20 backdrop-blur-xs rounded-3xl p-6 sm:p-8 space-y-6">
            
            {/* Farm Crest & Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 mx-auto shadow-lg shadow-amber-500/20 flex items-center justify-center">
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
                <p className="text-xs text-stone-300 mt-1 drop-shadow-sm">
                  Heritage Desi Rooster Conservation & Breeder Community
                </p>
              </div>
            </div>

            {/* Headline & Value Pitch */}
            <div className="text-center space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-white drop-shadow-sm">
                Welcome to JP Farms
              </h2>
              <p className="text-xs text-stone-300 max-w-sm mx-auto drop-shadow-sm">
                Please sign in with your Google account to enter our live rooster catalog, breeding stock, and farm guides.
              </p>
            </div>

            {/* Google Sign-In Button */}
            <div className="space-y-3 pt-1">
              <GoogleSignInButton variant="page" />
              
              <div className="flex items-center justify-center space-x-4 text-[11px] text-stone-300 drop-shadow-sm">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant Access</span>
                </span>
                <span className="text-stone-500">•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No Password Needed</span>
                </span>
                <span className="text-stone-500">•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Free</span>
                </span>
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
