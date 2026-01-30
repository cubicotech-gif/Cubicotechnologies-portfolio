import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export interface HeroImage {
  id: string;
  filename: string;
  url?: string; // Cloud storage URL
  category: string;
  order: number;
  active: boolean;
  created_at?: string;
}

// GET: Read all hero images from Supabase Database
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hero_images')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to fetch hero images: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, images: data || [] });
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero images' },
      { status: 500 }
    );
  }
}

// POST: Add new image entry to Supabase Database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, url, category, order } = body;

    if ((!filename && !url) || !category) {
      return NextResponse.json(
        { success: false, error: 'Filename/URL and category are required' },
        { status: 400 }
      );
    }

    const newImage = {
      filename: filename || 'cloud-image',
      url: url || null,
      category,
      order: order || 1,
      active: true,
    };

    const { data, error } = await supabaseAdmin
      .from('hero_images')
      .insert([newImage])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to add image: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, image: data });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add image' },
      { status: 500 }
    );
  }
}

// PUT: Update image in Supabase Database
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

    const updates: any = {};
    if (category !== undefined) updates.category = category;
    if (order !== undefined) updates.order = order;
    if (active !== undefined) updates.active = active;

    const { data, error } = await supabaseAdmin
      .from('hero_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase PUT error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to update image: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, image: data });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE: Remove image entry from Supabase Database
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

    const { error } = await supabaseAdmin
      .from('hero_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase DELETE error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to delete image: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image removed from hero section'
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
