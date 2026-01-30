import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Force Node.js runtime for file system operations
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

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'images', 'hero');

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err: any) {
      if (err.code !== 'EEXIST') {
        console.error('Error creating directory:', err);
        return NextResponse.json(
          { success: false, error: 'Failed to create upload directory' },
          { status: 500 }
        );
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filepath, buffer);

    console.log(`File uploaded successfully: ${filename}`);

    return NextResponse.json({
      success: true,
      filename: filename,
      path: `/images/hero/${filename}`,
      message: 'File uploaded successfully'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// GET: List all images in the hero directory
export async function GET() {
  try {
    const { readdir, access } = await import('fs/promises');
    const { extname } = await import('path');
    const uploadDir = join(process.cwd(), 'public', 'images', 'hero');

    // Ensure directory exists
    try {
      await access(uploadDir);
    } catch {
      // Directory doesn't exist, return empty array
      return NextResponse.json({ success: true, images: [] });
    }

    const files = await readdir(uploadDir);

    // Filter out non-image files and README
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const images = files
      .filter(file => {
        const ext = extname(file).toLowerCase();
        return imageExtensions.includes(ext) && file !== 'README.md';
      })
      .map(file => ({
        filename: file,
        path: `/images/hero/${file}`
      }));

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { success: false, error: `Failed to list images: ${error.message}` },
      { status: 500 }
    );
  }
}
