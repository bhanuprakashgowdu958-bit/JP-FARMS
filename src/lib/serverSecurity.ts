import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Secret key for HMAC token signing (falls back to a stable cryptographic server salt)
const SERVER_SECRET = process.env.ADMIN_AUTH_SECRET || 'jp-farms-production-master-secret-2026-v958';

export interface AdminTokenPayload {
  role: 'owner_admin';
  iat: number;
  exp: number;
}

/**
 * Generates a cryptographically signed HMAC-SHA256 token
 */
export function signAdminToken(durationMs = 24 * 60 * 60 * 1000): string {
  const now = Date.now();
  const payload: AdminTokenPayload = {
    role: 'owner_admin',
    iat: now,
    exp: now + durationMs,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Validates the HMAC-SHA256 token from cookies or Authorization header
 */
export function verifyAdminToken(req: NextRequest): boolean {
  try {
    // 1. Try reading from HttpOnly cookie
    let token = req.cookies.get('jp_farms_admin_token')?.value;

    // 2. Fallback to Authorization: Bearer <token>
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    // 3. Fallback to x-admin-token header
    if (!token) {
      token = req.headers.get('x-admin-token') || undefined;
    }

    if (!token || !token.includes('.')) {
      return false;
    }

    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) {
      return false;
    }

    // Recalculate signature with constant-time equality check
    const expectedSignature = crypto
      .createHmac('sha256', SERVER_SECRET)
      .update(payloadB64)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return false;
    }

    // Check expiration
    const payload: AdminTokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) {
      return false;
    }

    return payload.role === 'owner_admin';
  } catch {
    return false;
  }
}

/**
 * In-Memory Sliding-Window Rate Limiter
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((value, key) => {
      if (value.resetAt < now) {
        rateLimitMap.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export function checkRateLimit(
  identifier: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || record.resetAt < now) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfterSec };
  }

  record.count += 1;
  return { allowed: true };
}

/**
 * Attaches a secure HttpOnly cookie to a NextResponse
 */
export function setAdminAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: 'jp_farms_admin_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  });
}

/**
 * Clears the admin auth cookie
 */
export function clearAdminAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: 'jp_farms_admin_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}
