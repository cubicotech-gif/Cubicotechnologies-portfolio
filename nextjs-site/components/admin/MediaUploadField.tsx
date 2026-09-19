'use client';

import Image from 'next/image';
import { useRef, useState, type DragEvent } from 'react';
import Icon from '@/components/Icon';
import { useMediaUpload } from '@/lib/useMediaUpload';

interface MediaUploadFieldProps {
  label: string;
  hint?: string;
  /** 'image' for posters, 'video' for lesson files. */
  accept: 'image' | 'video';
  value: string | null;
  onChange: (url: string | null) => void;
  inputId: string;
}

export default function MediaUploadField({
  label,
  hint,
  accept,
  value,
  onChange,
  inputId,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { uploading, progress, error, upload, reset } = useMediaUpload();

  const acceptAttr = accept === 'video' ? 'video/*' : 'image/*';
  const limit = accept === 'video' ? '100MB' : '50MB';

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith(accept)) {
      // Surface the mismatch through the hook's error channel.
      await upload(new File([], 'invalid', { type: 'application/octet-stream' }));
      return;
    }
    const result = await upload(file);
    if (result) onChange(result.url);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <p className="mb-2 block text-sm font-semibold text-navy-950">{label}</p>

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="relative aspect-video bg-navy-950">
            {accept === 'video' ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={value} controls className="h-full w-full object-contain" />
            ) : (
              <Image src={value} alt="" fill sizes="400px" className="object-cover" />
            )}
          </div>
          <div className="flex items-center justify-between gap-3 p-3">
            <p className="truncate text-xs text-muted">{value.split('/').pop()}</p>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                reset();
              }}
              className="focus-ring flex-none rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
            dragging ? 'border-brand-600 bg-sky' : 'border-line bg-white'
          }`}
        >
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky text-brand-700">
            <Icon name={accept === 'video' ? 'film' : 'pen-tool'} size={22} />
          </span>

          {uploading ? (
            <div>
              <p className="text-sm font-semibold text-navy-950">Uploading… {progress}%</p>
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${label} upload progress`}
                className="mx-auto mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-line"
              >
                <div
                  className="h-full rounded-full bg-brand-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="focus-ring rounded-full bg-navy-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-900"
              >
                Choose {accept === 'video' ? 'a video' : 'an image'}
              </button>
              <p className="mt-2 text-xs text-muted">
                or drag and drop &middot; up to {limit}
              </p>
            </>
          )}

          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={acceptAttr}
            className="sr-only"
            onChange={(event) => {
              handleFile(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </div>
      )}

      {hint && !error && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
