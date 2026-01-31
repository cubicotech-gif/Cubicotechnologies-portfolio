import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

// All images go to a single library folder
const LIBRARY_FOLDER = 'library';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (images and videos)
    const validTypes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      // Videos
      'video/mp4',
      'video/webm',
      'video/quicktime', // .mov
      'video/x-msvideo', // .avi
      'video/mpeg',
      'video/ogg'
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${file.type}. Only images and videos are allowed.` },
        { status: 400 }
      );
    }

    // Validate file size (max 100MB for videos, 50MB for images)
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 100 * 1024 * 1024 : 50 * 1024 * 1024; // 100MB for videos, 50MB for images
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is ${isVideo ? '100MB for videos' : '50MB for images'}.` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filePath = `${LIBRARY_FOLDER}/${filename}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage (all images go to 'images' bucket, 'library' folder)
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { success: false, error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    console.log(`File uploaded to image library: ${publicUrl}`);

    return NextResponse.json({
      success: true,
      filename: filename,
      url: publicUrl,
      path: publicUrl,
      message: 'File uploaded successfully to image library'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// GET: List all images from the library
export async function GET(request: NextRequest) {
  try {
    const { data: files, error } = await supabaseAdmin.storage
      .from('images')
      .list(LIBRARY_FOLDER, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error listing images:', error);
      return NextResponse.json(
        { success: false, error: `Failed to list images: ${error.message}` },
        { status: 500 }
      );
    }

    const media = files
      .filter(file => {
        // Filter out directories and include both images and videos
        return file.name && /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mpeg|ogg)$/i.test(file.name);
      })
      .map(file => {
        const filePath = `${LIBRARY_FOLDER}/${file.name}`;
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('images')
          .getPublicUrl(filePath);

        // Determine media type
        const isVideo = /\.(mp4|webm|mov|avi|mpeg|ogg)$/i.test(file.name);

        return {
          filename: file.name,
          path: publicUrlData.publicUrl,
          url: publicUrlData.publicUrl,
          created_at: file.created_at,
          size: file.metadata?.size || 0,
          media_type: isVideo ? 'video' : 'image',
        };
      });

    return NextResponse.json({ success: true, images: media, total: media.length });
  } catch (error: any) {
    console.error('Error listing images:', error);

    // If error is due to missing credentials, return empty array
    if (error.message?.includes('SUPABASE_URL') || error.message?.includes('Invalid URL')) {
      return NextResponse.json({
        success: true,
        images: [],
        message: 'Supabase not configured. Please set environment variables.'
      });
    }

    return NextResponse.json(
      { success: false, error: `Failed to list images: ${error.message}` },
      { status: 500 }
    );
  }
}
