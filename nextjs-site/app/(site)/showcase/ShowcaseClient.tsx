'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import LessonCard from '@/components/LessonCard';
import LessonPlayer from '@/components/LessonPlayer';
import LessonModal from '@/components/LessonModal';
import { seedLessons, lessonsInSection, type Lesson } from '@/lib/lessons';
import { SHOWCASE_SECTIONS, SUBJECTS, type SectionId } from '@/lib/site';

export default function ShowcaseClient() {
  const [lessons, setLessons] = useState<Lesson[]>(seedLessons);
  const [loading, setLoading] = useState(true);
  const [modalLesson, setModalLesson] = useState<Lesson | null>(null);

  // Featured lesson and active subject filter are tracked per section.
  const [featured, setFeatured] = useState<Record<SectionId, Lesson | null>>({
    academic: null,
    islamic: null,
  });
  const [filters, setFilters] = useState<Record<SectionId, string>>({
    academic: 'All',
    islamic: 'All',
  });

  useEffect(() => {
    let cancelled = false;

    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        if (!cancelled && data.success && Array.isArray(data.items) && data.items.length > 0) {
          setLessons(data.items as Lesson[]);
        }
      } catch (error) {
        // Seed lessons stay on screen, so a failed fetch is not user-facing.
        console.error('Error fetching lessons:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLessons();
    return () => {
      cancelled = true;
    };
  }, []);

  const bySection = useMemo(
    () => ({
      academic: lessonsInSection(lessons, 'academic'),
      islamic: lessonsInSection(lessons, 'islamic'),
    }),
    [lessons]
  );

  const featuredFor = useCallback(
    (section: SectionId): Lesson | null => featured[section] ?? bySection[section][0] ?? null,
    [featured, bySection]
  );

  return (
    <>
      <section className="bg-gradient-to-b from-sky to-white px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
        <div className="section-shell max-w-3xl">
          <p className="eyebrow">Video showcase</p>
          <h1 className="heading-xl mt-3">A clear story for every subject.</h1>
          <p className="body-copy mt-5 text-lg leading-8">
            Sample lesson directions from both sides of the studio. Select any card to
            load it into that section&rsquo;s player, or open it for the full outline.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {SHOWCASE_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy-950 transition hover:border-brand-300"
              >
                {section.title}
                <Icon name="chevron-down" size={15} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {SHOWCASE_SECTIONS.map((section, index) => (
        <ShowcaseSectionBlock
          key={section.id}
          sectionId={section.id}
          title={section.title}
          blurb={section.blurb}
          lessons={bySection[section.id]}
          loading={loading}
          tinted={index % 2 === 1}
          featured={featuredFor(section.id)}
          activeFilter={filters[section.id]}
          onFilter={(subject) =>
            setFilters((current) => ({ ...current, [section.id]: subject }))
          }
          onFeature={(lesson) =>
            setFeatured((current) => ({ ...current, [section.id]: lesson }))
          }
          onOpen={setModalLesson}
        />
      ))}

      <section className="bg-navy-950 px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Don&rsquo;t see your topic?
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#c8d9f4]">
            These are directions, not a catalogue. Every lesson we make is built
            around one institution&rsquo;s curriculum and one group of students.
          </p>
          <Link href="/contact" className="btn-primary mt-8">
            Request a custom lesson
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </section>

      <LessonModal lesson={modalLesson} onClose={() => setModalLesson(null)} />
    </>
  );
}

interface SectionBlockProps {
  sectionId: SectionId;
  title: string;
  blurb: string;
  lessons: Lesson[];
  loading: boolean;
  tinted: boolean;
  featured: Lesson | null;
  activeFilter: string;
  onFilter: (subject: string) => void;
  onFeature: (lesson: Lesson) => void;
  onOpen: (lesson: Lesson) => void;
}

function ShowcaseSectionBlock({
  sectionId,
  title,
  blurb,
  lessons,
  loading,
  tinted,
  featured,
  activeFilter,
  onFilter,
  onFeature,
  onOpen,
}: SectionBlockProps) {
  const headingId = `${sectionId}-heading`;
  const chips = ['All', ...SUBJECTS[sectionId]];
  const visible =
    activeFilter === 'All'
      ? lessons
      : lessons.filter((lesson) => lesson.subject === activeFilter);

  // Announce filter results to screen readers without moving focus.
  const resultsRef = useRef<HTMLParagraphElement>(null);

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={`scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 ${tinted ? 'bg-canvas' : 'bg-white'}`}
    >
      <div className="section-shell">
        <div className="max-w-2xl">
          <h2 id={headingId} className="heading-lg">
            {title}
          </h2>
          <p className="body-copy mt-3">{blurb}</p>
        </div>

        {featured && (
          <div className="mt-9 overflow-hidden rounded-[2rem] bg-navy-950 p-6 shadow-stage sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <LessonPlayer item={featured} title={featured.title} />
              <div>
                <span className="inline-flex rounded-full bg-white/14 px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-[#d8efff]">
                  Featured lesson
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-3 leading-7 text-[#c8d9f4]">{featured.description}</p>
                <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <div>
                    <dt className="text-[#8fd2ff]">Subject</dt>
                    <dd className="font-semibold text-white">{featured.subject}</dd>
                  </div>
                  {featured.year_group && (
                    <div>
                      <dt className="text-[#8fd2ff]">Year group</dt>
                      <dd className="font-semibold text-white">{featured.year_group}</dd>
                    </div>
                  )}
                  {featured.duration && (
                    <div>
                      <dt className="text-[#8fd2ff]">Runtime</dt>
                      <dd className="font-semibold text-white">{featured.duration}</dd>
                    </div>
                  )}
                </dl>
                <button
                  type="button"
                  onClick={() => onOpen(featured)}
                  className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-accent-300"
                >
                  Lesson outline
                  <Icon name="arrow-right" size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label={`Filter ${title}`}>
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onFilter(chip)}
              aria-pressed={activeFilter === chip}
              className={`focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeFilter === chip
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-line bg-white text-navy-900 hover:border-brand-300'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <p ref={resultsRef} aria-live="polite" className="sr-only">
          {visible.length} lesson{visible.length === 1 ? '' : 's'} shown
        </p>

        {loading && lessons.length === 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-3xl border border-line bg-navy-50"
              />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-line bg-white p-8 text-center body-copy">
            No lessons in this subject yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                pressable
                selected={featured?.id === lesson.id}
                onSelect={onFeature}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
