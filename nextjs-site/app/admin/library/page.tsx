'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import Icon from '@/components/Icon';
import { Banner, EmptyState, PageHeading, Spinner, type BannerTone } from '@/components/admin/AdminUI';
import { useMediaUpload } from '@/lib/useMediaUpload';

interface LibraryItem {
  filename: string;
  url: string;
  size: number;
  created_at?: string;
  media_type: 'image' | 'video';
}

type Filter = 'all' | 'image' | 'video';

function formatSize(bytes: number): string {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ tone: BannerTone; message: string }>({
    tone: 'info',
    message: '',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const { uploading, progress, error: uploadError, upload } = useMediaUpload();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/upload-image');
      const data = await response.json();
      if (data.success) {
        setItems(data.images as LibraryItem[]);
        if (data.message) setBanner({ tone: 'info', message: data.message });
      } else {
        setBanner({ tone: 'error', message: data.error || 'Could not load the library.' });
      }
    } catch (error: any) {
      setBanner({ tone: 'error', message: `Could not load the library: ${error.message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(
    () => ({
      all: items.length,
      image: items.filter((item) => item.media_type === 'image').length,
      video: items.filter((item) => item.media_type === 'video').length,
    }),
    [items]
  );

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((item) => item.media_type === filter)),
    [items, filter]
  );

  /** Uploads sequentially so the progress bar tracks one file at a time. */
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    let uploaded = 0;
    for (const file of Array.from(files)) {
      const result = await upload(file);
      if (result) uploaded += 1;
    }
    if (uploaded > 0) {
      setBanner({
        tone: 'success',
        message: `Uploaded ${uploaded} file${uploaded === 1 ? '' : 's'}.`,
      });
      await load();
    }
  };

  const remove = async (item: LibraryItem) => {
    if (!window.confirm(`Delete ${item.filename}? Any lesson using it will lose its media.`)) {
      return;
    }
    try {
      const response = await fetch(
        `/api/upload-image?filename=${encodeURIComponent(item.filename)}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Delete failed');
      setBanner({ tone: 'success', message: 'File deleted.' });
      await load();
    } catch (error: any) {
      setBanner({ tone: 'error', message: `Could not delete: ${error.message}` });
    }
  };

  const copyUrl = async (item: LibraryItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(item.filename);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setBanner({ tone: 'error', message: 'Could not copy to the clipboard.' });
    }
  };

  return (
    <>
      <PageHeading
        title="Media library"
        subtitle="Everything uploaded to storage. Lessons can also upload directly from their own form."
      />

      <Banner tone={banner.tone} message={banner.message} />

      <div
        onDragOver={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
          dragging ? 'border-brand-600 bg-sky' : 'border-line bg-white'
        }`}
      >
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky text-brand-700">
          <Icon name="film" size={26} />
        </span>

        {uploading ? (
          <>
            <p className="font-semibold text-navy-950">Uploading… {progress}%</p>
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Upload progress"
              className="mx-auto mt-3 h-2 w-full max-w-sm overflow-hidden rounded-full bg-line"
            >
              <div
                className="h-full rounded-full bg-brand-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="font-display text-lg font-semibold text-navy-950">
              Drop files here
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              Images up to 50MB, videos up to 100MB. Files go straight to storage, so
              large lesson videos are fine.
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-primary mt-5"
            >
              Choose files
            </button>
          </>
        )}

        {uploadError && (
          <p className="mt-3 text-sm font-medium text-red-600">{uploadError}</p>
        )}

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="sr-only"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      <div className="mb-5 mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter media">
        {(['all', 'image', 'video'] as Filter[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`focus-ring rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
              filter === key
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-line bg-white text-navy-900 hover:border-brand-300'
            }`}
          >
            {key === 'all' ? 'All' : `${key}s`} ({counts[key]})
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading media…" />
      ) : visible.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          body="Upload an image or video above, or add media directly from the lesson form."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((item) => (
            <li
              key={item.filename}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-card"
            >
              <div className="relative aspect-video bg-navy-950">
                {item.media_type === 'video' ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video src={item.url} muted className="h-full w-full object-cover" />
                ) : (
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover"
                  />
                )}
                <span className="absolute left-2 top-2 rounded-full bg-navy-950/80 px-2 py-0.5 text-xs font-semibold capitalize text-white">
                  {item.media_type}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-navy-950" title={item.filename}>
                  {item.filename}
                </p>
                <p className="mt-0.5 text-xs text-muted">{formatSize(item.size)}</p>
                <div className="mt-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(item)}
                    className="focus-ring flex-1 rounded-lg bg-sky px-2 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-100"
                  >
                    {copied === item.filename ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="focus-ring rounded-lg px-2 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
