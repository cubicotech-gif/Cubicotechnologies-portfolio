import type { Metadata } from 'next';
import ShowcaseClient from './ShowcaseClient';

export const metadata: Metadata = {
  title: 'Video showcase',
  description:
    'Animated lesson directions across Academic Concepts and Islamic Studies & Arabic Language. Watch sample lessons and see how each topic is structured.',
};

export default function ShowcasePage() {
  return <ShowcaseClient />;
}
