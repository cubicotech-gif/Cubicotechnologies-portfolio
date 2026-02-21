import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

const LIBRARY_FOLDER = 'library';

// POST: Generate a signed upload URL for direct client-to-Supabase upload
// This bypasses Next.js body size limits for large files (videos)
export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { success: false, error: 'Filename and contentType are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/mpeg', 'video/ogg',
    ];

    if (!validTypes.includes(contentType)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${contentType}` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}-${sanitizedName}`;
    const filePath = `${LIBRARY_FOLDER}/${uniqueFilename}`;

    // Create signed upload URL (valid for 10 minutes)
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error('Signed URL error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to create upload URL: ${error.message}` },
        { status: 500 }
      );
    }

    // Get the public URL for after upload completes
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
    });
  } catch (error: any) {
    console.error('Upload URL error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to create upload URL: ${error.message}` },
      { status: 500 }
    );
  }
}
