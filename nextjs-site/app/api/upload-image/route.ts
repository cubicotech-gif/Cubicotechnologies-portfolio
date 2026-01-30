import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

// Valid upload folders/categories
const VALID_FOLDERS = [
  'hero',        // Hero section animated background
  'portfolio',   // Portfolio showcase items
  'projects',    // Featured projects
  'logos',       // Logo designs
  'team',        // Team member photos
  'general',     // Miscellaneous images
] as const;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate folder
    if (!VALID_FOLDERS.includes(folder as any)) {
      return NextResponse.json(
        { success: false, error: `Invalid folder. Must be one of: ${VALID_FOLDERS.join(', ')}` },
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

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filePath = `${folder}/${filename}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage (all images go to 'images' bucket)
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

    console.log(`File uploaded to Supabase Storage: ${publicUrl}`);

    return NextResponse.json({
      success: true,
      filename: filename,
      folder: folder,
      url: publicUrl,
      path: publicUrl,
      message: `File uploaded successfully to ${folder} folder`
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// GET: List all images from Supabase Storage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';

    // Validate folder if provided
    if (folder && !VALID_FOLDERS.includes(folder as any)) {
      return NextResponse.json(
        { success: false, error: `Invalid folder. Must be one of: ${VALID_FOLDERS.join(', ')}` },
        { status: 400 }
      );
    }

    const { data: files, error } = await supabaseAdmin.storage
      .from('images')
      .list(folder, {
        limit: 100,
        offset: 0,
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
        const filePath = folder ? `${folder}/${file.name}` : file.name;
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('images')
          .getPublicUrl(filePath);

        return {
          filename: file.name,
          folder: folder,
          path: publicUrlData.publicUrl,
          url: publicUrlData.publicUrl,
        };
      });

    return NextResponse.json({ success: true, images, folder });
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
