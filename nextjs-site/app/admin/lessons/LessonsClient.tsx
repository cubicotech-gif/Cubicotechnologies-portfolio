'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { Banner, EmptyState, PageHeading, Spinner, type BannerTone } from '@/components/admin/AdminUI';
import LessonForm, { toDraft, type LessonDraft } from './LessonForm';
import { resolvePoster, hasPlayableVideo } from '@/lib/media';
import { SHOWCASE_SECTIONS, type SectionId } from '@/lib/site';
import type { Lesson } from '@/lib/lessons';

export default function LessonsClient() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<LessonDraft | null>(null);
  const [banner, setBanner] = useState<{ tone: BannerTone; message: string }>({
    tone: 'info',
    message: '',
  });

  const notify = (tone: BannerTone, message: string) => setBanner({ tone, message });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      if (data.success) {
        setLessons(data.items as Lesson[]);
      } else {
        notify('error', data.error || 'Could not load lessons.');
      }
    } catch (error: any) {
      notify('error', `Could not load lessons: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bySection = useMemo(() => {
    const groups: Record<SectionId, Lesson[]> = { academic: [], islamic: [] };
    for (const lesson of lessons) {
      const key: SectionId = lesson.section === 'islamic' ? 'islamic' : 'academic';
      groups[key].push(lesson);
    }
    for (const key of Object.keys(groups) as SectionId[]) {
      groups[key].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return groups;
  }, [lessons]);

  /** Serialises a draft into the API payload shape. */
  const buildPayload = (form: LessonDraft) => {
    const embed = form.embed_url.trim();
    return {
      title: form.title.trim(),
      section: form.section,
      subject: form.subject,
      description: form.description.trim(),
      poster_url: form.poster_url,
      image_url: form.poster_url,
      video_url: form.video_url,
      embed_url: embed || null,
      media_type: embed || form.video_url ? 'video' : 'image',
      year_group: form.year_group || null,
      duration: form.duration.trim() || null,
      outcomes: form.outcomes
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      active: form.active,
    };
  };

  const save = async (form: LessonDraft) => {
    setSaving(true);
    try {
      const editing = Boolean(form.id);
      const payload: Record<string, any> = buildPayload(form);

      if (editing) {
        payload.id = form.id;
      } else {
        // New lessons go to the end of their section.
        const siblings = bySection[form.section];
        payload.order = siblings.length
          ? Math.max(...siblings.map((lesson) => lesson.order ?? 0)) + 1
          : 1;
      }

      const response = await fetch('/api/portfolio', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        notify('error', data.error || 'Could not save the lesson.');
        return;
      }

      notify('success', editing ? 'Lesson updated.' : 'Lesson created.');
      setDraft(null);
      await load();
    } catch (error: any) {
      notify('error', `Could not save the lesson: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (lesson: Lesson) => {
    if (!window.confirm(`Delete "${lesson.title}"? This cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/portfolio?id=${encodeURIComponent(String(lesson.id))}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        notify('error', data.error || 'Could not delete the lesson.');
        return;
      }
      notify('success', 'Lesson deleted.');
      await load();
    } catch (error: any) {
      notify('error', `Could not delete the lesson: ${error.message}`);
    }
  };

  /** Swaps the order value with the neighbour above or below. */
  const move = async (section: SectionId, index: number, direction: -1 | 1) => {
    const list = bySection[section];
    const target = list[index + direction];
    const current = list[index];
    if (!target || !current) return;

    // Positions can be equal or unset in older rows, so renumber the whole
    // section rather than trusting the two values to differ.
    const reordered = [...list];
    reordered[index] = target;
    reordered[index + direction] = current;

    setLessons((previous) =>
      previous.map((lesson) => {
        const position = reordered.findIndex((item) => item.id === lesson.id);
        return position === -1 ? lesson : { ...lesson, order: position + 1 };
      })
    );

    try {
      await Promise.all(
        reordered.map((lesson, position) =>
          fetch('/api/portfolio', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: lesson.id, order: position + 1 }),
          })
        )
      );
      notify('success', 'Order updated.');
    } catch (error: any) {
      notify('error', `Could not save the new order: ${error.message}`);
      await load();
    }
  };

  const toggleActive = async (lesson: Lesson) => {
    try {
      await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lesson.id, active: lesson.active === false }),
      });
      await load();
    } catch (error: any) {
      notify('error', `Could not change visibility: ${error.message}`);
    }
  };

  return (
    <>
      <PageHeading
        title="Lessons"
        subtitle="Everything shown on the public showcase, in both sections."
        action={
          !draft && (
            <button type="button" onClick={() => setDraft(toDraft())} className="btn-primary">
              <Icon name="sparkles" size={17} />
              New lesson
            </button>
          )
        }
      />

      <Banner tone={banner.tone} message={banner.message} />

      {draft && (
        <div className="mb-8">
          <LessonForm
            draft={draft}
            saving={saving}
            onCancel={() => setDraft(null)}
            onSave={save}
          />
        </div>
      )}

      {loading ? (
        <Spinner label="Loading lessons…" />
      ) : lessons.length === 0 ? (
        <EmptyState
          title="No lessons yet"
          body="Create your first lesson to replace the sample content on the public showcase. You can upload a video file, paste a YouTube or Vimeo link, or start with just a poster image."
        />
      ) : (
        <div className="space-y-10">
          {SHOWCASE_SECTIONS.map((section) => (
            <section key={section.id}>
              <h2 className="mb-4 font-display text-xl font-semibold text-navy-950">
                {section.title}
                <span className="ml-2 text-sm font-normal text-muted">
                  {bySection[section.id].length} lesson
                  {bySection[section.id].length === 1 ? '' : 's'}
                </span>
              </h2>

              {bySection[section.id].length === 0 ? (
                <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-sm text-muted">
                  Nothing in this section yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {bySection[section.id].map((lesson, index) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      isFirst={index === 0}
                      isLast={index === bySection[section.id].length - 1}
                      onUp={() => move(section.id, index, -1)}
                      onDown={() => move(section.id, index, 1)}
                      onEdit={() => setDraft(toDraft(lesson))}
                      onDelete={() => remove(lesson)}
                      onToggle={() => toggleActive(lesson)}
                    />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </>
  );
}

interface LessonRowProps {
  lesson: Lesson;
  isFirst: boolean;
  isLast: boolean;
  onUp: () => void;
  onDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

function LessonRow({
  lesson,
  isFirst,
  isLast,
  onUp,
  onDown,
  onEdit,
  onDelete,
  onToggle,
}: LessonRowProps) {
  const poster = resolvePoster(lesson);
  const playable = hasPlayableVideo(lesson);
  const hidden = lesson.active === false;

  return (
    <li
      className={`flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-3 shadow-card ${
        hidden ? 'opacity-60' : ''
      }`}
    >
      <div className="relative h-16 w-28 flex-none overflow-hidden rounded-xl bg-navy-100">
        {poster ? (
          <Image src={poster} alt="" fill sizes="112px" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-600 to-sky-400" />
        )}
      </div>

      <div className="min-w-48 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-600">
            {lesson.subject}
          </span>
          {playable ? (
            <span className="rounded-full bg-sky px-2 py-0.5 text-xs font-semibold text-brand-700">
              {lesson.embed_url ? 'Embed' : 'Uploaded video'}
            </span>
          ) : (
            <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-semibold text-accent-800">
              Poster only
            </span>
          )}
          {hidden && (
            <span className="rounded-full bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-700">
              Hidden
            </span>
          )}
        </div>
        <p className="mt-1 font-semibold text-navy-950">{lesson.title}</p>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted">{lesson.description}</p>
      </div>

      <div className="flex flex-none items-center gap-1">
        <IconButton label="Move up" disabled={isFirst} onClick={onUp} rotate={180} />
        <IconButton label="Move down" disabled={isLast} onClick={onDown} />
        <button
          type="button"
          onClick={onToggle}
          className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-[#476082] hover:bg-sky hover:text-brand-700"
        >
          {hidden ? 'Show' : 'Hide'}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-sky"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  rotate = 0,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  rotate?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="focus-ring rounded-lg p-2 text-[#476082] transition hover:bg-sky hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <span style={{ display: 'block', transform: `rotate(${rotate}deg)` }}>
        <Icon name="chevron-down" size={18} />
      </span>
    </button>
  );
}
