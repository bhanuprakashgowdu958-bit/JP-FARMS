import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Rooster } from '@/types/rooster';
import { INITIAL_ROOSTERS } from '@/lib/data';
import { verifyAdminToken } from '@/lib/serverSecurity';

const DATA_FILE = path.join(process.cwd(), 'data', 'roosters.json');
const TMP_FILE = path.join('/tmp', 'roosters.json');

// In-memory cache for serverless lifecycle
let memoryRoostersCache: Rooster[] | null = null;
const memoryDeletedIds: Set<string> = new Set();

function isAuthorizedAdmin(req: NextRequest): boolean {
  return verifyAdminToken(req);
}

async function getRoostersFromFile(): Promise<Rooster[]> {
  if (memoryRoostersCache && Array.isArray(memoryRoostersCache)) {
    return memoryRoostersCache.filter((r: Rooster) => !memoryDeletedIds.has(r.id) && !memoryDeletedIds.has(r.tagId));
  }

  // 1. Try reading from /tmp (writable in serverless)
  try {
    const tmpData = await readFile(TMP_FILE, 'utf-8');
    const parsed = JSON.parse(tmpData);
    if (Array.isArray(parsed)) {
      memoryRoostersCache = parsed;
      return parsed.filter((r: Rooster) => !memoryDeletedIds.has(r.id) && !memoryDeletedIds.has(r.tagId));
    }
  } catch {}

  // 2. Read bundled data file
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    memoryRoostersCache = parsed;
    return parsed.filter((r: Rooster) => !memoryDeletedIds.has(r.id) && !memoryDeletedIds.has(r.tagId));
  } catch (e) {
    memoryRoostersCache = INITIAL_ROOSTERS;
    return INITIAL_ROOSTERS.filter((r: Rooster) => !memoryDeletedIds.has(r.id) && !memoryDeletedIds.has(r.tagId));
  }
}

async function saveRoostersToFile(roosters: Rooster[]): Promise<void> {
  memoryRoostersCache = roosters;
  try {
    await writeFile(TMP_FILE, JSON.stringify(roosters, null, 2));
  } catch {}
  try {
    await writeFile(DATA_FILE, JSON.stringify(roosters, null, 2));
  } catch {}
}

// GET all roosters (Public read)
export async function GET() {
  try {
    const roosters = await getRoostersFromFile();
    return NextResponse.json({ success: true, data: roosters });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to read roosters', details: err.message }, { status: 500 });
  }
}

// POST create a new rooster (Admin only)
export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Input sanitization & validation
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: 'Invalid or missing rooster name' }, { status: 400 });
    }

    const price = Number(body.price);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
    }

    const roosters = await getRoostersFromFile();

    const newRooster: Rooster = {
      ...body,
      name: body.name.trim().slice(0, 100),
      price,
      id: body.id || `jp-${Date.now().toString().slice(-4)}`,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0],
      views: 1,
    };

    const updated = [newRooster, ...roosters];
    await saveRoostersToFile(updated);

    return NextResponse.json({ success: true, data: newRooster });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create rooster', details: err.message }, { status: 500 });
  }
}

// PUT update existing rooster (Admin only)
export async function PUT(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid rooster id' }, { status: 400 });
    }

    const roosters = await getRoostersFromFile();
    const index = roosters.findIndex(r => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Rooster not found' }, { status: 404 });
    }

    // Sanitize updates
    if (updates.price !== undefined) {
      const price = Number(updates.price);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
      }
      updates.price = price;
    }

    roosters[index] = { ...roosters[index], ...updates };
    await saveRoostersToFile(roosters);

    return NextResponse.json({ success: true, data: roosters[index] });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update rooster', details: err.message }, { status: 500 });
  }
}

// DELETE rooster (Admin only)
export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing rooster id' }, { status: 400 });
    }

    memoryDeletedIds.add(id);
    const roosters = await getRoostersFromFile();
    const updated = roosters.filter(r => r.id !== id && r.tagId !== id);
    await saveRoostersToFile(updated);

    return NextResponse.json({ success: true, message: 'Rooster deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete rooster', details: err.message }, { status: 500 });
  }
}
