import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { CustomerInquiry } from '@/types/rooster';
import { INITIAL_INQUIRIES } from '@/lib/data';
import { isBhanuEmail } from '@/lib/authStore';

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json');

function isAuthorizedAdmin(req: NextRequest): boolean {
  const adminEmail = req.headers.get('x-admin-email');
  return Boolean(adminEmail && isBhanuEmail(adminEmail));
}

function sanitizeText(val: unknown, maxLen = 300): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>]/g, '')
    .slice(0, maxLen)
    .trim();
}

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

// GET all inquiries (Admin only to protect customer privacy)
export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required to view inquiries.' }, { status: 401 });
  }

  try {
    const inquiries = await getInquiriesFromFile();
    return NextResponse.json({ success: true, data: inquiries });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to read inquiries', details: err.message }, { status: 500 });
  }
}

// POST create a new inquiry / booking lead (Validated & sanitized)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const customerName = sanitizeText(body.customerName, 100);
    const phoneNumber = sanitizeText(body.phoneNumber, 20);

    if (!customerName || customerName.length < 2) {
      return NextResponse.json({ error: 'Valid customer name is required.' }, { status: 400 });
    }

    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ error: 'Valid 10-digit phone number is required.' }, { status: 400 });
    }

    const inquiries = await getInquiriesFromFile();

    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now().toString().slice(-4)}`,
      customerName,
      phoneNumber,
      cityState: sanitizeText(body.cityState, 100),
      message: sanitizeText(body.message, 500),
      roosterId: body.roosterId ? sanitizeText(body.roosterId, 50) : undefined,
      roosterTag: body.roosterTag ? sanitizeText(body.roosterTag, 50) : undefined,
      roosterName: body.roosterName ? sanitizeText(body.roosterName, 100) : undefined,
      inquiryType: ['general', 'farm_visit', 'breed_info', 'whatsapp'].includes(body.inquiryType) ? body.inquiryType : 'general',
      status: 'new',
      createdAt: new Date().toLocaleString(),
    };

    const updated = [newInquiry, ...inquiries];
    await saveInquiriesToFile(updated);

    return NextResponse.json({ success: true, data: newInquiry });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to save inquiry', details: err.message }, { status: 500 });
  }
}

// PATCH update inquiry status (Admin only)
export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const validStatuses: CustomerInquiry['status'][] = ['new', 'contacted', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
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

