import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Rooster } from '@/types/rooster';
import { INITIAL_ROOSTERS } from '@/lib/data';

const DATA_FILE = path.join(process.cwd(), 'data', 'roosters.json');

async function getRoostersFromFile(): Promise<Rooster[]> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    // If file doesn't exist, create it with initial seed
    await writeFile(DATA_FILE, JSON.stringify(INITIAL_ROOSTERS, null, 2));
    return INITIAL_ROOSTERS;
  }
}

async function saveRoostersToFile(roosters: Rooster[]): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(roosters, null, 2));
}

// GET all roosters
export async function GET() {
  try {
    const roosters = await getRoostersFromFile();
    return NextResponse.json({ success: true, data: roosters });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to read roosters', details: err.message }, { status: 500 });
  }
}

// POST create a new rooster
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roosters = await getRoostersFromFile();

    const newRooster: Rooster = {
      ...body,
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

// PUT update existing rooster
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing rooster id' }, { status: 400 });
    }

    const roosters = await getRoostersFromFile();
    const index = roosters.findIndex(r => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Rooster not found' }, { status: 404 });
    }

    roosters[index] = { ...roosters[index], ...updates };
    await saveRoostersToFile(roosters);

    return NextResponse.json({ success: true, data: roosters[index] });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update rooster', details: err.message }, { status: 500 });
  }
}

// DELETE rooster
export async function DELETE(req: NextRequest) {
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

