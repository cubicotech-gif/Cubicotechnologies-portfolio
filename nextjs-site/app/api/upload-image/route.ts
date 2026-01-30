import { NextRequest, NextResponse } from 'next/server';
import { bucket } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

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

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filePath = `hero/${filename}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Firebase Storage
    const fileUpload = bucket.file(filePath);

    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          firebaseStorageDownloadTokens: timestamp.toString(),
        }
      },
      public: true,
    });

    // Make file publicly accessible
    await fileUpload.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    console.log(`File uploaded to Firebase Storage: ${publicUrl}`);

    return NextResponse.json({
      success: true,
      filename: filename,
      url: publicUrl,
      path: publicUrl,
      message: 'File uploaded successfully to Firebase Storage'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// GET: List all images from Firebase Storage
export async function GET() {
  try {
    const [files] = await bucket.getFiles({
      prefix: 'hero/',
    });

    const images = files
      .filter(file => {
        // Filter out directories and non-image files
        const name = file.name;
        return name !== 'hero/' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
      })
      .map(file => {
        const filename = file.name.replace('hero/', '');
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        return {
          filename,
          path: publicUrl,
          url: publicUrl,
        };
      });

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error('Error listing images:', error);

    // If error is due to missing credentials, return empty array
    if (error.message?.includes('Could not load the default credentials')) {
      return NextResponse.json({
        success: true,
        images: [],
        message: 'Firebase not configured. Please set environment variables.'
      });
    }

    return NextResponse.json(
      { success: false, error: `Failed to list images: ${error.message}` },
      { status: 500 }
    );
  }
}
