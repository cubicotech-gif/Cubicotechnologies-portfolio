# Cubico Educational Animation Studio

Next.js 14 (App Router) site for an educational animation studio, backed by
Supabase for content and media.

## Pages

| Route       | Purpose                                                        |
|-------------|----------------------------------------------------------------|
| `/`         | Hero, capabilities, the two lesson strands, process, CTA         |
| `/showcase` | Video showcase split into **Academic Concepts** and **Islamic Studies & Arabic Language** |
| `/services` | Production offerings and the six-stage process                   |
| `/about`    | Studio positioning and principles                                |
| `/contact`  | Institution enquiry form                                         |
| `/admin/*`  | Content management (see the security note below)                 |

`/portfolio` permanently redirects to `/showcase`.

## Theming

The whole visual system lives in two files:

- `tailwind.config.ts` — colour scales (`navy`, `brand`, `accent`, `sky`) and
  semantic aliases (`ink`, `muted`, `line`, `canvas`)
- `app/globals.css` — CSS variables plus component classes
  (`.btn-primary`, `.surface-card`, `.field`, `.heading-xl`, …)

Pages use those semantic classes rather than raw colours, so a retheme means
editing these two files, not every component.

Fonts: **Fraunces** (display) and **DM Sans** (body), loaded via `next/font`.

## Lesson content

Lessons are `portfolio_items` rows. Each has a `section` (`academic` or
`islamic`) and a `subject` used for the filter chips.

Media resolution is handled by `lib/media.ts`, which supports three sources:

1. `embed_url` — a YouTube or Vimeo link (played via a no-cookie iframe that is
   only injected after the viewer presses play)
2. `video_url` — a self-hosted file uploaded through the admin media library
3. `image_url` / `poster_url` — the still shown on the card and as the poster

`lib/lessons.ts` holds seed lessons that render before Supabase returns data,
so the showcase is never empty.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the Supabase values
npm run dev
```

## Database

Pick **one** of these, depending on what your Supabase project already has.

**A new / empty project** — run `DATABASE_SETUP.sql` in the Supabase SQL editor.
It creates the final schema directly, so no migration is needed afterwards.

**A project still holding the old agency schema** (tables named `hero_images`,
`featured_projects`, `client_logos`) — run `MIGRATION-education-studio.sql`
instead. It converts the schema in place and keeps your rows: old columns are
made nullable and back-filled rather than dropped, and a commented block at the
bottom removes them once you have verified the live site.

Running the wrong one is safe — each detects the situation and either no-ops or
tells you which script to use.

Both scripts create the `images` storage bucket with a 100MB file size limit.
The bucket is what the uploader writes to, so nothing uploads until one of them
has run.

Tables created: `portfolio_items` (lessons), `contact_submissions` (enquiries)
and `site_settings` (navigation logo).

## When something is not working

Open any admin page. If the backend is misconfigured, a red panel at the top
names the failing checks instead of leaving you to read 500s in the console.
The same data is available as JSON at `/api/health`, which reports:

- whether each environment variable is set, and whether it has stray
  whitespace (a trailing newline pasted into an env value produces a bare
  "fetch failed" and is otherwise invisible)
- whether `NEXT_PUBLIC_SUPABASE_URL` parses, and whether it points at the
  dashboard rather than the project API
- whether each table is present and readable
- whether the `images` storage bucket exists

Environment values are trimmed before use, so whitespace is reported but no
longer breaks anything. `/api/health` never returns a key, only its length.

## Admin panel

| Page                | What it does                                                   |
|---------------------|----------------------------------------------------------------|
| `/admin`            | Overview: live lesson counts per section, new enquiry count      |
| `/admin/lessons`    | Create, edit, reorder, hide and delete lessons                   |
| `/admin/enquiries`  | Read contact-form enquiries, change status, reply by email       |
| `/admin/library`    | Everything in storage; upload, copy URL, delete                  |

### Adding a lesson

`/admin/lessons` -> **New lesson**. Each lesson needs a title, section, subject
and description. For the video, use whichever suits:

- **Paste a YouTube or Vimeo link.** The form recognises the URL and shows a
  live preview so you can confirm it before saving.
- **Upload the video file.** It goes browser-to-storage via a signed URL, so
  the 100MB limit applies rather than Vercel's 4.5MB request cap. A progress
  bar tracks the real upload.
- **Poster image.** Optional for embeds (YouTube's thumbnail is used as a
  fallback), recommended for uploaded files.

Lessons are ordered per section with the up/down arrows, and **Hide** takes one
off the public site without deleting it.

Until you save your first lesson, the public showcase falls back to the eight
built-in samples in `lib/lessons.ts` so the site is never empty.
