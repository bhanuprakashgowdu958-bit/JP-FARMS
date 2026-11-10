import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.mov']);
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB limit

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size exceeds the 25 MB limit (received ${(file.size / (1024 * 1024)).toFixed(1)} MB)` 
      }, { status: 413 });
    }

    // 2. MIME Type Validation
    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, MP4, and WebM files are allowed.' 
      }, { status: 415 });
    }

    // 3. Extension Validation & Path Traversal Prevention
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ 
        error: 'Invalid file extension. Uploaded file must have a valid media extension.' 
      }, { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Secure randomized filename
    const sanitizedBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${sanitizedBase}${ext}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json({ error: 'Failed to upload file', details: err.message }, { status: 500 });
  }
}
