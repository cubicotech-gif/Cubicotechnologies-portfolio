'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { resolveMedia, type MediaSource } from '@/lib/media';

interface LessonPlayerProps {
  item: MediaSource;
  title: string;
  /** Rounded corners differ between the hero stage and the modal. */
  className?: string;
  /** Start playing as soon as the player mounts (used by the modal). */
  autoStart?: boolean;
}

/**
 * Click-to-play surface that works for YouTube/Vimeo embeds and for
 * self-hosted files alike. The iframe is only injected after the viewer
 * presses play, so no third-party script loads on page view.
 */
export default function LessonPlayer({
  item,
  title,
  className = '',
  autoStart = false,
}: LessonPlayerProps) {
  const media = resolveMedia(item);
  const [playing, setPlaying] = useState(false);

  // Reset when the selected lesson changes.
  useEffect(() => {
    setPlaying(autoStart);
  }, [media.src, autoStart]);

  const frame = `relative aspect-video w-full overflow-hidden rounded-3xl bg-navy-950 ${className}`;

  if (media.kind === 'image') {
    return (
      <div className={frame}>
        {media.src ? (
          <Image
            src={media.src}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        ) : (
          <PlaceholderArt />
        )}
      </div>
    );
  }

  if (playing && media.kind === 'embed') {
    return (
      <div className={frame}>
        <iframe
          src={media.src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (playing && media.kind === 'file') {
    return (
      <div className={frame}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={media.src}
          poster={media.poster || undefined}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full bg-black object-contain"
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      {media.poster ? (
        <Image
          src={media.poster}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      ) : (
        <PlaceholderArt />
      )}
      <div className="absolute inset-0 bg-navy-950/35" />
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${title}`}
        className="focus-ring absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-300 text-navy-950 shadow-xl transition hover:scale-105">
          <Icon name="play" size={30} />
        </span>
      </button>
    </div>
  );
}

/** Shown when a lesson has no artwork yet, so the layout never collapses. */
function PlaceholderArt() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-sky-400">
      <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full border-[18px] border-accent-300/80" />
      <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-white/10" />
    </div>
  );
}
