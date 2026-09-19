/**
 * Single source of truth for studio identity and the two showcase sections.
 * Section ids are stored in `portfolio_items.section`, so keep these stable.
 */
export const SITE = {
  name: 'Cubico Educational Animation Studio',
  shortName: 'Cubico Studio',
  tagline: 'Curriculum, brought to life.',
  description:
    'We turn text-heavy school curricula into clear, concrete and engaging animated lessons — across core academic subjects, Islamic Studies and Arabic language.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cubicotechnologies.com',
  email: 'hello@cubicotechnologies.com',
} as const;

export type SectionId = 'academic' | 'islamic';

export interface ShowcaseSection {
  id: SectionId;
  title: string;
  blurb: string;
}

export const SHOWCASE_SECTIONS: ShowcaseSection[] = [
  {
    id: 'academic',
    title: 'Academic Concepts',
    blurb:
      'Mathematics, science, history and literacy — abstract ideas made concrete through visual storytelling.',
  },
  {
    id: 'islamic',
    title: 'Islamic Studies & Arabic Language',
    blurb:
      'Respectful, clear visual learning built around language, context and foundational understanding.',
  },
];

/** Subject filters offered within each showcase section. */
export const SUBJECTS: Record<SectionId, string[]> = {
  academic: ['Mathematics', 'Science', 'History', 'Literacy'],
  islamic: ["Qur'anic Studies", 'Arabic Language', 'Islamic History', 'Foundations'],
};

export const ALL_SUBJECTS: string[] = [
  ...SUBJECTS.academic,
  ...SUBJECTS.islamic,
];

/** Age bands used by the enquiry form and lesson metadata. */
export const YEAR_GROUPS = [
  'Early Years (3-5)',
  'Primary (5-11)',
  'Lower Secondary (11-14)',
  'Upper Secondary (14-16)',
  'Post-16 / College',
  'Mixed / Whole school',
] as const;
