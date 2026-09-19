'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Icon from '@/components/Icon';
import LessonPlayer from '@/components/LessonPlayer';
import type { Lesson } from '@/lib/lessons';

interface LessonModalProps {
  lesson: Lesson | null;
  onClose: () => void;
}

/**
 * Lesson detail dialog. Locks page scroll, closes on Escape, and keeps
 * keyboard focus inside while open.
 */
export default function LessonModal({ lesson, onClose }: LessonModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!lesson) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, video, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus();
    };
  }, [lesson, onClose]);

  if (!lesson) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-navy-950/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-modal-title"
        className="relative my-auto w-full max-w-4xl rounded-[2rem] bg-white p-5 shadow-2xl sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close lesson details"
          className="focus-ring absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy-950 shadow-card transition hover:bg-sky"
        >
          <Icon name="close" size={20} />
        </button>

        <LessonPlayer item={lesson} title={lesson.title} autoStart />

        <div className="mt-6">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand-600">
            {lesson.subject}
          </span>
          <h2
            id="lesson-modal-title"
            className="mt-2 font-display text-2xl font-semibold text-navy-950 sm:text-3xl"
          >
            {lesson.title}
          </h2>
          <p className="body-copy mt-3">{lesson.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {lesson.year_group && (
              <span className="rounded-full bg-sky px-3 py-1 text-sm font-semibold text-brand-700">
                {lesson.year_group}
              </span>
            )}
            {lesson.duration && (
              <span className="rounded-full bg-sky px-3 py-1 text-sm font-semibold text-brand-700">
                {lesson.duration} runtime
              </span>
            )}
          </div>

          {lesson.outcomes && lesson.outcomes.length > 0 && (
            <div className="mt-7 rounded-2xl border border-line bg-canvas p-6">
              <h3 className="font-display text-lg font-semibold text-navy-950">
                After this lesson, students can
              </h3>
              <ul className="mt-4 space-y-3">
                {lesson.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-600 text-white">
                      <Icon name="check" size={12} />
                    </span>
                    <span className="text-sm leading-6 text-muted">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href="/contact" className="btn-primary mt-7">
            Request this for your curriculum
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
