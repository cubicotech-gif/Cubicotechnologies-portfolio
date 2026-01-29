import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export interface HeroImage {
  id: string;
  cloudinary_id: string;
  category: string;
  order: number;
  active: boolean;
  secure_url?: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'hero-images.json');

// Helper: Read JSON file
async function readHeroImages(): Promise<HeroImage[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading hero-images.json:', error);
    return [];
  }
}

// Helper: Write JSON file
async function writeHeroImages(images: HeroImage[]): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(images, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing hero-images.json:', error);
    throw new Error('Failed to save hero images');
  }
}

// GET: Read all hero images
export async function GET() {
  try {
    const images = await readHeroImages();
    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero images' },
      { status: 500 }
    );
  }
}

// POST: Add new image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file, category, order } = body;

    if (!file || !category) {
      return NextResponse.json(
        { success: false, error: 'File and category are required' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file);

    // Read current images
    const images = await readHeroImages();

    // Create new image entry
    const newImage: HeroImage = {
      id: `hero-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      cloudinary_id: uploadResult.public_id,
      category,
      order: order || images.length + 1,
      active: true,
      secure_url: uploadResult.secure_url,
    };

    // Add to array and save
    images.push(newImage);
    await writeHeroImages(images);

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add image' },
      { status: 500 }
    );
  }
}

// PUT: Update image
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, category, order, active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Read current images
    const images = await readHeroImages();
    const imageIndex = images.findIndex((img) => img.id === id);

    if (imageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Update image
    if (category !== undefined) images[imageIndex].category = category;
    if (order !== undefined) images[imageIndex].order = order;
    if (active !== undefined) images[imageIndex].active = active;

    // Save changes
    await writeHeroImages(images);

    return NextResponse.json({ success: true, image: images[imageIndex] });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE: Remove image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Read current images
    const images = await readHeroImages();
    const imageToDelete = images.find((img) => img.id === id);

    if (!imageToDelete) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(imageToDelete.cloudinary_id);

    // Remove from array
    const updatedImages = images.filter((img) => img.id !== id);
    await writeHeroImages(updatedImages);

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
