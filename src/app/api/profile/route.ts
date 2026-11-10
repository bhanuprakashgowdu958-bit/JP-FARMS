import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

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
  phoneNumber: '+91 97012 34567',
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
    const email = searchParams.get('email')?.toLowerCase();
    const uid = searchParams.get('uid');

    const fileProfiles = await getProfiles();
    const merged = { ...fileProfiles, ...inMemoryProfiles };

    let found: ProfileData | null = null;
    if (email && merged[email]) {
      found = merged[email];
    } else if (uid && merged[uid]) {
      found = merged[uid];
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
    const email = body.email?.toLowerCase();
    const uid = body.uid;

    if (!email && !uid) {
      return NextResponse.json({ success: false, error: 'Email or UID required' }, { status: 400 });
    }

    const fileProfiles = await getProfiles();
    const existing = (email && fileProfiles[email]) || (uid && fileProfiles[uid]) || inMemoryProfiles[email] || {};

    const updated: ProfileData = {
      ...existing,
      ...body,
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
