-- ===================================================================
--  Migration: creative agency  ->  educational animation studio
-- ===================================================================
--  Run this ONCE in the Supabase SQL editor, after DATABASE_SETUP.sql.
--  It is idempotent: every statement is guarded, so re-running is safe.
--
--  What it does
--    1. Adds the lesson fields to portfolio_items (section, subject,
--       year_group, duration, outcomes, poster_url, video_url,
--       embed_url, media_type) and back-fills them from the old
--       agency columns.
--    2. Adds the institution enquiry fields to contact_submissions and
--       back-fills them from the old name/email/service/message columns.
--
--  The OLD COLUMNS ARE LEFT IN PLACE and only made nullable. Nothing is
--  dropped, so existing data is recoverable and a rollback is possible.
--  Once you have confirmed the site works, the optional DROP block at
--  the bottom can be run to tidy up.
-- ===================================================================


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

-- The old agency columns were NOT NULL. Relax them so new lesson rows
-- can be inserted without supplying client/year/category.
ALTER TABLE portfolio_items ALTER COLUMN category    DROP NOT NULL;
ALTER TABLE portfolio_items ALTER COLUMN client      DROP NOT NULL;
ALTER TABLE portfolio_items ALTER COLUMN year        DROP NOT NULL;
ALTER TABLE portfolio_items ALTER COLUMN image_url   DROP NOT NULL;
ALTER TABLE portfolio_items ALTER COLUMN description DROP NOT NULL;

-- Back-fill: everything existing becomes an academic lesson, keeping its
-- old category as the subject label so nothing disappears from the grid.
UPDATE portfolio_items SET section = 'academic' WHERE section IS NULL;
UPDATE portfolio_items SET subject = COALESCE(NULLIF(category, ''), 'Foundations')
  WHERE subject IS NULL;

-- Infer media_type from the stored URL for rows uploaded before the
-- column existed.
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

ALTER TABLE portfolio_items
  DROP CONSTRAINT IF EXISTS portfolio_items_section_check;
ALTER TABLE portfolio_items
  ADD CONSTRAINT portfolio_items_section_check
  CHECK (section IN ('academic', 'islamic'));

ALTER TABLE portfolio_items
  DROP CONSTRAINT IF EXISTS portfolio_items_media_type_check;
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

-- Carry old submissions across so the admin inbox keeps its history.
UPDATE contact_submissions
SET
  contact_name    = COALESCE(contact_name, name),
  work_email      = COALESCE(work_email, email),
  curriculum_area = COALESCE(curriculum_area, service),
  project_brief   = COALESCE(project_brief, message),
  institution_name = COALESCE(institution_name, '(not recorded)'),
  year_group      = COALESCE(year_group, '(not recorded)')
WHERE contact_name IS NULL OR work_email IS NULL;

-- Relax the old NOT NULL columns so new-shaped inserts succeed.
ALTER TABLE contact_submissions ALTER COLUMN name    DROP NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN email   DROP NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN service DROP NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN message DROP NOT NULL;

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


-- ===================================================================
-- 3. OPTIONAL CLEANUP — run only after verifying the live site.
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
