import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export interface ServiceImage {
  id: string;
  service_type: string;
  image_slot: number;
  image_url: string;
  alt_text?: string;
  order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// GET: Retrieve service images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('service_type');
    const imageSlot = searchParams.get('image_slot');
    const activeOnly = searchParams.get('active') === 'true';

    let query = supabaseAdmin
      .from('service_images')
      .select('*')
      .order('order', { ascending: true });

    if (serviceType) {
      query = query.eq('service_type', serviceType);
    }

    if (imageSlot) {
      query = query.eq('image_slot', parseInt(imageSlot));
    }

    if (activeOnly) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching service images:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: data || [],
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Add new service image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url, service_type, image_slot, alt_text, order = 1 } = body;

    if (!image_url || !service_type || !image_slot) {
      return NextResponse.json(
        { success: false, error: 'Image URL, service type, and image slot are required' },
        { status: 400 }
      );
    }

    // Check if this service_type + image_slot combination already exists
    const { data: existing } = await supabaseAdmin
      .from('service_images')
      .select('id')
      .eq('service_type', service_type)
      .eq('image_slot', parseInt(image_slot))
      .single();

    if (existing) {
      // Update existing image
      const { data, error } = await supabaseAdmin
        .from('service_images')
        .update({
          image_url,
          alt_text,
          order,
          updated_at: new Date().toISOString(),
        })
        .eq('service_type', service_type)
        .eq('image_slot', parseInt(image_slot))
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Service image updated successfully',
        image: data,
      });
    } else {
      // Insert new image
      const { data, error } = await supabaseAdmin
        .from('service_images')
        .insert([{
          image_url,
          service_type,
          image_slot: parseInt(image_slot),
          alt_text,
          order,
          active: true,
        }])
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Service image added successfully',
        image: data,
      });
    }
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update service image
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, image_url, alt_text, order, active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (image_url !== undefined) updateData.image_url = image_url;
    if (alt_text !== undefined) updateData.alt_text = alt_text;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;

    const { data, error } = await supabaseAdmin
      .from('service_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service image updated',
      image: data,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete service image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('service_images')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service image deleted',
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
