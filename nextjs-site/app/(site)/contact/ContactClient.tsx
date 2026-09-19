'use client';

import { useState, type FormEvent } from 'react';
import Icon from '@/components/Icon';
import { SITE, ALL_SUBJECTS, YEAR_GROUPS } from '@/lib/site';

interface EnquiryForm {
  institution_name: string;
  contact_name: string;
  role: string;
  work_email: string;
  phone: string;
  curriculum_area: string;
  year_group: string;
  timeline: string;
  project_brief: string;
  consent: boolean;
}

type FieldKey = Exclude<keyof EnquiryForm, 'consent'>;

const EMPTY_FORM: EnquiryForm = {
  institution_name: '',
  contact_name: '',
  role: '',
  work_email: '',
  phone: '',
  curriculum_area: '',
  year_group: '',
  timeline: '',
  project_brief: '',
  consent: false,
};

const TIMELINES = [
  'As soon as possible',
  'This term',
  'Next term',
  'Next academic year',
  'Still exploring',
];

/** Required fields and the message shown when they fail. */
const REQUIRED: { key: FieldKey; message: string }[] = [
  { key: 'institution_name', message: 'Please enter your institution name.' },
  { key: 'contact_name', message: 'Please enter your name.' },
  { key: 'work_email', message: 'Please enter a valid work email address.' },
  { key: 'curriculum_area', message: 'Please tell us the subject or curriculum area.' },
  { key: 'year_group', message: 'Please select a year group or age range.' },
  { key: 'project_brief', message: 'Please give us a short project brief.' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactClient() {
  const [form, setForm] = useState<EnquiryForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const update = <K extends keyof EnquiryForm>(key: K, value: EnquiryForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    // Clear a field's error as soon as the person starts correcting it.
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const found: Partial<Record<keyof EnquiryForm, string>> = {};

    for (const field of REQUIRED) {
      if (!form[field.key].trim()) found[field.key] = field.message;
    }
    if (form.work_email.trim() && !EMAIL_PATTERN.test(form.work_email.trim())) {
      found.work_email = 'Please enter a valid work email address.';
    }
    if (!form.consent) {
      found.consent = 'Please confirm consent before submitting.';
    }

    setErrors(found);

    // Move focus to the first problem so keyboard and screen-reader users
    // are not left guessing what failed.
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      document.getElementById(firstKey)?.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution_name: form.institution_name.trim(),
          contact_name: form.contact_name.trim(),
          role: form.role.trim(),
          work_email: form.work_email.trim(),
          phone: form.phone.trim(),
          curriculum_area: form.curriculum_area.trim(),
          year_group: form.year_group,
          timeline: form.timeline,
          project_brief: form.project_brief.trim(),
          consent_given: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setForm(EMPTY_FORM);
        setStatus('success');
        setStatusMessage(
          'Thank you — your enquiry has reached the studio. We reply to institutional enquiries within two working days.'
        );
      } else {
        setStatus('error');
        setStatusMessage(
          data.error ||
            'We could not submit your enquiry. Please try again, or email us directly.'
        );
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage(
        'We could not reach the studio just now. Please try again, or email us directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-navy-950 px-5 py-16 sm:px-8 sm:py-20">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#8fd2ff]">
              Custom lesson enquiries
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Let&rsquo;s make your next lesson easier to understand.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#c8d9f4]">
              Tell us about the curriculum area you want to bring to life. The more
              specific the topic, the more useful our first reply will be.
            </p>

            <dl className="mt-9 space-y-5">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10 text-white">
                  <Icon name="clock" size={20} />
                </span>
                <div>
                  <dt className="font-semibold text-white">Response time</dt>
                  <dd className="text-sm leading-6 text-[#c8d9f4]">
                    Within two working days, from a person, not an autoresponder.
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10 text-white">
                  <Icon name="mail" size={20} />
                </span>
                <div>
                  <dt className="font-semibold text-white">Prefer email?</dt>
                  <dd className="text-sm leading-6 text-[#c8d9f4]">
                    <a
                      href={`mailto:${SITE.email}`}
                      className="focus-ring rounded underline decoration-white/40 underline-offset-4 hover:text-white"
                    >
                      {SITE.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10 text-white">
                  <Icon name="users" size={20} />
                </span>
                <div>
                  <dt className="font-semibold text-white">Who this is for</dt>
                  <dd className="text-sm leading-6 text-[#c8d9f4]">
                    Schools, madrasas, curriculum teams and educational publishers.
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="institution_name"
                  label="Institution name"
                  required
                  error={errors.institution_name}
                  value={form.institution_name}
                  onChange={(value) => update('institution_name', value)}
                  autoComplete="organization"
                />
                <Field
                  id="contact_name"
                  label="Your name"
                  required
                  error={errors.contact_name}
                  value={form.contact_name}
                  onChange={(value) => update('contact_name', value)}
                  autoComplete="name"
                />
                <Field
                  id="role"
                  label="Your role"
                  placeholder="e.g. Head of Science"
                  error={errors.role}
                  value={form.role}
                  onChange={(value) => update('role', value)}
                  autoComplete="organization-title"
                />
                <Field
                  id="work_email"
                  label="Work email"
                  type="email"
                  required
                  error={errors.work_email}
                  value={form.work_email}
                  onChange={(value) => update('work_email', value)}
                  autoComplete="email"
                />
                <Field
                  id="phone"
                  label="Phone"
                  type="tel"
                  error={errors.phone}
                  value={form.phone}
                  onChange={(value) => update('phone', value)}
                  autoComplete="tel"
                />
                <SelectField
                  id="year_group"
                  label="Year group or age range"
                  required
                  error={errors.year_group}
                  value={form.year_group}
                  onChange={(value) => update('year_group', value)}
                  placeholder="Select an age range..."
                  options={[...YEAR_GROUPS]}
                />
                <div className="sm:col-span-2">
                  <SelectField
                    id="curriculum_area"
                    label="Subject or curriculum area"
                    required
                    error={errors.curriculum_area}
                    value={form.curriculum_area}
                    onChange={(value) => update('curriculum_area', value)}
                    placeholder="Select a subject area..."
                    options={[...ALL_SUBJECTS, 'Multiple subjects', 'Something else']}
                  />
                </div>
                <div className="sm:col-span-2">
                  <SelectField
                    id="timeline"
                    label="When do you need this?"
                    error={errors.timeline}
                    value={form.timeline}
                    onChange={(value) => update('timeline', value)}
                    placeholder="Select a timeline..."
                    options={TIMELINES}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="project_brief" className="mb-2 block text-sm font-semibold text-navy-950">
                    Project brief <RequiredMark />
                  </label>
                  <textarea
                    id="project_brief"
                    value={form.project_brief}
                    onChange={(event) => update('project_brief', event.target.value)}
                    aria-required="true"
                    aria-invalid={Boolean(errors.project_brief)}
                    aria-describedby={errors.project_brief ? 'project_brief-error' : 'project_brief-hint'}
                    placeholder="Which topic do students struggle with, and what should they be able to do after the lesson?"
                    className={`field min-h-32 resize-y ${errors.project_brief ? 'field-invalid' : ''}`}
                  />
                  <p id="project_brief-hint" className="mt-1.5 text-sm text-muted">
                    The specific misconception you want fixed is the most useful thing
                    you can tell us.
                  </p>
                  <FieldError id="project_brief-error" message={errors.project_brief} />
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <input
                  id="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => update('consent', event.target.checked)}
                  aria-required="true"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                  className="focus-ring mt-1 h-4 w-4 flex-none accent-brand-600"
                />
                <div>
                  <label htmlFor="consent" className="text-sm leading-6 text-[#476082]">
                    I consent to {SITE.shortName} storing these details in order to
                    respond to this enquiry. <RequiredMark />
                  </label>
                  <FieldError id="consent-error" message={errors.consent} />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-7 w-full disabled:cursor-wait disabled:opacity-70"
              >
                {submitting ? 'Sending enquiry...' : 'Send enquiry'}
              </button>

              <p role="status" aria-live="polite" className="sr-only">
                {submitting ? 'Submitting your enquiry' : statusMessage}
              </p>

              {status !== 'idle' && (
                <p
                  className={`mt-4 flex gap-3 rounded-xl p-4 text-sm leading-6 ${
                    status === 'success'
                      ? 'bg-emerald-50 text-emerald-900'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  <span className="mt-0.5 flex-none">
                    <Icon name={status === 'success' ? 'check' : 'alert-circle'} size={18} />
                  </span>
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function RequiredMark() {
  return (
    <span className="text-red-600" aria-hidden="true">
      *
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  type = 'text',
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy-950">
        {label} {required && <RequiredMark />}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field ${error ? 'field-invalid' : ''}`}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
  required?: boolean;
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy-950">
        {label} {required && <RequiredMark />}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field ${error ? 'field-invalid' : ''} ${value ? 'text-ink' : 'text-muted'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-ink">
            {option}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
