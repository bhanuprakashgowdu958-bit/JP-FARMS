import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAdminToken } from '@/lib/serverSecurity';

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drcftm7m',
  api_key: process.env.CLOUDINARY_API_KEY || '354734745383935',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'GzN7HoDD21d9GJMG4m71T8pmacg',
  secure: true,
});

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
    // Security check: Only verified admin session can upload assets
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required to upload media.' }, { status: 401 });
    }

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
    
    // Upload directly to Cloudinary CDN
    try {
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64Data}`;
      const isVideo = file.type.startsWith('video/');

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'jp-farms/roosters',
        public_id: `${Date.now()}_${sanitizedBase}`,
        resource_type: isVideo ? 'video' : 'image',
        overwrite: true,
      });

      return NextResponse.json({ 
        success: true, 
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        filename,
        size: file.size,
        type: file.type
      });
    } catch (cloudErr: any) {
      console.warn('Cloudinary upload fallback to local storage:', cloudErr.message);
      
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
    }
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json({ error: 'Failed to upload file', details: err.message }, { status: 500 });
  }
}
