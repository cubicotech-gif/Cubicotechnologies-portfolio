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

1. Run `DATABASE_SETUP.sql` on a fresh Supabase project.
2. Run `MIGRATION-education-studio.sql` to add the lesson and enquiry columns.

The migration is idempotent and non-destructive: old agency columns are made
nullable rather than dropped, and existing rows are back-filled. A commented
cleanup block at the bottom drops them once you have verified the live site.

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
