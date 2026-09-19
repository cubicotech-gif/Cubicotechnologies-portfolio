import type { SectionId } from '@/lib/site';
import type { MediaSource } from '@/lib/media';

export interface Lesson extends MediaSource {
  id: string | number;
  title: string;
  /** Which showcase block the lesson belongs to. */
  section: SectionId;
  /** Filter chip within that section, e.g. "Mathematics". */
  subject: string;
  description: string;
  year_group?: string | null;
  duration?: string | null;
  /** What a student can do after watching — shown in the detail view. */
  outcomes?: string[];
  order?: number;
  active?: boolean;
}

/**
 * Seed lessons. These render immediately so the site never looks empty, and
 * are replaced by Supabase rows as soon as the admin panel has content.
 */
export const seedLessons: Lesson[] = [
  {
    id: 'math-fractions',
    section: 'academic',
    subject: 'Mathematics',
    title: 'Fractions: seeing the whole',
    description:
      'Visual models connect parts, wholes and equivalence so fractions stop being arbitrary notation.',
    year_group: 'Primary (5-11)',
    duration: '4:20',
    image_url: '/images/lessons/mathematics.svg',
    outcomes: [
      'Identify the whole before naming the part',
      'Recognise equivalent fractions from an area model',
      'Explain why the denominator grows as pieces shrink',
    ],
  },
  {
    id: 'science-forces',
    section: 'academic',
    subject: 'Science',
    title: 'Forces in motion',
    description:
      'Pushes, pulls and resultant motion demonstrated through simple animated experiments.',
    year_group: 'Lower Secondary (11-14)',
    duration: '5:05',
    image_url: '/images/lessons/science.svg',
    outcomes: [
      'Describe balanced and unbalanced forces',
      'Predict motion from a force diagram',
      'Link everyday examples to the underlying model',
    ],
  },
  {
    id: 'history-maps',
    section: 'academic',
    subject: 'History',
    title: 'Reading a historical map',
    description:
      'Places, timelines and shifting borders assembled into one understandable story.',
    year_group: 'Lower Secondary (11-14)',
    duration: '6:12',
    image_url: '/images/lessons/history.svg',
    outcomes: [
      'Interpret map keys and period conventions',
      'Track change across a sequence of maps',
      'Connect geography to historical cause',
    ],
  },
  {
    id: 'literacy-main-idea',
    section: 'academic',
    subject: 'Literacy',
    title: 'Finding the main idea',
    description:
      'A repeatable visual framework that moves learners from surface detail to meaning.',
    year_group: 'Primary (5-11)',
    duration: '3:48',
    image_url: '/images/lessons/literacy.svg',
    outcomes: [
      'Separate supporting detail from central claim',
      'Summarise a paragraph in one sentence',
      'Apply the framework to unfamiliar text',
    ],
  },
  {
    id: 'quran-vocabulary',
    section: 'islamic',
    subject: "Qur'anic Studies",
    title: "Qur'anic vocabulary in context",
    description:
      'Recognition and understanding supported through context-led visual explanation.',
    year_group: 'Primary (5-11)',
    duration: '4:55',
    image_url: '/images/lessons/quran.svg',
    outcomes: [
      'Recognise high-frequency vocabulary by sight',
      'Infer meaning from surrounding context',
      'Connect a word to its root family',
    ],
  },
  {
    id: 'arabic-letters',
    section: 'islamic',
    subject: 'Arabic Language',
    title: 'Arabic letters and sound',
    description:
      'Sound, letter shape and word examples paired so early language learning becomes concrete.',
    year_group: 'Early Years (3-5)',
    duration: '3:30',
    image_url: '/images/lessons/arabic.svg',
    outcomes: [
      'Match each letter to its sound',
      'Recognise initial, medial and final forms',
      'Blend letters into short familiar words',
    ],
  },
  {
    id: 'islamic-history',
    section: 'islamic',
    subject: 'Islamic History',
    title: 'Exploring Islamic history',
    description:
      'Place, time and cultural context structured into meaningful historical learning.',
    year_group: 'Upper Secondary (14-16)',
    duration: '7:02',
    image_url: '/images/lessons/islamic-history.svg',
    outcomes: [
      'Place key events on a coherent timeline',
      'Describe the spread of scholarship geographically',
      'Evaluate a source within its context',
    ],
  },
  {
    id: 'foundations-core',
    section: 'islamic',
    subject: 'Foundations',
    title: 'Foundational concepts, clearly',
    description:
      'A calm visual pathway through key concepts and the vocabulary that carries them.',
    year_group: 'Primary (5-11)',
    duration: '5:40',
    image_url: '/images/lessons/foundations.svg',
    outcomes: [
      'Define each core term in student language',
      'Relate concepts to daily practice',
      'Build vocabulary that later topics depend on',
    ],
  },
];

export function lessonsInSection(lessons: Lesson[], section: SectionId): Lesson[] {
  return lessons
    .filter((lesson) => lesson.section === section && lesson.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
