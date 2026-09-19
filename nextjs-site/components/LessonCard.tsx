'use client';

import Image from 'next/image';
import Icon from '@/components/Icon';
import { resolvePoster, hasPlayableVideo } from '@/lib/media';
import type { Lesson } from '@/lib/lessons';

interface LessonCardProps {
  lesson: Lesson;
  onSelect: (lesson: Lesson) => void;
  selected?: boolean;
  /** Renders the card as a toggle within a featured-lesson group. */
  pressable?: boolean;
  priority?: boolean;
}

export default function LessonCard({
  lesson,
  onSelect,
  selected = false,
  pressable = false,
  priority = false,
}: LessonCardProps) {
  const poster = resolvePoster(lesson);
  const playable = hasPlayableVideo(lesson);

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson)}
      aria-pressed={pressable ? selected : undefined}
      className={`focus-ring card-lift group rounded-3xl border bg-white p-3 text-left ${
        selected
          ? 'border-brand-600 shadow-lift ring-2 ring-brand-600/15'
          : 'border-line shadow-card'
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy-100">
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-sky-400" />
        )}
        <div className="thumb-overlay absolute inset-0" />

        {playable && (
          <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-700 transition duration-200 group-hover:scale-110 group-hover:bg-accent-300 group-hover:text-navy-950">
            <Icon name="play" size={17} />
          </span>
        )}

        {lesson.duration && (
          <span className="absolute bottom-3 right-3 rounded-full bg-navy-950/75 px-2.5 py-1 text-xs font-semibold text-white">
            {lesson.duration}
          </span>
        )}
      </div>

      <div className="px-2 pb-2 pt-4">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand-600">
          {lesson.subject}
        </span>
        <h3 className="mt-2 text-lg font-bold leading-snug text-navy-950">
          {lesson.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted">{lesson.description}</p>
        {lesson.year_group && (
          <p className="mt-3 inline-flex rounded-full bg-sky px-2.5 py-1 text-xs font-semibold text-brand-700">
            {lesson.year_group}
          </p>
        )}
      </div>
    </button>
  );
}
