import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Request a custom lesson',
  description:
    'Tell us the curriculum area you want to bring to life. Enquiry form for schools, madrasas and curriculum publishers.',
};

export default function ContactPage() {
  return <ContactClient />;
}
