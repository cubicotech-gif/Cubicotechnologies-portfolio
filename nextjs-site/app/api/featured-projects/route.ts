import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  order: number;
  active: boolean;
  client_name?: string;
  project_url?: string;
  created_at?: string;
}

// GET: Read all featured projects
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('featured_projects')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to fetch projects: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, projects: data || [] });
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST: Add new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, description, image_url, order, client_name, project_url } = body;

    if (!title || !category || !description || !image_url) {
      return NextResponse.json(
        { success: false, error: 'Title, category, description, and image are required' },
        { status: 400 }
      );
    }

    const newProject = {
      title,
      category,
      description,
      image_url,
      order: order || 1,
      active: true,
      client_name: client_name || null,
      project_url: project_url || null,
    };

    const { data, error } = await supabaseAdmin
      .from('featured_projects')
      .insert([newProject])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to add project: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add project' },
      { status: 500 }
    );
  }
}

// PUT: Update project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, category, description, image_url, order, active, client_name, project_url } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (order !== undefined) updates.order = order;
    if (active !== undefined) updates.active = active;
    if (client_name !== undefined) updates.client_name = client_name;
    if (project_url !== undefined) updates.project_url = project_url;

    const { data, error } = await supabaseAdmin
      .from('featured_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase PUT error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to update project: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE: Remove project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get project to find image URL
    const { data: project } = await supabaseAdmin
      .from('featured_projects')
      .select('image_url')
      .eq('id', id)
      .single();

    // Delete from database
    const { error } = await supabaseAdmin
      .from('featured_projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase DELETE error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to delete project: ${error.message}` },
        { status: 500 }
      );
    }

    // Delete image from storage if it exists
    if (project?.image_url && project.image_url.includes('supabase.co')) {
      try {
        const urlParts = project.image_url.split('/storage/v1/object/public/');
        if (urlParts[1]) {
          const [bucket, ...pathParts] = urlParts[1].split('/');
          const filePath = pathParts.join('/');
          await supabaseAdmin.storage.from(bucket).remove([filePath]);
          console.log(`Deleted image from storage: ${filePath}`);
        }
      } catch (storageError) {
        console.error('Failed to delete image from storage:', storageError);
        // Don't fail the whole request if storage deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Project removed successfully'
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
