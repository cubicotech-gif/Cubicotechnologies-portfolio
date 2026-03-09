/*
 * Run this SQL once in Supabase Dashboard → SQL Editor before using this route:
 *
 * CREATE TABLE IF NOT EXISTS image_metadata (
 *   image_url  TEXT PRIMARY KEY,
 *   focal_x    INTEGER NOT NULL DEFAULT 50,
 *   focal_y    INTEGER NOT NULL DEFAULT 50,
 *   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * ALTER TABLE image_metadata ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "service_role_all" ON image_metadata TO service_role USING (true) WITH CHECK (true);
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/image-metadata          → all focal points as { metadata: { [url]: { focal_x, focal_y } } }
// GET /api/image-metadata?url=...  → single record
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url).searchParams.get('url');

    if (url) {
      const { data, error } = await supabaseAdmin
        .from('image_metadata')
        .select('focal_x, focal_y')
        .eq('image_url', url)
        .maybeSingle();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        focal_x: data?.focal_x ?? 50,
        focal_y: data?.focal_y ?? 50,
      });
    }

    const { data, error } = await supabaseAdmin
      .from('image_metadata')
      .select('image_url, focal_x, focal_y');

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const metadata: Record<string, { focal_x: number; focal_y: number }> = {};
    for (const row of data ?? []) {
      metadata[row.image_url] = { focal_x: row.focal_x, focal_y: row.focal_y };
    }
    return NextResponse.json({ success: true, metadata });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/image-metadata  body: { url, focal_x, focal_y }
export async function POST(request: NextRequest) {
  try {
    const { url, focal_x, focal_y } = await request.json();

    if (!url || focal_x === undefined || focal_y === undefined) {
      return NextResponse.json(
        { success: false, error: 'url, focal_x and focal_y are required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('image_metadata')
      .upsert({ image_url: url, focal_x, focal_y, updated_at: new Date().toISOString() });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
