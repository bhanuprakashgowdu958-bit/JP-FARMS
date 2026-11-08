'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Feather, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  Truck, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  HeartHandshake,
  Users
} from 'lucide-react';
import { useAuth } from '@/lib/authStore';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function SignUpPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between">
      
      {/* Top Navigation Bar */}
      <header className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center">
              <Feather className="w-5 h-5 text-amber-400 transform -rotate-12" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-black text-white tracking-tight">JP FARMS</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Est. 2016
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-medium">Heritage Desi Rooster Conservation Estate</p>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 hover:text-white bg-stone-900/90 hover:bg-stone-800 px-3.5 py-2 rounded-xl border border-amber-500/30 transition shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Explore Showcase</span>
            <span className="sm:hidden">Showcase</span>
          </Link>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-stone-900/80 hover:bg-stone-800 px-3.5 py-2 rounded-xl border border-stone-800 transition shadow-sm backdrop-blur-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Farm Helpline</span>
          </a>
        </div>
      </header>

      {/* Main Split Showcase Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch my-auto">
          
          {/* LEFT COLUMN: Majestic 3D Rooster Visual Showcase */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden min-h-[380px] lg:min-h-[580px] shadow-2xl border border-stone-800 flex flex-col justify-between p-6 sm:p-8 bg-stone-900 group">
            
            {/* 3D Rooster Background Image */}
            <img
              src="/banners/ad_rooster_golden_grains_commercial.jpg"
              alt="JP Farms 3D Champion Rooster Feeding on Golden Grains"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />

            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/30"></div>
            <div className="absolute inset-0 bg-amber-500/5 mix-blend-overlay"></div>

            {/* Top Badges on Rooster Banner */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 bg-stone-950/80 backdrop-blur-md text-amber-400 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-amber-400/40 shadow-lg">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Champion Bloodlines</span>
              </span>

              <span className="bg-stone-950/80 backdrop-blur-md text-stone-300 text-[11px] font-bold px-3 py-1.5 rounded-full border border-stone-700/80">
                Hoskote, Bengaluru
              </span>
            </div>

            {/* Bottom Content on Rooster Banner */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Live Farm Pedigree
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                Pure Indian Heritage Roosters.
                <span className="block text-amber-400">Ethically Bred & Preserved.</span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed max-w-md">
                Join our certified breeder network to access pure-origin Aseels, Kadaknaths, and Ganjams with complete avian health documentation.
              </p>

              {/* Breeder Trust Stats */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-700/50">
                <div className="bg-stone-950/70 backdrop-blur-md p-2.5 rounded-xl border border-stone-800 text-center">
                  <p className="text-base sm:text-lg font-black text-amber-400">250+</p>
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Active Breeders</p>
                </div>
                <div className="bg-stone-950/70 backdrop-blur-md p-2.5 rounded-xl border border-stone-800 text-center">
                  <p className="text-base sm:text-lg font-black text-emerald-400">100%</p>
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">AC Live Crate</p>
                </div>
                <div className="bg-stone-950/70 backdrop-blur-md p-2.5 rounded-xl border border-stone-800 text-center">
                  <p className="text-base sm:text-lg font-black text-sky-400">Day 1</p>
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Vaccinated</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Dedicated Sign-Up Action Card */}
          <div className="lg:col-span-6 bg-white text-stone-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-200 flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Amber Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-sky-500"></div>

            <div className="space-y-6">
              
              {/* Farm Crest & Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 mx-auto shadow-lg shadow-amber-500/20 flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                    <Feather className="w-7 h-7 text-amber-600 transform -rotate-12" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center space-x-2">
                    <h1 className="text-2xl font-black tracking-tight text-stone-950">JP FARMS</h1>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Est. 2016
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Heritage Desi Rooster Conservation & Breeder Community
                  </p>
                </div>
              </div>

              {/* Headline & Value Pitch */}
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
                  {isAuthenticated ? `Welcome, ${user?.displayName}!` : 'Welcome to JP Farms'}
                </h2>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {isAuthenticated 
                    ? 'Entering farm showcase...'
                    : 'Please sign in with your Google account to enter our live rooster catalog, breeding stock, and farm guides.'
                  }
                </p>
              </div>

              {/* Google Sign-In Button */}
              {!isAuthenticated && (
                <div className="space-y-3 pt-1">
                  <GoogleSignInButton variant="page" />
                  
                  <div className="flex items-center justify-center space-x-4 text-[11px] text-stone-400">
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instant Access</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>No Password Needed</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Free</span>
                    </span>
                  </div>

                  {/* Or browse as guest */}
                  <div className="pt-1 text-center">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:border-amber-400 text-stone-700 hover:text-amber-900 bg-stone-50 hover:bg-amber-50/50 font-bold text-xs transition duration-150 group"
                    >
                      <span>Explore Rooster Catalog as Guest</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </div>
                </div>
              )}

              {/* 4 Member Privileges */}
              <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-100 space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-wider text-stone-500">
                  Exclusive Member Privileges
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  <div className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">Priority Drops</p>
                      <p className="text-[11px] text-stone-500">Reserve newly hatched purebred chicks first</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">Health Passes</p>
                      <p className="text-[11px] text-stone-500">Download digital vaccination certificates</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">Live Crate GPS</p>
                      <p className="text-[11px] text-stone-500">Real-time door delivery tracking alerts</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">VIP Advisory</p>
                      <p className="text-[11px] text-stone-500">Direct WhatsApp consultation with masters</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Footer Notice */}
            <div className="pt-6 border-t border-stone-100 text-center space-y-1">
              <p className="text-[11px] text-stone-400">
                Fast & secure 1-click Google sign-in. By entering, you agree to JP Farms bio-security and live transit policies.
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="max-w-7xl w-full mx-auto p-4 sm:p-6 text-center text-xs text-stone-500 relative z-10">
        © {new Date().getFullYear()} JP Farms Heritage Estate, Hoskote, Bengaluru • Dedicated to Heritage Poultry Conservation.
      </footer>

    </div>
  );
}
