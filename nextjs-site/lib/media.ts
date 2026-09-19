/**
 * Resolves how a lesson's media should be played.
 *
 * Three sources are supported:
 *  - `embed_url`  : a YouTube or Vimeo link pasted into the admin panel
 *  - `video_url`  : a self-hosted file uploaded to Supabase storage
 *  - `image_url`  : a still, used as the poster frame or as the card art
 *
 * Older rows only have `image_url`, which may itself point at an uploaded
 * video, so the extension is sniffed as a fallback.
 */

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogv'];

export type PlaybackKind = 'embed' | 'file' | 'image';

export interface MediaSource {
  embed_url?: string | null;
  video_url?: string | null;
  image_url?: string | null;
  poster_url?: string | null;
  media_type?: 'image' | 'video' | null;
}

export interface ResolvedMedia {
  kind: PlaybackKind;
  /** iframe src for embeds, file src for self-hosted video, else the image. */
  src: string;
  /** Still shown before playback starts. */
  poster: string | null;
  provider: 'youtube' | 'vimeo' | null;
}

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

/** Extracts the video id from the common YouTube URL shapes. */
export function parseYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([\w-]{6,})/,
    /youtube\.com\/watch\?(?:.*&)?v=([\w-]{6,})/,
    /youtube\.com\/embed\/([\w-]{6,})/,
    /youtube\.com\/shorts\/([\w-]{6,})/,
    /youtube\.com\/live\/([\w-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function parseVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

/**
 * Builds a privacy-friendlier embed src with autoplay, so the player starts
 * as soon as the viewer presses our own play button.
 */
export function buildEmbedSrc(url: string): { src: string; provider: 'youtube' | 'vimeo' } | null {
  const youTubeId = parseYouTubeId(url);
  if (youTubeId) {
    return {
      src: `https://www.youtube-nocookie.com/embed/${youTubeId}?autoplay=1&rel=0&modestbranding=1`,
      provider: 'youtube',
    };
  }
  const vimeoId = parseVimeoId(url);
  if (vimeoId) {
    return {
      src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0`,
      provider: 'vimeo',
    };
  }
  return null;
}

/** Best available still for a card or poster frame. */
export function resolvePoster(item: MediaSource): string | null {
  if (item.poster_url) return item.poster_url;
  if (item.image_url && !isVideoUrl(item.image_url)) return item.image_url;
  if (item.embed_url) {
    const youTubeId = parseYouTubeId(item.embed_url);
    if (youTubeId) return `https://i.ytimg.com/vi/${youTubeId}/hqdefault.jpg`;
  }
  return null;
}

export function resolveMedia(item: MediaSource): ResolvedMedia {
  const poster = resolvePoster(item);

  if (item.embed_url) {
    const embed = buildEmbedSrc(item.embed_url);
    if (embed) {
      return { kind: 'embed', src: embed.src, poster, provider: embed.provider };
    }
  }

  const fileCandidate =
    item.video_url ||
    (item.media_type === 'video' || isVideoUrl(item.image_url) ? item.image_url : null);

  if (fileCandidate) {
    return { kind: 'file', src: fileCandidate, poster, provider: null };
  }

  return { kind: 'image', src: item.image_url || '', poster, provider: null };
}

export function hasPlayableVideo(item: MediaSource): boolean {
  return resolveMedia(item).kind !== 'image';
}
