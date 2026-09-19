import type { Metadata } from 'next';
import Link from 'next/link';
import Icon, { type IconName } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'How we work',
  description:
    'Curriculum-aligned animated lesson production: scripting, storyboarding, animation, narration and delivery — with review milestones your subject leads control.',
};

const offerings: { icon: IconName; title: string; copy: string; includes: string[] }[] = [
  {
    icon: 'graduation-cap',
    title: 'Single lesson animation',
    copy: 'One topic, done properly. Best for the concept your students reliably get stuck on.',
    includes: [
      'Curriculum-aligned script',
      'Storyboard review round',
      'Full animation and sound design',
      'Professional narration',
    ],
  },
  {
    icon: 'film',
    title: 'Lesson series',
    copy: 'A connected sequence across a scheme of work, with a consistent visual language throughout.',
    includes: [
      'Shared visual system and characters',
      'Episode-level learning outcomes',
      'Consistent pacing across the series',
      'Bulk production timeline',
    ],
  },
  {
    icon: 'pen-tool',
    title: 'Curriculum visualisation',
    copy: 'Diagrams, explainer stills and animated assets that slot into lessons you already teach.',
    includes: [
      'Editable diagram sets',
      'Whiteboard-ready exports',
      'Slide-deck animation loops',
      'Accessible colour and contrast',
    ],
  },
  {
    icon: 'message-square',
    title: 'Arabic & Islamic Studies production',
    copy: 'Specialist production following your institution’s guidance on content, depiction and transliteration.',
    includes: [
      'Right-to-left typesetting',
      'Scholar or subject-lead review',
      'Transliteration and vocalisation support',
      'Recitation handled to your policy',
    ],
  },
];

const stages = [
  {
    number: '01',
    title: 'Discovery',
    copy: 'We read your specification and talk to the person who teaches the topic. We agree the learning outcome the lesson has to hit.',
    output: 'Scope and outcome brief',
  },
  {
    number: '02',
    title: 'Script',
    copy: 'A written lesson script with narration, on-screen text and vocabulary. Your subject lead signs it off before any visuals begin.',
    output: 'Approved script',
  },
  {
    number: '03',
    title: 'Storyboard',
    copy: 'Frame-by-frame visual plan showing exactly how each idea is introduced, built and resolved.',
    output: 'Storyboard with one revision round',
  },
  {
    number: '04',
    title: 'Animation',
    copy: 'Full production: animation, narration, sound design and captions, assembled against the approved storyboard.',
    output: 'Draft lesson for review',
  },
  {
    number: '05',
    title: 'Review',
    copy: 'You watch the draft with the people who will teach it. We collect notes in one pass and apply them together.',
    output: 'Revised final cut',
  },
  {
    number: '06',
    title: 'Delivery',
    copy: 'Final files in the formats your classrooms and VLE need, plus a hosted link if you want one.',
    output: 'Delivered lesson and source exports',
  },
];

const faqs = [
  {
    question: 'How long does one lesson take?',
    answer:
      'A single five-minute lesson typically runs four to six weeks from approved script to delivery. Series work runs in parallel once the visual system is agreed, so the per-lesson time drops considerably.',
  },
  {
    question: 'Who writes the script?',
    answer:
      'We do, from your specification and a conversation with your subject lead. If you already have a script or scheme of work you want followed closely, we work from that instead.',
  },
  {
    question: 'What formats do we receive?',
    answer:
      'MP4 at the resolutions you need, plus caption files. We can also supply a hosted embed if your network blocks external video platforms, or upload straight to your own channel.',
  },
  {
    question: 'How do you handle Islamic Studies content?',
    answer:
      'We follow your institution’s guidance, agreed in writing at the discovery stage — including depiction policy, transliteration scheme, and whether recitation is included and by whom.',
  },
  {
    question: 'Can lessons be revised after delivery?',
    answer:
      'Yes. Specifications change, and so do the things students get wrong. Revisions to delivered lessons are quoted separately and reuse the existing source files, so they are far cheaper than new production.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-sky to-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="section-shell max-w-3xl">
          <p className="eyebrow">How we work</p>
          <h1 className="heading-xl mt-3">
            A production process your subject leads control.
          </h1>
          <p className="body-copy mt-6 text-lg leading-8">
            Animated lessons fail when the animation is decided before the teaching is.
            We run it the other way around: outcome, script, storyboard — and only then
            a single frame of animation.
          </p>
          <Link href="/contact" className="btn-primary mt-8">
            Discuss a project
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">What we produce</p>
            <h2 className="heading-lg mt-3">Four ways institutions work with us.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {offerings.map((offering) => (
              <article key={offering.title} className="surface-card flex flex-col p-7">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky text-brand-700">
                  <Icon name={offering.icon} size={24} />
                </span>
                <h3 className="font-display text-xl font-semibold text-navy-950">
                  {offering.title}
                </h3>
                <p className="body-copy mt-3">{offering.copy}</p>
                <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                  {offering.includes.map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-sky text-brand-700">
                        <Icon name="check" size={12} />
                      </span>
                      <span className="text-sm leading-6 text-muted">{line}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">The six stages</p>
            <h2 className="heading-lg mt-3">You see the lesson before it is animated.</h2>
            <p className="body-copy mt-4">
              Each stage ends in something you can read, watch or approve — so nothing
              expensive gets built on an assumption nobody checked.
            </p>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage) => (
              <li key={stage.number} className="surface-card flex flex-col p-6">
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {stage.number}
                </span>
                <h3 className="text-lg font-bold text-navy-950">{stage.title}</h3>
                <p className="body-copy mt-3 flex-1">{stage.copy}</p>
                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky px-3 py-1.5 text-xs font-bold text-brand-700">
                  <Icon name="check" size={13} />
                  {stage.output}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Common questions</p>
            <h2 className="heading-lg mt-3">Before you enquire.</h2>
            <p className="body-copy mt-4">
              If your question is not here, ask it directly — we answer enquiries
              ourselves, not through a form queue.
            </p>
            <Link href="/contact" className="btn-secondary mt-7">
              Ask a question
            </Link>
          </div>
          <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-card">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-6 open:bg-canvas">
                <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold text-navy-950">
                  {faq.question}
                  <span className="flex-none text-brand-600 transition group-open:rotate-180">
                    <Icon name="chevron-down" size={20} />
                  </span>
                </summary>
                <p className="body-copy mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
