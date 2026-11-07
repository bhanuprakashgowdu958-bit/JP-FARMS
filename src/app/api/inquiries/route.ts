import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { CustomerInquiry } from '@/types/rooster';
import { INITIAL_INQUIRIES } from '@/lib/data';

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json');

async function getInquiriesFromFile(): Promise<CustomerInquiry[]> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    await writeFile(DATA_FILE, JSON.stringify(INITIAL_INQUIRIES, null, 2));
    return INITIAL_INQUIRIES;
  }
}

async function saveInquiriesToFile(inquiries: CustomerInquiry[]): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2));
}

// GET all inquiries
export async function GET() {
  try {
    const inquiries = await getInquiriesFromFile();
    return NextResponse.json({ success: true, data: inquiries });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to read inquiries', details: err.message }, { status: 500 });
  }
}

// POST create a new inquiry / booking lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiries = await getInquiriesFromFile();

    const newInquiry: CustomerInquiry = {
      ...body,
      id: body.id || `inq-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleString(),
    };

    const updated = [newInquiry, ...inquiries];
    await saveInquiriesToFile(updated);

    return NextResponse.json({ success: true, data: newInquiry });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to save inquiry', details: err.message }, { status: 500 });
  }
}

// PATCH update inquiry status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const inquiries = await getInquiriesFromFile();
    const index = inquiries.findIndex(i => i.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    inquiries[index].status = status;
    await saveInquiriesToFile(inquiries);

    return NextResponse.json({ success: true, data: inquiries[index] });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update inquiry status', details: err.message }, { status: 500 });
  }
}

