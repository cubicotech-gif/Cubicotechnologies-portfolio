import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About the studio',
  description:
    'A small animation studio built around one question: what does a student actually need to see in order to understand this?',
};

const principles = [
  {
    icon: 'target' as const,
    title: 'Learning outcome first',
    copy: 'Every sequence starts from what a student should be able to do afterwards — not from a visual idea looking for a subject.',
  },
  {
    icon: 'users' as const,
    title: 'Built with teachers',
    copy: 'Subject leads review the script and storyboard before a single frame is animated, so the language matches the classroom.',
  },
  {
    icon: 'book-open' as const,
    title: 'Respectful by default',
    copy: 'For Islamic Studies and Arabic work we follow your institution’s guidance on depiction, transliteration and recitation.',
  },
  {
    icon: 'graduation-cap' as const,
    title: 'Made for real classrooms',
    copy: 'Delivered in formats that play on school networks, interactive whiteboards and your existing VLE.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-sky to-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="section-shell max-w-4xl">
          <p className="eyebrow">About the studio</p>
          <h1 className="heading-xl mt-3">
            We make the difficult part of the lesson the clear part.
          </h1>
          <p className="body-copy mt-6 max-w-2xl text-lg leading-8">
            {SITE.name} is an animation studio working exclusively in education. We
            take the topics that lose students — the abstract, the sequential, the
            hard-to-picture — and rebuild them as short animated lessons that a class
            can follow the first time.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">How we think</p>
            <h2 className="heading-lg mt-3">Four things we hold to.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {principles.map((item) => (
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

      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Who we work with</p>
            <h2 className="heading-lg mt-3">
              Schools, madrasas and curriculum publishers.
            </h2>
            <p className="body-copy mt-5">
              We work with institutions that already know what they need taught and
              want it taught better. That usually means a subject lead with a topic
              students keep struggling with, a curriculum team building a new scheme
              of work, or a publisher adding video to an existing resource.
            </p>
            <Link href="/contact" className="btn-primary mt-8">
              Start a conversation
              <Icon name="arrow-right" size={18} />
            </Link>
          </div>
          <div className="surface-card p-8">
            <h3 className="font-display text-2xl font-semibold text-navy-950">
              What a first conversation covers
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                'The topic and the specific misconception you want to fix',
                'Year group, prior knowledge and lesson length',
                'Curriculum or specification the lesson must align to',
                'Any institutional guidance on content and depiction',
                'Where the finished lesson needs to play',
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-600 text-white">
                    <Icon name="check" size={14} />
                  </span>
                  <span className="body-copy">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
