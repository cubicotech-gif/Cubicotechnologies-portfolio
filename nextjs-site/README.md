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

## Known issue: the admin panel is unauthenticated

`/admin` and the write endpoints under `/api` have **no authentication**. Anyone
who knows the URL can upload, edit and delete site content, because the API
routes write with the Supabase service-role key.

This was deliberately left out of the redesign and needs closing before the site
handles real content. The smallest fix is a `middleware.ts` matching
`/admin/:path*` that checks a password from an environment variable; a fuller
fix is Supabase Auth, which the project already depends on.
