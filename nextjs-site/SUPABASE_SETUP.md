# Supabase Setup Guide

Complete guide to set up Supabase for image uploads and database storage in your portfolio website.

## Why Supabase?

- ✅ **Open Source** - Can self-host if needed
- ✅ **PostgreSQL Database** - Powerful, persistent data storage
- ✅ **Storage Included** - 1GB free storage
- ✅ **Authentication Ready** - Built-in auth (for future features)
- ✅ **No Credit Card** - Free tier doesn't require payment
- ✅ **Works on Vercel** - Perfect for serverless deployments
- ✅ **Real-time Subscriptions** - Auto-update when data changes

---

## Quick Setup (10 Minutes)

### Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign In"**
3. Sign up with GitHub (recommended) or email
4. Click **"New project"**
5. Fill in:
   - **Name**: `cubico-portfolio`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `US East`)
   - **Pricing Plan**: **Free**
6. Click **"Create new project"**
7. Wait ~2 minutes for project to initialize

### Step 2: Create Database Table

1. In left sidebar, click **"SQL Editor"**
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
-- Create hero_images table
CREATE TABLE hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT,
  category TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on order for faster sorting
CREATE INDEX idx_hero_images_order ON hero_images("order");

-- Create index on active status
CREATE INDEX idx_hero_images_active ON hero_images(active);

-- Add Row Level Security (RLS) policies
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for displaying images)
CREATE POLICY "Public read access" ON hero_images
  FOR SELECT USING (true);

-- Allow service role to insert, update, delete
CREATE POLICY "Service role full access" ON hero_images
  FOR ALL USING (auth.role() = 'service_role');
```

4. Click **"Run"** (or press `Ctrl/Cmd + Enter`)
5. You should see: **"Success. No rows returned"**

### Step 3: Create Storage Bucket

1. In left sidebar, click **"Storage"**
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `hero-images`
   - **Public bucket**: ✅ **Check this box** (images need to be publicly accessible)
4. Click **"Create bucket"**

### Step 4: Configure Storage Policies

1. Click on the **`hero-images`** bucket you just created
2. Click **"Policies"** tab
3. Click **"New policy"**
4. Click **"Create a policy from scratch"**
5. For **SELECT (read)**:
   - Click **"New policy"**
   - Policy name: `Public read access`
   - Target roles: `public`
   - Policy definition: `true`
   - Click **"Review"** → **"Save policy"**

6. For **INSERT (upload)**:
   - Click **"New policy"**
   - Policy name: `Service role upload`
   - Target roles: `authenticated`, `service_role`
   - Policy definition: `true`
   - Click **"Review"** → **"Save policy"**

**Alternative (Simpler)**: Use these SQL commands in SQL Editor:

```sql
-- Storage policies for hero-images bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-images');

CREATE POLICY "Service role upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hero-images'
  AND (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);
```

### Step 5: Get API Credentials

1. In left sidebar, click **⚙️ Project Settings**
2. Click **"API"** in the settings menu
3. You'll see:

```
Project URL:
https://xxxxxxxxxxxxx.supabase.co

API Keys:
- anon/public: eyJhbGc...  (This is safe to use in browser)
- service_role: eyJhbGc... (⚠️ KEEP SECRET! Server-side only)
```

4. Copy these 3 values:
   - **Project URL**
   - **anon public key**
   - **service_role key**

### Step 6: Configure Local Environment

1. Open `/nextjs-site/.env.local`
2. Replace the placeholder values:

```env
# Your Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Your anon/public key (the shorter one)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...

# Your service_role key (⚠️ KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

### Step 7: Test Locally

```bash
cd nextjs-site
npm run dev
```

Visit `http://localhost:3000/admin/hero` and try uploading an image!

### Step 8: Deploy to Vercel

#### Add Environment Variables to Vercel:

1. Go to **https://vercel.com/dashboard**
2. Select your project
3. **Settings** → **Environment Variables**
4. Add these 3 variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxxxxxxxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` (your anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (your service_role key) |

5. Click **"Save"** for each
6. **Redeploy** your site

---

## Database Schema

The `hero_images` table structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `filename` | TEXT | Original filename |
| `url` | TEXT | Supabase Storage public URL |
| `category` | TEXT | Category (Logo Design, Artwork, etc.) |
| `order` | INTEGER | Display order (1, 2, 3...) |
| `active` | BOOLEAN | Show/hide on website |
| `created_at` | TIMESTAMPTZ | When image was added |

---

## How It Works

### 1. Image Upload Flow

```
User uploads image
  → Admin page sends to /api/upload-image
  → API uploads to Supabase Storage bucket
  → Returns public URL
  → Admin page adds record to database with URL
  → Image appears in hero section!
```

### 2. Display Flow

```
Homepage loads
  → AnimatedCardsBackground fetches from /api/hero-images
  → API queries Supabase database for active images
  → Returns images with URLs
  → Images display in animated background
```

### 3. Data Persistence

- **Images**: Stored permanently in Supabase Storage
- **Configuration**: Stored permanently in Supabase Database
- **Survives Deployments**: ✅ Yes! (unlike in-memory solutions)

---

## Free Tier Limits

| Resource | Free Tier Limit | Your Usage (est.) |
|----------|----------------|-------------------|
| **Database** | 500 MB | <10 MB (~100 records) |
| **Storage** | 1 GB | ~50 MB (~100 images) |
| **Bandwidth** | 2 GB | ~500 MB/month |
| **API Requests** | Unlimited* | ~1000/day |

*Fair use policy applies

**You'll use less than 5% of the free tier!**

---

## Troubleshooting

### Error: "relation 'hero_images' does not exist"

**Solution**: You didn't create the database table. Go to Step 2 and run the SQL.

### Error: "new row violates row-level security policy"

**Solution**: Check your RLS policies. Make sure service_role has full access.

### Upload fails with "Bucket not found"

**Solution**:
1. Go to Storage in Supabase
2. Make sure bucket is named exactly: `hero-images`
3. Make sure it's set to **Public**

### Images upload but don't display

**Solution**: Check storage policies. Public read access must be enabled:

```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-images');
```

### "Invalid JWT" error

**Solution**:
- Check environment variables are correct
- Make sure you're using the right keys (anon vs service_role)
- Restart dev server after changing .env.local

---

## Supabase Dashboard Quick Links

After setup, bookmark these:

- **Database**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
- **Storage**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/storage/buckets
- **API Settings**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api
- **SQL Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

Replace `YOUR_PROJECT_ID` with your actual project ID.

---

## Advanced: Database Queries

### View all hero images:

```sql
SELECT * FROM hero_images
ORDER BY "order" ASC;
```

### View only active images:

```sql
SELECT * FROM hero_images
WHERE active = true
ORDER BY "order" ASC;
```

### Count images per category:

```sql
SELECT category, COUNT(*)
FROM hero_images
GROUP BY category;
```

### Delete all inactive images:

```sql
DELETE FROM hero_images
WHERE active = false;
```

---

## Security Best Practices

### ✅ Safe (Public)
- `NEXT_PUBLIC_SUPABASE_URL` - OK in browser/Git
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - OK in browser/Git

### ⚠️ Secret (Never Expose)
- `SUPABASE_SERVICE_ROLE_KEY` - NEVER commit to Git, NEVER use client-side
- Already in `.gitignore` ✅

### Row Level Security (RLS)
- Database has RLS enabled
- Public can READ hero images
- Only service_role can WRITE
- Prevents unauthorized modifications

---

## Need Help?

### Supabase Documentation:
- **Getting Started**: https://supabase.com/docs/guides/getting-started
- **Storage Guide**: https://supabase.com/docs/guides/storage
- **Database**: https://supabase.com/docs/guides/database

### Check Logs:
1. **Supabase Logs**: Dashboard → Logs
2. **Vercel Logs**: Vercel Dashboard → Deployments → View Logs
3. **Browser Console**: F12 → Console tab

---

## Bonus: Future Features You Can Add

With Supabase, you can easily add:

- 🔐 **Authentication** - Login/admin access
- 📊 **Analytics** - Track image views
- 🔍 **Search** - Full-text search in images
- 📱 **Real-time** - Auto-update when images change
- 🗂️ **Categories** - Separate tables for different image types
- 💬 **Comments** - User feedback on portfolio

All included in the free tier!

---

Happy uploading! 🚀

Your images are now stored safely in Supabase's cloud infrastructure, and your configuration persists across deployments!
