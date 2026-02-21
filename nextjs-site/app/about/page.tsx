'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const values = [
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Excellence',
    description: 'We deliver international-quality creative work that exceeds expectations and sets new standards.',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Collaboration',
    description: 'We work hand-in-hand with every client, treating their vision as our own to create meaningful results.',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Innovation',
    description: 'We stay ahead of design trends and technologies to bring fresh, cutting-edge solutions to every project.',
    gradient: 'from-orange-600 to-yellow-600',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Integrity',
    description: 'Transparency, honesty, and reliability form the foundation of every client relationship we build.',
    gradient: 'from-pink-600 to-purple-600',
  },
];

const milestones = [
  { year: '2020', title: 'Founded', description: 'Cubico Technologies was founded with a mission to deliver world-class creative services.' },
  { year: '2021', title: 'First 20 Clients', description: 'Grew our client base across multiple industries with a focus on quality and reliability.' },
  { year: '2022', title: 'Expanded Services', description: 'Added videography and motion graphics to our service lineup, going beyond static design.' },
  { year: '2023', title: '50+ Happy Clients', description: 'Crossed the 50-client milestone with a 98% satisfaction rate and growing referral network.' },
  { year: '2024', title: '100+ Projects', description: 'Completed over 100 projects for clients across the USA and internationally.' },
  { year: '2025', title: 'US Operations', description: 'Established our headquarters in Pembroke Pines, Florida, to better serve North American clients.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO SECTION */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-cyan-900/30" />
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">About Us</p>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent font-[family-name:var(--font-space-grotesk)]">
              We Are Cubico
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
              A creative agency based in Florida, delivering exceptional visual experiences for brands worldwide.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </section>

      {/* STORY SECTION */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs uppercase tracking-widest text-purple-400 mb-4">Our Story</p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)]">
                Creative Excellence Since 2020
              </h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  Cubico Technologies was born from a simple belief: every brand deserves world-class creative work, regardless of size or budget. What started as a small team of passionate designers has grown into a full-service creative agency.
                </p>
                <p>
                  Based in Pembroke Pines, Florida, we combine artistic vision with strategic thinking to create designs that don&apos;t just look beautiful — they drive real business results. From custom artwork and brand identities to social media content and professional videography, we bring ideas to life.
                </p>
                <p>
                  With over 100 projects completed and a 98% client satisfaction rate, we&apos;ve built a reputation for delivering quality work on time, every time. Our clients range from startups to established brands across multiple industries.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-2xl p-8 text-center">
                  <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">5+</p>
                  <p className="text-gray-400 text-sm">Years of Excellence</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-2xl p-8 text-center">
                  <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">50+</p>
                  <p className="text-gray-400 text-sm">Happy Clients</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border border-orange-500/20 rounded-2xl p-8 text-center">
                  <p className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">100+</p>
                  <p className="text-gray-400 text-sm">Projects Completed</p>
                </div>
                <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/20 rounded-2xl p-8 text-center">
                  <p className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">98%</p>
                  <p className="text-gray-400 text-sm">Satisfaction Rate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-black via-zinc-950 to-black relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">What Drives Us</p>
            <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space-grotesk)]">
              Our Core Values
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative p-8 bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">What We Do</p>
            <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space-grotesk)]">
              Our Services
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              {
                number: '01',
                title: 'Artwork Designing',
                desc: 'Custom digital illustrations and visual assets crafted from scratch, tailored to your brand.',
                gradient: 'from-purple-600 to-pink-600',
              },
              {
                number: '02',
                title: 'Branding & Graphics',
                desc: 'Complete brand identities from logos to style guides that make your business unforgettable.',
                gradient: 'from-blue-600 to-cyan-600',
              },
              {
                number: '03',
                title: 'Social Media Graphics',
                desc: 'Scroll-stopping content designed to capture attention and drive engagement across platforms.',
                gradient: 'from-orange-600 to-yellow-600',
              },
              {
                number: '04',
                title: 'Videography',
                desc: 'Professional video content from social reels to product videos with motion graphics and effects.',
                gradient: 'from-pink-600 to-purple-600',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative p-8 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg">{service.number}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href="/services"
              className="inline-block px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Explore Our Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-black via-zinc-950 to-black relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Our Journey</p>
            <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space-grotesk)]">
              Milestones
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-purple-500/50" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative pl-20"
                >
                  {/* Dot */}
                  <div className="absolute left-6 top-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 border-4 border-black" />

                  {/* Year Badge */}
                  <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 mb-2">
                    {milestone.year}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{milestone.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </section>

      {/* LOCATION SECTION */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs uppercase tracking-widest text-cyan-400 mb-4">Where We Are</p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)]">
                Based in Florida, Serving Globally
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Our headquarters are located in Pembroke Pines, Florida. We work with clients across the United States and internationally, leveraging modern collaboration tools to deliver seamless creative experiences regardless of location.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Address</p>
                    <p className="text-gray-400 text-sm">17965 SW 1st Street, Pembroke Pines, FL 33029</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Phone</p>
                    <p className="text-gray-400 text-sm">+1 (347) 718-8716</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-400 text-sm">info@cubicotech.com | sales@cubicotech.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 lg:p-10"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Why Work With Us?</h3>
              <div className="space-y-4">
                {[
                  'International-quality creative work at competitive prices',
                  'Dedicated project manager for every engagement',
                  'Fast turnaround times with flexible deadlines',
                  'Unlimited revisions until you are 100% satisfied',
                  'Full source files and commercial usage rights',
                  'Transparent pricing with no hidden fees',
                  'Free 30-minute consultation for new projects',
                  'Proven track record with 98% satisfaction rate',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-cyan-900/30 to-purple-900/30" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-space-grotesk)]">
            Ready to Work Together?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let&apos;s discuss your project and create something exceptional.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-10 py-5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/50"
            >
              Start a Project
            </Link>
            <Link
              href="/portfolio"
              className="px-10 py-5 bg-white/10 border border-white/20 text-white text-lg font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              View Our Work
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
