import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  image_url: string;
  year: string;
  services: string[];
  order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// GET: Retrieve portfolio items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('active') === 'true';

    let query = supabaseAdmin
      .from('portfolio_items')
      .select('*')
      .order('order', { ascending: true });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (activeOnly) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching portfolio items:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      items: data || [],
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Add new portfolio item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      client,
      description,
      image_url,
      year,
      services = [],
      order = 1
    } = body;

    if (!title || !category || !client || !description || !image_url || !year) {
      return NextResponse.json(
        { success: false, error: 'Title, category, client, description, image URL, and year are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio_items')
      .insert([{
        title,
        category,
        client,
        description,
        image_url,
        year,
        services: Array.isArray(services) ? services : [],
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
      message: 'Portfolio item added successfully',
      item: data,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update portfolio item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, category, client, description, image_url, year, services, order, active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (client !== undefined) updateData.client = client;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (year !== undefined) updateData.year = year;
    if (services !== undefined) updateData.services = Array.isArray(services) ? services : [];
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;

    const { data, error } = await supabaseAdmin
      .from('portfolio_items')
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
      message: 'Portfolio item updated',
      item: data,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete portfolio item
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
      .from('portfolio_items')
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
      message: 'Portfolio item deleted',
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
