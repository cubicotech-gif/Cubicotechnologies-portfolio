-- ===================================================================
-- COMPLETE DATABASE SETUP FOR CUBICO PORTFOLIO
-- Run this in Supabase SQL Editor
-- ===================================================================

-- ===================================================================
-- 1. HERO IMAGES TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT,
  category TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images("order");
CREATE INDEX IF NOT EXISTS idx_hero_images_active ON hero_images(active);

-- Enable Row Level Security
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON hero_images;
DROP POLICY IF EXISTS "Service role full access" ON hero_images;

-- Policies
CREATE POLICY "Public read access" ON hero_images
  FOR SELECT USING (true);

CREATE POLICY "Service role full access" ON hero_images
  FOR ALL USING (auth.role() = 'service_role');

-- ===================================================================
-- 2. FEATURED PROJECTS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS featured_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN DEFAULT true,
  client_name TEXT,
  project_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_featured_projects_order ON featured_projects("order");
CREATE INDEX IF NOT EXISTS idx_featured_projects_active ON featured_projects(active);
CREATE INDEX IF NOT EXISTS idx_featured_projects_category ON featured_projects(category);

-- Enable Row Level Security
ALTER TABLE featured_projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON featured_projects;
DROP POLICY IF EXISTS "Service role full access" ON featured_projects;

-- Policies
CREATE POLICY "Public read access" ON featured_projects
  FOR SELECT USING (true);

CREATE POLICY "Service role full access" ON featured_projects
  FOR ALL USING (auth.role() = 'service_role');

-- ===================================================================
-- 3. CLIENT LOGOS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS client_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN DEFAULT true,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_logos_order ON client_logos("order");
CREATE INDEX IF NOT EXISTS idx_client_logos_active ON client_logos(active);

-- Enable Row Level Security
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON client_logos;
DROP POLICY IF EXISTS "Service role full access" ON client_logos;

-- Policies
CREATE POLICY "Public read access" ON client_logos
  FOR SELECT USING (true);

CREATE POLICY "Service role full access" ON client_logos
  FOR ALL USING (auth.role() = 'service_role');

-- ===================================================================
-- STORAGE POLICIES (Run only if not already created)
-- ===================================================================

-- Allow public to read all images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'images');
  END IF;
END $$;

-- Allow service role to upload
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname = 'Service role upload'
  ) THEN
    CREATE POLICY "Service role upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'images'
      AND auth.role() = 'service_role'
    );
  END IF;
END $$;

-- Allow service role to delete
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname = 'Service role delete'
  ) THEN
    CREATE POLICY "Service role delete"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'images'
      AND auth.role() = 'service_role'
    );
  END IF;
END $$;

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================

-- Check tables
SELECT 'Tables Created:' as status;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('hero_images', 'featured_projects', 'client_logos');

-- Check storage policies
SELECT 'Storage Policies:' as status;
SELECT policyname FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
ORDER BY policyname;

-- ===================================================================
-- SUCCESS MESSAGE
-- ===================================================================
SELECT
  '✅ Database setup complete!' as message,
  'Tables: hero_images, featured_projects, client_logos' as tables,
  'Storage: images bucket with read/write/delete policies' as storage,
  'Security: RLS enabled on all tables' as security;
