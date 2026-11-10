import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Rooster } from '@/types/rooster';
import { INITIAL_ROOSTERS } from '@/lib/data';
import { isBhanuEmail } from '@/lib/authStore';

const DATA_FILE = path.join(process.cwd(), 'data', 'roosters.json');

function isAuthorizedAdmin(req: NextRequest): boolean {
  const adminEmail = req.headers.get('x-admin-email');
  return Boolean(adminEmail && isBhanuEmail(adminEmail));
}

async function getRoostersFromFile(): Promise<Rooster[]> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    await writeFile(DATA_FILE, JSON.stringify(INITIAL_ROOSTERS, null, 2));
    return INITIAL_ROOSTERS;
  }
}

async function saveRoostersToFile(roosters: Rooster[]): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(roosters, null, 2));
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

    const roosters = await getRoostersFromFile();
    const updated = roosters.filter(r => r.id !== id);
    await saveRoostersToFile(updated);

    return NextResponse.json({ success: true, message: 'Rooster deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete rooster', details: err.message }, { status: 500 });
  }
}
