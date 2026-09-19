/**
 * Small inline icon set (Lucide-derived paths) so the studio UI keeps a
 * consistent line weight without pulling in an icon package.
 */
import type { SVGProps } from 'react';

export type IconName =
  | 'sparkles'
  | 'play'
  | 'pause'
  | 'blocks'
  | 'cursor-click'
  | 'target'
  | 'book-open'
  | 'atom'
  | 'sigma'
  | 'arrow-right'
  | 'check'
  | 'menu'
  | 'close'
  | 'mail'
  | 'clock'
  | 'users'
  | 'film'
  | 'pen-tool'
  | 'message-square'
  | 'graduation-cap'
  | 'chevron-down'
  | 'external-link'
  | 'alert-circle';

const PATHS: Record<IconName, JSX.Element> = {
  sparkles: (
    <>
      <path d="M9.9 2.6 8.5 6.4 4.7 7.8l3.8 1.4 1.4 3.8 1.4-3.8 3.8-1.4-3.8-1.4z" />
      <path d="M18 9v3M19.5 10.5h-3M16.5 17v3M18 18.5h-3M6 16v3M7.5 17.5h-3" />
    </>
  ),
  play: <path d="M6 4.5v15l13-7.5z" />,
  pause: <path d="M8 4.5h3.5v15H8zM12.5 4.5H16v15h-3.5z" />,
  blocks: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  'cursor-click': (
    <>
      <path d="M9 9l10.5 3.9-4.4 1.6-1.6 4.4z" />
      <path d="M5 3v2M3 5h2M5 12H3M12 3v2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  'book-open': (
    <>
      <path d="M12 6.5C10.5 5 8.5 4.5 3.5 4.5v13c5 0 7 .5 8.5 2 1.5-1.5 3.5-2 8.5-2v-13c-5 0-7 .5-8.5 2z" />
      <path d="M12 6.5v13" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1.6" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)" />
    </>
  ),
  sigma: <path d="M18 5H6l6 7-6 7h12" />,
  'arrow-right': <path d="M4 12h15M13 6l6 6-6 6" />,
  check: <path d="M4.5 12.5l5 5 10-11" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 18L18 6M6 6l12 12" />,
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  users: (
    <>
      <path d="M15.5 20v-1.8a3.6 3.6 0 0 0-3.6-3.6H6.1A3.6 3.6 0 0 0 2.5 18.2V20" />
      <circle cx="9" cy="7.4" r="3.4" />
      <path d="M21.5 20v-1.8a3.6 3.6 0 0 0-2.7-3.5M16 4.2a3.6 3.6 0 0 1 0 6.9" />
    </>
  ),
  film: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M7 4v16M17 4v16M2.5 12h19M2.5 8h4.5M2.5 16h4.5M17 8h4.5M17 16h4.5" />
    </>
  ),
  'pen-tool': (
    <>
      <path d="m12 3 8 5-2.5 11h-11L4 8z" />
      <path d="m12 3 3 9-3 9-3-9z" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),
  'message-square': <path d="M20.5 14.5a2.5 2.5 0 0 1-2.5 2.5H8l-4.5 4V5.5A2.5 2.5 0 0 1 6 3h12a2.5 2.5 0 0 1 2.5 2.5z" />,
  'graduation-cap': (
    <>
      <path d="M12 3.5 22 9l-10 5.5L2 9z" />
      <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </>
  ),
  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  'external-link': (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16h.01" />
    </>
  ),
};

/** Icons that read better as solid shapes than as strokes. */
const FILLED: IconName[] = ['play', 'pause', 'sparkles'];

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export default function Icon({ name, size = 24, ...props }: IconProps) {
  const filled = FILLED.includes(name);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
