import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

/**
 * A lesson row. `section` splits the showcase into its two blocks and
 * `subject` is the filter chip within a section.
 *
 * Media can come from three places, resolved in lib/media.ts:
 *   embed_url  — a YouTube/Vimeo link
 *   video_url  — a self-hosted file in Supabase storage
 *   image_url  — the still / poster frame
 */
export interface LessonRow {
  id: string;
  title: string;
  section: 'academic' | 'islamic';
  subject: string;
  description: string;
  image_url: string | null;
  poster_url: string | null;
  video_url: string | null;
  embed_url: string | null;
  media_type: 'image' | 'video' | null;
  year_group: string | null;
  duration: string | null;
  outcomes: string[];
  order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

const SECTIONS = ['academic', 'islamic'];

/** Fields a client may set. Anything else in the body is ignored. */
const WRITABLE = [
  'title',
  'section',
  'subject',
  'description',
  'image_url',
  'poster_url',
  'video_url',
  'embed_url',
  'media_type',
  'year_group',
  'duration',
  'outcomes',
  'order',
  'active',
] as const;

function pickWritable(body: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of WRITABLE) {
    if (body[key] === undefined) continue;
    result[key] = key === 'outcomes' ? (Array.isArray(body[key]) ? body[key] : []) : body[key];
  }
  return result;
}

// GET: Retrieve lessons
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const subject = searchParams.get('subject');
    const activeOnly = searchParams.get('active') === 'true';

    let query = supabaseAdmin
      .from('portfolio_items')
      .select('*')
      .order('order', { ascending: true });

    if (section && SECTIONS.includes(section)) {
      query = query.eq('section', section);
    }
    if (subject && subject !== 'All') {
      query = query.eq('subject', subject);
    }
    if (activeOnly) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching lessons:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, items: data || [] });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add a lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, section, subject, description } = body;

    if (!title || !section || !subject || !description) {
      return NextResponse.json(
        { success: false, error: 'Title, section, subject and description are required' },
        { status: 400 }
      );
    }

    if (!SECTIONS.includes(section)) {
      return NextResponse.json(
        { success: false, error: `Section must be one of: ${SECTIONS.join(', ')}` },
        { status: 400 }
      );
    }

    // A lesson needs something to show: artwork, a file, or an embed.
    if (!body.image_url && !body.video_url && !body.embed_url) {
      return NextResponse.json(
        { success: false, error: 'Provide an image, an uploaded video, or an embed URL' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio_items')
      .insert([{ active: true, order: 1, ...pickWritable(body) }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Lesson added', item: data });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update a lesson
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    if (body.section !== undefined && !SECTIONS.includes(body.section)) {
      return NextResponse.json(
        { success: false, error: `Section must be one of: ${SECTIONS.join(', ')}` },
        { status: 400 }
      );
    }

    const updateData = {
      ...pickWritable(body),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('portfolio_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Lesson updated', item: data });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a lesson
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('portfolio_items').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Lesson deleted' });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
