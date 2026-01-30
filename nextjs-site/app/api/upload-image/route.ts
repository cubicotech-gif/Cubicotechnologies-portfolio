import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^.]+$/, '');
    const publicId = `hero/${timestamp}-${sanitizedName}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'hero',
      public_id: `${timestamp}-${sanitizedName}`,
      resource_type: 'auto',
    });

    console.log(`File uploaded to Cloudinary: ${result.secure_url}`);

    return NextResponse.json({
      success: true,
      filename: `${timestamp}-${sanitizedName}${file.name.match(/\.[^.]+$/)?.[0] || ''}`,
      url: result.secure_url,
      path: result.secure_url,
      publicId: result.public_id,
      message: 'File uploaded successfully to Cloudinary'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// GET: List all images from Cloudinary
export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'hero/',
      max_results: 100,
    });

    const images = result.resources.map((resource: any) => ({
      filename: resource.public_id.replace('hero/', ''),
      path: resource.secure_url,
      url: resource.secure_url,
      publicId: resource.public_id,
      uploadedAt: resource.created_at,
    }));

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error('Error listing images:', error);

    // If error is due to missing credentials, return empty array
    if (error.message?.includes('Must supply api_key')) {
      return NextResponse.json({
        success: true,
        images: [],
        message: 'Cloudinary not configured. Please set environment variables.'
      });
    }

    return NextResponse.json(
      { success: false, error: `Failed to list images: ${error.message}` },
      { status: 500 }
    );
  }
}
