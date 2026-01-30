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

    // Validate file type
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${file.type}. Only images are allowed.` },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for HD images)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 50MB.' },
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

    const images = files
      .filter(file => {
        // Filter out directories and non-image files
        return file.name && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
      })
      .map(file => {
        const filePath = `${LIBRARY_FOLDER}/${file.name}`;
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('images')
          .getPublicUrl(filePath);

        return {
          filename: file.name,
          path: publicUrlData.publicUrl,
          url: publicUrlData.publicUrl,
          created_at: file.created_at,
          size: file.metadata?.size || 0,
        };
      });

    return NextResponse.json({ success: true, images, total: images.length });
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
