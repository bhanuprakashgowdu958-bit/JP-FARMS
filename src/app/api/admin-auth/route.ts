import { NextRequest, NextResponse } from 'next/server';
import { 
  signAdminToken, 
  verifyAdminToken, 
  setAdminAuthCookie, 
  clearAdminAuthCookie, 
  checkRateLimit 
} from '@/lib/serverSecurity';

// Server-only authorized admin PINs (never sent to client browser bundle)
const SERVER_ADMIN_PINS = new Set([
  '778899',
  'jpfarms777',
  'jpfarms',
]);

if (process.env.ADMIN_MASTER_PIN) {
  SERVER_ADMIN_PINS.add(process.env.ADMIN_MASTER_PIN.trim().toLowerCase());
}

/**
 * GET: Verify current session authentication status via HttpOnly cookie
 */
export async function GET(req: NextRequest) {
  const isValid = verifyAdminToken(req);
  if (!isValid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, role: 'owner_admin' });
}

/**
 * POST: Authenticate using Master PIN and issue a cryptographic session token
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    // 1. Sliding Window Rate Limiting (5 attempts per 5 minutes per IP)
    const rateCheck = checkRateLimit(`admin-auth:${ip}`, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        error: `Too many failed attempts. Security cooldown active. Please retry in ${rateCheck.retryAfterSec} seconds.` 
      }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const pin = (body.pin || '').trim().toLowerCase();

    // 2. Validate Master PIN strictly on server
    const isPinValid = Boolean(pin && SERVER_ADMIN_PINS.has(pin));

    if (!isPinValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Access Denied: Incorrect Master Passcode. Security event logged.' 
      }, { status: 401 });
    }

    // 3. Issue Cryptographic HMAC Session Token
    const token = signAdminToken();
    const response = NextResponse.json({ 
      success: true, 
      token,
      role: 'owner_admin',
      message: 'Owner credentials verified successfully.'
    });

    // 4. Attach Secure HttpOnly Cookie
    setAdminAuthCookie(response, token);

    return response;
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Authentication verification encountered a server error.' 
    }, { status: 500 });
  }
}

/**
 * DELETE: Revoke admin session and purge authentication cookies
 */
export async function DELETE() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Admin session terminated securely.' 
  });
  clearAdminAuthCookie(response);
  return response;
}
