import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { isBhanuEmail } from '@/lib/authStore';

const DATA_FILE = path.join(process.cwd(), 'data', 'user_profiles.json');

interface ProfileData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  updatedAt?: string;
}

const BHANU_ACCOUNTS = ['bhanuprakashgowdu958@gmail.com', 'bhanuprakashgowdu87@gmail.com'];

const DEFAULT_BHANU_PROFILE: ProfileData = {
  name: 'Bhanu Prakash',
  phoneNumber: '',
  updatedAt: new Date().toISOString(),
};

async function getProfiles(): Promise<Record<string, ProfileData>> {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    for (const acc of BHANU_ACCOUNTS) {
      if (!parsed[acc]) parsed[acc] = { ...DEFAULT_BHANU_PROFILE, email: acc };
    }
    return parsed;
  } catch (e) {
    const fallback: Record<string, ProfileData> = {};
    for (const acc of BHANU_ACCOUNTS) {
      fallback[acc] = { ...DEFAULT_BHANU_PROFILE, email: acc };
    }
    return fallback;
  }
}

async function saveProfiles(dict: Record<string, ProfileData>): Promise<void> {
  try {
    await writeFile(DATA_FILE, JSON.stringify(dict, null, 2));
  } catch (e) {
    // Non-blocking for serverless readonly filesystem
  }
}

// In-memory fallback cache for serverless instances
let inMemoryProfiles: Record<string, ProfileData> = {
  'bhanuprakashgowdu958@gmail.com': { ...DEFAULT_BHANU_PROFILE, email: 'bhanuprakashgowdu958@gmail.com' },
  'bhanuprakashgowdu87@gmail.com': { ...DEFAULT_BHANU_PROFILE, email: 'bhanuprakashgowdu87@gmail.com' },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get('email')?.toLowerCase()?.trim();
    const targetUid = searchParams.get('uid')?.trim();

    // Security Check: Requester can only read their own profile unless requester is Admin
    const authHeaderEmail = req.headers.get('x-user-email')?.toLowerCase()?.trim();
    const authHeaderUid = req.headers.get('x-user-uid')?.trim();
    const isAdmin = isBhanuEmail(authHeaderEmail);

    if (!isAdmin) {
      const matchesEmail = authHeaderEmail && targetEmail && authHeaderEmail === targetEmail;
      const matchesUid = authHeaderUid && targetUid && authHeaderUid === targetUid;
      if (!matchesEmail && !matchesUid) {
        return NextResponse.json({ success: false, error: 'Unauthorized: You can only access your own profile.' }, { status: 403 });
      }
    }

    const fileProfiles = await getProfiles();
    const merged = { ...fileProfiles, ...inMemoryProfiles };

    let found: ProfileData | null = null;
    if (targetEmail && merged[targetEmail]) {
      found = merged[targetEmail];
    } else if (targetUid && merged[targetUid]) {
      found = merged[targetUid];
    }

    if (found) {
      return NextResponse.json({ success: true, data: found });
    }

    return NextResponse.json({ success: false, data: null });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.toLowerCase()?.trim();
    const uid = body.uid?.trim();

    if (!email && !uid) {
      return NextResponse.json({ success: false, error: 'Email or UID required' }, { status: 400 });
    }

    // Security Check: Requester can only update their own profile unless requester is Admin
    const authHeaderEmail = req.headers.get('x-user-email')?.toLowerCase()?.trim();
    const authHeaderUid = req.headers.get('x-user-uid')?.trim();
    const isAdmin = isBhanuEmail(authHeaderEmail);

    if (!isAdmin) {
      const matchesEmail = authHeaderEmail && email && authHeaderEmail === email;
      const matchesUid = authHeaderUid && uid && authHeaderUid === uid;
      if (!matchesEmail && !matchesUid) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Cannot update another user profile.' }, { status: 403 });
      }
    }

    const fileProfiles = await getProfiles();
    const existing = (email && fileProfiles[email]) || (uid && fileProfiles[uid]) || inMemoryProfiles[email] || {};

    // Sanitize input fields
    const updated: ProfileData = {
      ...existing,
      name: body.name ? String(body.name).slice(0, 100) : existing.name,
      phoneNumber: body.phoneNumber ? String(body.phoneNumber).slice(0, 20) : existing.phoneNumber,
      deliveryAddress: body.deliveryAddress ? String(body.deliveryAddress).slice(0, 300) : existing.deliveryAddress,
      city: body.city ? String(body.city).slice(0, 100) : existing.city,
      state: body.state ? String(body.state).slice(0, 100) : existing.state,
      pincode: body.pincode ? String(body.pincode).slice(0, 12) : existing.pincode,
      updatedAt: new Date().toISOString(),
    };

    if (email) {
      fileProfiles[email] = updated;
      inMemoryProfiles[email] = updated;
      if (BHANU_ACCOUNTS.includes(email)) {
        for (const linked of BHANU_ACCOUNTS) {
          fileProfiles[linked] = { ...updated, email: linked };
          inMemoryProfiles[linked] = { ...updated, email: linked };
        }
      }
    }
    if (uid) {
      fileProfiles[uid] = updated;
      inMemoryProfiles[uid] = updated;
    }

    await saveProfiles(fileProfiles);

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
