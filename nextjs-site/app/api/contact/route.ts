import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export interface ContactSubmission {
  id: string;
  institution_name: string;
  contact_name: string;
  role?: string;
  work_email: string;
  phone?: string;
  curriculum_area: string;
  year_group: string;
  timeline?: string;
  project_brief: string;
  consent_given: boolean;
  created_at: string;
  status: 'new' | 'read' | 'replied';
}

// GET: Retrieve contact submissions (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching contact submissions:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      submissions: data || [],
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Submit a new institution enquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      institution_name,
      contact_name,
      role,
      work_email,
      phone,
      curriculum_area,
      year_group,
      timeline,
      project_brief,
      consent_given,
    } = body;

    const missing = [
      ['institution_name', institution_name],
      ['contact_name', contact_name],
      ['work_email', work_email],
      ['curriculum_area', curriculum_area],
      ['year_group', year_group],
      ['project_brief', project_brief],
    ].filter(([, value]) => !value || !String(value).trim());

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required field(s): ${missing.map(([key]) => key).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(work_email).trim())) {
      return NextResponse.json(
        { success: false, error: 'A valid work email address is required' },
        { status: 400 }
      );
    }

    if (!consent_given) {
      return NextResponse.json(
        { success: false, error: 'Consent is required before we can store your details' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert([
        {
          institution_name: String(institution_name).trim(),
          contact_name: String(contact_name).trim(),
          role: role ? String(role).trim() : null,
          work_email: String(work_email).trim().toLowerCase(),
          phone: phone ? String(phone).trim() : null,
          curriculum_area: String(curriculum_area).trim(),
          year_group: String(year_group).trim(),
          timeline: timeline ? String(timeline).trim() : null,
          project_brief: String(project_brief).trim(),
          consent_given: true,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving enquiry:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save your enquiry' },
        { status: 500 }
      );
    }

    // TODO: notify the studio by email (Resend/SendGrid) once a provider is chosen.

    return NextResponse.json({
      success: true,
      message: 'Thank you for your enquiry. We reply within two working days.',
      submission: data,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update submission status (for admin use)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID and status are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .update({ status })
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
      message: 'Status updated',
      submission: data,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete submission (for admin use)
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
      .from('contact_submissions')
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
      message: 'Submission deleted',
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
