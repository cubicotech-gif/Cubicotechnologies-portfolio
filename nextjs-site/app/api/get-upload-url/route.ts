import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

const LIBRARY_FOLDER = 'library';

const validTypes = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/mpeg', 'video/ogg',
];

// POST: Generate a Supabase signed upload URL so the browser can upload directly,
// bypassing Vercel's 4.5MB serverless function body size limit.
export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, fileSize } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { success: false, error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    if (!validTypes.includes(contentType)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type (${contentType}). Only images and videos are allowed.` },
        { status: 400 }
      );
    }

    const isVideo = contentType.startsWith('video/');
    const maxSize = isVideo ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    if (fileSize && fileSize > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum is ${isVideo ? '100MB for videos' : '50MB for images'}.` },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}-${sanitizedName}`;
    const filePath = `${LIBRARY_FOLDER}/${uniqueFilename}`;

    // Generate a signed upload URL — the browser will PUT the file directly to Supabase
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error('Supabase signed URL error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to create upload URL: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: filePath,
      filename: uniqueFilename,
      publicUrl: publicUrlData.publicUrl,
      media_type: isVideo ? 'video' : 'image',
    });
  } catch (error: any) {
    console.error('Get upload URL error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to generate upload URL: ${error.message}` },
      { status: 500 }
    );
  }
}
