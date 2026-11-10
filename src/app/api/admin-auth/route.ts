import { NextRequest, NextResponse } from 'next/server';
import { isBhanuEmail } from '@/lib/authStore';

// Server-only authorized admin PINs (never sent to client browser bundle)
const SERVER_ADMIN_PINS = new Set([
  '778899',
  'jpfarms777',
  'jpfarms',
]);

// Basic in-memory rate limiting to prevent brute force
const failedAttempts: Record<string, { count: number; lockedUntil: number }> = {};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    // Check rate limit
    if (failedAttempts[ip] && failedAttempts[ip].lockedUntil > now) {
      const waitSec = Math.ceil((failedAttempts[ip].lockedUntil - now) / 1000);
      return NextResponse.json({ 
        success: false, 
        error: `Too many failed attempts. Please wait ${waitSec} seconds before trying again.` 
      }, { status: 429 });
    }

    const body = await req.json();
    const pin = (body.pin || '').trim().toLowerCase();
    const email = (body.email || '').trim().toLowerCase();

    // Check Google Auth Owner Email bypass
    if (email && isBhanuEmail(email)) {
      return NextResponse.json({ success: true, role: 'owner_admin' });
    }

    // Check Server-side PIN
    if (pin && SERVER_ADMIN_PINS.has(pin)) {
      // Clear failed attempts upon success
      delete failedAttempts[ip];
      return NextResponse.json({ success: true, role: 'pin_admin' });
    }

    // Increment failed attempts
    if (!failedAttempts[ip]) {
      failedAttempts[ip] = { count: 1, lockedUntil: 0 };
    } else {
      failedAttempts[ip].count += 1;
      if (failedAttempts[ip].count >= 5) {
        failedAttempts[ip].lockedUntil = now + 5 * 60 * 1000; // 5 min lockout
      }
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Access Denied: Incorrect Master PIN. Authorized personnel only.' 
    }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

