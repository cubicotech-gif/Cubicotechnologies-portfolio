'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Icon, { type IconName } from '@/components/Icon';
import LessonCard from '@/components/LessonCard';
import LessonPlayer from '@/components/LessonPlayer';
import LessonModal from '@/components/LessonModal';
import { seedLessons, lessonsInSection, type Lesson } from '@/lib/lessons';
import { SHOWCASE_SECTIONS } from '@/lib/site';

const capabilities: { icon: IconName; title: string; copy: string }[] = [
  {
    icon: 'blocks',
    title: 'Make abstract ideas concrete',
    copy: 'Visual storytelling, worked examples and motion turn the ideas students cannot picture into something they can.',
  },
  {
    icon: 'cursor-click',
    title: 'Hold attention on purpose',
    copy: 'Pace, framing and visual language are built for classroom attention spans, not for showreels.',
  },
  {
    icon: 'target',
    title: 'Align to your curriculum',
    copy: 'Every sequence is shaped around the concepts, vocabulary and outcomes your specification actually requires.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Share your curriculum',
    copy: 'Tell us the topic, the year group and the misconception you keep having to correct.',
  },
  {
    number: '02',
    title: 'Shape the lesson',
    copy: 'We plan the learning journey, the visual approach and age-appropriate language, then agree it with you.',
  },
  {
    number: '03',
    title: 'Animate and review',
    copy: 'You review the storyboard and the animation at fixed milestones, with revisions built into each stage.',
  },
  {
    number: '04',
    title: 'Deliver for your students',
    copy: 'A finished lesson in the formats your classrooms, VLE and school network can actually play.',
  },
];

export default function HomeClient() {
  const [lessons, setLessons] = useState<Lesson[]>(seedLessons);
  const [modalLesson, setModalLesson] = useState<Lesson | null>(null);

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
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
    return () => {
      cancelled = true;
    };
  }, []);

  // One highlight from each section, so the home page previews both sides.
  const highlights = useMemo(() => {
    const academic = lessonsInSection(lessons, 'academic').slice(0, 2);
    const islamic = lessonsInSection(lessons, 'islamic').slice(0, 2);
    return [...academic, ...islamic];
  }, [lessons]);

  const activeFeature = highlights[0] ?? null;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-8rem] top-4 h-72 w-72 rounded-full bg-sky-200/70 blur-[2px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[-7rem] h-56 w-56 rounded-full bg-accent-100/80 blur-[2px]"
        />

        <div className="section-shell relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="tag-soft mb-5">Animation made for learning</p>
            <h1 className="heading-xl max-w-3xl">
              Complex curricula, brought to life through animated lessons.
            </h1>
            <p className="body-copy mt-6 max-w-2xl text-lg leading-8">
              We transform text-heavy school content into clear, concrete and engaging
              animated learning experiences — across core academic subjects, Islamic
              Studies and Arabic language.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/showcase" className="btn-primary">
                View video showcase
                <Icon name="arrow-right" size={18} />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Request a custom lesson
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
              {[
                { value: '100+', label: 'Lessons produced' },
                { value: '50+', label: 'Institutions served' },
                { value: '5+', label: 'Years in education' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-bold text-brand-600">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-gradient-to-br from-sky-100 via-white to-accent-50 p-6 shadow-hero sm:p-9">
              <div
                aria-hidden="true"
                className="absolute left-8 top-9 h-16 w-16 rotate-12 rounded-2xl bg-accent-300/80"
              />
              <div
                aria-hidden="true"
                className="animate-floaty absolute right-10 top-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-lg"
              >
                <Icon name="sigma" size={26} />
              </div>
              <div
                aria-hidden="true"
                className="animate-floaty-slow absolute bottom-9 left-9 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg"
              >
                <Icon name="atom" size={26} />
              </div>
              <div
                aria-hidden="true"
                className="animate-floaty absolute bottom-12 right-8 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-300 text-navy-950 shadow-lg"
              >
                <Icon name="book-open" size={22} />
              </div>

              <div className="relative mx-[12%] my-[10%] rounded-[1.5rem] border-8 border-white shadow-xl">
                {activeFeature ? (
                  <LessonPlayer
                    item={activeFeature}
                    title={activeFeature.title}
                    className="rounded-[1rem]"
                  />
                ) : (
                  <div className="aspect-video rounded-[1rem] bg-brand-700" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="px-5 py-16 sm:px-8">
        <div className="section-shell">
          <div className="mb-9 max-w-2xl">
            <p className="eyebrow">What animation can do</p>
            <h2 className="heading-lg mt-3">Made for lessons that need to click.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {capabilities.map((item) => (
              <article key={item.title} className="surface-card p-6">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky text-brand-700">
                  <Icon name={item.icon} size={24} />
                </span>
                <h3 className="text-xl font-bold text-navy-950">{item.title}</h3>
                <p className="body-copy mt-3">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TWO SHOWCASE STRANDS */}
      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Two strands of work</p>
            <h2 className="heading-lg mt-3">
              Core curriculum, and Islamic Studies &amp; Arabic.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {SHOWCASE_SECTIONS.map((section) => (
              <Link
                key={section.id}
                href={`/showcase#${section.id}`}
                className="focus-ring card-lift group rounded-3xl border border-line bg-white p-8 shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky text-brand-700">
                  <Icon name={section.id === 'academic' ? 'graduation-cap' : 'book-open'} size={24} />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy-950">
                  {section.title}
                </h3>
                <p className="body-copy mt-3">{section.blurb}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-600">
                  Watch examples
                  <Icon name="arrow-right" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LESSONS */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow">Selected lessons</p>
              <h2 className="heading-lg mt-3">Recent work from both strands.</h2>
            </div>
            <Link
              href="/showcase"
              className="focus-ring inline-flex items-center gap-2 rounded-full text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              See the full showcase
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                priority={index < 2}
                onSelect={setModalLesson}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">A collaborative process</p>
            <h2 className="heading-lg mt-3">From curriculum page to animated lesson.</h2>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <li key={step.number} className="surface-card p-6">
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-navy-950">{step.title}</h3>
                <p className="body-copy mt-3">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell">
          <div className="overflow-hidden rounded-[2rem] bg-navy-950 px-6 py-14 text-center shadow-stage sm:px-12">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
              Let&rsquo;s make your next lesson easier to understand.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#c8d9f4]">
              Tell us the curriculum area you want to bring to life, and we&rsquo;ll come
              back with an approach, a timeline and a cost.
            </p>
            <Link href="/contact" className="btn-primary mt-8">
              Start a conversation
              <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <LessonModal lesson={modalLesson} onClose={() => setModalLesson(null)} />
    </>
  );
}
