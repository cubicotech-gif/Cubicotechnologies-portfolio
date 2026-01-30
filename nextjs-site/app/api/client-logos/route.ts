import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export interface ClientLogo {
  id: string;
  client_name: string;
  logo_url: string;
  order: number;
  active: boolean;
  website_url?: string;
  created_at?: string;
}

// GET: Read all client logos
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('client_logos')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to fetch logos: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, logos: data || [] });
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logos' },
      { status: 500 }
    );
  }
}

// POST: Add new logo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_name, logo_url, order, website_url } = body;

    if (!client_name || !logo_url) {
      return NextResponse.json(
        { success: false, error: 'Client name and logo are required' },
        { status: 400 }
      );
    }

    const newLogo = {
      client_name,
      logo_url,
      order: order || 1,
      active: true,
      website_url: website_url || null,
    };

    const { data, error } = await supabaseAdmin
      .from('client_logos')
      .insert([newLogo])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to add logo: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, logo: data });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add logo' },
      { status: 500 }
    );
  }
}

// PUT: Update logo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, client_name, logo_url, order, active, website_url } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Logo ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (client_name !== undefined) updates.client_name = client_name;
    if (logo_url !== undefined) updates.logo_url = logo_url;
    if (order !== undefined) updates.order = order;
    if (active !== undefined) updates.active = active;
    if (website_url !== undefined) updates.website_url = website_url;

    const { data, error } = await supabaseAdmin
      .from('client_logos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase PUT error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to update logo: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Logo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, logo: data });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update logo' },
      { status: 500 }
    );
  }
}

// DELETE: Remove logo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Logo ID is required' },
        { status: 400 }
      );
    }

    // Get logo to find image URL
    const { data: logo } = await supabaseAdmin
      .from('client_logos')
      .select('logo_url')
      .eq('id', id)
      .single();

    // Delete from database
    const { error } = await supabaseAdmin
      .from('client_logos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase DELETE error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to delete logo: ${error.message}` },
        { status: 500 }
      );
    }

    // Delete image from storage if it exists
    if (logo?.logo_url && logo.logo_url.includes('supabase.co')) {
      try {
        const urlParts = logo.logo_url.split('/storage/v1/object/public/');
        if (urlParts[1]) {
          const [bucket, ...pathParts] = urlParts[1].split('/');
          const filePath = pathParts.join('/');
          await supabaseAdmin.storage.from(bucket).remove([filePath]);
          console.log(`Deleted logo from storage: ${filePath}`);
        }
      } catch (storageError) {
        console.error('Failed to delete logo from storage:', storageError);
        // Don't fail the whole request if storage deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Logo removed successfully'
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete logo' },
      { status: 500 }
    );
  }
}
