-- ===================================================================
--  Migration: creative agency  ->  educational animation studio
-- ===================================================================
--  Run this ONCE in the Supabase SQL editor on a database that already
--  holds the OLD agency schema.
--
--  On a NEW project run DATABASE_SETUP.sql instead: it creates the
--  final schema directly and needs no migration.
--
--  Safe to run more than once, and safe to run against a database that
--  is already on the new schema — every step that depends on a legacy
--  column checks for that column first.
--
--  What it does
--    1. Adds the lesson fields to portfolio_items (section, subject,
--       year_group, duration, outcomes, poster_url, video_url,
--       embed_url, media_type) and back-fills them from the old
--       agency columns.
--    2. Adds the institution enquiry fields to contact_submissions and
--       back-fills them from the old name/email/service/message.
--
--  The OLD COLUMNS ARE LEFT IN PLACE and only made nullable. Nothing is
--  dropped, so the data stays recoverable. The optional block at the
--  bottom removes them once you have verified the live site.
-- ===================================================================


-- -------------------------------------------------------------------
-- 0. Guard
-- -------------------------------------------------------------------
DO $guard$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'portfolio_items'
  ) THEN
    RAISE EXCEPTION
      'Nothing to migrate: this database has no portfolio_items table. %',
      'Run DATABASE_SETUP.sql instead — it creates the final schema directly on a new project.';
  END IF;
END
$guard$;


-- -------------------------------------------------------------------
-- 1. portfolio_items  ->  lessons
-- -------------------------------------------------------------------

ALTER TABLE portfolio_items
  ADD COLUMN IF NOT EXISTS section     TEXT,
  ADD COLUMN IF NOT EXISTS subject     TEXT,
  ADD COLUMN IF NOT EXISTS year_group  TEXT,
  ADD COLUMN IF NOT EXISTS duration    TEXT,
  ADD COLUMN IF NOT EXISTS outcomes    TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS poster_url  TEXT,
  ADD COLUMN IF NOT EXISTS video_url   TEXT,
  ADD COLUMN IF NOT EXISTS embed_url   TEXT,
  ADD COLUMN IF NOT EXISTS media_type  TEXT;

-- The old agency columns were NOT NULL, which would block inserting a
-- lesson. Relax whichever of them this database actually has.
DO $relax$
DECLARE
  col TEXT;
BEGIN
  FOREACH col IN ARRAY ARRAY['category', 'client', 'year', 'image_url', 'description']
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'portfolio_items'
        AND column_name = col AND is_nullable = 'NO'
    ) THEN
      EXECUTE format('ALTER TABLE portfolio_items ALTER COLUMN %I DROP NOT NULL', col);
    END IF;
  END LOOP;
END
$relax$;

-- Everything existing becomes an academic lesson so nothing vanishes
-- from the showcase; you can move rows to the other section afterwards.
UPDATE portfolio_items SET section = 'academic' WHERE section IS NULL;

-- Carry the old category across as the subject label, when that column
-- is present.
DO $subject$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'portfolio_items'
      AND column_name = 'category'
  ) THEN
    EXECUTE $sql$
      UPDATE portfolio_items
      SET subject = COALESCE(NULLIF(category, ''), 'Foundations')
      WHERE subject IS NULL
    $sql$;
  END IF;
END
$subject$;

-- Anything still without a subject gets a safe default.
UPDATE portfolio_items SET subject = 'Foundations' WHERE subject IS NULL;

-- Infer media_type for rows uploaded before the column existed.
UPDATE portfolio_items
SET media_type = CASE
  WHEN lower(split_part(image_url, '?', 1)) ~ '\.(mp4|webm|mov|m4v|ogv)$' THEN 'video'
  ELSE 'image'
END
WHERE media_type IS NULL AND image_url IS NOT NULL;

-- Move video files out of image_url into video_url, where they belong.
UPDATE portfolio_items
SET video_url = image_url
WHERE video_url IS NULL AND media_type = 'video';

ALTER TABLE portfolio_items DROP CONSTRAINT IF EXISTS portfolio_items_section_check;
ALTER TABLE portfolio_items
  ADD CONSTRAINT portfolio_items_section_check
  CHECK (section IN ('academic', 'islamic'));

ALTER TABLE portfolio_items DROP CONSTRAINT IF EXISTS portfolio_items_media_type_check;
ALTER TABLE portfolio_items
  ADD CONSTRAINT portfolio_items_media_type_check
  CHECK (media_type IS NULL OR media_type IN ('image', 'video'));

ALTER TABLE portfolio_items ALTER COLUMN section SET NOT NULL;
ALTER TABLE portfolio_items ALTER COLUMN subject SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_portfolio_items_section ON portfolio_items(section);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_subject ON portfolio_items(subject);


-- -------------------------------------------------------------------
-- 2. contact_submissions  ->  institution enquiries
-- -------------------------------------------------------------------

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS institution_name TEXT,
  ADD COLUMN IF NOT EXISTS contact_name     TEXT,
  ADD COLUMN IF NOT EXISTS role             TEXT,
  ADD COLUMN IF NOT EXISTS work_email       TEXT,
  ADD COLUMN IF NOT EXISTS curriculum_area  TEXT,
  ADD COLUMN IF NOT EXISTS year_group       TEXT,
  ADD COLUMN IF NOT EXISTS timeline         TEXT,
  ADD COLUMN IF NOT EXISTS project_brief    TEXT,
  ADD COLUMN IF NOT EXISTS consent_given    BOOLEAN DEFAULT false;

-- Carry old submissions across, so the enquiries inbox keeps its
-- history, and relax the old NOT NULLs.
DO $enquiries$
DECLARE
  col TEXT;
  legacy TEXT[] := ARRAY['name', 'email', 'service', 'message'];
  present BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'contact_submissions'
      AND column_name = 'name'
  ) INTO present;

  IF present THEN
    EXECUTE $sql$
      UPDATE contact_submissions
      SET contact_name     = COALESCE(contact_name, name),
          work_email       = COALESCE(work_email, email),
          curriculum_area  = COALESCE(curriculum_area, service),
          project_brief    = COALESCE(project_brief, message),
          institution_name = COALESCE(institution_name, '(not recorded)'),
          year_group       = COALESCE(year_group, '(not recorded)')
      WHERE contact_name IS NULL OR work_email IS NULL
    $sql$;
  END IF;

  FOREACH col IN ARRAY legacy
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'contact_submissions'
        AND column_name = col AND is_nullable = 'NO'
    ) THEN
      EXECUTE format('ALTER TABLE contact_submissions ALTER COLUMN %I DROP NOT NULL', col);
    END IF;
  END LOOP;
END
$enquiries$;

-- Any row still missing a required value gets a placeholder, otherwise
-- the NOT NULL constraints below cannot be applied.
UPDATE contact_submissions
SET institution_name = COALESCE(institution_name, '(not recorded)'),
    contact_name     = COALESCE(contact_name, '(not recorded)'),
    work_email       = COALESCE(work_email, '(not recorded)'),
    curriculum_area  = COALESCE(curriculum_area, '(not recorded)'),
    year_group       = COALESCE(year_group, '(not recorded)'),
    project_brief    = COALESCE(project_brief, '(not recorded)')
WHERE institution_name IS NULL
   OR contact_name IS NULL
   OR work_email IS NULL
   OR curriculum_area IS NULL
   OR year_group IS NULL
   OR project_brief IS NULL;

ALTER TABLE contact_submissions ALTER COLUMN institution_name SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN contact_name     SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN work_email       SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN curriculum_area  SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN year_group       SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN project_brief    SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_work_email
  ON contact_submissions(work_email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_institution
  ON contact_submissions(institution_name);


-- -------------------------------------------------------------------
-- 3. Storage bucket and policies
-- -------------------------------------------------------------------
-- The old setup created storage policies but never the bucket itself,
-- and capped uploads below the 100MB video ceiling.
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('images', 'images', true, 104857600)
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = GREATEST(
        COALESCE(storage.buckets.file_size_limit, 0),
        104857600
      );

DROP POLICY IF EXISTS "Public read access"  ON storage.objects;
DROP POLICY IF EXISTS "Service role upload" ON storage.objects;
DROP POLICY IF EXISTS "Service role update" ON storage.objects;
DROP POLICY IF EXISTS "Service role delete" ON storage.objects;

CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Service role upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'service_role');
-- Needed because the uploader sends x-upsert, which UPDATEs on replace.
CREATE POLICY "Service role update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'service_role');
CREATE POLICY "Service role delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'service_role');


-- ===================================================================
--  VERIFY
-- ===================================================================
SELECT 'Lessons' AS check, count(*)::text AS result FROM portfolio_items
UNION ALL
SELECT 'Enquiries', count(*)::text FROM contact_submissions
UNION ALL
SELECT 'Bucket', COALESCE(max(id), 'MISSING') FROM storage.buckets WHERE id = 'images';


-- ===================================================================
-- 4. OPTIONAL CLEANUP — run only after verifying the live site.
--    This permanently removes the old agency columns and their data.
-- ===================================================================
-- ALTER TABLE portfolio_items
--   DROP COLUMN IF EXISTS category,
--   DROP COLUMN IF EXISTS client,
--   DROP COLUMN IF EXISTS year,
--   DROP COLUMN IF EXISTS services;
--
-- ALTER TABLE contact_submissions
--   DROP COLUMN IF EXISTS name,
--   DROP COLUMN IF EXISTS email,
--   DROP COLUMN IF EXISTS service,
--   DROP COLUMN IF EXISTS budget,
--   DROP COLUMN IF EXISTS message;
