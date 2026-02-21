import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

// Increase body size limit for large file uploads (100MB)
export const maxDuration = 60;

// All images go to a single library folder
const LIBRARY_FOLDER = 'library';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
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

    const results: any[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type (${file.type}). Only images and videos are allowed.`);
        continue;
      }

      // Validate file size (max 100MB for videos, 50MB for images)
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large. Maximum is ${isVideo ? '100MB for videos' : '50MB for images'}.`);
        continue;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}-${sanitizedName}`;
      const filePath = `${LIBRARY_FOLDER}/${filename}`;

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Supabase Storage
      const { error } = await supabaseAdmin.storage
        .from('images')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        errors.push(`${file.name}: Upload failed - ${error.message}`);
        continue;
      }

      // Get public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      console.log(`File uploaded to image library: ${publicUrl}`);

      results.push({
        filename,
        url: publicUrl,
        path: publicUrl,
        originalName: file.name,
        size: file.size,
        media_type: isVideo ? 'video' : 'image',
      });
    }

    // Single file response (backwards compatible)
    if (files.length === 1 && results.length === 1) {
      return NextResponse.json({
        success: true,
        filename: results[0].filename,
        url: results[0].url,
        path: results[0].path,
        message: 'File uploaded successfully to image library'
      });
    }

    // Multi-file response
    return NextResponse.json({
      success: results.length > 0,
      uploaded: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `${results.length} file(s) uploaded successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
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
        return file.name && /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mpeg|ogg)$/i.test(file.name);
      })
      .map(file => {
        const filePath = `${LIBRARY_FOLDER}/${file.name}`;
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('images')
          .getPublicUrl(filePath);

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

// DELETE: Remove file from library storage
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      );
    }

    const filePath = `${LIBRARY_FOLDER}/${filename}`;

    const { error } = await supabaseAdmin.storage
      .from('images')
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { success: false, error: `Delete failed: ${error.message}` },
        { status: 500 }
      );
    }

    console.log(`File deleted from library: ${filePath}`);

    return NextResponse.json({
      success: true,
      message: 'File deleted from library',
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: `Delete failed: ${error.message}` },
      { status: 500 }
    );
  }
}
