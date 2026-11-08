'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Feather, ArrowLeft, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/authStore';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function LoginPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50/30 to-stone-200 text-stone-900 flex flex-col justify-between p-4 sm:p-6">
      
      {/* Top Bar with Back Button */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Showcase</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-200/80 space-y-8 relative overflow-hidden">
          
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-sky-500"></div>

          {/* Logo & Headline */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 mx-auto shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Feather className="w-7 h-7 text-amber-600 transform -rotate-12" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight text-stone-900">JP FARMS</h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Est. 2016
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Heritage Desi Rooster Showcase & Conservation Estate
              </p>
            </div>
          </div>

          {/* Value Prop */}
          <div className="text-center space-y-1">
            <h2 className="text-base font-extrabold text-stone-900">
              {isAuthenticated ? `Welcome back, ${user?.displayName}!` : 'Sign in with your Google Account'}
            </h2>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              {isAuthenticated
                ? 'You are signed in. Redirecting to showcase...'
                : '1-click sign-in to easily place orders, save delivery addresses, and track live animal crate dispatches.'}
            </p>
          </div>

          {/* Google Sign In Button */}
          {!isAuthenticated && (
            <div className="space-y-4">
              <GoogleSignInButton variant="page" />
              <p className="text-[11px] text-center text-stone-400">
                Fast, secure & password-free with your Google ID.
              </p>
            </div>
          )}

          {/* Key Customer Benefits */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-3 text-xs">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              Why Sign in?
            </span>
            <div className="space-y-2 text-stone-700">
              <div className="flex items-center space-x-2.5">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Track live climate crate dispatch status</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant access to certified avian health papers</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Express 1-click cart checkout</span>
              </div>
            </div>
          </div>

          {/* Privacy Note & Sign Up Link */}
          <div className="space-y-2 text-center">
            <p className="text-[11px] text-stone-500">
              New to JP Farms?{' '}
              <Link href="/signup" className="font-bold text-amber-600 hover:text-amber-700 underline">
                Join Breeder Circle (Sign Up)
              </Link>
            </p>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              By signing in, you agree to JP Farms bio-secure live animal transit and visitor care policies.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-stone-500">
        © {new Date().getFullYear()} JP Farms Heritage Estate • All rights reserved.
      </div>

    </div>
  );
}

