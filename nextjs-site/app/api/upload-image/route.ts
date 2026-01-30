import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'hero');
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      filename: filename,
      path: `/images/hero/${filename}`,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// GET: List all images in the hero directory
export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'hero');

    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      return NextResponse.json({ success: true, images: [] });
    }

    const files = await fs.readdir(uploadDir);

    // Filter out non-image files and README
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext) && file !== 'README.md';
      })
      .map(file => ({
        filename: file,
        path: `/images/hero/${file}`
      }));

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list images' },
      { status: 500 }
    );
  }
}
