'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { AdminField, Banner } from '@/components/admin/AdminUI';
import MediaUploadField from '@/components/admin/MediaUploadField';
import { buildEmbedSrc } from '@/lib/media';
import { SUBJECTS, YEAR_GROUPS, type SectionId } from '@/lib/site';
import type { Lesson } from '@/lib/lessons';

export interface LessonDraft {
  id?: string | number;
  title: string;
  section: SectionId;
  subject: string;
  description: string;
  year_group: string;
  duration: string;
  embed_url: string;
  video_url: string | null;
  poster_url: string | null;
  outcomes: string;
  active: boolean;
}

export function toDraft(lesson?: Lesson | null): LessonDraft {
  return {
    id: lesson?.id,
    title: lesson?.title ?? '',
    section: (lesson?.section as SectionId) ?? 'academic',
    subject: lesson?.subject ?? SUBJECTS.academic[0],
    description: lesson?.description ?? '',
    year_group: lesson?.year_group ?? '',
    duration: lesson?.duration ?? '',
    embed_url: lesson?.embed_url ?? '',
    video_url: lesson?.video_url ?? null,
    poster_url: lesson?.poster_url ?? lesson?.image_url ?? null,
    outcomes: (lesson?.outcomes ?? []).join('\n'),
    active: lesson?.active !== false,
  };
}

interface LessonFormProps {
  draft: LessonDraft;
  saving: boolean;
  onCancel: () => void;
  onSave: (draft: LessonDraft) => void;
}

export default function LessonForm({ draft, saving, onCancel, onSave }: LessonFormProps) {
  const [form, setForm] = useState<LessonDraft>(draft);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(draft);
    setError('');
  }, [draft]);

  const set = <K extends keyof LessonDraft>(key: K, value: LessonDraft[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  // Switching section invalidates the subject, so snap it to a valid one.
  const subjects = SUBJECTS[form.section];
  useEffect(() => {
    if (!subjects.includes(form.subject)) {
      setForm((current) => ({ ...current, subject: subjects[0] }));
    }
  }, [subjects, form.subject]);

  const embedPreview = useMemo(() => {
    const trimmed = form.embed_url.trim();
    if (!trimmed) return null;
    return buildEmbedSrc(trimmed);
  }, [form.embed_url]);

  const embedInvalid = form.embed_url.trim().length > 0 && embedPreview === null;

  const submit = () => {
    if (!form.title.trim()) return setError('Give the lesson a title.');
    if (!form.description.trim()) return setError('Add a short description.');
    if (embedInvalid) return setError('That does not look like a YouTube or Vimeo link.');
    if (!form.embed_url.trim() && !form.video_url && !form.poster_url) {
      return setError('Add a video, an embed link, or at least a poster image.');
    }
    setError('');
    onSave(form);
  };

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
      <h2 className="font-display text-xl font-semibold text-navy-950">
        {form.id ? 'Edit lesson' : 'New lesson'}
      </h2>

      {error && (
        <div className="mt-5">
          <Banner tone="error" message={error} />
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <AdminField id="lf-title" label="Lesson title" required>
            <input
              id="lf-title"
              className="field"
              value={form.title}
              onChange={(event) => set('title', event.target.value)}
              placeholder="Fractions: seeing the whole"
            />
          </AdminField>

          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField id="lf-section" label="Showcase section" required>
              <select
                id="lf-section"
                className="field"
                value={form.section}
                onChange={(event) => set('section', event.target.value as SectionId)}
              >
                <option value="academic">Academic Concepts</option>
                <option value="islamic">Islamic Studies &amp; Arabic</option>
              </select>
            </AdminField>

            <AdminField id="lf-subject" label="Subject" required>
              <select
                id="lf-subject"
                className="field"
                value={form.subject}
                onChange={(event) => set('subject', event.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>

          <AdminField id="lf-description" label="Description" required>
            <textarea
              id="lf-description"
              className="field min-h-24 resize-y"
              value={form.description}
              onChange={(event) => set('description', event.target.value)}
              placeholder="One or two sentences shown on the lesson card."
            />
          </AdminField>

          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField id="lf-year" label="Year group">
              <select
                id="lf-year"
                className="field"
                value={form.year_group}
                onChange={(event) => set('year_group', event.target.value)}
              >
                <option value="">Not specified</option>
                {YEAR_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField id="lf-duration" label="Runtime" hint="e.g. 4:20">
              <input
                id="lf-duration"
                className="field"
                value={form.duration}
                onChange={(event) => set('duration', event.target.value)}
                placeholder="4:20"
              />
            </AdminField>
          </div>

          <AdminField
            id="lf-outcomes"
            label="Learning outcomes"
            hint="One per line. Shown in the lesson outline dialog."
          >
            <textarea
              id="lf-outcomes"
              className="field min-h-28 resize-y"
              value={form.outcomes}
              onChange={(event) => set('outcomes', event.target.value)}
              placeholder={'Identify the whole before naming the part\nRecognise equivalent fractions'}
            />
          </AdminField>
        </div>

        <div className="space-y-5">
          <AdminField
            id="lf-embed"
            label="YouTube or Vimeo link"
            hint="Leave blank if you are uploading the video file instead."
          >
            <input
              id="lf-embed"
              className={`field ${embedInvalid ? 'field-invalid' : ''}`}
              value={form.embed_url}
              onChange={(event) => set('embed_url', event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </AdminField>

          {embedPreview && (
            <div className="overflow-hidden rounded-2xl border border-line">
              <div className="flex items-center gap-2 bg-sky px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-700">
                <Icon name="check" size={14} />
                {embedPreview.provider} link recognised
              </div>
              <div className="aspect-video bg-navy-950">
                <iframe
                  // Preview only: strip autoplay so the admin page stays quiet.
                  src={embedPreview.src.replace('autoplay=1', 'autoplay=0')}
                  title="Embed preview"
                  className="h-full w-full"
                  allow="encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {embedInvalid && (
            <p className="text-sm font-medium text-red-600">
              Not a recognised YouTube or Vimeo URL.
            </p>
          )}

          <MediaUploadField
            inputId="lf-video"
            label="Or upload the video file"
            accept="video"
            hint="Goes straight to Supabase storage, so large files are fine."
            value={form.video_url}
            onChange={(url) => set('video_url', url)}
          />

          <MediaUploadField
            inputId="lf-poster"
            label="Poster image"
            accept="image"
            hint="The still shown on the lesson card. Recommended 1280x800."
            value={form.poster_url}
            onChange={(url) => set('poster_url', url)}
          />

          <label className="flex items-center gap-3 rounded-xl border border-line bg-canvas p-4">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => set('active', event.target.checked)}
              className="focus-ring h-4 w-4 accent-brand-600"
            />
            <span className="text-sm font-semibold text-navy-950">
              Visible on the public showcase
            </span>
          </label>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="btn-primary disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? 'Saving…' : form.id ? 'Save changes' : 'Create lesson'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
