/**
 * CUBICO TECHNOLOGIES - SUPABASE CONFIGURATION
 * Contact form backend integration
 */

// ====================================
// SUPABASE CONFIGURATION
// ====================================

// IMPORTANT: Replace these with your actual Supabase credentials
// Get these from: https://app.supabase.com/project/_/settings/api

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize Supabase client (only if credentials are provided)
let supabaseClient = null;

if (SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE') {
    // Load Supabase client from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = function() {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client initialized');
    };
    document.head.appendChild(script);
} else {
    console.warn('⚠️ Supabase credentials not configured. Contact form will work in demo mode.');
}

// ====================================
// SUBMIT FORM TO SUPABASE
// ====================================

async function submitToSupabase(formData) {
    // If Supabase is not configured, simulate successful submission
    if (!supabaseClient) {
        console.log('Demo mode - Form data:', formData);
        return new Promise(resolve => {
            setTimeout(resolve, 1000); // Simulate network delay
        });
    }

    try {
        // Add timestamp
        const submissionData = {
            ...formData,
            created_at: new Date().toISOString()
        };

        // Insert into Supabase
        const { data, error } = await supabaseClient
            .from('contacts')
            .insert([submissionData])
            .select();

        if (error) {
            throw error;
        }

        console.log('✅ Form submitted successfully:', data);
        return data;
    } catch (error) {
        console.error('❌ Supabase submission error:', error);
        throw new Error('Failed to submit form. Please try again.');
    }
}

// ====================================
// SETUP INSTRUCTIONS
// ====================================

/*
SETUP INSTRUCTIONS:

1. CREATE SUPABASE PROJECT
   - Go to https://supabase.com
   - Click "Start your project"
   - Create a new project (free tier is fine)
   - Wait for project initialization (~2 minutes)

2. GET YOUR CREDENTIALS
   - In your Supabase dashboard, go to Settings > API
   - Copy your "Project URL" (replace SUPABASE_URL above)
   - Copy your "anon/public" key (replace SUPABASE_ANON_KEY above)

3. CREATE DATABASE TABLE
   - Go to SQL Editor in your Supabase dashboard
   - Run this SQL command:

   CREATE TABLE contacts (
       id BIGSERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT NOT NULL,
       phone TEXT,
       service TEXT NOT NULL,
       budget TEXT NOT NULL,
       message TEXT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

   -- Allow anonymous inserts (for contact form submissions)
   CREATE POLICY "Allow anonymous inserts" ON contacts
       FOR INSERT
       TO anon
       WITH CHECK (true);

   -- Allow authenticated reads (for admin access)
   CREATE POLICY "Allow authenticated reads" ON contacts
       FOR SELECT
       TO authenticated
       USING (true);

4. TEST THE FORM
   - Open contact.html in your browser
   - Submit a test message
   - Check your Supabase dashboard > Table Editor > contacts
   - Your submission should appear there

5. VIEW SUBMISSIONS
   - Go to Table Editor in Supabase
   - Click on "contacts" table
   - View all form submissions

6. OPTIONAL: EMAIL NOTIFICATIONS
   - Set up email notifications using Supabase Edge Functions
   - Or use a service like Zapier to forward submissions to email
   - Instructions: https://supabase.com/docs/guides/functions

TROUBLESHOOTING:

- If form doesn't submit: Check browser console for errors
- If "Demo mode" message appears: Credentials not configured properly
- If CORS errors: Check Supabase URL is correct
- If submission fails: Verify RLS policies are created correctly

SECURITY NOTES:

- The anon key is safe to expose (it's meant for client-side use)
- Row Level Security (RLS) policies protect your data
- Never expose your service_role key in client-side code
- For production, consider rate limiting and additional validation
*/
