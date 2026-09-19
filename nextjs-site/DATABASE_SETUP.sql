-- ===================================================================
--  CUBICO EDUCATIONAL ANIMATION STUDIO — FRESH DATABASE SETUP
-- ===================================================================
--  Run this ONCE in the Supabase SQL editor on a NEW project.
--  It creates the final schema directly, so no migration is needed
--  afterwards.
--
--  Safe to re-run: every statement is guarded.
--
--  If you instead have an OLD database from the previous agency site
--  (tables called hero_images, featured_projects, client_logos …),
--  do NOT run this. Run MIGRATION-education-studio.sql, which converts
--  that schema in place and keeps your data.
-- ===================================================================


-- -------------------------------------------------------------------
-- 1. LESSONS  (table name kept as portfolio_items so existing
--    deployments and API routes keep working)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  title        TEXT NOT NULL,
  -- Which showcase block the lesson belongs to.
  section      TEXT NOT NULL CHECK (section IN ('academic', 'islamic')),
  -- Filter chip within that section, e.g. 'Mathematics'.
  subject      TEXT NOT NULL,
  description  TEXT NOT NULL,

  -- Media. A lesson needs at least one of these three.
  image_url    TEXT,   -- card art / fallback still
  poster_url   TEXT,   -- explicit poster frame
  video_url    TEXT,   -- self-hosted file in Supabase storage
  embed_url    TEXT,   -- YouTube or Vimeo link
  media_type   TEXT CHECK (media_type IS NULL OR media_type IN ('image', 'video')),

  year_group   TEXT,
  duration     TEXT,
  outcomes     TEXT[] DEFAULT '{}',

  "order"      INTEGER NOT NULL DEFAULT 1,
  active       BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_section ON portfolio_items(section);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_subject ON portfolio_items(subject);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_active  ON portfolio_items(active);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_order   ON portfolio_items("order");

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access"       ON portfolio_items;
DROP POLICY IF EXISTS "Service role full access" ON portfolio_items;

CREATE POLICY "Public read access" ON portfolio_items
  FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON portfolio_items
  FOR ALL USING (auth.role() = 'service_role');


-- -------------------------------------------------------------------
-- 2. INSTITUTION ENQUIRIES
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  institution_name TEXT NOT NULL,
  contact_name     TEXT NOT NULL,
  role             TEXT,
  work_email       TEXT NOT NULL,
  phone            TEXT,
  curriculum_area  TEXT NOT NULL,
  year_group       TEXT NOT NULL,
  timeline         TEXT,
  project_brief    TEXT NOT NULL,
  consent_given    BOOLEAN DEFAULT false,

  status           TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status
  ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_work_email
  ON contact_submissions(work_email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_institution
  ON contact_submissions(institution_name);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Enquiries are never publicly readable: only the service role (the API
-- routes) may touch them.
DROP POLICY IF EXISTS "Service role full access" ON contact_submissions;
CREATE POLICY "Service role full access" ON contact_submissions
  FOR ALL USING (auth.role() = 'service_role');


-- -------------------------------------------------------------------
-- 3. SITE SETTINGS  (used for the navigation logo)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  value      TEXT NOT NULL,
  type       TEXT DEFAULT 'Main Logo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access"       ON site_settings;
DROP POLICY IF EXISTS "Service role full access" ON site_settings;

CREATE POLICY "Public read access" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON site_settings
  FOR ALL USING (auth.role() = 'service_role');


-- -------------------------------------------------------------------
-- 4. STORAGE BUCKET
-- -------------------------------------------------------------------
-- The bucket must exist before any upload works. The old setup script
-- created the policies but not the bucket itself, which is why uploads
-- failed on a fresh project.
--
-- file_size_limit is 100MB to match the video ceiling enforced in
-- app/api/get-upload-url/route.ts.
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('images', 'images', true, 104857600)
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = GREATEST(
        COALESCE(storage.buckets.file_size_limit, 0),
        104857600
      );


-- -------------------------------------------------------------------
-- 5. STORAGE POLICIES
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read access"   ON storage.objects;
DROP POLICY IF EXISTS "Service role upload"  ON storage.objects;
DROP POLICY IF EXISTS "Service role update"  ON storage.objects;
DROP POLICY IF EXISTS "Service role delete"  ON storage.objects;

CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Service role upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'service_role');

-- Needed because the admin uploader sends x-upsert, which performs an
-- UPDATE when a file of the same name already exists.
CREATE POLICY "Service role update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'service_role');


-- ===================================================================
--  VERIFY
-- ===================================================================
SELECT 'Tables' AS check, table_name AS result
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('portfolio_items', 'contact_submissions', 'site_settings')

UNION ALL
SELECT 'Bucket', id FROM storage.buckets WHERE id = 'images'

UNION ALL
SELECT 'Storage policy', policyname
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'

ORDER BY 1, 2;
