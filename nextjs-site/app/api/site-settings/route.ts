import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

// GET: Retrieve site settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    let query = supabaseAdmin.from('site_settings').select('*');

    if (key) {
      query = query.eq('key', key).single();
    }

    const { data, error } = await query;

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: key ? data : (data || []),
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create or update site setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, type = 'Main Logo' } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Logo URL is required' },
        { status: 400 }
      );
    }

    // Determine the key based on type
    const key = type === 'Favicon' ? 'site_favicon' : 'site_logo';

    // Check if setting already exists
    const { data: existing } = await supabaseAdmin
      .from('site_settings')
      .select('id')
      .eq('key', key)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .update({
          value: url,
          type: type,
          updated_at: new Date().toISOString(),
        })
        .eq('key', key)
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
        message: 'Logo updated successfully',
        setting: data,
      });
    } else {
      // Create new
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .insert([{
          key: key,
          value: url,
          type: type,
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
        message: 'Logo added successfully',
        setting: data,
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

// PUT: Update setting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, key, value, type } = body;

    if (!id && !key) {
      return NextResponse.json(
        { success: false, error: 'ID or key is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from('site_settings').update({
      ...(value && { value }),
      ...(type && { type }),
      updated_at: new Date().toISOString(),
    });

    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('key', key);
    }

    const { data, error } = await query.select().single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting updated',
      setting: data,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete setting
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const key = searchParams.get('key');

    if (!id && !key) {
      return NextResponse.json(
        { success: false, error: 'ID or key is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from('site_settings').delete();

    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('key', key);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting deleted',
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
