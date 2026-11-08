'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/authStore';
import { LogOut, ChevronDown, User, CheckCircle2 } from 'lucide-react';

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

interface GoogleSignInButtonProps {
  className?: string;
  variant?: 'header' | 'page' | 'compact';
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  className = '',
  variant = 'header'
}) => {
  const { user, isAuthenticated, isLoading, signInWithGoogle, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthenticated && user) {
    const firstName = user.displayName?.split(' ')[0] || 'User';

    return (
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1.5 rounded-xl border border-stone-200 transition text-xs font-bold"
          title={`Signed in as ${user.displayName || user.email}`}
        >
          <img
            src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
            alt=""
            className="w-6 h-6 rounded-full object-cover border border-stone-300"
          />
          <span className="max-w-[100px] truncate">{firstName}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-stone-100 space-y-0.5">
              <p className="text-xs font-black text-stone-900 truncate">
                {user.displayName || 'Customer'}
              </p>
              <p className="text-[11px] text-stone-500 truncate font-mono">
                {user.email || 'Google User'}
              </p>
              <div className="flex items-center space-x-1 text-[10px] text-emerald-600 font-bold pt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Google Verified Account</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  signOut();
                }}
                className="w-full text-left flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Large full page button variant
  if (variant === 'page') {
    return (
      <button
        onClick={() => signInWithGoogle()}
        disabled={isLoading}
        className={`w-full flex items-center justify-center space-x-3 bg-white hover:bg-stone-50 text-stone-800 font-bold py-3.5 px-6 rounded-2xl border-2 border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-md transition active:scale-[0.99] text-sm group ${className}`}
      >
        <GoogleIcon className="w-5 h-5 shrink-0 group-hover:scale-110 transition" />
        <span>Continue with Google</span>
      </button>
    );
  }

  // Header compact button variant
  return (
    <button
      onClick={() => signInWithGoogle()}
      disabled={isLoading}
      className={`flex items-center space-x-1.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold px-3 py-2.5 rounded-xl border border-stone-200 shadow-xs hover:border-stone-300 transition active:scale-95 whitespace-nowrap shrink-0 group ${className}`}
      title="Sign in with your Google account"
    >
      <GoogleIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition" />
      <span>Sign In</span>
    </button>
  );
};
